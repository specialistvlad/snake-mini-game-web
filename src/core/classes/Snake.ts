import { GameObject } from './GameObject';
import {
    TGameState,
    TCoordinate,
    TCoordinates,
    Direction,
    TDirection,
    CellType,
    TCells,
    TCell,
} from '../types';

export type TSnakeRewards = {
    step: number,
    food: number,
    poison: number,
    death: number,
};

export type TSnakeConstructorParams = {
    snake: TCoordinates;
    name?: string;
    direction?: TDirection;
    tableSize?: number;
    rewards?: {
        step?: number,
        food?: number,
        poison?: number,
        death?: number,
    },
};

export class Snake extends GameObject {
    protected _name: string;
    protected _died: boolean = false;
    protected _snake: TCoordinates;
    protected currentDirection: TDirection;
    protected nextDirection: TDirection;
    protected steps: number = -1;
    protected tableSize: number;
    protected _foodEaten: number = 0;
    protected _reward: number = 0;
    protected rewards: TSnakeRewards;

    constructor(params: TSnakeConstructorParams) {
        super();
        this._name = params.name || 'My hero snake';
        this._snake = params.snake;
        this.currentDirection = params.direction || Direction.Right;
        this.nextDirection = this.currentDirection;
        this.tableSize = params.tableSize || 100;
        this.rewards = {
            step: params.rewards?.step || -0.2,
            food: params.rewards?.food || 10,
            poison: params.rewards?.poison || -2,
            death: params.rewards?.death || -10,
        };
    }

    public set direction(nextDegree: TDirection) {
        this.nextDirection = nextDegree;
    }

    public get name(): string {
        return this._name;
    }

    public get length(): number {
        return this._snake.length;
    }

    public get points(): TCoordinates {
        return this._snake.slice();
    }

    public get reward(): number {
        return this._reward;
    }

    public get foodEaten(): number {
        return this._foodEaten;
    }

    get died(): boolean {
        return this._died;
    }

    get score(): number {
        return this.steps > 0 ? this.steps : 0;
    }

    protected die() {
        this._died = true;
        this._reward = this.rewards.death;
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
            ...currentState,
            cells: this._snake.map((item, index) => ({
                coordinate: item,
                type: index === 0 ? CellType.snakeHead : CellType.snake,
            })),
        };
    }

    protected step(gameCells: TCells): void {
        this._foodEaten = 0;
        this._reward = 0;

        if (this.collision(gameCells)) { // check collision with tail
            return;
        }

        if (this.collisionOthers(gameCells)) { // check collision in another cells
            return;
        }

        if (this.tastyFood(gameCells)) { // find food
            return;
        }

        if (this.disgustingPoison(gameCells)) {
            return;
        }

        if (this.usualStepForward(gameCells)) { // just move to next cell
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

        if (this._snake.find(([y, x]) => nextCoord[0] === y && nextCoord[1] === x)) {
            this.die();
            return true;
        }
        return false;
    }

    /**
     * Handle here usual step forward minus one tail block
     */
    protected usualStepForward(gameCells: TCells): boolean {
        this._snake = [this.getNextCoord(), ...this._snake.slice(0, this._snake.length - 1)];
        this._reward = this.rewards.step;
        return true;
    }

    /**
     * Detect food in next cell
     * If food found we have to:
     *  set flag "food eaten"
     *  set reward
     *  return next coord for snake's head plus current snake
     * 
     * @returns Return true if we need to stop step managing
     */
    protected tastyFood(gameCells: TCells): boolean {
        if (this.nextCell(gameCells)?.type === CellType.food) {
            this._snake = [this.getNextCoord(), ...this._snake];

            this._foodEaten = 1;
            this._reward = this.rewards.food;

            return true;
        }

        return false;
    }

    /**
     * Detect poison in next cell
     * If poison found we have to:
     *  set reward
     * 
     * @returns Return true if we need to stop step managing
     */
    protected disgustingPoison(gameCells: TCells): boolean {
        if (this.nextCell(gameCells)?.type === CellType.poison) {
            this._snake = [this.getNextCoord(), ...this._snake.slice(0, this._snake.length - 1)];
            this._reward = this.rewards.poison;
            return true;
        }

        return false;
    }

    /**
     * Handle here collision with another objects in cells
     */
    protected collisionOthers(gameCells: TCells): boolean {
        const nextCell = this.nextCell(gameCells);
        
        if (nextCell?.type === CellType.snake || nextCell?.type === CellType.snakeHead || nextCell?.type === CellType.wall) {
            this.die();
            return true;
        }
        return false;
    }

    protected getNextCoord(): TCoordinate {
        const [y, x] = this._snake.slice(0)[0];
        const isNextDirectionCorrect = Math.abs(this.currentDirection - this.nextDirection) !== 180;
        if (isNextDirectionCorrect) {
            this.currentDirection = this.nextDirection;
        }
    
        switch (isNextDirectionCorrect ? this.nextDirection : this.currentDirection) {
            case Direction.Left:
                return [y, x === 0 ? this.tableSize - 1 : x - 1];
            case Direction.Right:
                return [y, x + 1 === this.tableSize ? 0 : x + 1];
            case Direction.Down:
                return [y + 1 === this.tableSize ? 0 : y + 1, x];
            case Direction.Up:
                return [y === 0 ? this.tableSize - 1 : y - 1, x];
        };
        throw new Error(`I have no idea how to move this angle o_O: ${this.nextDirection}`)
    }
};