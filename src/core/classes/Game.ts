import { LosingLengthSnake } from './LosingLengthSnake';
import { Food } from './Food';
import { GameObject } from './GameObject';
import {
    TCellTypes,
    TCell,
    TGameState,
    Direction,
    RelativeDirection,
    CellType,
    TCoordinate,
    TGoogleGameObjects,
    TGoogleGameState,
} from '../types';

interface IGame {
    reset(): void;
    tick(): TCellTypes;
    cells: TCellTypes;
    state: TGameState;
    score: number;
    direction: number;
    gameOver: boolean;
};

export type TGameConstructorParams = {
    snakes?: Array<LosingLengthSnake>;
    food?: Array<Food>;
};

export class Game implements IGame {
    protected defaultState = { cells: [] };
    protected size: number;
    protected fullSize: number;
    protected snakes: Array<LosingLengthSnake> = [];
    protected food: Array<Food> = [];
    protected _state: TGameState = this.defaultState;
    protected _cellsForView: TCellTypes = [];
    protected opts: TGameConstructorParams;

    constructor(size: number = 10, opts?: TGameConstructorParams) {
        this.opts = opts || {};
        this.size = size;
        this.fullSize = size * size;
        this.reset();
        this._cellsForView = this.makeCellsForView();
    }

    public reset(): void {
        const center = [Math.trunc(this.size / 2), Math.trunc(this.size / 2)];

        this.snakes = this.opts.snakes ? this.opts.snakes : [new LosingLengthSnake({
            name: 'My smart snake',
            snake: [
                [center[0], 2],
                [center[0], 1],
                [center[0], 0],
            ],
            tableSize: this.size,
        })];

        this.food = this.opts.food ? this.opts.food : [
            new Food(this.size),
        ];
    }

    public tick(): TCellTypes {
        const gameObjects = Array<GameObject>(...this.food, ...this.snakes);
        this._state = this.reduce(gameObjects, this.reduce(gameObjects, this.defaultState), false);
        this._cellsForView = this.makeCellsForView();
        return this._cellsForView;
    }

    public step(relativeDirection: RelativeDirection): TGoogleGameState {
        this.relativeDirection = relativeDirection;
        this.tick();
        return {
            state: this.getState(),
            reward: this.snakes[0].reward || 0,
            fruitEaten: this.snakes[0].foodEaten || 0,
            done: this.gameOver,
        };
    }

    public reduce(array: Array<GameObject>, state: TGameState, forward: boolean = true): TGameState {
        const methodName = forward ? 'reduce' : 'reduceRight';
        return array[methodName]((accumulator: TGameState, item: GameObject) => item.reducer(accumulator, forward), state);
    }

    protected makeEmptyCellsForView(): TCellTypes {
        return this._cellsForView = Array<CellType>(this.fullSize).fill(CellType.empty);
    }

    protected indexToCoordinate(index: number, max: number): TCoordinate {
        return [Math.trunc(index / max), Math.trunc(index % max)];
    }

    protected coordinateToIndex([y, x]: TCoordinate): number {
        return y * this.size + x;
    }

    protected makeCellsForView(): TCellTypes {
        if (this._cellsForView.length === 0) {
            return this._cellsForView = this.makeEmptyCellsForView();
        }

        const cellTypeIndex = (value: CellType) => Object.keys(CellType).indexOf(value.toString());

        const cellsSorted = this._state.cells.sort((a: TCell, b: TCell) => {
            if (this.coordinateToIndex(a.coordinate) < this.coordinateToIndex(b.coordinate)) {
                return 1;
            }

            if (this.coordinateToIndex(a.coordinate) > this.coordinateToIndex(b.coordinate)) {
                return -1;
            }

            if (this.coordinateToIndex(a.coordinate) === this.coordinateToIndex(b.coordinate)) {
                if (cellTypeIndex(a.type) < cellTypeIndex(b.type)) {
                    return 1;
                }

                if (cellTypeIndex(a.type) > cellTypeIndex(b.type)) {
                    return -1;
                }
                return 0;
            }

            throw new Error('Imposible');
        });

        return this._cellsForView = this.makeEmptyCellsForView().map((l, index) => {
            const [y1, x1] = this.indexToCoordinate(index, this.size);
            return cellsSorted.find(({ coordinate: [y, x] }: TCell) => x === x1 && y === y1)?.type || CellType.empty;
        });
    }

    public get cells(): TCellTypes {
        return this._cellsForView;
    }

    public get height(): number {
        return this.size;
    }

    public get width(): number {
        return this.size;
    }

    public set relativeDirection(direction: RelativeDirection) {
        this.snakes[0].relativeDirection = direction;
    }

    public set direction(angle: Direction) {
        this.snakes[0].direction = angle;
    }

    public get gameOver(): boolean {
        return this.snakes.length === 0 || this.snakes.filter(({ died }) => died).length === this.snakes.length;
    }

    public get score(): number {
        return this.snakes[0].score;
    }

    public get stepsLeft(): number {
        return this.snakes[0].stepsLeft;
    }

    public get state(): TGameState {
        return this._state;
    }

    public getState(): TGoogleGameObjects {
        return {
            s: this.snakes[0].points,
            f: this.food.map((food) => food.points).flat(),
        }
    }
};