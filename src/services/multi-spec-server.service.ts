import { Document, PathItemObject, OperationObject } from '../types';
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
    tags: [],
    components: {
      schemas: {},
      securitySchemes: {},
    },
  };

  for (const spec of specs) {
    const specTitle = spec.info?.title ?? 'Default API';
    if (!mergedSpec.tags!.find((t) => t.name === specTitle)) {
      mergedSpec.tags!.push({ name: specTitle });
    }

    if (spec.paths) {
      for (const [path, pathItem] of Object.entries(spec.paths)) {
        if (!pathItem) {
          continue;
        }

        if (mergedSpec.paths![path]) {
          logger.warn(`Duplicate path found: ${path} - using first occurrence`);
          continue;
        }

        const taggedPathItem: PathItemObject = { ...pathItem };

        const methods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'] as const;
        for (const method of methods) {
          const operation = taggedPathItem[method];
          if (operation) {
            const existingTags = operation.tags || [];
            if (!existingTags.includes(specTitle)) {
              (taggedPathItem[method] as OperationObject).tags = [...existingTags, specTitle];
            }
          }
        }

        mergedSpec.paths![path] = taggedPathItem;
      }
    }

    if (spec.components) {
      if (spec.components.schemas) {
        mergedSpec.components!.schemas = {
          ...mergedSpec.components!.schemas,
          ...spec.components.schemas,
        };
      }
      if (spec.components.securitySchemes) {
        mergedSpec.components!.securitySchemes = {
          ...mergedSpec.components!.securitySchemes,
          ...spec.components.securitySchemes,
        };
      }
    }
  }

  return mergedSpec;
}
