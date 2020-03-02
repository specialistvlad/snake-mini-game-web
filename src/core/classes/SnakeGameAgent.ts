import * as tf from '@tensorflow/tfjs-node';

import { createDeepQNetwork } from './dqn';
import { getRandomAction, NUM_ACTIONS, ALL_ACTIONS, getStateTensor, SnakeGame } from './snake_game';
import { ReplayMemory } from './ReplayMemory';

function assertPositiveInteger(x: number, name: string) {
  if (!Number.isInteger(x)) {
    throw new Error(
        `Expected ${name} to be an integer, but received ${x}`);
  }
  if (!(x > 0)) {
    throw new Error(
        `Expected ${name} to be a positive number, but received ${x}`);
  }
}

export class SnakeGameAgent {
  public frameCount: number = 0;
  public epsilon: number = 0;
  private epsilonInit: number;
  private epsilonFinal: number;
  private epsilonDecayFrames: number;
  private epsilonIncrement_: number;
  public onlineNetwork: tf.Sequential;
  public targetNetwork: tf.Sequential;
  private optimizer: tf.Optimizer;
  public replayBufferSize: number;
  private cumulativeReward_: number = 0;
  private fruitsEaten_: number = 0;

  private game: SnakeGame;
  private replayMemory: ReplayMemory;

  constructor(game: SnakeGame, config: any) {
    assertPositiveInteger(config.epsilonDecayFrames, 'epsilonDecayFrames');

    this.game = game;

    this.epsilonInit = config.epsilonInit;
    this.epsilonFinal = config.epsilonFinal;
    this.epsilonDecayFrames = config.epsilonDecayFrames;
    this.epsilonIncrement_ = (this.epsilonFinal - this.epsilonInit) / this.epsilonDecayFrames;

    this.onlineNetwork = createDeepQNetwork(game.height, game.width, NUM_ACTIONS);
    this.targetNetwork = createDeepQNetwork(game.height, game.width, NUM_ACTIONS);
    // Freeze taget network: it's weights are updated only through copying from
    // the online network.
    this.targetNetwork.trainable = false;

    this.optimizer = tf.train.adam(config.learningRate);

    this.replayBufferSize = config.replayBufferSize;
    this.replayMemory = new ReplayMemory(config.replayBufferSize);
    this.reset();
  }

  reset() {
    this.cumulativeReward_ = 0;
    this.fruitsEaten_ = 0;
    this.game.reset();
  }

  /**
   * Play one step of the game.
   *
   * @returns {number | null} If this step leads to the end of the game,
   *   the total reward from the game as a plain number. Else, `null`.
   */
  playStep() {
    this.epsilon = this.frameCount >= this.epsilonDecayFrames
      ? this.epsilonFinal
      : this.epsilonInit + this.epsilonIncrement_  * this.frameCount;
    this.frameCount++;

    // The epsilon-greedy algorithm.
    let action;
    const state = this.game.getState();
    if (Math.random() < this.epsilon) {
      action = getRandomAction();// Pick an action at random.
    } else {
      // Greedily pick an action based on online DQN output.
      tf.tidy(() => {
        const stateTensor = getStateTensor(state, this.game.height, this.game.width)
        // @ts-ignore
        action = ALL_ACTIONS[this.onlineNetwork.predict(stateTensor).argMax(-1).dataSync()[0]];
      });
    }

    const {state: nextState, reward, done, fruitEaten} = this.game.step(action);

    this.replayMemory.append([state, action, reward, done, nextState]);

    this.cumulativeReward_ += reward;
    if (fruitEaten) {
      this.fruitsEaten_++;
    }
    const output = {
      action,
      cumulativeReward: this.cumulativeReward_,
      done,
      fruitsEaten: this.fruitsEaten_
    };
    if (done) {
      this.reset();
    }
    return output;
  }

  /**
   * Perform training on a randomly sampled batch from the replay buffer.
   *
   * @param {number} batchSize Batch size.
   * @param {number} gamma Reward discount rate. Must be >= 0 and <= 1.
   * @param {tf.train.Optimizer} optimizer The optimizer object used to update
   *   the weights of the online network.
   */
  trainOnReplayBatch(batchSize: number, gamma: number, optimizer: tf.Optimizer) {
    // Get a batch of examples from the replay buffer.
    const batch = this.replayMemory.sample(batchSize);
    const lossFunction = () => tf.tidy(() => {
      const stateTensor = getStateTensor(batch.map(example => example[0]), this.game.height, this.game.width);
      const actionTensor = tf.tensor1d(batch.map(example => example[1]), 'int32');
      // @ts-ignore
      const qs = this.onlineNetwork.apply(stateTensor, {training: true}).mul(tf.oneHot(actionTensor, NUM_ACTIONS)).sum(-1);
      const rewardTensor = tf.tensor1d(batch.map(example => example[2]));
      const nextStateTensor = getStateTensor(batch.map(example => example[4]), this.game.height, this.game.width);
      // @ts-ignore
      const nextMaxQTensor = this.targetNetwork.predict(nextStateTensor).max(-1);
      const doneMask = tf.scalar(1).sub(tf.tensor1d(batch.map(example => example[3])).asType('float32'));
      const targetQs = rewardTensor.add(nextMaxQTensor.mul(doneMask).mul(gamma));
      return tf.losses.meanSquaredError(targetQs, qs);
    });

    // Calculate the gradients of the loss function with repsect to the weights
    // of the online DQN.
    // @ts-ignore
    const grads = tf.variableGrads(lossFunction);
    // Use the gradients to update the online DQN's weights.
    optimizer.applyGradients(grads.grads);
    tf.dispose(grads);
    // TODO(cais): Return the loss value here?
  }
}
