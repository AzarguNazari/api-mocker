import fs from 'fs';
import os from 'os';
import { isYamlFile, isDirectory, isFile, findYamlFiles } from '../file-scanner.util';
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

    describe('findYamlFiles', () => {
        it('should return YAML files recursively', () => {
            const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'api-mocker-'));
            const nestedDir = path.join(tmpRoot, 'nested');
            const deepDir = path.join(nestedDir, 'deep');
            fs.mkdirSync(nestedDir);
            fs.mkdirSync(deepDir);

            const yaml1 = path.join(tmpRoot, 'root.yaml');
            const yaml2 = path.join(nestedDir, 'child.yml');
            const txt = path.join(deepDir, 'ignore.txt');
            fs.writeFileSync(yaml1, 'openapi: 3.0.0');
            fs.writeFileSync(yaml2, 'openapi: 3.0.0');
            fs.writeFileSync(txt, 'ignore');

            const result = findYamlFiles(tmpRoot);
            expect(result.sort()).toEqual([yaml1, yaml2].sort());

            fs.rmSync(tmpRoot, { recursive: true, force: true });
        });

        it('should return empty array for non-directory input', () => {
            expect(findYamlFiles('/path/does/not/exist')).toEqual([]);
        });
    });
});
