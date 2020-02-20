import * as tf from '@tensorflow/tfjs';
import { RelativeDirection, TGameState, CellType } from '../types';

interface IAgent {
    predict (state: TGameState): RelativeDirection;
    gameStateToTensor(state: TGameState): tf.Tensor;
};

export class Agent implements IAgent {
    public modelUrl: string = './model/model.json';
    public sideSize: number;
    private model: any | undefined;

    constructor(size: number) {
        this.sideSize = size;
        this.loadModel();
    }

    public predict(state: TGameState): RelativeDirection {
        return tf.tidy(() => {
            const inputTensor = this.gameStateToTensor(state);
            const outTensor = this.model.predict(inputTensor);
            console.log('Predicted!', outTensor.toString());
            return outTensor;
        }).argMax(-1).dataSync();
    };

    async loadModel() {
        this.model = await tf.loadLayersModel(this.modelUrl);
    }

    gameStateToTensor(state: TGameState): tf.Tensor {
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
};
