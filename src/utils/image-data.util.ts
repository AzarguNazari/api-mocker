import { generateRandomInteger } from './number-generator.util';

export function generateRealisticImage(width = 400, height = 400): string {
    const id = generateRandomInteger(1, 1000);
    return `https://picsum.photos/id/${id}/${width}/${height}`;
}

export function generateRealisticAvatar(size = 200): string {
    const id = generateRandomInteger(1, 70);
    return `https://i.pravatar.cc/${size}?u=${id}`;
}

export function generateRealisticPlaceholder(width = 400, height = 400, text?: string): string {
    const baseUrl = `https://via.placeholder.com/${width}x${height}`;
    return text ? `${baseUrl}?text=${encodeURIComponent(text)}` : baseUrl;
}
