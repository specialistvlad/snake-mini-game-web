import * as tf from '@tensorflow/tfjs';
import { RelativeDirection, TGameState, CellType } from '../types';

interface IBaseAgent {
    predict (state: TGameState): RelativeDirection;
    gameStatesToTensor(state: Array<TGameState>): tf.Tensor;
};

export class BaseAgent implements IBaseAgent {
    public sideSize: number;
    protected model: any | undefined;

    constructor(size: number) {
        this.sideSize = size;
    }

    public predict(state: TGameState): RelativeDirection {
        return tf.tidy(() => {
            const inputTensor = this.gameStatesToTensor([state]);
            const outTensor = this.model.predict(inputTensor);
            // console.log('Predicted!', outTensor.toString());
            return outTensor;
        }).argMax(-1).dataSync();
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

    // public getStateTensor(state: Array<TGoogleGameObjects>, sideSize: number): tf.Tensor {
    //   const h = sideSize;
    //   const w = sideSize;
    //   const numExamples = state.length;
    //   const buffer = tf.buffer([numExamples, h, w, 2]);
    
    //   for (let n = 0; n < numExamples; ++n) {
    //     if (state[n] == null) {
    //       continue;
    //     }
    //     // Mark the snake.
    //     state[n].s.forEach((yx, i) => {
    //       buffer.set(i === 0 ? 2 : 1, n, yx[0], yx[1], 0);
    //     });
    
    //     // Mark the fruit(s).
    //     state[n].f.forEach(yx => {
    //       buffer.set(1, n, yx[0], yx[1], 1);
    //     });
    //   }
    //   return buffer.toTensor();
    // }
};
