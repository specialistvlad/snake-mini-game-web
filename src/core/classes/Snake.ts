import chroma from 'chroma-js';
import { TGameState, TDegree, TCoordinate, TCoordinates, Directions, CellType, TCells, TCell, TSnakePreview, TCellColor } from '../types';
import { GameObject } from './GameObject';

export type TSnakeConstructorParams = {
    name: string;
    snake: TCoordinates;
    color?: string;
    direction?: TDegree;
    tableSize?: number;
};

export class Snake extends GameObject {
    private _name: string;
    private _died: boolean = false;
    private color: string;
    private snake: TCoordinates;
    private currentDegree: TDegree;
    private nextDegree: TDegree;
    private steps: number = -1;
    private tableSize: number;

    constructor(params: TSnakeConstructorParams) {
        super();
        this._name = params.name || 'Unknown snake';
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

    public set direction(nextDegree: TDegree) {
        this.nextDegree = nextDegree;
    }

    public get name(): string {
        return this._name;
    }

    public get length(): number {
        return this.snake.length;
    }

    get died(): boolean {
        return this._died;
    }

    public get preview(): TSnakePreview {
        const previewLength = 5;
        return (Array<TCellColor>(previewLength)
            .fill('')
            .map((item, index) => this.colorful(index))
            .slice(0, this.length >= previewLength ? previewLength : this.length) as TSnakePreview);
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
        const next = this.getNextCoord();
        const nextElementOnTable = gameCells.find(({ coordinate }) => next[0] === coordinate[0] && next[1] === coordinate[1]);

        if (this.collision(gameCells, nextElementOnTable, next)) { // do nothing if collision with tail of with another snakes was detected
            return;
        }

        if (this.tastyFood(gameCells, nextElementOnTable)) { // grow
            this.snake = [next, ...this.snake];
            return;
        }

        if (this.loseWeight()) {
            if (this.snake.length === 1) {
                this._died = true;
                return;
            }
            this.snake = [next, ...this.snake.slice(0, this.snake.length - 2)];
        }

        this.snake = [next, ...this.snake.slice(0, this.snake.length - 1)];
    }


    private loseWeight(): boolean {
        // not implemented loose weight mode
        return false;
    }


    private collision(gameCells: TCells, nextCell: TCell | undefined, next: TCoordinate): boolean {
        const collision = this.snake.find(([y, x]) => next[0] === y && next[1] === x);
        
        if (collision || nextCell?.type === CellType.snake || nextCell?.type === CellType.wall) {
            return this._died = true;
        }
        return false;
    }

    private tastyFood(gameCells: TCells, nextCell: TCell | undefined): boolean {
        return nextCell?.type === CellType.food;
    }

    private getNextCoord(): TCoordinate {
        const [y, x] = this.snake.slice(0)[0];
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
};