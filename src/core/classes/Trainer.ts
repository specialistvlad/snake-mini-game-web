import * as tf from '@tensorflow/tfjs-node';
import shell from 'shelljs';

import { SnakeGameAgent } from './SnakeGameAgent';
import { copyWeights } from './dqn';
import { MovingAverager } from './MovingAverager';

export class Trainer {
  private agent: SnakeGameAgent;
  private opts: any;
  private optimizer: any;
  private path: string = '';
  private tPrev: number = 0;
  private frameCountPrev: number = 0;
  private averageReward100Best: number = -Infinity;
  private framesPerSecond: number = 0;
  private averageReward100: number = 0;
  private averageEaten100: number = 0;
  
  private rewardAverager100: MovingAverager = new MovingAverager(100);
  private eatenAverager100: MovingAverager = new MovingAverager(100);
  private summaryFileWriter: any;

  constructor (agent: SnakeGameAgent, opts: any) {
    this.agent = agent;
    this.opts = opts;
    this.optimizer = tf.train.adam(opts.earningRate);
    this.path = `${opts.saveModelTo}/${new Date().toISOString().replace(/\:/gi, '-')}`;
    this.summaryFileWriter = tf.node.summaryFileWriter(opts.logDir);
  }

  async loop() {
    const { batchSize, gamma, cumulativeRewardThreshold, maxNumFrames, savePath, logDir } = this.opts;
    const { agent } = this;

    for (let i = 0; i < agent.replayBufferSize; ++i) {
      agent.playStep();
    }

    this.tPrev = this.time();
    this.frameCountPrev = agent.frameCount;

    while (true) {
      agent.trainOnReplayBatch(batchSize, gamma, this.optimizer);
      const {cumulativeReward, done, fruitsEaten} = agent.playStep();

      if (done) {
        this.measureFPS(cumulativeReward, fruitsEaten);
        this.logToConsole();
        this.logTensorFlow();

        if (this.averageReward100 >= cumulativeRewardThreshold ||
            agent.frameCount >= maxNumFrames) {
          // TODO(cais): Save online network.
          break;
        }

        if (this.averageReward100 > this.averageReward100Best) {
          this.averageReward100Best = this.averageReward100;
          if (savePath != null) {
            // if (!fs.existsSync(savePath)) {
            //   mkdir('-p', savePath);
            // }
            // await agent.onlineNetwork.save(`file://${savePath}`);
            console.log(`Saved DQN to ${savePath}`);
          }
        }
      }
      this.sync();
    }
  }

  sync() {
    const { syncEveryFrames } = this.opts;
    const { agent } = this;

    if (agent.frameCount % syncEveryFrames === 0) {
      copyWeights(agent.targetNetwork, agent.onlineNetwork);
      console.log('Sync\'ed weights from online network to target network');
    }
  }

  time(): number {
    return new Date().getTime();
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

  logToConsole() {
    const { agent, averageReward100, averageEaten100, framesPerSecond } = this;
    console.log(
      `Frame #${agent.frameCount}: ` +
      `cumulativeReward100=${averageReward100.toFixed(1)}; ` +
      `eaten100=${averageEaten100.toFixed(2)} ` +
      `(epsilon=${agent.epsilon.toFixed(3)}) ` +
      `(${framesPerSecond.toFixed(1)} frames/s)`);
  }

  logTensorFlow() {
    if (!this.summaryFileWriter) {
      return;
    }
    const { agent, averageReward100, averageEaten100, framesPerSecond } = this;
    this.summaryFileWriter.scalar('cumulativeReward100', averageReward100, agent.frameCount);
    this.summaryFileWriter.scalar('eaten100', averageEaten100, agent.frameCount);
    this.summaryFileWriter.scalar('epsilon', agent.epsilon, agent.frameCount);
    this.summaryFileWriter.scalar('framesPerSecond', framesPerSecond, agent.frameCount);
  }
}
