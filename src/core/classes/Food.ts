import { TGameState, TDegree, TCoordinate, TCoordinates, Directions, CellType, TCells } from '../types';
import { IGameObject } from './GameObject';

export class Food implements IGameObject {
  public reducer(game: TGameState): TGameState {
    return {
        ...game,
    };
}
}