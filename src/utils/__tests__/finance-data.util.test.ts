import {
    generateRealisticCurrency,
    generateRealisticPrice,
    generateRealisticAmount,
} from '../finance-data.util';

describe('Finance Data Util', () => {
    describe('generateRealisticCurrency', () => {
        it('should generate a 3-letter currency code', () => {
            const currency = generateRealisticCurrency();
            expect(currency).toMatch(/^[A-Z]{3}$/);
        });
    });

    describe('generateRealisticPrice', () => {
        it('should generate a price within range', () => {
            const price = generateRealisticPrice(10, 20);
            expect(price).toBeGreaterThanOrEqual(10);
            expect(price).toBeLessThanOrEqual(20);
        });

        it('should often have realistic decimal endings', () => {
            const prices = Array(10).fill(0).map(() => generateRealisticPrice(10, 100));
            const validEndings = [0.0, 0.99, 0.95, 0.5, 0.49];
            prices.forEach(price => {
                const decimal = price % 1;
                const isClose = validEndings.some(e => Math.abs(decimal - e) < 0.001);
                expect(isClose).toBe(true);
            });
        });
    });

    describe('generateRealisticAmount', () => {
        it('should generate an amount within range', () => {
            const amount = generateRealisticAmount(5, 50);
            expect(amount).toBeGreaterThanOrEqual(5);
            expect(amount).toBeLessThanOrEqual(50);
        });
    });
});
