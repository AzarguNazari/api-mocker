import {
    generateRealisticImage,
    generateRealisticAvatar,
    generateRealisticPlaceholder,
} from '../image-data.util';

describe('Image Data Util', () => {
    describe('generateRealisticImage', () => {
        it('should generate a valid picsum URL', () => {
            const url = generateRealisticImage();
            expect(url).toMatch(/^https:\/\/picsum\.photos\/id\/\d+\/\d+\/\d+$/);
        });

        it('should respect custom dimensions', () => {
            const url = generateRealisticImage(800, 600);
            expect(url).toContain('800/600');
        });
    });

    describe('generateRealisticAvatar', () => {
        it('should generate a valid pravatar URL', () => {
            const url = generateRealisticAvatar();
            expect(url).toMatch(/^https:\/\/i\.pravatar\.cc\/\d+\?u=\d+$/);
        });

        it('should respect custom size', () => {
            const url = generateRealisticAvatar(100);
            expect(url).toContain('100?u=');
        });
    });

    describe('generateRealisticPlaceholder', () => {
        it('should generate a valid placeholder URL', () => {
            const url = generateRealisticPlaceholder();
            expect(url).toBe('https://via.placeholder.com/400x400');
        });

        it('should include custom text', () => {
            const url = generateRealisticPlaceholder(200, 100, 'Test');
            expect(url).toBe('https://via.placeholder.com/200x100?text=Test');
        });
    });
});
