export const CellPalette = {
    empty: 'black',
    wall: 'white',
    mirror: 'gray',
    food: 'green',
};

export enum CellType {
    empty = 'empty',
    wall = 'wall',
    food = 'food',
    snake = 'snake',
};
export type TCellColor = string;

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
    color: TCellColor,
};

export type TCells = Array<TCell>;
export type TColorTableRow = Array<string>;
export type TColorTable = Array<TColorTableRow>;

export type TSnakePreview = [TCellColor, TCellColor, TCellColor, TCellColor, TCellColor];
export type TScore = {
    name: string;
    died: boolean;
    length: number,
    preview: TSnakePreview,
};
export type TScoreTable = Array<TScore>;