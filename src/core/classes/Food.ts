import { TGameState, CellType, CellPalette } from '../types';
import { GameObject } from './GameObject';

export class Food extends GameObject {
  private lastDinnerTime: number;
  public tableSize: number;
  private dinnerRefreshSeconds: number = 7;

  constructor(tableSize: number, lastDinnerTime: number = 0) {
    super();
    this.tableSize = tableSize;
    this.lastDinnerTime = lastDinnerTime;
  }

  protected reduceForward(currentState: TGameState): TGameState {
    if (this.secondsFromLastDinner() > this.dinnerRefreshSeconds) {
      this.dinnerTime();
      return this.localState = {
        cells: [{
          coordinate: this.randomCoordinate(this.tableSize),
          type: CellType.food,
          color: CellPalette.food,
        }],
      };
    }
  
    return this.localState;
  }

  protected reduceBackward(currentState: TGameState): TGameState {
    if (this.findCellsByCoord(currentState.cells, this.localState.cells[0].coordinate).length === 2) {
        this.moreFoooood()
    }
    return currentState;
  }

  protected dinnerTime() {
    this.lastDinnerTime = new Date().getTime() / 1000;
  }

  protected secondsFromLastDinner() {
    return this.secondsFromUnixEpoch() - this.lastDinnerTime;
  }

  get dinnerEachSeconds(): number {
    return this.dinnerRefreshSeconds;
  }

  protected moreFoooood() {
    this.lastDinnerTime = 0;
  }
}