import { Snake } from './Snake';
import { TArea, TCell, TCellType, colors } from '../../types';

interface IGameTable {
    start(): void;
    tick(): TArea;
    getActualArea(): TArea;
};

export class GameTable implements IGameTable {
    private size: number = 25;
    private snakes: Array<Snake> = [];
    private area: TArea;

    constructor() {
        this.area = this.makeArea();
        // this.makeSnake();
    }

    public start(): void {

    }

    public tick(): TArea {
        this.snakes.forEach(element => {
            element.step();
        });
        const random = (size: number) => Math.floor((Math.random() * size));
        // @ts-ignore
        const randomColorValue = (): TCellType  => Object.keys(colors)[random(Object.keys(colors).length)];
        this.area.forEach((row: Array<TCell>) => row.forEach((cell: TCell) => cell.cellType = randomColorValue()));
        // return 'died';
        return this.getActualArea();
    }
    public getActualArea(): TArea {
        return [...this.area];
    }

    private makeArea(): TArea {
        const row = () => Array<TCell>(this.size).fill({ cellType: 'wall' }).map((item) => ({ ...item }));
        return Array<Array<TCell>>(this.size).fill([]).map(row);
    }

    // private makeSnake() {
    //     new Snake({
    //         id: 'My test snake',
    //         initPoint: [0, 0],
    //         area,
    //       }),
    // }
};