import { Snake } from './Snake';
import { TGameState, Direction, RelativeDirection, TCoordinates, CellType } from '../types';

type optionalDirection = Direction | null;

const snakeTest = (
    directionsList: Array<optionalDirection>,
    snakeCoordinates: TCoordinates,
    snakeAdditionalParams?: any,
    gameState: TGameState = { cells: [] },
    ) => {
        const snake = new Snake({
            snake: snakeCoordinates,
            ...snakeAdditionalParams,
        });

        // @ts-ignore
        return [null, ...directionsList].reduce((accumulator: Array<TCoordinates>, currentValue: optionalDegree) => {
            if (currentValue !== null) {
                snake.direction = currentValue;
            }
            return [ ...accumulator, snake.reducer(gameState) ];
        }, []);
    };

const match = (steps: Array<TCoordinates>) => steps.map(coordinates => ({ cells: coordinates.map(item => (expect.objectContaining({ coordinate: item })))})); 

describe('Snake', () => {
    test('snake init step works correctly(without move forward, only rendering)', () =>
        expect(snakeTest([], [[0, 0]])).toMatchObject(match([[[0, 0]]])));

    describe('move', () => {
        describe('from default direction to', () => {
            test('default direction - new', () => expect(snakeTest([null], [[1, 1]])).toMatchObject(match([[[1, 1]], [[1, 2]]])));
            test('default to Right', () => expect(snakeTest([Direction.Right], [[1, 1]])).toMatchObject(match([[[1, 1]], [[1, 2]]])));
            test('default to Down', () => expect(snakeTest([Direction.Down], [[1, 1]])).toMatchObject(match([[[1, 1]], [[2, 1]]])));
            test('default to Left', () => expect(snakeTest([Direction.Left], [[1, 1]])).toMatchObject(match([[[1, 1]], [[1, 2]]])));
            test('default to Up', () => expect(snakeTest([Direction.Up], [[1, 1]])).toMatchObject(match([[[1, 1]], [[0, 1]]])));
        });

        describe('from Right to', () => {
            test('default direction', () => expect(snakeTest([null], [[1, 1]])).toMatchObject(match([[[1, 1]], [[1, 2]]])));
            test('Right', () => expect(snakeTest([Direction.Right], [[1, 1]], { direction: Direction.Right })).toMatchObject(match([[[1, 1]], [[1, 2]]])));
            test('Down', () => expect(snakeTest([Direction.Down], [[1, 1]], { direction: Direction.Right })).toMatchObject(match([[[1, 1]], [[2, 1]]])));
            test('Left', () => expect(snakeTest([Direction.Left], [[1, 1]], { direction: Direction.Right })).toMatchObject(match([[[1, 1]], [[1, 2]]])));
            test('Up', () => expect(snakeTest([Direction.Up], [[1, 1]], { direction: Direction.Right })).toMatchObject(match([[[1, 1]], [[0, 1]]])));
        });

        describe('from Down direction to', () => {
            test('default direction', () => expect(snakeTest([null], [[1, 1]], { direction: Direction.Down }))
                .toMatchObject(match([[[1, 1]], [[2, 1]]])));
            test('Right', () => expect(snakeTest([Direction.Right], [[1, 1]], { direction: Direction.Down }))
                .toMatchObject(match([[[1, 1]], [[1, 2]]])));
            test('Down', () => expect(snakeTest([Direction.Down], [[1, 1]], { direction: Direction.Down }))
                .toMatchObject(match([[[1, 1]], [[2, 1]]])));
            test('Left', () => expect(snakeTest([Direction.Left], [[1, 1]], { direction: Direction.Down }))
                .toMatchObject(match([[[1, 1]], [[1, 0]]])));
            test('Up', () => expect(snakeTest([Direction.Up], [[1, 1]], { direction: Direction.Down }))
                .toMatchObject(match([[[1, 1]], [[2, 1]]])));
        });

        describe('from Left direction to', () => {
            test('default direction', () => expect(snakeTest([null], [[1, 1]], { direction: Direction.Left }))
                .toMatchObject(match([[[1, 1]], [[1, 0]]])));
            test('Right', () => expect(snakeTest([Direction.Right], [[1, 1]], { direction: Direction.Left }))
                .toMatchObject(match([[[1, 1]], [[1, 0]]])));
            test('Down', () => expect(snakeTest([Direction.Down], [[1, 1]], { direction: Direction.Left }))
                .toMatchObject(match([[[1, 1]], [[2, 1]]])));
            test('Left', () => expect(snakeTest([Direction.Left], [[1, 1]], { direction: Direction.Left }))
                .toMatchObject(match([[[1, 1]], [[1, 0]]])));
            test('Up', () => expect(snakeTest([Direction.Up], [[1, 1]], { direction: Direction.Left }))
                .toMatchObject(match([[[1, 1]], [[0, 1]]])));
        });

        describe('from Up direction to', () => {
            test('default direction', () => expect(snakeTest([null], [[1, 1]], { direction: Direction.Up }))
                .toMatchObject(match([[[1, 1]], [[0, 1]]])));
            test('Right', () => expect(snakeTest([Direction.Right], [[1, 1]], { direction: Direction.Up }))
                .toMatchObject(match([[[1, 1]], [[1, 2]]])));
            test('Down', () => expect(snakeTest([Direction.Down], [[1, 1]], { direction: Direction.Up }))
                .toMatchObject(match([[[1, 1]], [[0, 1]]])));
            test('Left', () => expect(snakeTest([Direction.Left], [[1, 1]], { direction: Direction.Up }))
                .toMatchObject(match([[[1, 1]], [[1, 0]]])));
            test('Up', () => expect(snakeTest([Direction.Up], [[1, 1]], { direction: Direction.Up }))
                .toMatchObject(match([[[1, 1]], [[0, 1]]])));
        });
    });

    describe('move through the mirror', () => {
        test('default to Right', () =>
        expect(snakeTest([null], [[19, 19]], { direction: Direction.Right, tableSize: 20 }))
            .toMatchObject(match([[[19, 19]], [[19, 0]]])));
        
        test('default to Down', () =>
        expect(snakeTest([null], [[20, 20]], { direction: Direction.Down, tableSize: 21 }))
            .toMatchObject(match([[[20, 20]], [[0, 20]]])));

        test('default to Left  with default table size', () =>
        expect(snakeTest([null], [[0, 0]], { direction: Direction.Left }))
            .toMatchObject(match([[[0, 0]], [[0, 99]]])));

        test('default to Up', () =>
        expect(snakeTest([null], [[0, 0]], { direction: Direction.Up, tableSize: 20 }))
            .toMatchObject(match([[[0, 0]], [[19, 0]]])));
    });

    describe('Long snake', () => {
        test('default direction', () =>
        expect(snakeTest([null, null, Direction.Down, null, Direction.Left, null], [[0, 1], [0, 0]])).toMatchObject(match([
            [[0, 1], [0, 0]],
            [[0, 2], [0, 1]],
            [[0, 3], [0, 2]],
            [[1, 3], [0, 3]],
            [[2, 3], [1, 3]],
            [[2, 2], [2, 3]],
            [[2, 1], [2, 2]],
        ])));
    });

    describe('Dinner', () => {
        const state: TGameState = { cells: [{ coordinate: [0, 1], type: CellType.food }],
            reward: 0,
            fruitEaten: 0,
            done: false
        };
        test('eat something and grow', () =>
        expect(snakeTest([null], [[0, 0]], {}, state)).toMatchObject(match([
            [[0, 1], [0, 0]],
            [[0, 1], [0, 1], [0, 0]],
        ])));
    });

    // test('relativeDirectionToAbsolute', () => {
    //     expect.assertions(12);
    //     const snake = new Snake({ name, snake: [[0, 0]] });
    //     expect(snake.relativeDirectionToAbsolute(RelativeDirection.Left, Direction.Down)).toEqual(Direction.Right);
    //     expect(snake.relativeDirectionToAbsolute(RelativeDirection.Straight, Direction.Down)).toEqual(Direction.Down);
    //     expect(snake.relativeDirectionToAbsolute(RelativeDirection.Right, Direction.Down)).toEqual(Direction.Left);

    //     expect(snake.relativeDirectionToAbsolute(RelativeDirection.Left, Direction.Left)).toEqual(Direction.Down);
    //     expect(snake.relativeDirectionToAbsolute(RelativeDirection.Straight, Direction.Left)).toEqual(Direction.Left);
    //     expect(snake.relativeDirectionToAbsolute(RelativeDirection.Right, Direction.Left)).toEqual(Direction.Up);

    //     expect(snake.relativeDirectionToAbsolute(RelativeDirection.Left, Direction.Right)).toEqual(Direction.Up);
    //     expect(snake.relativeDirectionToAbsolute(RelativeDirection.Straight, Direction.Right)).toEqual(Direction.Right);
    //     expect(snake.relativeDirectionToAbsolute(RelativeDirection.Right, Direction.Right)).toEqual(Direction.Down);

    //     expect(snake.relativeDirectionToAbsolute(RelativeDirection.Left, Direction.Up)).toEqual(Direction.Left);
    //     expect(snake.relativeDirectionToAbsolute(RelativeDirection.Straight, Direction.Up)).toEqual(Direction.Up);
    //     expect(snake.relativeDirectionToAbsolute(RelativeDirection.Right, Direction.Up)).toEqual(Direction.Right);
    // });

    // describe('Collision', () => {
    //     const state: TGameState = { cells: [{ coordinate: [0, 1], type: CellType.food }] };
    //     test('with tail', () =>
    //     expect(snakeTest([null], [[0, 0]], {}, state)).toMatchObject(match([
    //         [[0, 1], [0, 0]],
    //     ])));
    // });

    describe('Reward results', () => {
        test('food', () => {
            const state: TGameState = { cells: [{ coordinate: [0, 1], type: CellType.food }] };
            const snake = new Snake({
                snake: [[0, 0]],
                rewards: { food: 117 },
            });

            snake.reducer(snake.reducer(state));

            expect(snake.foodEaten).toBe(1);
            expect(snake.reward).toBe(117);
        });

        test('poison', () => {
            const state: TGameState = { cells: [{ coordinate: [0, 1], type: CellType.poison }] };
            const snake = new Snake({
                snake: [[0, 0]],
                rewards: { poison: -1283 },
            });

            snake.reducer(snake.reducer(state));

            expect(snake.foodEaten).toBe(0);
            expect(snake.reward).toBe(-1283);
        });

        test('usual step', () => {
            const state: TGameState = { cells: [] };
            const snake = new Snake({
                snake: [[0, 0]],
                rewards: { step: 637 },
            });

            snake.reducer(snake.reducer(state));

            expect(snake.foodEaten).toBe(0);
            expect(snake.reward).toBe(637);
        });

        test('death', () => {
            const state: TGameState = { cells: [] };
            const snake = new Snake({
                snake: [[0, 0], [1, 0], [1, 1], [0, 1]],
                rewards: { death: 1115 },
            });

            snake.reducer(snake.reducer(state));
            expect(snake.foodEaten).toBe(0);
            expect(snake.reward).toBe(1115);
        });
    });
});
