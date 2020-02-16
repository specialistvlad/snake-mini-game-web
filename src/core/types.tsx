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
};

// *******************************************
// Coordinates and direction on the table
// *******************************************
export type TCoordinate = [number, number]; // y, x
export type TCoordinates = Array<TCoordinate>;
export enum Directions {
    Right = 0,
    Down = 90,
    Left = 180,
    Up = 270,
};

export type TDegree = number;

export type TGameState = {
    cells: TCells,
};

export type TCell = {
    coordinate: TCoordinate,
    type: CellType,
};

export type TCells = Array<TCell>;
export type TCellTypes = Array<CellType>;
