import { Snake, TSnakeConstructorParams } from './Snake';
import { TGameShit, TDegree, Directions } from '../types';

type optionalDegree = TDegree | null;

const makeSnakeStepsReducer = (snake: Snake) => {
    return (accumulator: TGameShit, currentValue: optionalDegree) => {
        if (currentValue !== null) {
            snake.direction = currentValue;
        }

        return snake.stepReducer(accumulator);
    };
};

// template for each test for reducers
const makeReducerTest = (steps: Array<optionalDegree>, gameState: TGameShit, snakeParams: TSnakeConstructorParams) =>
    [null, ...steps].reduce(makeSnakeStepsReducer(new Snake(snakeParams)), { coords: [] });

describe('Snake', () => {
    test('snake init step works correctly(without move forward, only rendering)', () =>
        expect(makeReducerTest([], { coords: [] }, { name: '', initPoint: [0, 0]}))
            .toStrictEqual({ coords: [[0, 0]] }));

    describe('move', () => {
        describe('from default direction to', () => {
            test('default direction', () =>
            expect(makeReducerTest([null], { coords: [] }, { name: '', initPoint: [1, 1]}))
                .toStrictEqual({ coords: [[1, 2]] }));
            
            test('default to Right', () =>
            expect(makeReducerTest([Directions.Right], { coords: [] }, { name: '', initPoint: [1, 1]}))
                .toStrictEqual({ coords: [[1, 2]] }));
            
            test('default to Down', () =>
            expect(makeReducerTest([Directions.Down], { coords: [] }, { name: '', initPoint: [1, 1]}))
                .toStrictEqual({ coords: [[2, 1]] }));
    
            test('default to Left', () =>
            expect(makeReducerTest([Directions.Left], { coords: [] }, { name: '', initPoint: [1, 1]}))
                .toStrictEqual({ coords: [[1, 2]] }));
    
            test('default to Up', () =>
            expect(makeReducerTest([Directions.Up], { coords: [] }, { name: '', initPoint: [1, 1]}))
                .toStrictEqual({ coords: [[0, 1]] }));
        });

        describe('from Right to', () => {
            test('default direction', () =>
            expect(makeReducerTest([null], { coords: [] }, { name: '', initPoint: [1, 1]}))
                .toStrictEqual({ coords: [[1, 2]] }));
            
            test('Right', () =>
            expect(makeReducerTest([Directions.Right], { coords: [] }, { name: '', initPoint: [1, 1], direction: Directions.Right}))
                .toStrictEqual({ coords: [[1, 2]] }));
            
            test('Down', () =>
            expect(makeReducerTest([Directions.Down], { coords: [] }, { name: '', initPoint: [1, 1], direction: Directions.Right}))
                .toStrictEqual({ coords: [[2, 1]] }));
    
            test('Left', () =>
            expect(makeReducerTest([Directions.Left], { coords: [] }, { name: '', initPoint: [1, 1], direction: Directions.Right}))
                .toStrictEqual({ coords: [[1, 2]] }));
    
            test('Up', () =>
            expect(makeReducerTest([Directions.Up], { coords: [] }, { name: '', initPoint: [1, 1], direction: Directions.Right}))
                .toStrictEqual({ coords: [[0, 1]] }));
        });

        describe('from Down direction to', () => {
            test('default direction', () =>
            expect(makeReducerTest([null], { coords: [] }, { name: '', initPoint: [1, 1], direction: Directions.Down}))
                .toStrictEqual({ coords: [[2, 1]] }));
            
            test('Right', () =>
            expect(makeReducerTest([Directions.Right], { coords: [] }, { name: '', initPoint: [1, 1], direction: Directions.Down}))
                .toStrictEqual({ coords: [[1, 2]] }));
            
            test('Down', () =>
            expect(makeReducerTest([Directions.Down], { coords: [] }, { name: '', initPoint: [1, 1], direction: Directions.Down}))
                .toStrictEqual({ coords: [[2, 1]] }));
    
            test('Left', () =>
            expect(makeReducerTest([Directions.Left], { coords: [] }, { name: '', initPoint: [1, 1], direction: Directions.Down}))
                .toStrictEqual({ coords: [[1, 0]] }));
    
            test('Up', () =>
            expect(makeReducerTest([Directions.Up], { coords: [] }, { name: '', initPoint: [1, 1], direction: Directions.Down}))
                .toStrictEqual({ coords: [[2, 1]] }));
        });

        describe('from Left direction to', () => {
            test('default direction', () =>
            expect(makeReducerTest([null], { coords: [] }, { name: '', initPoint: [1, 1], direction: Directions.Left}))
                .toStrictEqual({ coords: [[1, 0]] }));
            
            test('Right', () =>
            expect(makeReducerTest([Directions.Right], { coords: [] }, { name: '', initPoint: [1, 1], direction: Directions.Left}))
                .toStrictEqual({ coords: [[1, 0]] }));
            
            test('Down', () =>
            expect(makeReducerTest([Directions.Down], { coords: [] }, { name: '', initPoint: [1, 1], direction: Directions.Left}))
                .toStrictEqual({ coords: [[2, 1]] }));
    
            test('Left', () =>
            expect(makeReducerTest([Directions.Left], { coords: [] }, { name: '', initPoint: [1, 1], direction: Directions.Left}))
                .toStrictEqual({ coords: [[1, 0]] }));
    
            test('Up', () =>
            expect(makeReducerTest([Directions.Up], { coords: [] }, { name: '', initPoint: [1, 1], direction: Directions.Left}))
                .toStrictEqual({ coords: [[0, 1]] }));
        });

        describe('from Up direction to', () => {
            test('default direction', () =>
            expect(makeReducerTest([null], { coords: [] }, { name: '', initPoint: [1, 1], direction: Directions.Up}))
                .toStrictEqual({ coords: [[0, 1]] }));
            
            test('Right', () =>
            expect(makeReducerTest([Directions.Right], { coords: [] }, { name: '', initPoint: [1, 1], direction: Directions.Up}))
                .toStrictEqual({ coords: [[1, 2]] }));
            
            test('Down', () =>
            expect(makeReducerTest([Directions.Down], { coords: [] }, { name: '', initPoint: [1, 1], direction: Directions.Up}))
                .toStrictEqual({ coords: [[0, 1]] }));
    
            test('Left', () =>
            expect(makeReducerTest([Directions.Left], { coords: [] }, { name: '', initPoint: [1, 1], direction: Directions.Up}))
                .toStrictEqual({ coords: [[1, 0]] }));
    
            test('Up', () =>
            expect(makeReducerTest([Directions.Up], { coords: [] }, { name: '', initPoint: [1, 1], direction: Directions.Up}))
                .toStrictEqual({ coords: [[0, 1]] }));
        });
    });
});
