import * as tf from '@tensorflow/tfjs-node';

import { createDeepQNetwork } from './dqn';
import { Game } from './Game';
import { ReplayMemory } from './ReplayMemory';
import { TGoogleGameObjects, RelativeDirection } from '../types';

const NUM_ACTIONS = 3;

export class TrainAgent {
  public frameCount: number = 0;
  public epsilon: number = 0;
  private epsilonInit: number;
  private epsilonFinal: number;
  private epsilonDecayFrames: number;
  private epsilonIncrement_: number;
  public model: tf.Sequential;
  public trainingModel: tf.Sequential;
  private optimizer: tf.Optimizer;
  public replayBufferSize: number;
  private cumulativeReward_: number = 0;
  private fruitsEaten_: number = 0;

  private game: Game;
  private replayMemory: ReplayMemory;

  constructor(game: Game, config: any) {
    this.game = game;

    this.epsilonInit = config.epsilonInit;
    this.epsilonFinal = config.epsilonFinal;
    this.epsilonDecayFrames = config.epsilonDecayFrames;
    this.epsilonIncrement_ = (this.epsilonFinal - this.epsilonInit) / this.epsilonDecayFrames;

    this.model = createDeepQNetwork(game.height, game.width, NUM_ACTIONS);
    this.trainingModel = createDeepQNetwork(game.height, game.width, NUM_ACTIONS);
    // Freeze taget network: it's weights are updated only through copying from
    // the online network.
    this.trainingModel.trainable = false;

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
      action = this.getRandomAction();// Pick an action at random.
    } else {
      // Greedily pick an action based on online DQN output.
      tf.tidy(() => {
        const stateTensor = this.getStateTensor([state], this.game.height, this.game.width)
        action = [RelativeDirection.Straight, RelativeDirection.Left, RelativeDirection.Right]
        // @ts-ignore
          [this.model.predict(stateTensor).argMax(-1).dataSync()[0]];
      });
    }

    const {gameObjects: nextState, reward, done, fruitEaten} = this.game.step(action as RelativeDirection);

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
      const stateTensor = this.getStateTensor(batch.map(example => example[0]), this.game.height, this.game.width);
      const actionTensor = tf.tensor1d(batch.map(example => example[1]), 'int32');
      // @ts-ignore
      const qs = this.model.apply(stateTensor, {training: true}).mul(tf.oneHot(actionTensor, NUM_ACTIONS)).sum(-1);
      const rewardTensor = tf.tensor1d(batch.map(example => example[2]));
      const nextStateTensor = this.getStateTensor(batch.map(example => example[4]), this.game.height, this.game.width);
      // @ts-ignore
      const nextMaxQTensor = this.trainingModel.predict(nextStateTensor).max(-1);
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

  getRandomInteger(min: number, max: number) {
    // Note that we don't reuse the implementation in the more generic
    // `getRandomIntegers()` (plural) below, for performance optimization.
    return Math.floor((max - min) * Math.random()) + min;
  }
  
  /**
   * Generate a random action among all possible actions.
   *
   * @return {0 | 1 | 2} Action represented as a number.
   */
  getRandomAction() {
    return this.getRandomInteger(0, NUM_ACTIONS);
  }
  
  assertPositiveInteger(x: number, name: string) {
    if (!Number.isInteger(x)) {
      throw new Error(
          `Expected ${name} to be an integer, but received ${x}`);
    }
    if (!(x > 0)) {
      throw new Error(
          `Expected ${name} to be a positive number, but received ${x}`);
    }
  }
  
  getStateTensor(state: Array<TGoogleGameObjects>, h: number, w: number) {
    const numExamples = state.length;
    // TODO(cais): Maintain only a single buffer for efficiency.
    const buffer = tf.buffer([numExamples, h, w, 2]);
  
    for (let n = 0; n < numExamples; ++n) {
      if (state[n] == null) {
        continue;
      }
      // Mark the snake.
      state[n].s.forEach((yx, i) => {
        buffer.set(i === 0 ? 2 : 1, n, yx[0], yx[1], 0);
      });
  
      // Mark the fruit(s).
      state[n].f.forEach(yx => {
        buffer.set(1, n, yx[0], yx[1], 1);
      });
    }
    return buffer.toTensor();
  }
}
