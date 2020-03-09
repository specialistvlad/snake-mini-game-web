import * as tf from '@tensorflow/tfjs-node';
import shell from 'shelljs';

import { SnakeGameAgent } from './GoogleAgent';
import { copyWeights } from './dqn';
import { MovingAverager } from './MovingAverager';

type TTrainerOptions = {
  height: number,
  width: number,
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

export class Trainer {
  private agent: SnakeGameAgent;
  private opts: any;
  private optimizer: any;
  private path: string = '';
  private tPrev: number = 0;
  private frameCountPrev: number = 0;
  private averageReward100Best: number = 0;
  private framesPerSecond: number = 0;
  private averageReward100: number = 0;
  private averageEaten100: number = 0;
  
  private rewardAverager100: MovingAverager = new MovingAverager(100);
  private eatenAverager100: MovingAverager = new MovingAverager(100);
  private summaryFileWriter: any;

  constructor (agent: SnakeGameAgent, opts: TTrainerOptions) {
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
      copyWeights(agent.targetNetwork, agent.onlineNetwork);
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
    this.rewardAverager100.append(cumulativeReward);
    this.eatenAverager100.append(fruitsEaten);
    this.averageReward100 = this.rewardAverager100.average();
    this.averageEaten100 = this.eatenAverager100.average();
  }

  maxFramesReached() {
    if (this.agent.frameCount >= this.opts.maxNumFrames) {
      console.log(`Max frames(${this.opts.maxNumFrames}) count was reached(${this.agent.frameCount}). Exiting...`);
      process.exit(0);
    }
  }

  logToConsole() {
    const { agent, averageReward100, averageEaten100, framesPerSecond } = this;
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
    const { agent, averageReward100, averageEaten100, framesPerSecond } = this;
    this.summaryFileWriter.scalar('cumulativeReward100', averageReward100, agent.frameCount);
    this.summaryFileWriter.scalar('eaten100', averageEaten100, agent.frameCount);
    this.summaryFileWriter.scalar('epsilon', agent.epsilon, agent.frameCount);
    this.summaryFileWriter.scalar('fps', framesPerSecond, agent.frameCount);
  }

  async saveModel() {
    const { agent } = this;
    const { saveModelTo } = this.opts;
    
    if (saveModelTo != null && this.averageReward100 > this.averageReward100Best) {
      this.averageReward100Best = this.averageReward100;
      const fullPath = `${this.path}/reward=${this.eatenAverager100.average().toFixed(2)}-frame=${agent.frameCount}`;
      shell.mkdir('-p', fullPath);
      await agent.onlineNetwork.save(`file://${fullPath}/`);
      console.log(`Model saved to ${`file://${fullPath}`}`);
    }
  }
}
