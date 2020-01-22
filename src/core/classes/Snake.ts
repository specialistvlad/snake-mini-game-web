import { TArea } from '../types';

type TDirection = 'up' | 'down' | 'left' | 'right';
type TResult = 'impossible' | 'success' | 'died'; 
export type Coordinate = [number, number];

type Coordinates = Array<Coordinate>;

interface ISnakeCreateParams {
    name: string;
    initPoint: Coordinate;
    area: TArea,
    color?: string;
    direction?: TDirection;
};

interface ISnake {
    changeDirection(nextDirection: TDirection): boolean;
    step(): TResult;
};

export class Snake implements ISnake {
    public name: string;
    private snake: Coordinates;
    private area: TArea;
    private currentDirection: TDirection;
    private nextDirection: TDirection;

    constructor(params: ISnakeCreateParams) {
        this.validateParams(params); // make object is correct

        // setup all params
        this.name = params.name || 'Unknown snake';
        this.area = params.area;
        this.snake = [params.initPoint, [2,3], [2,4]];
        this.currentDirection = params.direction || 'up';
        this.nextDirection = params.direction || 'up';

        // trigger projecting snake coordinates to table without movement 
        this.step(true);
    }

    private validateParams({ initPoint, area }: ISnakeCreateParams) {
        if (initPoint[0] >= area.length) {
            throw new Error('Initial x point can\'t be great then area size!');
        }

        if (initPoint[1] >= area[initPoint[0]].length) {
            throw new Error('Initial x point can\'t be great then area size!');
        }
    }

    public step(init: boolean = false): TResult {
        // this.debug();
        const [last] = this.snake.slice(this.snake.length - 1); // in food was found then need return last element
        
        if (!init) {
            this.snake.unshift(this.getNextCoordForAngle(0));
            this.snake.pop();
        }

        
        this.snake.forEach(([x, y]) => this.area[x][y].cellType = 'snake');
        this.area[last[0]][last[1]].cellType = 'empty';
        return 'died';
    }

    public changeDirection(nextDirection: TDirection): boolean {
        if (this.isImpossibleDirection(nextDirection)) {
            return false;
        }

        this.nextDirection = nextDirection;
        return true;
    }

    private isImpossibleDirection(nextDirection: TDirection): boolean {
        return (this.currentDirection === 'up' && nextDirection === 'down') ||
            (this.currentDirection === 'down' && nextDirection === 'up') ||
            (this.currentDirection === 'left' && nextDirection === 'right') ||
            (this.currentDirection === 'right' && nextDirection === 'left');
    }

    private getNextCoordForAngle(angle: number): Coordinate {
        const [[x, y]] = this.snake.slice(0);
        if (y >= this.area.length - 1) {
            return [x, 0];
        }

        return [x, y + 1];
    }

    private debug(): void {
        console.table(this.area.map(row => row.map(({cellType}) => cellType)));
    }
};