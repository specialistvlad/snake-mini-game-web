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

    test('reset', () => {
        expect.assertions(1);
        expect(1).toBe(1);
    });

    test('step', () => {
        expect.assertions(1);
        expect(1).toBe(1);
    });

    test('height', () => {
        expect.assertions(1);
        const game = new Game(17);
        expect(game.height).toBe(17);
    });

    test('width', () => {
        expect.assertions(1);
        const game = new Game(13);
        expect(game.width).toBe(13);
    });
});
