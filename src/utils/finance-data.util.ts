import { generateRandomInteger } from './number-generator.util';
import { pickRandom } from './array.util';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY'];

export function generateRealisticCurrency(): string {
    return pickRandom(CURRENCIES);
}

export function generateRealisticPrice(min = 1, max = 1000): number {
    const base = Math.floor(Math.random() * (max - min) + min);
    const endings = [0.0, 0.99, 0.95, 0.5, 0.49];
    const ending = endings[generateRandomInteger(0, endings.length - 1)];
    const price = base + ending;
    return price > max ? max : price;
}

export function generateRealisticAmount(min = 1, max = 100): number {
    if (Math.random() > 0.5) {
        return generateRandomInteger(min, max);
    }
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}
