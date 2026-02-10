import { generateRandomInteger } from './number-generator.util';
import { pickRandom } from './array.util';

const FIRST_NAMES = [
    'James', 'Emma', 'Michael', 'Olivia', 'Robert', 'Sophia', 'William', 'Ava',
    'David', 'Isabella', 'John', 'Mia', 'Joseph', 'Charlotte', 'Daniel', 'Amelia',
];

const LAST_NAMES = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
];

const DOMAINS = [
    'example.com', 'test.com', 'demo.com', 'sample.org', 'placeholder.net', 'mock.io', 'dummy.co', 'fake.dev',
];

export function generateRealisticFirstName(): string {
    return pickRandom(FIRST_NAMES);
}

export function generateRealisticLastName(): string {
    return pickRandom(LAST_NAMES);
}

export function generateRealisticName(): string {
    return `${pickRandom(FIRST_NAMES)} ${pickRandom(LAST_NAMES)}`;
}

export function generateRealisticEmail(): string {
    const firstName = pickRandom(FIRST_NAMES).toLowerCase();
    const lastName = pickRandom(LAST_NAMES).toLowerCase();
    const domain = pickRandom(DOMAINS);
    return `${firstName}.${lastName}@${domain}`;
}

export function generateRealisticPhone(): string {
    const area = generateRandomInteger(200, 999);
    const prefix = generateRandomInteger(200, 999);
    const line = generateRandomInteger(1000, 9999);
    return `+1 (${area}) ${prefix}-${line}`;
}

export function generateRealisticUsername(): string {
    const firstName = pickRandom(FIRST_NAMES).toLowerCase();
    const number = generateRandomInteger(1, 999);
    return `${firstName}${number}`;
}
