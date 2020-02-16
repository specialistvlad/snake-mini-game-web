import { LosingLengthSnake } from './LosingLengthSnake';
import { Food } from './Food';
import { GameObject } from './GameObject';
import { TCellTypes, TCell, TGameState, TDegree, CellType, TCoordinate } from '../types';

interface IGame {
    reset(): void;
    tick(): TCellTypes;
    cells: TCellTypes;
    score: number;
    direction: number;
    gameOver: boolean;
};

export class Game implements IGame {
    private defaultState = { cells: [] };
    private size: number;
    public fullSize: number;
    private state: TGameState = this.defaultState;
    private snakes: Array<LosingLengthSnake> = [];
    private food: Array<Food> = [];
    private _cellsForView: TCellTypes = [];

    constructor(size: number = 10) {
        this.size = size;
        this.fullSize = size * size;
        this.reset();
        this._cellsForView = this.makeCellsForView();
    }

    public reset(): void {
        const center = [Math.trunc(this.size / 2), Math.trunc(this.size / 2)];
        this.snakes = [new LosingLengthSnake({
            name: 'My smart snake',
            snake: [
                [center[0], center[1]+1],
                [center[0], center[1]],
                [center[0], center[1]-1],
            ],
            tableSize: this.size,
        })];

        this.food = [
            new Food(this.size),
        ];
    }

    public tick(): TCellTypes {
        const gameObjects = Array<GameObject>(...this.food, ...this.snakes);
        this.state = this.reduce(gameObjects, this.reduce(gameObjects, this.defaultState), false);
        this._cellsForView = this.makeCellsForView();
        return this._cellsForView;
    }

    public reduce(array: Array<GameObject>, state: TGameState, forward: boolean = true): TGameState {
        const methodName = forward ? 'reduce' : 'reduceRight';
        return array[methodName]((accumulator: TGameState, item: GameObject) => item.reducer(accumulator, forward), state);
    }

    protected makeEmptyCellsForView(): TCellTypes {
        return this._cellsForView = Array<CellType>(this.fullSize).fill(CellType.empty);
    }

    protected indexToCoordinate(index: number, max: number): TCoordinate {
        return [Math.trunc(index / max), Math.trunc(index % max)];
    }

    protected coordinateToIndex([y, x]: TCoordinate): number {
        return y * this.size + x;
    }

    protected makeCellsForView(): TCellTypes {
        if (this._cellsForView.length === 0) {
            return this._cellsForView = this.makeEmptyCellsForView();
        }

        const cellTypeIndex = (value: CellType) => Object.keys(CellType).indexOf(value.toString());

        const cellsSorted = this.state.cells.sort((a: TCell, b: TCell) => {
            if (this.coordinateToIndex(a.coordinate) < this.coordinateToIndex(b.coordinate)) {
                return 1;
            }

            if (this.coordinateToIndex(a.coordinate) > this.coordinateToIndex(b.coordinate)) {
                return -1;
            }

            if (this.coordinateToIndex(a.coordinate) === this.coordinateToIndex(b.coordinate)) {
                if (cellTypeIndex(a.type) < cellTypeIndex(b.type)) {
                    return 1;
                }

                if (cellTypeIndex(a.type) > cellTypeIndex(b.type)) {
                    return -1;
                }
                return 0;
            }

            throw new Error('Imposible');
        });

        return this._cellsForView = this.makeEmptyCellsForView().map((l, index) => {
            const [y1, x1] = this.indexToCoordinate(index, this.size);
            return cellsSorted.find(({ coordinate: [y, x] }: TCell) => x === x1 && y === y1)?.type || CellType.empty;
        });
    }

    public get cells(): TCellTypes {
        return this._cellsForView;
    }

    public set direction(angle: TDegree) {
        this.snakes[0].direction = angle;
    }

    public get gameOver(): boolean {
        return this.snakes.length === 0 || this.snakes.filter(({ died }) => died).length === this.snakes.length;
    }

    public get score(): number {
        return this.snakes[0].score;
    }

    public get stepsLeft(): number {
        return this.snakes[0].stepsLeft;
    }
};