import { TGameState, TDegree, TCoordinate, TCoordinates, Directions, CellType } from '../types';

export type TSnakeConstructorParams = {
    name: string;
    snake: TCoordinates;
    color?: string;
    direction?: TDegree;
    tableSize?: number;
};

interface ISnake {
    direction: TDegree;
    stepReducer(state: TGameState): TGameState;
};

export class Snake implements ISnake {
    private name: string;
    private color: string;
    private snake: TCoordinates;
    private currentDegree: TDegree;
    private nextDegree: TDegree;
    private steps: number = -1;
    private tableSize: number;


    constructor(params: TSnakeConstructorParams) {
        this.name = params.name || 'Unknown snake';
        this.color = params.color || 'pink';
        this.snake = params.snake;
        this.currentDegree = params.direction || 0;
        this.nextDegree = this.currentDegree;
        this.tableSize = params.tableSize || 100;
    }

    public stepReducer(game: TGameState): TGameState {
        console.log('Iteration #', this.steps, 'of', this.name);
        
        if (this.steps >= 0) {
            console.log('before', this.snake);
            this.move();
            console.log('after', this.snake);
        }
        this.steps++;

        return {
            ...game,
            cells: [
                ...game.cells,
                ...this.snake.map(item => ({
                    coordinate: item,
                    type: CellType.snake,
                    color: this.color,
                })),
            ],
        };
    }

    private move(): void {
        const [last] = this.snake.slice(this.snake.length - 1);
        const [first] = this.snake.slice(0);
        const nextCoord = this.getNextCoord(first);
        this.snake = [nextCoord, ...this.snake.slice(0, this.snake.length - 1)];
    }

    private getNextCoord([y, x]: TCoordinate): TCoordinate {
        const isNextDirectionInCorrect = Math.abs(Math.abs(this.currentDegree) - Math.abs(this.nextDegree)) === 180;
        switch (isNextDirectionInCorrect ? this.currentDegree : this.nextDegree) {
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
        // console.log(`Change direction to: ${Directions[nextDegree]}`);
    }

    get direction(): TDegree {
        return this.nextDegree;
    }
};