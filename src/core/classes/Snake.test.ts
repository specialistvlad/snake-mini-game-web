import { Snake } from './Snake';
import { TArea, TCell, TCoordinate } from '../types';

const cleanArea = (area: TArea) => area.forEach((row: Array<TCell>) => row.forEach((cell: TCell) => cell.cellType = 'empty'));

describe('Snake', () => {
    const createArea = (): TArea => [
        [{ cellType: 'empty' }, { cellType: 'empty' }, { cellType: 'empty' }],
        [{ cellType: 'empty' }, { cellType: 'empty' }, { cellType: 'empty' }],
        [{ cellType: 'empty' }, { cellType: 'empty' }, { cellType: 'empty' }],
    ];

    test('snake init step works correctly(without move forward, only rendering)', () => {
        const area = createArea();
        const snake = new Snake({
            name: 'Some crazy snake for test',
            initPoint: [1, 1],
            area,
        });

        expect(area).toStrictEqual([
            [{ cellType: 'empty' }, { cellType: 'empty' }, { cellType: 'empty' }],
            [{ cellType: 'empty' }, { cellType: 'snake' }, { cellType: 'empty' }],
            [{ cellType: 'empty' }, { cellType: 'empty' }, { cellType: 'empty' }],
        ]);
    });

    describe('move', () => {
        test('default direction', () => {
            const area = createArea();
            const snake = new Snake({
                name: 'Some crazy snake for test',
                initPoint: [1, 1],
                area,
            });

            snake.step();
            expect(area).toStrictEqual([
                [{ cellType: 'empty' }, { cellType: 'empty' }, { cellType: 'empty' }],
                [{ cellType: 'empty' }, { cellType: 'empty' }, { cellType: 'snake' }],
                [{ cellType: 'empty' }, { cellType: 'empty' }, { cellType: 'empty' }],
            ]);
        });
    });

    // test('make step', () => {
    //     const area = createArea();
    //     const snake = new Snake({
    //         name: 'Some crazy snake for test',
    //         initPoint: [1, 1],
    //         area,
    //     });

    //     snake.step();
    //     expect(area).toStrictEqual([
    //         [{ cellType: 'empty' }, { cellType: 'empty' }, { cellType: 'empty' }],
    //         [{ cellType: 'empty' }, { cellType: 'empty' }, { cellType: 'snake' }],
    //         [{ cellType: 'empty' }, { cellType: 'empty' }, { cellType: 'empty' }],
    //     ]);
    // });

    // describe('turn', () => {
    //     test('left', () => {
    //         const area = createArea();
    //         const snake = new Snake({
    //             name: 'Some crazy snake for test',
    //             initPoint: [1, 1],
    //             area,
    //         });
    //         cleanArea(area);
    //         snake.direction = 90;
    //         snake.step();

    //         expect(area).toStrictEqual([
    //             [{ cellType: 'empty' }, { cellType: 'empty' }, { cellType: 'empty' }],
    //             [{ cellType: 'snake' }, { cellType: 'empty' }, { cellType: 'empty' }],
    //             [{ cellType: 'empty' }, { cellType: 'empty' }, { cellType: 'empty' }],
    //         ]);
    //     });

        // test('right', () => {
        //     const area = createArea();
        //     const snake = new Snake({
        //         name: 'Some crazy snake for test',
        //         initPoint: [1, 1],
        //         area,
        //     });
        //     snake.step();

        //     expect(area).toStrictEqual([
        //         [{ cellType: 'empty' }, { cellType: 'empty' }, { cellType: 'empty' }],
        //         [{ cellType: 'empty' }, { cellType: 'empty' }, { cellType: 'snake' }],
        //         [{ cellType: 'empty' }, { cellType: 'empty' }, { cellType: 'empty' }],
        //     ]);
        // });

        // test('up', () => {
        //     const area = createArea();
        //     const snake = new Snake({
        //         name: 'Some crazy snake for test',
        //         initPoint: [1, 1],
        //         area,
        //     });
        //     snake.step();

        //     expect(area).toStrictEqual([
        //         [{ cellType: 'empty' }, { cellType: 'snake' }, { cellType: 'empty' }],
        //         [{ cellType: 'empty' }, { cellType: 'empty' }, { cellType: 'empty' }],
        //         [{ cellType: 'empty' }, { cellType: 'empty' }, { cellType: 'empty' }],
        //     ]);
        // });

        // test('down', () => {
        //     const area = createArea();
        //     const snake = new Snake({
        //         name: 'Some crazy snake for test',
        //         initPoint: [1, 1],
        //         area,
        //     });
        //     snake.step();

        //     expect(area).toStrictEqual([
        //         [{ cellType: 'empty' }, { cellType: 'empty' }, { cellType: 'empty' }],
        //         [{ cellType: 'empty' }, { cellType: 'empty' }, { cellType: 'empty' }],
        //         [{ cellType: 'empty' }, { cellType: 'snake' }, { cellType: 'empty' }],
        //     ]);
        // });
    // });

    // describe('move through mirror', () => {
    //     test('left', () => {
    //         const area = createArea();
    //         const snake = new Snake({
    //             name: 'Some crazy snake for test',
    //             initPoint: [0, 1],
    //             area,
    //         });
    //         snake.step();

    //         expect(area).toStrictEqual([
    //             [{ cellType: 'empty' }, { cellType: 'empty' }, { cellType: 'empty' }],
    //             [{ cellType: 'empty' }, { cellType: 'empty' }, { cellType: 'snake' }],
    //             [{ cellType: 'empty' }, { cellType: 'empty' }, { cellType: 'empty' }],
    //         ]);
    //     });

    //     test('right', () => {
    //         const area = createArea();
    //         const snake = new Snake({
    //             name: 'Some crazy snake for test',
    //             initPoint: [2, 1],
    //             area,
    //         });
    //         snake.step();

    //         expect(area).toStrictEqual([
    //             [{ cellType: 'empty' }, { cellType: 'empty' }, { cellType: 'empty' }],
    //             [{ cellType: 'snake' }, { cellType: 'empty' }, { cellType: 'empty' }],
    //             [{ cellType: 'empty' }, { cellType: 'empty' }, { cellType: 'empty' }],
    //         ]);
    //     });

    //     test('up', () => {
    //         const area = createArea();
    //         const snake = new Snake({
    //             name: 'Some crazy snake for test',
    //             initPoint: [1, 0],
    //             area,
    //         });
    //         snake.step();

    //         expect(area).toStrictEqual([
    //             [{ cellType: 'empty' }, { cellType: 'empty' }, { cellType: 'empty' }],
    //             [{ cellType: 'empty' }, { cellType: 'empty' }, { cellType: 'empty' }],
    //             [{ cellType: 'empty' }, { cellType: 'snake' }, { cellType: 'empty' }],
    //         ]);
    //     });

    //     test('down', () => {
    //         const area = createArea();
    //         const snake = new Snake({
    //             name: 'Some crazy snake for test',
    //             initPoint: [1, 2],
    //             area,
    //         });
    //         snake.step();

    //         expect(area).toStrictEqual([
    //             [{ cellType: 'empty' }, { cellType: 'snake' }, { cellType: 'empty' }],
    //             [{ cellType: 'empty' }, { cellType: 'empty' }, { cellType: 'empty' }],
    //             [{ cellType: 'empty' }, { cellType: 'empty' }, { cellType: 'empty' }],
    //         ]);
    //     });
    // });
});
