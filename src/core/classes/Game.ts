import { LosingLengthSnake } from './LosingLengthSnake';
import { Food } from './Food';
import { GameObject } from './GameObject';
import { TCell, TColorTable, TGameState, TDegree, CellType } from '../types';

interface IGame {
    reset(): void;
    tick(): TColorTable;
    cells: TColorTable;
    score: number;
    direction: number;
    gameOver: boolean;
};

export class Game implements IGame {
    private defaultState = { cells: [] };
    private size: number;
    private state: TGameState = this.defaultState;
    private snakes: Array<LosingLengthSnake> = [];
    private food: Array<Food> = [];
    private tmp: TColorTable;

    constructor(size: number = 10) {
        this.size = size;
        this.reset();
        this.tmp = this.cellsToColorTable();
    }

    public reset(): void {
        const center = [Math.trunc(this.size / 2), Math.trunc(this.size / 2)];
        this.snakes = [new LosingLengthSnake({
            name: 'My smart snake',
            snake: [
                [center[0], center[1]+1],
                [center[0], center[1]],
                [center[0], center[1]-1],
            ],
            tableSize: this.size,
        })];

        this.food = [
            new Food(this.size),
        ];
    }

    public tick(): TColorTable {
        // console.time('reduce');
        const gameObjects = Array<GameObject>(...this.food, ...this.snakes);
        this.state = this.reduce(gameObjects, this.reduce(gameObjects, this.defaultState), false);
        // console.timeEnd('reduce');
        // console.time('conversion');
        this.tmp = this.cellsToColorTable();
        // console.timeEnd('conversion');
        return this.tmp;
    }

    public reduce(array: Array<GameObject>, state: TGameState, forward: boolean = true): TGameState {
        const methodName = forward ? 'reduce' : 'reduceRight';
        return array[methodName]((accumulator: TGameState, item: GameObject) => item.reducer(accumulator, forward), state);
    }

    protected cellsToColorTable(): TColorTable {
        const table = Array<Array<CellType>>(this.size).fill([]).map(() => Array<CellType>(this.size).fill(CellType.empty));
        this.state.cells.forEach(({ coordinate: [x, y], type}: TCell) => table[x][y] = type);
        return table;
    }

    public get cells(): TColorTable {
        return this.tmp;
    }

    public set direction(angle: TDegree) {
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
};