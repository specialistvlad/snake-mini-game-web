import * as tf from '@tensorflow/tfjs';
import { RelativeDirection, TGameState, CellType } from '../types';

interface IPlayAgent {
    predict (state: TGameState): RelativeDirection;
    gameStateToTensor(state: TGameState): tf.Tensor;
};

export class PlayAgent implements IPlayAgent {
    public modelUrl: string = './model/model.json';
    public sideSize: number;
    private model: any | undefined;
    private _agentReady: boolean = false;

    constructor(size: number) {
        this.sideSize = size;
    }

    async init(): Promise<undefined> {
        await this.loadModel();
        this._agentReady = true;
        this.warm();
        return;
    }

    public get agentReady(): boolean {
        return this._agentReady;
    }

    public predict(state: TGameState): RelativeDirection {
        if (!this._agentReady) {
            throw new Error('Agent is not ready to predict yet');
        }

        return tf.tidy(() => {
            const inputTensor = this.gameStateToTensor(state);
            const outTensor = this.model.predict(inputTensor);
            // console.log('Predicted!', outTensor.toString());
            return outTensor;
        }).argMax(-1).dataSync();
    };

    private async loadModel(): Promise<undefined> {
        this.model = await tf.loadLayersModel(this.modelUrl);
        return;
    }

    private async warm() {
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
};
