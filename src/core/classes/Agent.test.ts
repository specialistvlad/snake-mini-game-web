import * as tf from '@tensorflow/tfjs';

import { Agent } from './Agent';
import { TCellTypes } from '../types';

describe('Agent', () => {
    tf.setBackend('cpu');

    test('gameStateToTensor', () => {
        expect.assertions(1);
        const agent = new Agent(4);
        expect(agent.gameStateToTensor({
            "cells": [
                { "coordinate": [2, 1], "type": 2 }, // food
                { "coordinate": [0, 3], "type": 4 }, // snake head
                { "coordinate": [0, 2], "type": 3 }, // snake
            ],
        }).arraySync()).toMatchObject([
            [
                [[0, 0], [0, 0], [3, 0], [4, 0]],
                [[0, 0], [0, 0], [0, 0], [0, 0]],
                [[0, 0], [0, 2], [0, 0], [0, 0]],
                [[0, 0], [0, 0], [0, 0], [0, 0]],
            ]
        ]);
    });
});
