import fs from 'fs';
import path from 'path';

export function isDirectory(filePath: string): boolean {
    try {
        return fs.statSync(filePath).isDirectory();
    } catch {
        return false;
    }
}

export function isFile(filePath: string): boolean {
    try {
        return fs.statSync(filePath).isFile();
    } catch {
        return false;
    }
}

export function findSpecFiles(dirPath: string): string[] {
    if (!isDirectory(dirPath)) {
        return [];
    }

    const specFiles: string[] = [];
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
        const fullPath = path.join(dirPath, file);

        if (isDirectory(fullPath)) {
            specFiles.push(...findSpecFiles(fullPath));
            continue;
        }

        if (isSpecFile(file)) {
            specFiles.push(fullPath);
        }
    }

    return specFiles;
}

export function isSpecFile(filename: string): boolean {
    const ext = path.extname(filename).toLowerCase();
    return ext === '.yaml' || ext === '.yml' || ext === '.json';
}

export function findYamlFiles(dirPath: string): string[] {
    return findSpecFiles(dirPath).filter((filePath) => {
        const ext = path.extname(filePath).toLowerCase();
        return ext === '.yaml' || ext === '.yml';
    });
}

export function isYamlFile(filename: string): boolean {
    const ext = path.extname(filename).toLowerCase();
    return ext === '.yaml' || ext === '.yml';
}
