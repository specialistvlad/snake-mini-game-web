import * as tf from '@tensorflow/tfjs';
import { RelativeDirection, TGameState, CellType, TGoogleGameObjects } from '../types';

interface IBaseAgent {
    predict (state: TGameState): RelativeDirection;
    gameStateToTensor(state: TGameState): tf.Tensor;
};

export class BaseAgent implements IBaseAgent {
    public sideSize: number;
    protected model: any | undefined;

    constructor(size: number) {
        this.sideSize = size;
    }

    public predict(state: TGameState): RelativeDirection {
        return tf.tidy(() => {
            const inputTensor = this.gameStateToTensor(state);
            const outTensor = this.model.predict(inputTensor);
            // console.log('Predicted!', outTensor.toString());
            return outTensor;
        }).argMax(-1).dataSync();
    };

    protected async warm() {
        this.predict({ cells: [] });
    }

    public gameStateToTensor(state: TGameState): tf.Tensor {
        const n = 0;
        const statesCount = 1;
        const buffer = tf.buffer([statesCount, this.sideSize, this.sideSize, 2]);
        state.cells.forEach(({ coordinate, type }) => buffer.set(
            type === CellType.snake || type === CellType.snakeHead ? type - 2 : type - 1,
            n,
            coordinate[0],
            coordinate[1],
            type === CellType.snake || type === CellType.snakeHead ? 0 : 1,
        ));
        return buffer.toTensor();
    }

    public getStateTensor(state: Array<TGoogleGameObjects>, sideSize: number) {
      const h = sideSize;
      const w = sideSize;
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
};
