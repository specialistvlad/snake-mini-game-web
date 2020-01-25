import { TGameState, CellType, CellPalette } from '../types';
import { GameObject } from './GameObject';

export class Food extends GameObject {
  private lastDinnerTime: Date;
  public tableSize: number;
  private dinnerRefreshSeconds = 4;

  constructor(tableSize: number) {
    super();
    this.tableSize = tableSize;
    this.lastDinnerTime = new Date(2000, 0);
  }

  protected logic(currentState: TGameState): TGameState {
    if ((Date.now() - this.lastDinnerTime.getTime()) / 1000 > this.dinnerRefreshSeconds) {
      this.lastDinnerTime = new Date();
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
}