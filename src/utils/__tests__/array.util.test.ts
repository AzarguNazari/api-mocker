import { pickRandom } from '../array.util';

describe('Array Util', () => {
    describe('pickRandom', () => {
        it('should return an element from the array', () => {
            const array = [1, 2, 3, 4, 5];
            const result = pickRandom(array);
            expect(array).toContain(result);
        });

        it('should return the only element if array has length 1', () => {
            const array = ['test'];
            const result = pickRandom(array);
            expect(result).toBe('test');
        });
    });
});
