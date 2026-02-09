import {
    generateRealisticEmail,
    generateRealisticName,
    generateRealisticPhone,
    generateRealisticAddress,
    generateRealisticCity,
    generateRealisticCompany,
    generateRealisticUsername,
    generateRealisticTitle,
    generateRealisticZipCode,
} from '../realistic-data.util';

describe('Realistic Data Util', () => {
    describe('generateRealisticEmail', () => {
        it('should generate valid email format', () => {
            const email = generateRealisticEmail();
            expect(email).toMatch(/^[a-z]+\.[a-z]+@[a-z]+\.(com|org|net|io|co|dev)$/);
        });
    });

    describe('generateRealisticName', () => {
        it('should generate full name with first and last name', () => {
            const name = generateRealisticName();
            const parts = name.split(' ');
            expect(parts).toHaveLength(2);
            expect(parts[0].length).toBeGreaterThan(0);
            expect(parts[1].length).toBeGreaterThan(0);
        });
    });

    describe('generateRealisticPhone', () => {
        it('should generate phone in US format', () => {
            const phone = generateRealisticPhone();
            expect(phone).toMatch(/^\+1 \(\d{3}\) \d{3}-\d{4}$/);
        });
    });

    describe('generateRealisticAddress', () => {
        it('should generate address with number and street', () => {
            const address = generateRealisticAddress();
            expect(address).toMatch(/^\d+ [A-Za-z]+ Street$/);
        });
    });

    describe('generateRealisticCity', () => {
        it('should generate a city name', () => {
            const city = generateRealisticCity();
            expect(city.length).toBeGreaterThan(0);
        });
    });

    describe('generateRealisticCompany', () => {
        it('should generate a company name', () => {
            const company = generateRealisticCompany();
            expect(company.length).toBeGreaterThan(0);
        });
    });

    describe('generateRealisticUsername', () => {
        it('should generate username with name and number', () => {
            const username = generateRealisticUsername();
            expect(username).toMatch(/^[a-z]+\d+$/);
        });
    });

    describe('generateRealisticTitle', () => {
        it('should generate a job title', () => {
            const title = generateRealisticTitle();
            expect(title.length).toBeGreaterThan(0);
        });
    });

    describe('generateRealisticZipCode', () => {
        it('should generate 5-digit zip code', () => {
            const zip = generateRealisticZipCode();
            expect(zip).toMatch(/^\d{5}$/);
        });
    });
});
