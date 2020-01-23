import { TArea, TDegree, TCoordinate, TCoordinates, Directions } from '../types';

interface ISnakeCreateParams {
    name: string;
    initPoint: TCoordinate;
    area: TArea,
    color?: string;
    direction?: TDegree;
};

interface ISnake {
    direction: TDegree;
    step(): void;
};

export class Snake implements ISnake {
    public name: string;
    private snake: TCoordinates;
    private area: TArea;
    private currentDegree: TDegree;
    private nextDegree: TDegree;

    constructor(params: ISnakeCreateParams) {
        this.validateParams(params); // make object is correct

        // setup all params
        this.name = params.name || 'Unknown snake';
        this.area = params.area;
        this.snake = [params.initPoint];
        this.currentDegree = params.direction || 0;
        this.nextDegree = this.currentDegree;

        this.render();
    }

    private validateParams({ initPoint, area }: ISnakeCreateParams) {
        if (initPoint[0] >= area.length) {
            throw new Error('Initial x point can\'t be great then area size!');
        }

        if (initPoint[1] >= area[initPoint[0]].length) {
            throw new Error('Initial x point can\'t be great then area size!');
        }
    }

    public step(): void {
        // this.debug();
        const nextCoord = this.getNextCoordForAngle(0);
        const nextCellType = this.area[nextCoord[0]][nextCoord[1]].cellType;
        const [last] = this.snake.slice(this.snake.length - 1);

        this.snake.unshift(nextCoord);
        this.snake.pop();
        this.render();
    }

    public render() {
        this.snake.forEach(([x, y]) => this.area[x][y].cellType = 'snake');
    }

    set direction(nextDegree: TDegree) {
        this.nextDegree = nextDegree;
        console.log(nextDegree, `Change direction to: ${nextDegree}˚ = ${Directions[nextDegree]}`);
    }

    get direction(): TDegree {
        return this.nextDegree;
    }

    private getNextCoordForAngle(angle: number): TCoordinate {
        const [[y, x]] = this.snake.slice(0);
        if (y >= this.area.length - 1) {
            return [x, 0];
        }

        return [x, y + 1];
    }

    private debug(): void {
        console.table(this.area.map(row => row.map(({cellType}) => cellType)));
    }
};