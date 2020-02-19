import { TGameState, TCoordinate, TCells } from '../types';

export abstract class GameObject {
  protected defaultState: TGameState = { cells: [] };
  protected localState: TGameState = this.defaultState;

  protected reduceForward(currentState: TGameState): TGameState {
    throw new Error('Must be implemented!');
  }

  protected reduceBackward(currentState: TGameState): TGameState {
    return currentState;
  }

  public reducer(
    currentState: TGameState = this.defaultState,
    forward: boolean = true, 
    dryRun: boolean = false,
  ): TGameState {
    if (!dryRun && forward) {
      this.localState = this.reduceForward(currentState);
    }

    if (!dryRun && !forward) {
      return this.reduceBackward(currentState);
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

  protected findCellsByCoord(cells: TCells, [y, x]: TCoordinate): TCells {
    return cells.filter(({ coordinate, type }) => coordinate[0] === y && coordinate[1] === x);
  }
}