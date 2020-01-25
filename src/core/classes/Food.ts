import { TGameState, TDegree, TCoordinate, TCoordinates, Directions, CellType, TCells, CellPalette } from '../types';
import { GameObject } from './GameObject';

export class Food extends GameObject {
  private lastDinnerTime: Date;
  public tableSize: number;
  private coordinates: TCoordinates = [];

  constructor(tableSize: number) {
    super();
    this.tableSize = tableSize;
    this.lastDinnerTime = new Date(2000, 0);
  }

  protected logic(currentState: TGameState): TGameState {
    return {
      cells: [{
        coordinate: [this.random(this.tableSize), this.random(this.tableSize)],
        type: CellType.food,
        color: CellPalette.food,
      }]
    };
  }

  public static make(tableSize: number): Array<Food> {
    return [new Food(tableSize)];
  }
}