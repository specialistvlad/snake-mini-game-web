import { Snake } from './Snake';
import { Food } from './Food';
import { GameObject } from './GameObject';
import { TCell, ColorTable, TGameState } from '../types';

interface IGame {
    reset(): void;
    tick(): ColorTable;
};

export class Game implements IGame {
    private defaultState = { cells: [] };
    public size: number = 15;
    private state: TGameState = this.defaultState;
    public snakes: Array<Snake> = [];
    public food: Array<Food> = [];

    constructor() {
        this.reset();
    }

    public reset(): void {
        this.snakes = Snake.make(this.size);
        this.food = Food.make(this.size);
    }

    public tick(): ColorTable {
        const gameObjects = Array<GameObject>(...this.food, ...this.snakes);
        this.state = this.composeSnakes();

        this.state = gameObjects.reduce((accumulator: TGameState, item: GameObject) => item.reducer(accumulator), this.defaultState);
        return this.cellsToColorTable();
    }

    public composeSnakes(): TGameState {
        return this.snakes.reduce((accumulator: TGameState, item: Snake) => item.reducer(accumulator, true), this.defaultState);
    }

    public cellsToColorTable(): ColorTable {
        const table = Array<Array<string>>(this.size).fill([]).map(() => Array<string>(this.size).fill(''));
        this.state.cells.forEach(({ coordinate: [x, y], color}: TCell) => table[x][y] = color);
        return table;
    }
};