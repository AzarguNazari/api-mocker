import { isYamlFile, isDirectory, isFile } from '../file-scanner.util';
import path from 'path';

describe('File Scanner Util', () => {
    describe('isYamlFile', () => {
        it('should return true for .yaml files', () => {
            expect(isYamlFile('spec.yaml')).toBe(true);
            expect(isYamlFile('openapi.yaml')).toBe(true);
        });

        it('should return true for .yml files', () => {
            expect(isYamlFile('spec.yml')).toBe(true);
            expect(isYamlFile('api.yml')).toBe(true);
        });

        it('should return false for non-yaml files', () => {
            expect(isYamlFile('spec.json')).toBe(false);
            expect(isYamlFile('readme.md')).toBe(false);
            expect(isYamlFile('index.ts')).toBe(false);
        });

        it('should be case insensitive', () => {
            expect(isYamlFile('spec.YAML')).toBe(true);
            expect(isYamlFile('spec.YML')).toBe(true);
        });
    });

    describe('isDirectory', () => {
        it('should return true for existing directory', () => {
            const dirPath = path.join(__dirname, '..');
            expect(isDirectory(dirPath)).toBe(true);
        });

        it('should return false for non-existent path', () => {
            expect(isDirectory('/non/existent/path')).toBe(false);
        });

        it('should return false for file path', () => {
            const filePath = __filename;
            expect(isDirectory(filePath)).toBe(false);
        });
    });

    describe('isFile', () => {
        it('should return true for existing file', () => {
            const filePath = __filename;
            expect(isFile(filePath)).toBe(true);
        });

        it('should return false for non-existent path', () => {
            expect(isFile('/non/existent/file.txt')).toBe(false);
        });

        it('should return false for directory path', () => {
            const dirPath = path.join(__dirname, '..');
            expect(isFile(dirPath)).toBe(false);
        });
    });
});
