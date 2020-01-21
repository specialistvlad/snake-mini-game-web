import { Snake } from './Snake';

describe('Snake', () => {
    describe('move', () => {
        test('left', () => {
            const snake = new Snake({
                name: 'Some crazy snake for test',
                initPoint: [5, 5],
                area: [
                    [{ cellType: ''}],
                    []
                ]

            });
        });
    });
});
