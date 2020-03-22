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

// *******************************************
// Coordinates and direction on the table
// *******************************************
export type TCoordinate = [number, number]; // y, x
export type TCoordinates = Array<TCoordinate>;

export enum Direction {
    Right = 0,
    Down = 90,
    Left = 180,
    Up = 270,
};

export enum RelativeDirection {
    Straight = 0,
    Left = 1,
    Right = 2,
};

export type TGameState = {
    cells: TCells,
};

export type TCell = {
    coordinate: TCoordinate,
    type: CellType,
};

export type TCells = Array<TCell>;
export type TCellTypes = Array<CellType>;

export type TGoogleGameObjects = {
    s: Array<TCoordinate>,
    f: Array<TCoordinate>,
};

export type TGoogleGameState = {
    cells: TCells,
    reward: number,
    fruitEaten: number,
    done: boolean,
};

export type TOptimizedState = [TGoogleGameState, RelativeDirection, number, boolean, TCells];
