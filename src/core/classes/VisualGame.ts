import { Game } from './Game';
import { TGameState, TCellTypes, TCell, CellType, TDirection } from '../types';

export class VisualGame extends Game {
    protected _cellsForView: TCellTypes = [];

    constructor(size: number) {
        super(size);
        this._cellsForView = this.makeCellsForView();
    }

    public get cells(): TCellTypes {
        return this._cellsForView;
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

    public step(direction: TDirection): TGameState {
        super.step(direction);
        this._cellsForView = this.makeCellsForView();
        return this._state;
    }

    protected makeEmptyCells(): TCellTypes {
        return this._cellsForView = Array<CellType>(this.fullSize).fill(CellType.empty);
    }

    protected makeCellsForView(): TCellTypes {
        if (this._cellsForView.length === 0) {
            return this._cellsForView = this.makeEmptyCells();
        }

        const cellTypeIndex = (value: CellType) => Object.keys(CellType).indexOf(value.toString());

        const cellsSorted = this._state.cells.sort((a: TCell, b: TCell) => {
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

        return this._cellsForView = this.makeEmptyCells().map((l, index) => {
            const [y1, x1] = this.indexToCoordinate(index, this.size);
            return cellsSorted.find(({ coordinate: [y, x] }: TCell) => x === x1 && y === y1)?.type || CellType.empty;
        });
    }
};