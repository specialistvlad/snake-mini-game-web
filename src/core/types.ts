export enum GameState {
    ready = 0,
    running = 1,
    pause = 2,
    gameOver = 3,
};

export enum CellType {
    empty = 0,
    wall,
    food,
    snake,
    snakeHead,
    poison,
};

export type TCoordinate = [number, number]; // y, x
export type TCoordinates = Array<TCoordinate>;

export enum Direction {
    Right = 0,
    Down = 90,
    Left = 180,
    Up = 270,
};

export type TDirection = Direction.Right | Direction.Down | Direction.Left | Direction.Up;

export type TGameState = {
    cells: TCells,
    reward: number,
    fruitEaten: number,
    done: boolean,
};

export type TCell = {
    coordinate: TCoordinate,
    type: CellType,
};

export type TCells = Array<TCell>;
export type TCellTypes = Array<CellType>;

export type TOptimizedState = [TGameState, Direction, number, boolean, TCells];
