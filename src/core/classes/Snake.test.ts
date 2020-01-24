import { Snake, TSnakeConstructorParams } from './Snake';
import { TGameState, TDegree, Directions, TCoordinates } from '../types';

type optionalDegree = TDegree | null;

const snakeTest = (
    directionsList: Array<optionalDegree>,
    snakeCoordinates: TCoordinates,
    snakeAdditionalParams?: any, 
    ) => {
        const snake = new Snake({
            name: '',
            snake: snakeCoordinates,
            ...snakeAdditionalParams,
        })

        // @ts-ignore
        return [null, ...directionsList].reduce((accumulator: Array<TCoordinates>, currentValue: optionalDegree) => {
            if (currentValue !== null) {
                snake.direction = currentValue;
            }
            return [ ...accumulator, snake.reducer({ cells: [] }) ];
        }, []);
    };

const match = (steps: Array<TCoordinates>) => steps.map(coordinates => ({ cells: coordinates.map(item => (expect.objectContaining({ coordinate: item })))})); 

describe('Snake', () => {
    test('snake init step works correctly(without move forward, only rendering)', () =>
        expect(snakeTest([], [[0, 0]])).toMatchObject(match([[[0, 0]]])));

    describe('move', () => {
        describe('from default direction to', () => {
            test('default direction - new', () => expect(snakeTest([null], [[1, 1]])).toMatchObject(match([[[1, 1]], [[1, 2]]])));
            test('default to Right', () => expect(snakeTest([Directions.Right], [[1, 1]])).toMatchObject(match([[[1, 1]], [[1, 2]]])));
            test('default to Down', () => expect(snakeTest([Directions.Down], [[1, 1]])).toMatchObject(match([[[1, 1]], [[2, 1]]])));
            test('default to Left', () => expect(snakeTest([Directions.Left], [[1, 1]])).toMatchObject(match([[[1, 1]], [[1, 2]]])));
            test('default to Up', () => expect(snakeTest([Directions.Up], [[1, 1]])).toMatchObject(match([[[1, 1]], [[0, 1]]])));
        });

        describe('from Right to', () => {
            test('default direction', () => expect(snakeTest([null], [[1, 1]])).toMatchObject(match([[[1, 1]], [[1, 2]]])));
            test('Right', () => expect(snakeTest([Directions.Right], [[1, 1]], { direction: Directions.Right })).toMatchObject(match([[[1, 1]], [[1, 2]]])));
            test('Down', () => expect(snakeTest([Directions.Down], [[1, 1]], { direction: Directions.Right })).toMatchObject(match([[[1, 1]], [[2, 1]]])));
            test('Left', () => expect(snakeTest([Directions.Left], [[1, 1]], { direction: Directions.Right })).toMatchObject(match([[[1, 1]], [[1, 2]]])));
            test('Up', () => expect(snakeTest([Directions.Up], [[1, 1]], { direction: Directions.Right })).toMatchObject(match([[[1, 1]], [[0, 1]]])));
        });

        describe('from Down direction to', () => {
            test('default direction', () => expect(snakeTest([null], [[1, 1]], { direction: Directions.Down }))
                .toMatchObject(match([[[1, 1]], [[2, 1]]])));
            test('Right', () => expect(snakeTest([Directions.Right], [[1, 1]], { direction: Directions.Down }))
                .toMatchObject(match([[[1, 1]], [[1, 2]]])));
            test('Down', () => expect(snakeTest([Directions.Down], [[1, 1]], { direction: Directions.Down }))
                .toMatchObject(match([[[1, 1]], [[2, 1]]])));
            test('Left', () => expect(snakeTest([Directions.Left], [[1, 1]], { direction: Directions.Down }))
                .toMatchObject(match([[[1, 1]], [[1, 0]]])));
            test('Up', () => expect(snakeTest([Directions.Up], [[1, 1]], { direction: Directions.Down }))
                .toMatchObject(match([[[1, 1]], [[2, 1]]])));
        });

        describe('from Left direction to', () => {
            test('default direction', () => expect(snakeTest([null], [[1, 1]], { direction: Directions.Left }))
                .toMatchObject(match([[[1, 1]], [[1, 0]]])));
            test('Right', () => expect(snakeTest([Directions.Right], [[1, 1]], { direction: Directions.Left }))
                .toMatchObject(match([[[1, 1]], [[1, 0]]])));
            test('Down', () => expect(snakeTest([Directions.Down], [[1, 1]], { direction: Directions.Left }))
                .toMatchObject(match([[[1, 1]], [[2, 1]]])));
            test('Left', () => expect(snakeTest([Directions.Left], [[1, 1]], { direction: Directions.Left }))
                .toMatchObject(match([[[1, 1]], [[1, 0]]])));
            test('Up', () => expect(snakeTest([Directions.Up], [[1, 1]], { direction: Directions.Left }))
                .toMatchObject(match([[[1, 1]], [[0, 1]]])));
        });

        describe('from Up direction to', () => {
            test('default direction', () => expect(snakeTest([null], [[1, 1]], { direction: Directions.Up }))
                .toMatchObject(match([[[1, 1]], [[0, 1]]])));
            test('Right', () => expect(snakeTest([Directions.Right], [[1, 1]], { direction: Directions.Up }))
                .toMatchObject(match([[[1, 1]], [[1, 2]]])));
            test('Down', () => expect(snakeTest([Directions.Down], [[1, 1]], { direction: Directions.Up }))
                .toMatchObject(match([[[1, 1]], [[0, 1]]])));
            test('Left', () => expect(snakeTest([Directions.Left], [[1, 1]], { direction: Directions.Up }))
                .toMatchObject(match([[[1, 1]], [[1, 0]]])));
            test('Up', () => expect(snakeTest([Directions.Up], [[1, 1]], { direction: Directions.Up }))
                .toMatchObject(match([[[1, 1]], [[0, 1]]])));
        });
    });

    describe('move through the mirror', () => {
        test('default to Right', () =>
        expect(snakeTest([null], [[19, 19]], { direction: Directions.Right, tableSize: 20 }))
            .toMatchObject(match([[[19, 19]], [[19, 0]]])));
        
        test('default to Down', () =>
        expect(snakeTest([null], [[20, 20]], { direction: Directions.Down, tableSize: 21 }))
            .toMatchObject(match([[[20, 20]], [[0, 20]]])));

        test('default to Left  with default table size', () =>
        expect(snakeTest([null], [[0, 0]], { direction: Directions.Left }))
            .toMatchObject(match([[[0, 0]], [[0, 99]]])));

        test('default to Up', () =>
        expect(snakeTest([null], [[0, 0]], { direction: Directions.Up, tableSize: 20 }))
            .toMatchObject(match([[[0, 0]], [[19, 0]]])));
    });

    describe('Long snake', () => {
        test('default direction', () =>
        expect(snakeTest([null, null, Directions.Down, null, Directions.Left, null], [[0, 1], [0, 0]])).toMatchObject(match([
            [[0, 1], [0, 0]],
            [[0, 2], [0, 1]],
            [[0, 3], [0, 2]],
            [[1, 3], [0, 3]],
            [[2, 3], [1, 3]],
            [[2, 2], [2, 3]],
            [[2, 1], [2, 2]],
        ])));
    });
});
