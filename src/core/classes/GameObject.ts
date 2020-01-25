import { TGameState, TCoordinate } from '../types';

interface IGameObject {
  reducer(state: TGameState): TGameState;
};

export abstract class GameObject implements IGameObject {
  protected defaultState: TGameState = { cells: [] };
  protected localState: TGameState = this.defaultState;

  protected random(max: number) {
    return Math.floor((Math.random() * max));
  }

  protected static indexToCoordinate(index: number, max: number): TCoordinate {
    return [Math.trunc(index / max), Math.trunc(index % max)];
  }

  protected logic(game: TGameState): TGameState {
    throw new Error('Must be implemented!');
  }

  public reducer(currentState: TGameState, dryRun: boolean = false): TGameState {
    if (!dryRun) {
      this.localState = this.logic(currentState);
    }

    return {
      ...currentState,
      ...this.localState,
      cells: [
        ...currentState.cells,
        ...this.localState.cells,
      ],
    };
  }

  protected secondsFromUnixEpoch() {
    return Date.now() / 1000;
  }
}