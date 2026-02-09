import { generateRandomInteger, generateRandomNumber } from '../number-generator.util';

describe('Number Generator Util', () => {
    describe('generateRandomInteger', () => {
        it('should generate integer within range', () => {
            const result = generateRandomInteger(1, 10);
            expect(result).toBeGreaterThanOrEqual(1);
            expect(result).toBeLessThanOrEqual(10);
            expect(Number.isInteger(result)).toBe(true);
        });

        it('should handle same min and max', () => {
            const result = generateRandomInteger(5, 5);
            expect(result).toBe(5);
        });

        it('should handle negative range', () => {
            const result = generateRandomInteger(-10, -5);
            expect(result).toBeGreaterThanOrEqual(-10);
            expect(result).toBeLessThanOrEqual(-5);
        });
    });

    describe('generateRandomNumber', () => {
        it('should generate number within range with default decimals', () => {
            const result = generateRandomNumber(0, 100);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThanOrEqual(100);
            expect(result.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
        });

        it('should respect custom decimal places', () => {
            const result = generateRandomNumber(0, 1, 4);
            const decimals = result.toString().split('.')[1]?.length || 0;
            expect(decimals).toBeLessThanOrEqual(4);
        });

        it('should handle min equals max', () => {
            const result = generateRandomNumber(5.5, 5.5);
            expect(result).toBe(5.5);
        });
    });
});
