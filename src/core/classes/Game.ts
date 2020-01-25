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
    public size: number = 20;
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
        this.state = this.reduce(gameObjects, this.reduce(gameObjects, this.defaultState), false);
        return this.cellsToColorTable();
    }

    public reduce(array: Array<GameObject>, state: TGameState, forward: boolean = true): TGameState {
        const methodName = forward ? 'reduce' : 'reduceRight';
        return array[methodName]((accumulator: TGameState, item: GameObject) => item.reducer(accumulator, forward), state);
    }

    public cellsToColorTable(): ColorTable {
        const table = Array<Array<string>>(this.size).fill([]).map(() => Array<string>(this.size).fill(''));
        this.state.cells.forEach(({ coordinate: [x, y], color}: TCell) => table[x][y] = color);
        return table;
    }
};