import { Snake } from './Snake';
import { TArea, TCell, colors } from '../types';

interface IGameTable {
    reset(): void;
    tick(): TArea;
    getActualArea(): TArea;
};

export class GameTable implements IGameTable {
    private size: number = 25;
    public snakes: Array<Snake> = [];
    private area: TArea = [];
    private randomizeMode: boolean = false;

    constructor() {
        this.reset();
    }

    public reset(): void {
        this.area = this.makeArea();
        this.snakes = this.makeSnakes();
    }

    public tick(): TArea {
        if (this.randomizeMode) {
            this.randomizeArea();
            return this.getActualArea();
        }

        this.area.forEach((row: Array<TCell>) => row.forEach((cell: TCell) => cell.cellType = 'empty'));
        this.snakes.forEach(element => element.step());
        return this.getActualArea();
    }

    public getActualArea(): TArea {
        return [...this.area];
    }

    private makeArea(): TArea {
        const row = () => Array<TCell>(this.size).fill({ cellType: 'empty' }).map((item) => ({ ...item }));
        return Array<Array<TCell>>(this.size).fill([]).map(row);
    }

    private randomizeArea(): void {
        const random = (size: number) => Math.floor((Math.random() * size));
        // @ts-ignore
        this.area.forEach((row: Array<TCell>) => row.forEach((cell: TCell) => cell.cellType = Object.keys(colors)[random(Object.keys(colors).length)]));
    }

    private makeSnakes() {
        return [new Snake({
            name: 'My test snake',
            initPoint: [2, 2],
            area: this.area,
          })];
    }
};