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
  // private tPrev: number = 0;
  // private frameCountPrev: number = 0;
  // private averageReward100Best = -Infinity;
  private rewardAverager100: MovingAverager = new MovingAverager(100);
  private eatenAverager100: MovingAverager = new MovingAverager(100);

  constructor (agent: SnakeGameAgent, opts: any) {
    this.agent = agent;
    this.opts = opts;
    this.optimizer = tf.train.adam(opts.earningRate);
    this.path = `${opts.saveModelTo}/${new Date().toISOString().replace(/\:/gi, '-')}`;
  }

  async loop() {
    const { batchSize, gamma, learningRate, cumulativeRewardThreshold,
      maxNumFrames, syncEveryFrames, savePath, logDir } = this.opts;
    const { agent } = this;

    let summaryWriter;
    if (logDir != null) {
      summaryWriter = tf.node.summaryFileWriter(logDir);
    }

    for (let i = 0; i < agent.replayBufferSize; ++i) {
      agent.playStep();
    }

    let tPrev = new Date().getTime();
    let frameCountPrev = agent.frameCount;
    let averageReward100Best = -Infinity;
    while (true) {
      agent.trainOnReplayBatch(batchSize, gamma, this.optimizer);
      const {cumulativeReward, done, fruitsEaten} = agent.playStep();
      if (done) {
        const t = new Date().getTime();
        const framesPerSecond = (agent.frameCount - frameCountPrev) / (t - tPrev) * 1e3;
        tPrev = t;
        frameCountPrev = agent.frameCount;

        this.rewardAverager100.append(cumulativeReward);
        this.eatenAverager100.append(fruitsEaten);
        const averageReward100 = this.rewardAverager100.average();
        const averageEaten100 = this.eatenAverager100.average();

        console.log(
            `Frame #${agent.frameCount}: ` +
            `cumulativeReward100=${averageReward100.toFixed(1)}; ` +
            `eaten100=${averageEaten100.toFixed(2)} ` +
            `(epsilon=${agent.epsilon.toFixed(3)}) ` +
            `(${framesPerSecond.toFixed(1)} frames/s)`);
        if (summaryWriter != null) {
          summaryWriter.scalar(
              'cumulativeReward100', averageReward100, agent.frameCount);
          summaryWriter.scalar('eaten100', averageEaten100, agent.frameCount);
          summaryWriter.scalar('epsilon', agent.epsilon, agent.frameCount);
          summaryWriter.scalar(
              'framesPerSecond', framesPerSecond, agent.frameCount);
        }
        if (averageReward100 >= cumulativeRewardThreshold ||
            agent.frameCount >= maxNumFrames) {
          // TODO(cais): Save online network.
          break;
        }
        if (averageReward100 > averageReward100Best) {
          averageReward100Best = averageReward100;
          if (savePath != null) {
            // if (!fs.existsSync(savePath)) {
            //   mkdir('-p', savePath);
            // }
            // await agent.onlineNetwork.save(`file://${savePath}`);
            console.log(`Saved DQN to ${savePath}`);
          }
        }
      }
      if (agent.frameCount % syncEveryFrames === 0) {
        copyWeights(agent.targetNetwork, agent.onlineNetwork);
        console.log('Sync\'ed weights from online network to target network');
      }
    }
  }
}
