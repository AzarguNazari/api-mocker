import { Document } from '../types';
import { parseOpenAPISpec } from './parser.service';
import { isDirectory, isFile, isSpecFile, findSpecFiles } from '../utils/file-scanner.util';
import { ParseError } from '../utils/error-handler.util';
import { createLogger } from '../utils/logger.util';

const logger = createLogger('multi-spec');

export async function loadSpecsFromPath(specPath: string): Promise<Document[]> {
    if (isFile(specPath)) {
        if (!isSpecFile(specPath)) {
            throw new ParseError('File must be an OpenAPI spec file (.yaml, .yml, or .json)');
        }
        const spec = await parseOpenAPISpec(specPath);
        return [spec];
    }

    if (isDirectory(specPath)) {
        const specFiles = findSpecFiles(specPath);

        if (specFiles.length === 0) {
            throw new ParseError(`No OpenAPI spec files found in directory: ${specPath}`);
        }

        const specs: Document[] = [];
        for (const file of specFiles) {
            try {
                const spec = await parseOpenAPISpec(file);
                specs.push(spec);
                logger.info(`Loaded spec from: ${file}`);
            } catch {
                logger.warn(`Skipped invalid spec: ${file}`);
            }
        }

        if (specs.length === 0) {
            throw new ParseError('No valid OpenAPI specs found');
        }

        return specs;
    }

    throw new ParseError(`Path not found: ${specPath}`);
}

export function mergeSpecs(specs: Document[]): Document {
    if (specs.length === 0) {
        throw new ParseError('No specs to merge');
    }

    if (specs.length === 1) {
        return specs[0];
    }

    const mergedSpec: Document = {
        openapi: specs[0].openapi,
        info: {
            title: 'Merged API Specifications',
            version: '1.0.0',
        },
        paths: {},
    };

    for (const spec of specs) {
        if (!spec.paths) {
            continue;
        }

        for (const [path, pathItem] of Object.entries(spec.paths)) {
            if (!pathItem) {
                continue;
            }

            if (mergedSpec.paths![path]) {
                logger.warn(`Duplicate path found: ${path} - using first occurrence`);
                continue;
            }

            mergedSpec.paths![path] = pathItem;
        }
    }

    return mergedSpec;
}
