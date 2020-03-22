import * as tf from '@tensorflow/tfjs';
import { RelativeDirection, TGameState, CellType } from '../types';
import { BaseAgent } from './BaseAgent';

interface IPlayAgent {
    predict (state: TGameState): RelativeDirection;
    gameStateToTensor(state: TGameState): tf.Tensor;
};

export class PlayAgent extends BaseAgent implements IPlayAgent {
    public modelUrl: string = './model/model.json';
    public sideSize: number;
    private _ready: boolean = false;

    constructor(size: number) {
        super(size);
        this.sideSize = size;
    }

    public async loadModel(): Promise<undefined> {
        this.model = await tf.loadLayersModel(this.modelUrl);
        this._ready = true;
        this.warm();
        return;
    }

    public get ready(): boolean {
        return this._ready;
    }

    public predict(state: TGameState): RelativeDirection {
        if (!this._ready) {
            throw new Error('Agent is not ready to predict yet');
        }

        return super.predict(state);
    };
};
