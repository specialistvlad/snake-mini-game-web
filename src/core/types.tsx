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