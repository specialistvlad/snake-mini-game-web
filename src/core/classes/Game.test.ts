import * as tf from '@tensorflow/tfjs';

import { Game } from './Game';
import { Food } from './Food';
import { RelativeDirection } from '../types';

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
        const game = new Game(5);
        game.tick();
        game.tick();
        game.reset();
        expect(game.getState()).toEqual({
            f: [[Infinity, Infinity]],
            s: [[2, 2], [2, 1], [2, 0]],
        });
    });

    test('step', () => {
        expect.assertions(1);
        const food = new Food(5, 100000000000, [4, 1]);
        const game = new Game(5, { food: [food] });

        expect(game.step(RelativeDirection.Right)).toEqual({
            gameObjects: {
                f: [[4, 1]],
                s: [[2, 2], [2, 1], [2, 0]],
            },
            reward: 0,
            fruitEaten: 0,
            done: false,
        });
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
