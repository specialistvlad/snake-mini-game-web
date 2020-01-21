type TDirection = 'up' | 'down' | 'left' | 'right';
type TResult = 'impossible' | 'success' | 'died'; 
export type Coordinate = [number, number];
type Coordinates = Array<Coordinate>;

interface ISnakeParams {
    id: string;
    initPoint: Coordinate;
    color?: string;
    direction?: TDirection;
};

interface ISnake {
    changeDirection(nextDirection: TDirection): boolean;
    step(): TResult;
};

export class Snake implements ISnake {
    id: string;
    coordinates: Coordinates;
    currentDirection: TDirection;
    nextDirection: TDirection;

    constructor(params: ISnakeParams) {
        this.id = params.id || 'Unknown snake';
        this.coordinates = [params.initPoint];
        this.currentDirection = params.direction || 'up';
        this.nextDirection = params.direction || 'up';
    }

    public step(): TResult {
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
};