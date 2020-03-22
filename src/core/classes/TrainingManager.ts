import * as tf from '@tensorflow/tfjs-node';
import shell from 'shelljs';

import { TrainingAgent } from './TrainingAgent';
import { NumbersStack } from './NumbersStack';

type TTrainerOptions = {
  sideSize: number,
  foodCount: number,
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
  protected agent: TrainingAgent;
  protected opts: any;
  protected optimizer: any;
  protected path: string = '';
  protected tPrev: number = 0;
  protected frameCountPrev: number = 0;
  protected averageReward100Best: number = 0;
  protected framesPerSecond: number = 0;
  protected averageReward: number = 0;
  protected averageEaten: number = 0;
  
  protected rewardAverager: NumbersStack = new NumbersStack(100);
  protected eatenAverager: NumbersStack = new NumbersStack(100);
  protected summaryFileWriter: any;

  constructor (agent: TrainingAgent, opts: TTrainerOptions) {
    this.agent = agent;
    this.opts = opts;
    this.optimizer = tf.train.adam(opts.learningRate);
    this.path = `${opts.saveModelTo}/${new Date().toISOString().replace(/\:/gi, '-')}`;
    this.summaryFileWriter = tf.node.summaryFileWriter(opts.logDir || '');
    this.tPrev = this.time();
    this.frameCountPrev = this.agent.currentStep;
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

    if (agent.currentStep % syncEveryFrames === 0) {
      this.agent.sync();
      console.log('Sync weights done');
    }
  }

  time(): number {
    return new Date().getTime();
  }

  warm() {
    console.log('Warming up to step: %d, Please wait...', this.opts.replayBufferSize);
    for (let i = 0; i < this.opts.replayBufferSize; ++i) {
      this.agent.playStep();
    }
    this.tPrev = this.time();
    this.frameCountPrev = this.agent.currentStep;
  }

  measureFPS(cumulativeReward: number, fruitsEaten: number) {
    const t = this.time();
    this.framesPerSecond = (this.agent.currentStep - this.frameCountPrev) / (t - this.tPrev) * 1e3;
    
    this.tPrev = t;
    this.frameCountPrev = this.agent.currentStep;
    this.rewardAverager.append(cumulativeReward);
    this.eatenAverager.append(fruitsEaten);
    this.averageReward = this.rewardAverager.average();
    this.averageEaten = this.eatenAverager.average();
  }

  maxFramesReached() {
    if (this.agent.currentStep >= this.opts.maxNumFrames) {
      console.log(`Max frames(${this.opts.maxNumFrames}) count was reached(${this.agent.currentStep}). Exiting...`);
      process.exit(0);
    }
  }

  logToConsole() {
    const { agent, averageReward: averageReward100, averageEaten: averageEaten100, framesPerSecond } = this;
    console.log(
      `Step #${agent.currentStep}: ` +
      `reward=${averageReward100.toFixed(1)}; ` +
      `eaten=${averageEaten100.toFixed(2)} ` +
      `(currentEpsilon=${agent.currentEpsilon.toFixed(3)}) ` +
      `${framesPerSecond.toFixed(1)}fps`);
  }

  logTensorFlow() {
    if (!this.summaryFileWriter) {
      return;
    }
    const { agent, averageReward: averageReward100, averageEaten: averageEaten100, framesPerSecond } = this;
    this.summaryFileWriter.scalar('cumulativeReward', averageReward100, agent.currentStep);
    this.summaryFileWriter.scalar('eaten', averageEaten100, agent.currentStep);
    this.summaryFileWriter.scalar('currentEpsilon', agent.currentEpsilon, agent.currentStep);
    this.summaryFileWriter.scalar('fps', framesPerSecond, agent.currentStep);
  }

  async saveModel() {
    const { agent } = this;
    const { saveModelTo } = this.opts;
    
    if (saveModelTo != null && this.averageReward > this.averageReward100Best) {
      this.averageReward100Best = this.averageReward;
      const fullPath = `${this.path}/reward=${this.eatenAverager.average().toFixed(2)}-frame=${agent.currentStep}`;
      shell.mkdir('-p', fullPath);
      await agent.saveToFile(`file://${fullPath}/`);
      console.log(`Model saved to ${`file://${fullPath}`}`);
    }
  }
}
