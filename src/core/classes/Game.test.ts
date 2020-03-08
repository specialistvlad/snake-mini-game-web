import * as tf from '@tensorflow/tfjs';

import { Game } from './Game';

describe('Game', () => {
    tf.setBackend('cpu');

    test('getState', () => {
        expect.assertions(1);
        const game = new Game(5);

        expect(game.getState()).toEqual({
            f: [[Infinity, Infinity]],
            s: [[2, 2], [2, 1], [2, 0]],
        });
    });
});
