import { Snake } from './Snake';
import { Food } from './Food';
import { GameObject } from './GameObject';
import { TCell, TColorTable, TGameState, TScoreTable } from '../types';

interface IGame {
    reset(): void;
    tick(): TColorTable;
    cellsToColorTable(): TColorTable;
    getSnake(): Snake;
    score(): TScoreTable;
    // food(): TFoodScore;
};

export class Game implements IGame {
    private defaultState = { cells: [] };
    private size: number = 20;
    private state: TGameState = this.defaultState;
    private snakes: Array<Snake> = [];
    private food: Array<Food> = [];

    constructor() {
        this.reset();
    }

    public reset(): void {
        this.snakes = Snake.make(this.size);
        this.food = Food.make(this.size);
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

    public cellsToColorTable(): TColorTable {
        const table = Array<Array<string>>(this.size).fill([]).map(() => Array<string>(this.size).fill(''));
        this.state.cells.forEach(({ coordinate: [x, y], color}: TCell) => table[x][y] = color);
        return table;
    }

    public getSnake(): Snake {
        return this.snakes[0];
    }

    public score(): TScoreTable {
        return this.snakes.map(item => ({
            name: item.name,
            died: item.died,
            length: item.length,
            preview: item.preview,
        }));
    }
};