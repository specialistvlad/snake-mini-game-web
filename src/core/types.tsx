export const colors = {
    empty: 'black',
    wall: 'white',
    food: 'green',
    snake: 'red',
};

export type TCellType = 'empty' | 'wall' | 'food' | 'snake';

type TCellColor = string;

export type TCell = {
    cellType: TCellType,
    cellColor?: TCellColor,
};

export type TRow = Array<TCell>;
export type TArea = Array<Array<TCell>>;

// *******************************************
// Coordinates and direction on the table
// *******************************************
export type TCoordinate = [number, number]; // y, x
export type TCoordinates = Array<TCoordinate>;
//
// 0 |---------------> X
// -
// |
// |       0˚ →
// |       90˚ ↓
// |       180˚ ←
// |       270˚ ↑
// |
// ∨
// 
// Y
export enum Directions {
    Right = 0,
    Down = 90,
    Left = 180,
    Up = 270,
};

export type TDegree = number;

export type TGameShit = {
    coords: TCoordinates,
};