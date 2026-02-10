import { pickRandom } from './array.util';

const COMPANIES = [
    'Tech Solutions', 'Global Systems', 'Digital Dynamics', 'Innovation Labs',
    'Data Corp', 'Cloud Services', 'Software Partners', 'Smart Systems',
    'Future Tech', 'Quantum Solutions', 'Cyber Technologies', 'Web Innovations',
];

const TITLES = [
    'Software Engineer', 'Product Manager', 'Data Scientist', 'UX Designer',
    'DevOps Engineer', 'Marketing Manager', 'Sales Director', 'CEO', 'CTO',
    'Project Manager', 'Business Analyst', 'Quality Assurance Engineer',
];

const DESCRIPTIONS = [
    'High-quality product with excellent features',
    'Innovative solution for modern challenges',
    'Reliable and efficient service',
    'Premium quality at affordable prices',
    'Customer-focused approach with proven results',
    'Industry-leading technology and support',
];

export function generateRealisticCompany(): string {
    return pickRandom(COMPANIES);
}

export function generateRealisticTitle(): string {
    return pickRandom(TITLES);
}

export function generateRealisticDescription(): string {
    return pickRandom(DESCRIPTIONS);
}
