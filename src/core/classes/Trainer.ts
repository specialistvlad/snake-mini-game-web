import * as tf from '@tensorflow/tfjs-node';
import shell from 'shelljs';

import { SnakeGameAgent } from '../../trainer/agent';
import { copyWeights } from '../../trainer/dqn';
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

    // @ts-ignore
    for (let i = 0; i < agent.replayBufferSize; ++i) {
      agent.playStep();
    }

    const optimizer = tf.train.adam(learningRate);
    let tPrev = new Date().getTime();
    // @ts-ignore
    let frameCountPrev = agent.frameCount;
    let averageReward100Best = -Infinity;
    while (true) {
      agent.trainOnReplayBatch(batchSize, gamma, optimizer);
      const {cumulativeReward, done, fruitsEaten} = agent.playStep();
      if (done) {
        const t = new Date().getTime();
    // @ts-ignore
        const framesPerSecond = (agent.frameCount - frameCountPrev) / (t - tPrev) * 1e3;
        tPrev = t;
    // @ts-ignore
        frameCountPrev = agent.frameCount;

        this.rewardAverager100.append(cumulativeReward);
        this.eatenAverager100.append(fruitsEaten);
        const averageReward100 = this.rewardAverager100.average();
        const averageEaten100 = this.eatenAverager100.average();

        console.log(
    // @ts-ignore
            `Frame #${agent.frameCount}: ` +
            `cumulativeReward100=${averageReward100.toFixed(1)}; ` +
            `eaten100=${averageEaten100.toFixed(2)} ` +
    // @ts-ignore
            `(epsilon=${agent.epsilon.toFixed(3)}) ` +
            `(${framesPerSecond.toFixed(1)} frames/s)`);
        if (summaryWriter != null) {
          summaryWriter.scalar(
    // @ts-ignore
              'cumulativeReward100', averageReward100, agent.frameCount);
    // @ts-ignore
          summaryWriter.scalar('eaten100', averageEaten100, agent.frameCount);
    // @ts-ignore
          summaryWriter.scalar('epsilon', agent.epsilon, agent.frameCount);
          summaryWriter.scalar(
    // @ts-ignore
              'framesPerSecond', framesPerSecond, agent.frameCount);
        }
        if (averageReward100 >= cumulativeRewardThreshold ||
    // @ts-ignore
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
    // @ts-ignore
      if (agent.frameCount % syncEveryFrames === 0) {
    // @ts-ignore
        copyWeights(agent.targetNetwork, agent.onlineNetwork);
        console.log('Sync\'ed weights from online network to target network');
      }
    }
  }
}
