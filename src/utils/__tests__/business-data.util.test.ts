import {
    generateRealisticCompany,
    generateRealisticTitle,
    generateRealisticDescription,
} from '../business-data.util';

describe('Business Data Util', () => {
    describe('generateRealisticCompany', () => {
        it('should generate a company name', () => {
            const company = generateRealisticCompany();
            expect(company.length).toBeGreaterThan(0);
        });
    });

    describe('generateRealisticTitle', () => {
        it('should generate a job title', () => {
            const title = generateRealisticTitle();
            expect(title.length).toBeGreaterThan(0);
        });
    });

    describe('generateRealisticDescription', () => {
        it('should generate a description', () => {
            const desc = generateRealisticDescription();
            expect(desc.length).toBeGreaterThan(0);
        });
    });
});
