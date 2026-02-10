import {
    generateRealisticEmail,
    generateRealisticName,
    generateRealisticPhone,
    generateRealisticUsername,
} from '../personal-data.util';

describe('Personal Data Util', () => {
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

    describe('generateRealisticUsername', () => {
        it('should generate username with name and number', () => {
            const username = generateRealisticUsername();
            expect(username).toMatch(/^[a-z]+\d+$/);
        });
    });
});
