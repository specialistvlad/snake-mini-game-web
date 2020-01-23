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


// Coordinates and direction on the table
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
export type TDegree = number;
export type TCoordinate = [number, number];
export type TCoordinates = Array<TCoordinate>;
export enum Directions { Right = 0, Down = 90, Left = 180, Up = 270 }