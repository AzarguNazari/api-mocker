import { Document } from '../types';
import { parseOpenAPISpec } from './parser.service';
import { isDirectory, isFile, isYamlFile, findYamlFiles } from '../utils/file-scanner.util';
import { ParseError } from '../utils/error-handler.util';

export async function loadSpecsFromPath(specPath: string): Promise<Document[]> {
    if (isFile(specPath)) {
        if (!isYamlFile(specPath)) {
            throw new ParseError('File must be a YAML file (.yaml or .yml)');
        }
        const spec = await parseOpenAPISpec(specPath);
        return [spec];
    }

    if (isDirectory(specPath)) {
        const yamlFiles = findYamlFiles(specPath);

        if (yamlFiles.length === 0) {
            throw new ParseError(`No YAML files found in directory: ${specPath}`);
        }

        const specs: Document[] = [];
        for (const file of yamlFiles) {
            try {
                const spec = await parseOpenAPISpec(file);
                specs.push(spec);
                console.log(`✓ Loaded spec from: ${file}`);
            } catch (error) {
                console.warn(`⚠ Skipped invalid spec: ${file}`);
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
                console.warn(`⚠ Duplicate path found: ${path} - using first occurrence`);
                continue;
            }

            mergedSpec.paths![path] = pathItem;
        }
    }

    return mergedSpec;
}
