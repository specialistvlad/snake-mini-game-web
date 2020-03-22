import * as tf from '@tensorflow/tfjs-node';
import shell from 'shelljs';

import { TrainAgent } from './TrainAgent';
import { copyWeights } from './dqn';
import { MovingAverager } from './MovingAverager';

type TTrainerOptions = {
  sideSize: number,
  numFruits: number,
  initLen: number,
  cumulativeRewardThreshold: number,
  maxNumFrames: number,
  replayBufferSize: number,
  epsilonInit: number,
  epsilonFinal: number,
  epsilonDecayFrames: number,
  batchSize: number,
  gamma: number,
  learningRate: number,
  syncEveryFrames: number,
  saveModelTo: string,
  logDir: string,
};

export class TrainingManager {
  private agent: TrainAgent;
  private opts: any;
  private optimizer: any;
  private path: string = '';
  private tPrev: number = 0;
  private frameCountPrev: number = 0;
  private averageReward100Best: number = 0;
  private framesPerSecond: number = 0;
  private averageReward: number = 0;
  private averageEaten: number = 0;
  
  private rewardAverager: MovingAverager = new MovingAverager(100);
  private eatenAverager: MovingAverager = new MovingAverager(100);
  private summaryFileWriter: any;

  constructor (agent: TrainAgent, opts: TTrainerOptions) {
    this.agent = agent;
    this.opts = opts;
    this.optimizer = tf.train.adam(opts.learningRate);
    this.path = `${opts.saveModelTo}/${new Date().toISOString().replace(/\:/gi, '-')}`;
    this.summaryFileWriter = tf.node.summaryFileWriter(opts.logDir || '');
    this.tPrev = this.time();
    this.frameCountPrev = this.agent.frameCount;
  }

  async loop() {
    this.warm();
    while (true) {
      this.agent.trainOnReplayBatch(this.opts.batchSize, this.opts.gamma, this.optimizer);
      const {cumulativeReward, done, fruitsEaten} = this.agent.playStep();

      if (done) {
        this.measureFPS(cumulativeReward, fruitsEaten);
        this.logToConsole();
        this.logTensorFlow();
        await this.saveModel();
        this.maxFramesReached();
      }
      this.sync();
    }
  }

  sync() {
    const { syncEveryFrames } = this.opts;
    const { agent } = this;

    if (agent.frameCount % syncEveryFrames === 0) {
      copyWeights(agent.trainingModel, agent.model);
      // console.log('Sync\'ed weights from online network to target network');
    }
  }

  time(): number {
    return new Date().getTime();
  }

  warm() {
    for (let i = 0; i < this.agent.replayBufferSize; ++i) {
      this.agent.playStep();
    }
    this.tPrev = this.time();
    this.frameCountPrev = this.agent.frameCount;
  }

  measureFPS(cumulativeReward: number, fruitsEaten: number) {
    const t = this.time();
    this.framesPerSecond = (this.agent.frameCount - this.frameCountPrev) / (t - this.tPrev) * 1e3;
    
    this.tPrev = t;
    this.frameCountPrev = this.agent.frameCount;
    this.rewardAverager.append(cumulativeReward);
    this.eatenAverager.append(fruitsEaten);
    this.averageReward = this.rewardAverager.average();
    this.averageEaten = this.eatenAverager.average();
  }

  maxFramesReached() {
    if (this.agent.frameCount >= this.opts.maxNumFrames) {
      console.log(`Max frames(${this.opts.maxNumFrames}) count was reached(${this.agent.frameCount}). Exiting...`);
      process.exit(0);
    }
  }

  logToConsole() {
    const { agent, averageReward: averageReward100, averageEaten: averageEaten100, framesPerSecond } = this;
    console.log(
      `Frame #${agent.frameCount}: ` +
      `reward=${averageReward100.toFixed(1)}; ` +
      `eaten=${averageEaten100.toFixed(2)} ` +
      `(epsilon=${agent.epsilon.toFixed(3)}) ` +
      `${framesPerSecond.toFixed(1)}fps`);
  }

  logTensorFlow() {
    if (!this.summaryFileWriter) {
      return;
    }
    const { agent, averageReward: averageReward100, averageEaten: averageEaten100, framesPerSecond } = this;
    this.summaryFileWriter.scalar('cumulativeReward', averageReward100, agent.frameCount);
    this.summaryFileWriter.scalar('eaten', averageEaten100, agent.frameCount);
    this.summaryFileWriter.scalar('epsilon', agent.epsilon, agent.frameCount);
    this.summaryFileWriter.scalar('fps', framesPerSecond, agent.frameCount);
  }

  async saveModel() {
    const { agent } = this;
    const { saveModelTo } = this.opts;
    
    if (saveModelTo != null && this.averageReward > this.averageReward100Best) {
      this.averageReward100Best = this.averageReward;
      const fullPath = `${this.path}/reward=${this.eatenAverager.average().toFixed(2)}-frame=${agent.frameCount}`;
      shell.mkdir('-p', fullPath);
      await agent.model.save(`file://${fullPath}/`);
      console.log(`Model saved to ${`file://${fullPath}`}`);
    }
  }
}
