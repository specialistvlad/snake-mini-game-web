import { Snake } from './Snake';
import { TCell, ColorTable, TGameState } from '../types';

interface IGame {
    reset(): void;
    tick(): ColorTable;
};

export class Game implements IGame {
    private defaultState = { cells: [] };
    public size: number = 15;
    public snakes: Array<Snake> = [];
    private state: TGameState = this.defaultState;

    constructor() {
        this.reset();
    }

    public reset(): void {
        this.state = this.defaultState;
        this.snakes = this.makeSnakes();
    }

    public tick(): ColorTable {
        const gameObjects = Array<Snake>(...this.snakes);
        this.state = gameObjects.reduce((accumulator: TGameState, item: Snake) => item.reducer(accumulator), this.defaultState);
        return this.cellsToColorTable();
    }

    public cellsToColorTable(): ColorTable {
        const table = Array<Array<string>>(this.size).fill([]).map(() => Array<string>(this.size).fill(''));
        this.state.cells.forEach(({ coordinate: [x, y], color}: TCell) => table[x][y] = color);
        return table;
    }

    private makeSnakes() {
        return [new Snake({
            name: 'My smart snake',
            // snake: [[Math.trunc(this.size / 2), Math.trunc(this.size / 2)]],
            snake: [[0, 7],[0, 6],[0, 5],[0, 4],[0, 3],[0, 2], [0, 1], [0, 0]],
            // snake: [[0, 0], [0, 1], [0, 2], [0, 3]],
            tableSize: this.size,
            color: 'violet'
          })];
    }
};