import chroma from 'chroma-js';
import { GameObject } from './GameObject';
import {
    TGameState,
    TDegree,
    TCoordinate,
    TCoordinates,
    Directions,
    CellType,
    TCells,
    TCell,
    TSnakePreview,
    TCellColor
} from '../types';

export type TSnakeConstructorParams = {
    name: string;
    snake: TCoordinates;
    color?: string;
    direction?: TDegree;
    tableSize?: number;
};

export class Snake extends GameObject {
    private _name: string;
    protected _died: boolean = false;
    private color: string;
    protected snake: TCoordinates;
    private currentDegree: TDegree;
    private nextDegree: TDegree;
    protected steps: number = -1;
    private tableSize: number;

    constructor(params: TSnakeConstructorParams) {
        super();
        this._name = params.name || 'Unknown snake';
        this.color = params.color || 'rgb(239, 27, 232)' || chroma.random().hex();
        this.snake = params.snake;
        this.currentDegree = params.direction || 0;
        this.nextDegree = this.currentDegree;
        this.tableSize = params.tableSize || 100;
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

    get score(): number {
        return this.steps;
    }

    public get preview(): TSnakePreview {
        const previewLength = 5;
        return (Array<TCellColor>(previewLength)
            .fill('')
            .map((item, index) => this.colorful(index))
            .slice(0, this.length >= previewLength ? previewLength : this.length) as TSnakePreview);
    }

    protected reduceForward(currentState: TGameState, dryRun: boolean = false): TGameState {
        if (!dryRun) {
            if (!this._died) {
                if (this.steps >= 0) {
                    this.step(currentState.cells);
                }
                this.steps++;
            }
        }

        return {
            cells: this.snake.map((item, index) => ({
                coordinate: item,
                type: CellType.snake,
                color: this.colorful(index),
            })),
        };
    }

    protected colorful(index: number): string {
        return index === 0
            ? this.color
            : chroma(this.color).saturate(index).darken((index / this.snake.length - 1) * 2).hex();
    }

    protected step(gameCells: TCells): void {
        if (this.collision(gameCells)) { // collision with tail check
            return;
        }

        if (this.collisionOthers(gameCells)) { // collision in another cells check
            return;
        }

        if (this.tastyFood(gameCells)) { // find food
            return;
        }

        if (this.usualStepForward(gameCells)) { // find food
            return;
        }
    }

    /**
     * Return possible cell if it already exists in array based on your snake movement way
     * 
     * In this cell can be: food, another snake or another type of cell
     * In this cell can't be current snake tail
     */
    protected nextCell(gameCells: TCells): TCell | undefined {
        const [y1, x1] = this.getNextCoord();
        return gameCells.find(({ coordinate: [y0, x0] }) => y0 === y1 && x0 === x1);
    }

    /**
     * Handle here collision with your tail
     */
    protected collision(gameCells: TCells): boolean {
        const nextCoord = this.getNextCoord();

        if (this.snake.find(([y, x]) => nextCoord[0] === y && nextCoord[1] === x)) {
            return this._died = true;
        }
        return false;
    }

    /**
     * Handle here usual step forward minus one tail block
     */
    protected usualStepForward(gameCells: TCells): boolean {
        this.snake = [this.getNextCoord(), ...this.snake.slice(0, this.snake.length - 1)];
        return true;
    }

    /**
     * Detect food in next cell
     * If food found we have to return next coord for snake's head plus current snake
     * 
     * @returns Return true if we need to stop step managing
     */
    protected tastyFood(gameCells: TCells): boolean {
        if (this.nextCell(gameCells)?.type === CellType.food) {
            this.snake = [this.getNextCoord(), ...this.snake];
            return true;
        }

        return false;
    }

    /**
     * Handle here collision with another objects in cells
     */
    protected collisionOthers(gameCells: TCells): boolean {
        const nextCell = this.nextCell(gameCells);
        
        if (nextCell?.type === CellType.snake || nextCell?.type === CellType.wall) {
            return this._died = true;
        }
        return false;
    }

    protected getNextCoord(): TCoordinate {
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