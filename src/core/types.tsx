export const CellPalette = {
    empty: 'black',
    wall: 'white',
    mirror: 'gray',
    food: 'green',
};

export const SnakePalette = ['red', 'blue', 'yellow', 'pearl'];

export enum CellType {
    empty = 'empty',
    wall = 'wall',
    food = 'food',
    snake = 'snake',
};
type TCellColor = string;

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

export type TGameStoreSimple = {
    coords: TCoordinates,
};

export type TGameStoreFull = {
    cells: TCells,
};

export type TCell = {
    coordinate: TCoordinate,
    type: CellType,
    color: TCellColor,
};

export type TCells = Array<TCell>;
export type ColorTable = Array<Array<string>>;