import { Food } from './Food';
import { CellType } from '../types';

describe('Food', () => {
    test('default params, should return dinner', () => {
        expect.assertions(2);
        const food = new Food(1);
        const state = food.reducer();
        expect(state).toMatchObject({
            cells: [{
                type: CellType.food,
                coordinate: [0, 0]
            }],
            reward: 0,
            fruitEaten: 0,
            done: false,
        });
        expect(food.reducer(state, false)).toMatchObject({
            cells: [{
                type: CellType.food,
                coordinate: [0, 0]
            }],
            reward: 0,
            fruitEaten: 0,
            done: false,
        });
    });

    test('two params, should return dinner', () => {
        expect.assertions(2);
        const food = new Food(1, 100000000000);
        const state = food.reducer();
        expect(state).toMatchObject({
            cells: [],
            reward: 0,
            fruitEaten: 0,
            done: false,
        });
        expect(food.reducer(state, false)).toMatchObject({
            cells: [],
            reward: 0,
            fruitEaten: 0,
            done: false,
        });
    });

    test('does it use random method?', () => {
        class Test extends Food {
            protected random(max: number) {
                return -1;
            }
        }

        expect.assertions(1);
        const food = new Test(50);

        expect(food.reducer()).toEqual({
            cells: [{
                type: CellType.food,
                coordinate: [-1, -1]
            }],
            reward: 0,
            fruitEaten: 0,
            done: false,
        });
    });

    test('time condition works correct', () => {
        let a = 0;
        const b = 6;

        class Test extends Food {
            protected secondsFromUnixEpoch() {
                return a;
            }
        }

        expect.assertions(1);
        const food = new Test(50, b);
        a = b + food.dinnerEachSeconds;
        expect(food.reducer()).toEqual({
            cells: [],
            reward: 0,
            fruitEaten: 0,
            done: false,
        });
    });

    test('time condition works correct 2', () => {
        let a = 0;
        const b = 6;

        class Test extends Food {
            protected secondsFromUnixEpoch() {
                return a;
            }
        }

        expect.assertions(1);
        const food = new Test(1, b);
        a = b + food.dinnerEachSeconds + 1;
        expect(food.reducer()).toEqual({
            cells: [{
                type: CellType.food,
                coordinate: [0, 0]
            }],
            reward: 0,
            fruitEaten: 0,
            done: false,
        });
    });
});
