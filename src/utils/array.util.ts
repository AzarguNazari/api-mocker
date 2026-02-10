import { generateRandomInteger } from './number-generator.util';

export function pickRandom<T>(array: T[]): T {
    const index = generateRandomInteger(0, array.length - 1);
    return array[index];
}
