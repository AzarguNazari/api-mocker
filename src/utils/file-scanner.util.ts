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

export function findYamlFiles(dirPath: string): string[] {
    if (!isDirectory(dirPath)) {
        return [];
    }

    const yamlFiles: string[] = [];
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
        const fullPath = path.join(dirPath, file);

        if (isDirectory(fullPath)) {
            yamlFiles.push(...findYamlFiles(fullPath));
            continue;
        }

        if (isYamlFile(file)) {
            yamlFiles.push(fullPath);
        }
    }

    return yamlFiles;
}

export function isYamlFile(filename: string): boolean {
    const ext = path.extname(filename).toLowerCase();
    return ext === '.yaml' || ext === '.yml';
}
