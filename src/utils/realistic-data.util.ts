import { generateRandomInteger } from './number-generator.util';

const FIRST_NAMES = [
  'James',
  'Emma',
  'Michael',
  'Olivia',
  'Robert',
  'Sophia',
  'William',
  'Ava',
  'David',
  'Isabella',
  'John',
  'Mia',
  'Joseph',
  'Charlotte',
  'Daniel',
  'Amelia',
];

const LAST_NAMES = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
  'Rodriguez',
  'Martinez',
  'Hernandez',
  'Lopez',
  'Gonzalez',
  'Wilson',
  'Anderson',
  'Thomas',
];

const CITIES = [
  'New York',
  'Los Angeles',
  'Chicago',
  'Houston',
  'Phoenix',
  'Philadelphia',
  'San Antonio',
  'San Diego',
  'Dallas',
  'San Jose',
  'Austin',
  'Jacksonville',
  'Seattle',
  'Denver',
  'Boston',
  'Portland',
];

const STREET_NAMES = [
  'Main',
  'Oak',
  'Maple',
  'Cedar',
  'Elm',
  'Washington',
  'Lake',
  'Hill',
  'Park',
  'Pine',
  'First',
  'Second',
  'Third',
  'Broadway',
  'Center',
  'Church',
];

const COMPANIES = [
  'Tech Solutions',
  'Global Systems',
  'Digital Dynamics',
  'Innovation Labs',
  'Data Corp',
  'Cloud Services',
  'Software Partners',
  'Smart Systems',
  'Future Tech',
  'Quantum Solutions',
  'Cyber Technologies',
  'Web Innovations',
];

const DOMAINS = [
  'example.com',
  'test.com',
  'demo.com',
  'sample.org',
  'placeholder.net',
  'mock.io',
  'dummy.co',
  'fake.dev',
];

export function generateRealisticEmail(): string {
  const firstName = pickRandom(FIRST_NAMES).toLowerCase();
  const lastName = pickRandom(LAST_NAMES).toLowerCase();
  const domain = pickRandom(DOMAINS);

  return `${firstName}.${lastName}@${domain}`;
}

export function generateRealisticName(): string {
  const firstName = pickRandom(FIRST_NAMES);
  const lastName = pickRandom(LAST_NAMES);
  return `${firstName} ${lastName}`;
}

export function generateRealisticFirstName(): string {
  return pickRandom(FIRST_NAMES);
}

export function generateRealisticLastName(): string {
  return pickRandom(LAST_NAMES);
}

export function generateRealisticCity(): string {
  return pickRandom(CITIES);
}

export function generateRealisticAddress(): string {
  const number = generateRandomInteger(1, 9999);
  const street = pickRandom(STREET_NAMES);
  return `${number} ${street} Street`;
}

export function generateRealisticCompany(): string {
  return pickRandom(COMPANIES);
}

export function generateRealisticPhone(): string {
  const area = generateRandomInteger(200, 999);
  const prefix = generateRandomInteger(200, 999);
  const line = generateRandomInteger(1000, 9999);
  return `+1 (${area}) ${prefix}-${line}`;
}

export function generateRealisticZipCode(): string {
  return generateRandomInteger(10000, 99999).toString();
}

export function generateRealisticCountry(): string {
  const countries = ['USA', 'Canada', 'UK', 'Germany', 'France', 'Australia', 'Japan', 'Brazil'];
  return pickRandom(countries);
}

export function generateRealisticState(): string {
  const states = ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'];
  return pickRandom(states);
}

export function generateRealisticUsername(): string {
  const firstName = pickRandom(FIRST_NAMES).toLowerCase();
  const number = generateRandomInteger(1, 999);
  return `${firstName}${number}`;
}

export function generateRealisticTitle(): string {
  const titles = [
    'Software Engineer',
    'Product Manager',
    'Data Scientist',
    'UX Designer',
    'DevOps Engineer',
    'Marketing Manager',
    'Sales Director',
    'CEO',
    'CTO',
    'Project Manager',
    'Business Analyst',
    'Quality Assurance Engineer',
  ];
  return pickRandom(titles);
}

export function generateRealisticDescription(): string {
  const descriptions = [
    'High-quality product with excellent features',
    'Innovative solution for modern challenges',
    'Reliable and efficient service',
    'Premium quality at affordable prices',
    'Customer-focused approach with proven results',
    'Industry-leading technology and support',
  ];
  return pickRandom(descriptions);
}

function pickRandom<T>(array: T[]): T {
  const index = generateRandomInteger(0, array.length - 1);
  return array[index];
}
