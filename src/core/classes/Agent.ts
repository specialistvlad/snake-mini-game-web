import * as tf from '@tensorflow/tfjs';
import { TCellTypes, Directions, TGameState, CellType } from '../types';

interface IAgent {
    predict (cells: TGameState): Directions
};

export class Agent implements IAgent {
    public modelUrl: string = './model/model.json';
    public sideSize: number;
    private model: any | undefined;

    constructor(size: number) {
        this.sideSize = size;
        this.loadModel();
    }

    public predict(cells: TGameState): Directions {
        console.log('Predict me');
        
        // Predict 3 random samples.
        // const prediction = model.predict(inputTensor, { verbose: true });
        // console.log('prediction', prediction.toString(true));
        return Directions.Up;
    };

    async loadModel() {
        this.model = await tf.loadLayersModel(this.modelUrl);
    }

    gameStateToTensor(state: TGameState) {
        // const statesCount = state.length;
        const n = 0;
        const statesCount = 1;
        const buffer = tf.buffer([statesCount, this.sideSize, this.sideSize, 2]);
        // for (let n = 0; n < states.length; ++n) {
            // const state = states[n];
            // if (state == null) {
            //     continue;
            // }
            state.cells.forEach(({ coordinate, type }) => buffer.set(
                type, n, coordinate[0], coordinate[1],
                type === CellType.snake || type === CellType.snakeHead ? 0 : 1,
            ));
        // }
        return buffer.toTensor();
    }
};