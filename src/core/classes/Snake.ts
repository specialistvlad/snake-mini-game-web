import chroma from 'chroma-js';
import { TGameState, TDegree, TCoordinate, TCoordinates, Directions, CellType, TCells } from '../types';
import { GameObject } from './GameObject';

export type TSnakeConstructorParams = {
    name: string;
    snake: TCoordinates;
    color?: string;
    direction?: TDegree;
    tableSize?: number;
};

export class Snake extends GameObject {
    private name: string;
    private color: string;
    private snake: TCoordinates;
    private currentDegree: TDegree;
    private nextDegree: TDegree;
    private steps: number = -1;
    private tableSize: number;
    private died: boolean = false;

    constructor(params: TSnakeConstructorParams) {
        super();
        this.name = params.name || 'Unknown snake';
        this.color = params.color || 'pink';
        this.snake = params.snake;
        this.currentDegree = params.direction || 0;
        this.nextDegree = this.currentDegree;
        this.tableSize = params.tableSize || 100;
    }

    public static make(tableSize: number): Array<Snake> {
        return [new Snake({
            name: 'My smart snake',
            snake: [[Math.trunc(tableSize / 2), Math.trunc(tableSize / 2)]],
            tableSize: tableSize,
            color: chroma.random().hex(),
          })];
    }

    protected logic(currentState: TGameState, dryRun: boolean = false): TGameState {
        if (!dryRun) {
            if (this.steps >= 0 && !this.died) {
                this.step(currentState.cells);
            }
    
            this.steps++;
        }

        return {
            cells: this.snake.map((item, index) => ({
                coordinate: item,
                type: CellType.snake,
                color: this.colorful(index),
            })),
        };
      }

    private colorful(index: number): string {
        const len = this.snake.length - 1;
        // return index === 0 ? this.color : chroma.random().hex();
        return index === 0 ? this.color : chroma(this.color).saturate(index).darken((index / len) * 2).hex();
    }

    private step(gameCells: TCells): void {
        const [first] = this.snake.slice(0);
        const [last] = this.snake.slice(this.snake.length - 1);
        const next = this.getNextCoord(first);
        const nextElementOnTable = gameCells.find(({ coordinate }) => next[0] === coordinate[0] && next[1] === coordinate[1]);
        const collision = this.snake.find(([y, x]) => next[0] === y && next[1] === x);
        
        if (collision || nextElementOnTable?.type === CellType.snake || nextElementOnTable?.type === CellType.wall) {
            this.died = true;
            return;
        }

        if (nextElementOnTable?.type === CellType.food) {
            this.snake = [
                next,
                ...this.snake.slice(0, this.snake.length - 1),
                last,
            ];
            return;
        }

        this.snake = [
            next,
            ...this.snake.slice(0, this.snake.length - 1),
        ];
        
    }

    private getNextCoord([y, x]: TCoordinate): TCoordinate {
        const isNextDirectionCorrect = Math.abs(this.currentDegree - this.nextDegree) !== 180;
        if (isNextDirectionCorrect) {
            this.currentDegree = this.nextDegree;
        }
    
        switch (isNextDirectionCorrect ? this.nextDegree : this.currentDegree) {
            case Directions.Left:
                return [y, x === 0 ? this.tableSize - 1 : x - 1];
            case Directions.Right:
                return [y, x + 1 === this.tableSize ? 0 : x + 1];
            case Directions.Down:
                return [y + 1 === this.tableSize ? 0 : y + 1, x];
            case Directions.Up:
                return [y === 0 ? this.tableSize - 1 : y - 1, x];
        };
        throw new Error(`I have no idea how to move this degree o_O: ${this.nextDegree}`)
    }

    set direction(nextDegree: TDegree) {
        this.nextDegree = nextDegree;
    }
};