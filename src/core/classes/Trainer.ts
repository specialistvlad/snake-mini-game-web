// @ts-nocheck
import * as tf from '@tensorflow/tfjs-node';
import shell from 'shelljs';

import {SnakeGameAgent} from '../../trainer/agent';
import {copyWeights} from '../../trainer/dqn';
import { MovingAverager } from '../../trainer/MovingAverager';

export class Trainer {
  private agent: SnakeGameAgent;
  private opts: any;
  private tPrev: number = 0;
  private frameCountPrev: number = 0;
  private averageReward100Best = -Infinity;
  private rewardAverager100: MovingAverager = new MovingAverager(100);
  private eatenAverager100: MovingAverager = new MovingAverager(100);
  private optimizer: any;
  private path: string = '';

  constructor (agent: SnakeGameAgent, opts: any) {
    this.agent = agent;
    this.opts = opts;
    this.optimizer = tf.train.adam(opts.earningRate);
    this.path = `${opts.saveModelTo}/${new Date().toISOString().replace(/\:/gi, '-')}`;
  }

  async loop() {
    const { learningRate, replayBufferSize, batchSize, gamma, savePath, syncEveryFrames, cumulativeRewardThreshold, maxNumFrames } = this.opts;
    const { agent } = this;

    for (let i = 0; i < replayBufferSize; ++i) {
      agent.playStep();
    }
  
    this.tPrev = this.time();
    this.frameCountPrev = agent.frameCount;
  
    while (true) {
      agent.trainOnReplayBatch(batchSize, gamma, this.optimizer);
      const {cumulativeReward, done, fruitsEaten} = agent.playStep();

      if (done) {
        this.rewardAverager100.append(cumulativeReward);
        this.eatenAverager100.append(fruitsEaten);
  
        this.logger();
        this.sync();
        await this.save();

        if (this.needStopWork()) {
          await this.save();
          break;
        }
      }
    }
  }

  sync() {
    const { agent } = this;
    const { syncEveryFrames } = this.opts;
    if (agent.frameCount % syncEveryFrames === 0) {
      copyWeights(agent.targetNetwork, agent.onlineNetwork);
      console.log('Sync\'ed weights from online network to target network');
    }
  }

  async save() {
    const { agent } = this;
    const { saveModelTo } = this.opts;
    const averageReward100 = this.rewardAverager100.average();
    
    if (saveModelTo != null && averageReward100 > this.averageReward100Best) {
      this.averageReward100Best = averageReward100;
      const fullPath = `${this.path}/frame=${agent.frameCount}-reward=${this.eatenAverager100.average().toFixed(2)}`;
      shell.mkdir('-p', fullPath);
      const result = await agent.onlineNetwork.save(`file://${fullPath}/`);
      console.log(`Model saved to ${`file://${fullPath}`}`);
    }
  }


  async logger() {
    const { agent } = this;
    const averageReward100 = this.rewardAverager100.average();
    const averageEaten100 = this.eatenAverager100.average();
      
    console.log(
      `Frame #${agent.frameCount}: ` +
      `cumulativeReward100=${averageReward100.toFixed(1)}; ` +
      `eaten100=${averageEaten100.toFixed(2)} ` +
      `(epsilon=${agent.epsilon.toFixed(3)}) ` +
      `(${this.measureFrames().toFixed(1)} frames/s)`
    );
  }

  time(): number {
    return new Date().getTime();
  }

  measureFrames(): number {
    const { agent } = this;
    const t = this.time();
    const framesPerSecond = (agent.frameCount - this.frameCountPrev) / (t - this.tPrev) * 1e3;

    this.tPrev = t;
    this.frameCountPrev = agent.frameCount;
    return framesPerSecond;
  }

  needStopWork(): boolean {
    const { cumulativeRewardThreshold, maxNumFrames } = this.opts;
    return this.rewardAverager100.average() >= cumulativeRewardThreshold || this.agent.frameCount >= maxNumFrames;
  }
}
