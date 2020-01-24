import { Snake, TSnakeConstructorParams } from './Snake';
import { TGameState, TDegree, Directions, TCoordinates } from '../types';

type optionalDegree = TDegree | null;

const defaultState = { cells: [] };

const makeSnakeStepsReducer = (snake: Snake) => 
    (accumulator: TGameState, currentValue: optionalDegree) => {
        if (currentValue !== null) {
            snake.direction = currentValue;
        }
        return snake.stepReducer(defaultState);
    };

// template for each test for reducers
const makeReducerTest = (
    steps: Array<optionalDegree>,
    snake: TCoordinates,
    params?: any, 
    ) =>
    // @ts-ignore
    [null, ...steps]
        .reduce(makeSnakeStepsReducer(new Snake({ name: '', initPoint: snake[0], ...params })), defaultState);

const matchCoordinates = (coordinate: TCoordinates) => ({ cells: coordinate.map(item => (expect.objectContaining({ coordinate: item })))});

describe('Snake', () => {
    test('snake init step works correctly(without move forward, only rendering)', () =>
        expect(makeReducerTest([], [[0, 0]])).toMatchObject(matchCoordinates([[0, 0]])));

    describe('move', () => {
        describe('from default direction to', () => {
            test('default direction', () => expect(makeReducerTest([null], [[1, 1]])).toMatchObject(matchCoordinates([[1, 2]])));
            test('default to Right', () => expect(makeReducerTest([Directions.Right], [[1, 1]])).toMatchObject(matchCoordinates([[1, 2]])));
            test('default to Down', () => expect(makeReducerTest([Directions.Down], [[1, 1]])).toMatchObject(matchCoordinates([[2, 1]])));
            test('default to Left', () => expect(makeReducerTest([Directions.Left], [[1, 1]])).toMatchObject(matchCoordinates([[1, 2]])));
            test('default to Up', () => expect(makeReducerTest([Directions.Up], [[1, 1]])).toMatchObject(matchCoordinates([[0, 1]])));
        });

        describe('from Right to', () => {
            test('default direction', () => expect(makeReducerTest([null], [[1, 1]])).toMatchObject(matchCoordinates([[1, 2]])));
            test('Right', () => expect(makeReducerTest([Directions.Right], [[1, 1]], { direction: Directions.Right })).toMatchObject(matchCoordinates([[1, 2]])));
            test('Down', () => expect(makeReducerTest([Directions.Down], [[1, 1]], { direction: Directions.Right })).toMatchObject(matchCoordinates([[2, 1]])));
            test('Left', () => expect(makeReducerTest([Directions.Left], [[1, 1]], { direction: Directions.Right })).toMatchObject(matchCoordinates([[1, 2]])));
            test('Up', () => expect(makeReducerTest([Directions.Up], [[1, 1]], { direction: Directions.Right })).toMatchObject(matchCoordinates([[0, 1]])));
        });

        describe('from Down direction to', () => {
            test('default direction', () => expect(makeReducerTest([null], [[1, 1]], { direction: Directions.Down }))
                .toMatchObject(matchCoordinates([[2, 1]])));
            test('Right', () => expect(makeReducerTest([Directions.Right], [[1, 1]], { direction: Directions.Down }))
                .toMatchObject(matchCoordinates([[1, 2]])));
            test('Down', () => expect(makeReducerTest([Directions.Down], [[1, 1]], { direction: Directions.Down }))
                .toMatchObject(matchCoordinates([[2, 1]])));
            test('Left', () => expect(makeReducerTest([Directions.Left], [[1, 1]], { direction: Directions.Down }))
                .toMatchObject(matchCoordinates([[1, 0]])));
            test('Up', () => expect(makeReducerTest([Directions.Up], [[1, 1]], { direction: Directions.Down }))
                .toMatchObject(matchCoordinates([[2, 1]])));
        });

        describe('from Left direction to', () => {
            test('default direction', () => expect(makeReducerTest([null], [[1, 1]], { direction: Directions.Left }))
                .toMatchObject(matchCoordinates([[1, 0]])));
            test('Right', () => expect(makeReducerTest([Directions.Right], [[1, 1]], { direction: Directions.Left }))
                .toMatchObject(matchCoordinates([[1, 0]])));
            test('Down', () => expect(makeReducerTest([Directions.Down], [[1, 1]], { direction: Directions.Left }))
                .toMatchObject(matchCoordinates([[2, 1]])));
            test('Left', () => expect(makeReducerTest([Directions.Left], [[1, 1]], { direction: Directions.Left }))
                .toMatchObject(matchCoordinates([[1, 0]])));
            test('Up', () => expect(makeReducerTest([Directions.Up], [[1, 1]], { direction: Directions.Left }))
                .toMatchObject(matchCoordinates([[0, 1]])));
        });

        describe('from Up direction to', () => {
            test('default direction', () => expect(makeReducerTest([null], [[1, 1]], { direction: Directions.Up }))
                .toMatchObject(matchCoordinates([[0, 1]])));
            test('Right', () => expect(makeReducerTest([Directions.Right], [[1, 1]], { direction: Directions.Up }))
                .toMatchObject(matchCoordinates([[1, 2]])));
            test('Down', () => expect(makeReducerTest([Directions.Down], [[1, 1]], { direction: Directions.Up }))
                .toMatchObject(matchCoordinates([[0, 1]])));
            test('Left', () => expect(makeReducerTest([Directions.Left], [[1, 1]], { direction: Directions.Up }))
                .toMatchObject(matchCoordinates([[1, 0]])));
            test('Up', () => expect(makeReducerTest([Directions.Up], [[1, 1]], { direction: Directions.Up }))
                .toMatchObject(matchCoordinates([[0, 1]])));
        });
    });

    describe('move through the mirror', () => {
        test('default to Right', () =>
        expect(makeReducerTest([null], [[19, 19]], { direction: Directions.Right, tableSize: 20 }))
            .toMatchObject(matchCoordinates([[19, 0]])));
        
        test('default to Down', () =>
        expect(makeReducerTest([null], [[20, 20]], { direction: Directions.Down, tableSize: 21 }))
            .toMatchObject(matchCoordinates([[0, 20]])));

        test('default to Left  with default table size', () =>
        expect(makeReducerTest([null], [[0, 0]], { direction: Directions.Left }))
            .toMatchObject(matchCoordinates([[0, 99]])));

        test('default to Up', () =>
        expect(makeReducerTest([null], [[0, 0]], { direction: Directions.Up, tableSize: 20 }))
            .toMatchObject(matchCoordinates([[19, 0]])));
    });
});
