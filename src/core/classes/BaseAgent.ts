import * as tf from '@tensorflow/tfjs';
import { defaultState } from './Game';
import { TGameState, CellType, TDirection, Direction } from '../types';

interface IBaseAgent {
    predict (state: TGameState): TDirection;
    gameStatesToTensor(state: Array<TGameState>): tf.Tensor;
};

export class BaseAgent implements IBaseAgent {
    public sideSize: number;
    protected model: tf.LayersModel;
    protected actions: Array<Direction> = [Direction.Right, Direction.Down, Direction.Left, Direction.Up];

    constructor(size: number) {
        this.sideSize = size;
        this.model = new tf.Sequential();
    }

    public predict(state: TGameState): TDirection {
        const prediction = tf.tidy(() => this.model.predict(this.gameStatesToTensor([state]))) as tf.Tensor;
        const topMostValue = prediction.argMax(-1).dataSync()[0];
        return this.directionByIndex(topMostValue);
    };

    protected async warm() {
        this.predict(defaultState);
    }

    public gameStatesToTensor(states: Array<TGameState> = []): tf.Tensor {
        const buffer = tf.buffer([states.length, this.sideSize, this.sideSize, 2]);

        states.forEach((state, i) => {
          state.cells.forEach(({ coordinate, type }) => buffer.set(
              type === CellType.snake || type === CellType.snakeHead ? type - 2 : type - 1,
              i,
              coordinate[0],
              coordinate[1],
              type === CellType.snake || type === CellType.snakeHead ? 0 : 1,
          ));
        });
        return buffer.toTensor();
    }

    protected directionByIndex(value: TDirection) {
        return this.actions[value];
    }
};
