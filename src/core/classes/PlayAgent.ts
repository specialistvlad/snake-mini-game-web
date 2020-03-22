import * as tf from '@tensorflow/tfjs';
import { RelativeDirection, TGameState } from '../types';
import { BaseAgent } from './BaseAgent';

export class PlayAgent extends BaseAgent {
    public modelUrl: string;
    public sideSize: number;
    private _ready: boolean = false;

    constructor(size: number, url: string) {
        super(size);
        this.sideSize = size;
        this.modelUrl = url;
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
