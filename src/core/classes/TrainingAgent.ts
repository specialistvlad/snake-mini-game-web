import * as tf from '@tensorflow/tfjs-node';

import { BaseAgent } from './BaseAgent';
import { DeepLearningNetwork } from './DeepLearningNetwork';
import { Game, defaultState } from './Game';
import { ReplayBuffer } from './ReplayBuffer';
import { Direction, TOptimizedState } from '../types';

type TTrainAgentOptions = {
  sideSize: number,
  replayBufferSize: number,
  epsilonInit: number,
  epsilonFinal: number,
  epsilonDecayFrames: number,
  learningRate: number,
};

export class TrainingAgent extends BaseAgent {
  protected frameCount: number = 0;
  protected epsilon: number = 0;
  protected epsilonInit: number;
  protected epsilonFinal: number;
  protected epsilonDecayFrames: number;
  protected _epsilonStep: number;
  protected model: tf.Sequential;
  protected trainingModel: tf.Sequential;
  protected optimizer: tf.Optimizer;
  protected replayBufferSize: number;
  protected totalReward: number = 0;
  protected foodEaten: number = 0;

  protected game: Game;
  protected replayMemory: ReplayBuffer<TOptimizedState>;

  constructor(config: TTrainAgentOptions, game: Game) {
    super(config.sideSize);
    this.game = game;

    this.epsilonInit = config.epsilonInit;
    this.epsilonFinal = config.epsilonFinal;
    this.epsilonDecayFrames = config.epsilonDecayFrames;
    this._epsilonStep = (this.epsilonFinal - this.epsilonInit) / this.epsilonDecayFrames;

    this.model = new DeepLearningNetwork(config.sideSize, true).model;
    this.trainingModel = new DeepLearningNetwork(config.sideSize, false).model;
    this.optimizer = tf.train.adam(config.learningRate);

    this.replayBufferSize = config.replayBufferSize;
    this.replayMemory = new ReplayBuffer(config.replayBufferSize, [defaultState, Direction.Right, 0, false, []]);
    this.reset();
  }

  reset() {
    this.totalReward = 0;
    this.foodEaten = 0;
    this.game.reset();
  }

  get currentStep() {
    return this.frameCount;
  }

  get currentEpsilon() {
    return this.epsilon;
  }

  playStep() {
    this.epsilon = this.frameCount >= this.epsilonDecayFrames
      ? this.epsilonFinal
      : this.epsilonInit + this._epsilonStep * this.frameCount;
    this.frameCount++;

    const action: Direction = Math.random() < this.epsilon
      ? this.getRandomAction()
      : super.predict(this.game.state);
    
    const {cells: nextState, reward, done, fruitEaten} = this.game.step(action);
    this.replayMemory.append([this.game.state, action, reward, done, nextState]);

    this.totalReward += reward;
    if (fruitEaten) {
      this.foodEaten++;
    }
    const output = {
      action,
      cumulativeReward: this.totalReward,
      done,
      fruitsEaten: this.foodEaten
    };
    if (done) {
      this.reset();
    }
    return output;
  }

  trainOnReplayBatch(batchSize: number, gamma: number, optimizer: tf.Optimizer) {
    // Get a batch of examples from the replay buffer.
    const batch = this.replayMemory.sample(batchSize);
    const lossFunction = () => tf.tidy(() => {
      const stateTensor = this.gameStatesToTensor(batch.map(example => example[0]));
      const actionTensor = tf.tensor1d(batch.map(example => example[1]), 'int32');
      const qs = (this.model.apply(stateTensor, { training: true }) as tf.Tensor).mul(tf.oneHot(actionTensor, this.actions.length)).sum(-1);
      const rewardTensor = tf.tensor1d(batch.map(example => example[2]));
      const nextStateTensor = this.gameStatesToTensor(batch.map(example => ({
        ...defaultState,
        cells: example[4],
      })));
      const nextMaxQTensor = (this.trainingModel.predict(nextStateTensor) as tf.Tensor).max(-1);
      const doneMask = tf.scalar(1).sub(tf.tensor1d(batch.map(example => example[3])).asType('float32'));
      const targetQs = rewardTensor.add(nextMaxQTensor.mul(doneMask).mul(gamma));
      return tf.losses.meanSquaredError(targetQs, qs);
    });

    // @ts-ignore
    const grads = tf.variableGrads(lossFunction);
    optimizer.applyGradients(grads.grads);
    tf.dispose(grads);
  }

  getRandomInteger(min: number, max: number) {
    return Math.floor((max - min) * Math.random()) + min;
  }

  getRandomAction() {
    return this.directionByIndex(this.getRandomInteger(0, this.actions.length));
  }

  saveToFile(filepath: string) {
    return this.model.save(filepath);
  }

  sync() {
    // https://github.com/tensorflow/tfjs/issues/1807:
    let originalDestNetworkTrainable;
    if (this.trainingModel.trainable !== this.model.trainable) {
      originalDestNetworkTrainable = this.trainingModel.trainable;
      this.trainingModel.trainable = this.model.trainable;
    }
  
    this.trainingModel.setWeights(this.model.getWeights());
    if (originalDestNetworkTrainable != null) {
      this.trainingModel.trainable = originalDestNetworkTrainable;
    }
  }
}
