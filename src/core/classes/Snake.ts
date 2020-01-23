import { TGameShit, TDegree, TCoordinate, TCoordinates, Directions } from '../types';

export type TSnakeConstructorParams = {
    name: string;
    initPoint: TCoordinate;
    color?: string;
    direction?: TDegree;
};

interface ISnake {
    direction: TDegree;
    stepReducer({ coords }: TGameShit): TGameShit;
};

export class Snake implements ISnake {
    private name: string;
    private snake: TCoordinates;
    private currentDegree: TDegree;
    private nextDegree: TDegree;
    private steps: number = -1;

    constructor(params: TSnakeConstructorParams) {
        this.name = params.name || 'Unknown snake';
        this.snake = [params.initPoint];
        this.currentDegree = params.direction || 0;
        this.nextDegree = this.currentDegree;
    }

    public stepReducer(game: TGameShit): TGameShit {
        if (this.steps >= 0) {
            this.move();
        }
        this.steps++;

        return {
            ...game,
            coords: [ ...this.snake ],
        };
    }

    private move(): void {
        const [last] = this.snake.slice(this.snake.length - 1);
        const nextCoord = this.getNextCoord(last);
        this.snake = [nextCoord, ...this.snake.slice(0, this.snake.length - 1)];
    }

    private getNextCoord([y, x]: TCoordinate): TCoordinate {
        const isNextDirectionInCorrect = Math.abs(Math.abs(this.currentDegree) - Math.abs(this.nextDegree)) === 180;
        switch (isNextDirectionInCorrect ? this.currentDegree : this.nextDegree) {
            case Directions.Left:
                return [y, x - 1];
            case Directions.Right:
                return [y, x + 1];
            case Directions.Down:
                return [y + 1, x];
            case Directions.Up:
                return [y - 1, x];
        };
        throw new Error(`I have no idea how to move on this degree: ${this.nextDegree}`)
    }

    set direction(nextDegree: TDegree) {
        this.nextDegree = nextDegree;
        // console.log(`Change direction to: ${Directions[nextDegree]}`);
    }

    get direction(): TDegree {
        return this.nextDegree;
    }
};