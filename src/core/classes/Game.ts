import { LosingLengthSnake } from './LosingLengthSnake';
import { Food } from './Food';
import { GameObject } from './GameObject';
import { TCell, TColorTable, TGameState, TScoreTable, TDegree } from '../types';

interface IGame {
    reset(): void;
    tick(): TColorTable;
    cells: TColorTable;
    score: TScoreTable;
    direction: number;
    gameOver: boolean;
};

export class Game implements IGame {
    private defaultState = { cells: [] };
    private size: number = 20;
    private state: TGameState = this.defaultState;
    private snakes: Array<LosingLengthSnake> = [];
    private food: Array<Food> = [];

    constructor() {
        this.reset();
    }

    public reset(): void {
        this.snakes = [new LosingLengthSnake({
            name: 'My smart snake',
            snake: [[Math.trunc(this.size / 2), Math.trunc(this.size / 2)]],
            tableSize: this.size,
          })];
          
        this.food = [
            new Food(this.size),
            new Food(this.size),
            new Food(this.size),
          ];
    }

    public tick(): TColorTable {
        const gameObjects = Array<GameObject>(...this.food, ...this.snakes);
        this.state = this.reduce(gameObjects, this.reduce(gameObjects, this.defaultState), false);
        return this.cellsToColorTable();
    }

    public reduce(array: Array<GameObject>, state: TGameState, forward: boolean = true): TGameState {
        const methodName = forward ? 'reduce' : 'reduceRight';
        return array[methodName]((accumulator: TGameState, item: GameObject) => item.reducer(accumulator, forward), state);
    }

    protected cellsToColorTable(): TColorTable {
        const table = Array<Array<string>>(this.size).fill([]).map(() => Array<string>(this.size).fill(''));
        this.state.cells.forEach(({ coordinate: [x, y], color}: TCell) => table[x][y] = color);
        return table;
    }

    public get cells(): TColorTable {
        return this.cellsToColorTable();
    }

    public set direction(angle: TDegree) {
        this.snakes[0].direction = angle;
    }

    public get gameOver(): boolean {
        return this.snakes.length === 0 || this.snakes.filter(({ died }) => died).length === this.snakes.length;
    }

    public get score(): TScoreTable {
        return this.snakes.map(item => ({
            name: item.name,
            died: item.died,
            length: item.length,
            preview: item.preview,
            stepsLeft: item.stepsLeft,
        }));
    }
};