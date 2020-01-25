import { TGameState, CellType, CellPalette } from '../types';
import { GameObject } from './GameObject';

export class Food extends GameObject {
  private lastDinnerTime: number;
  public tableSize: number;
  private dinnerRefreshSeconds = 4;

  constructor(tableSize: number, lastDinnerTime: number = 0) {
    super();
    this.tableSize = tableSize;
    this.lastDinnerTime = lastDinnerTime;
  }

  protected logic(currentState: TGameState): TGameState {
    if (this.secondsFromLastDinner() > this.dinnerRefreshSeconds) {
      this.dinnerTime();
      return {
        cells: [{
          coordinate: [this.random(this.tableSize), this.random(this.tableSize)],
          type: CellType.food,
          color: CellPalette.food,
        }],
      };
    }
  
    return this.localState;
  }

  public static make(tableSize: number): Array<Food> {
    return [new Food(tableSize)];
  }

  protected dinnerTime() {
    this.lastDinnerTime = new Date().getTime() / 1000;
  }

  protected secondsFromLastDinner() {
    return this.secondsFromUnixEpoch() - this.lastDinnerTime;
  }
}