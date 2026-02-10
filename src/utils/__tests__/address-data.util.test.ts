import {
    generateRealisticAddress,
    generateRealisticCity,
    generateRealisticZipCode,
    generateRealisticState,
    generateRealisticCountry,
} from '../address-data.util';

describe('Address Data Util', () => {
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

    describe('generateRealisticZipCode', () => {
        it('should generate 5-digit zip code', () => {
            const zip = generateRealisticZipCode();
            expect(zip).toMatch(/^\d{5}$/);
        });
    });

    describe('generateRealisticState', () => {
        it('should generate a state code', () => {
            const state = generateRealisticState();
            expect(state).toMatch(/^[A-Z]{2}$/);
        });
    });

    describe('generateRealisticCountry', () => {
        it('should generate a country name', () => {
            const country = generateRealisticCountry();
            expect(country.length).toBeGreaterThan(0);
        });
    });
});
