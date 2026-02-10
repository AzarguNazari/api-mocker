import { generateRandomInteger } from './number-generator.util';
import { pickRandom } from './array.util';

const CITIES = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
    'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
    'Seattle', 'Denver', 'Boston', 'Portland',
];

const STREET_NAMES = [
    'Main', 'Oak', 'Maple', 'Cedar', 'Elm', 'Washington', 'Lake', 'Hill',
    'Park', 'Pine', 'First', 'Second', 'Third', 'Broadway', 'Center', 'Church',
];

const STATES = ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'];

const COUNTRIES = ['USA', 'Canada', 'UK', 'Germany', 'France', 'Australia', 'Japan', 'Brazil'];

export function generateRealisticCity(): string {
    return pickRandom(CITIES);
}

export function generateRealisticStreetName(): string {
    return pickRandom(STREET_NAMES);
}

export function generateRealisticAddress(): string {
    const number = generateRandomInteger(1, 9999);
    const street = pickRandom(STREET_NAMES);
    return `${number} ${street} Street`;
}

export function generateRealisticState(): string {
    return pickRandom(STATES);
}

export function generateRealisticZipCode(): string {
    return generateRandomInteger(10000, 99999).toString();
}

export function generateRealisticCountry(): string {
    return pickRandom(COUNTRIES);
}
