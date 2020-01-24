import { TGameState, TDegree } from '../types';

export interface IGameObject {
    reducer(state: TGameState): TGameState;
};