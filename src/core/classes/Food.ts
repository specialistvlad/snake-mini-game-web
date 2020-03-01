import { TGameState, CellType, TCoordinate } from '../types';
import { GameObject } from './GameObject';

export class Food extends GameObject {
  public tableSize: number;
  protected lastDinnerTime: number;
  protected dinnerRefreshSeconds: number = 7;
  protected point: TCoordinate;

  constructor(tableSize: number, lastDinnerTime: number = 0, point: TCoordinate = [Infinity, Infinity]) {
    super();
    this.tableSize = tableSize;
    this.lastDinnerTime = lastDinnerTime;
    this.point = point;
  }

  protected reduceForward(currentState: TGameState): TGameState {
    if (this.secondsFromLastDinner() > this.dinnerRefreshSeconds) {
      this.dinnerTime();
      this.point = this.randomCoordinate(this.tableSize);
      return this.localState = {
        ...currentState,
        cells: [{
          coordinate: this.point,
          type: CellType.food,
        }],
      };
    }
  
    return this.localState;
  }

  protected reduceBackward(currentState: TGameState): TGameState {
    if (!this.localState.cells[0]){
      return currentState;
    }

    if (this.foodEaten(currentState)) {
        this.moreFoooood()
    }
    return currentState;
  }

  protected dinnerTime() {
    this.lastDinnerTime = new Date().getTime() / 1000;
  }

  protected foodEaten(currentState: TGameState) {
    return this.findCellsByCoord(currentState.cells, this.localState.cells[0].coordinate).length === 2;
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

  get points(): TCoordinate {
    return this.point;
  }
}