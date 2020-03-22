import { LosingLengthSnake } from './LosingLengthSnake';
import { Food } from './Food';
import { GameObject } from './GameObject';
import { TGameState, TDirection, TCoordinate } from '../types';

interface IGame {
    reset(): void;
    step(direction: TDirection): TGameState;
    state: TGameState;
    direction: TDirection;
};

export type TGameConstructorParams = {
    snakes?: Array<LosingLengthSnake>;
    food?: Array<Food>;
};

export const defaultState = {
    cells: [],
    reward: 0,
    fruitEaten: 0,
    done: false,
};

export class Game implements IGame {
    protected opts: TGameConstructorParams;
    protected size: number;
    protected fullSize: number;
    protected snakes: Array<LosingLengthSnake> = [];
    protected food: Array<Food> = [];
    protected _state: TGameState = defaultState;

    constructor(size: number = 10, opts?: TGameConstructorParams) {
        this.opts = opts || {};
        this.size = size;
        this.fullSize = size * size;
        this.reset();
    }

    public reset(): void {
        const center = Math.trunc(this.size / 2);

        this.snakes = this.opts.snakes ? this.opts.snakes : [new LosingLengthSnake({
            snake: [
                [center, 2],
                [center, 1],
                [center, 0],
            ],
            tableSize: this.size,
        })];

        this.food = this.opts.food ? this.opts.food : [
            new Food(this.size),
        ];
    }

    public step(direction: TDirection): TGameState {
        this.setDirection(direction);
        const gameObjects = Array<GameObject>(...this.food, ...this.snakes);
        return this._state = this.reduce(gameObjects, this.reduce(gameObjects, defaultState), false);
    }

    public reduce(array: Array<GameObject>, state: TGameState, forward: boolean = true): TGameState {
        const methodName = forward ? 'reduce' : 'reduceRight';
        return array[methodName]((accumulator: TGameState, item: GameObject) => item.reducer(accumulator, forward), state);
    }

    protected setDirection(direction: TDirection) {
        this.snakes[0].direction = direction;
    }

    public get direction(): TDirection {
        return this.snakes[0].direction;
    }

    public get state(): TGameState {
        return this._state;
    }

    protected indexToCoordinate(index: number, max: number): TCoordinate {
        return [Math.trunc(index / max), Math.trunc(index % max)];
    }

    protected coordinateToIndex([y, x]: TCoordinate): number {
        return y * this.size + x;
    }
};