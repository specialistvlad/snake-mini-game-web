import { Snake } from './Snake';
import { TCell, ColorTable, TCells, CellType, CellPalette, SnakePalette, TGameStoreSimple, TGameStoreFull } from '../types';

interface IGameTable {
    reset(): void;
    tick(): ColorTable;
};

export class GameTable implements IGameTable {
    public size: number = 10;
    public snakes: Array<Snake> = [];
    private cells: TCells = [];
    private randomizeMode: boolean = false;

    constructor() {
        this.reset();
    }

    public reset(): void {
        this.cells = [];
        this.snakes = this.makeSnakes();
    }

    public tick(): ColorTable {
        if (this.randomizeMode) {
            this.randomizeCells();
            return this.cellsToColorTable();
        }

        const gameObjects = [...this.snakes, /*...his.foods*/];

        this.cells = gameObjects.reduce((accumulator: TGameStoreFull, item) => {
            const current = item.stepReducer({ coords: accumulator.cells.map((cell: TCell) => cell.coordinate) });
            return {
                ...current,
                cells: current.coords.map((coordinate) => ({
                    coordinate: coordinate,
                    type: CellType.snake,
                    color: SnakePalette[0],
                })),
            };
        }, {
            cells: [],
        }).cells;

        return this.cellsToColorTable();
    }

    public cellsToColorTable(): ColorTable {
        const table = Array<Array<string>>(this.size).fill([]).map(() => Array<string>(this.size).fill(''));
        this.cells.forEach(({ coordinate: [y, x], color}: TCell) => table[x][y] = color);
        return table;
    }

    private randomizeCells(): Array<TCell> {
        const random = (size: number) => Math.floor((Math.random() * size));
        return this.cells = Array<TCell>(this.size * this.size).fill({
            coordinate: [0, 0],
            type: CellType.empty,
            color: '',
        }).map((item: TCell, ind) => {
            const allColors = [...Object.values(CellPalette), ...SnakePalette];
            return {
                ...item,
                coordinate: [Math.trunc(ind / this.size), Math.trunc(ind % this.size)],
                color: allColors[random(allColors.length)],
                type: CellType.empty,
            };
        });
    }

    private makeSnakes() {
        return [new Snake({
            name: 'My smart snake',
            initPoint: [Math.round(this.size / this.size), Math.round(this.size / this.size)],
          })];
    }
};