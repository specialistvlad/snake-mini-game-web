import { TGameState, TCoordinate } from '../types';

interface IGameObject {
  reducer(state: TGameState): TGameState;
};

export abstract class GameObject implements IGameObject {
  protected defaultState: TGameState = { cells: [] };
  protected localState: TGameState = this.defaultState;

  protected logic(game: TGameState): TGameState {
    throw new Error('Must be implemented!');
  }

  public reducer(currentState: TGameState = this.defaultState, dryRun: boolean = false): TGameState {
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

  protected random(max: number) {
    return Math.floor((Math.random() * max));
  }

  protected indexToCoordinate(index: number, max: number): TCoordinate {
    return [Math.trunc(index / max), Math.trunc(index % max)];
  }

  protected secondsFromUnixEpoch() {
    return Date.now() / 1000;
  }

  protected randomCoordinate(max: number): TCoordinate {
    return [this.random(max), this.random(max)];
  }
}