import { Snake } from './Snake';
import { TCell, ColorTable, TCells, CellType, CellPalette, SnakePalette } from '../types';

interface IGameTable {
    reset(): void;
    tick(): ColorTable;
};

export class GameTable implements IGameTable {
    public size: number = 5;
    public snakes: Array<Snake> = [];
    private cells: TCells = [];
    private randomizeMode: boolean = true;

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
            // console.log(this.cellsToColorTable());
            
            return this.cellsToColorTable();
        }
        // const makeSnakeStepsReducer = (snake: Snake) => {
        //     return (accumulator: TGameShit, currentValue: optionalDegree) => {
        //         if (currentValue !== null) {
        //             snake.direction = currentValue;
        //         }
        //         return snake.stepReducer(accumulator);
        //     };
        // };

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