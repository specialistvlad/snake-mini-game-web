import * as tf from '@tensorflow/tfjs';
import { RelativeDirection, TGameState, CellType } from '../types';

interface IBaseAgent {
    predict (state: TGameState): RelativeDirection;
    gameStatesToTensor(state: Array<TGameState>): tf.Tensor;
};

export class BaseAgent implements IBaseAgent {
    public sideSize: number;
    protected model: tf.LayersModel;

    constructor(size: number) {
        this.sideSize = size;
        this.model = new tf.Sequential();
    }

    public predict(state: TGameState): RelativeDirection {
        return tf.tidy(() => {
            const inputTensor = this.gameStatesToTensor([state]);
            const outTensor = this.model.predict(inputTensor);
            return outTensor;
        })
        // @ts-ignore
        .argMax(-1).dataSync();
    };

    protected async warm() {
        this.predict({ cells: [] });
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
};
