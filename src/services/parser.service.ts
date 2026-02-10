import SwaggerParser from '@apidevtools/swagger-parser';
import { Document } from '../types';
import { ParseError } from '../utils/error-handler.util';

export async function parseOpenAPISpec(specPath: string): Promise<Document> {
  try {
    const api = await SwaggerParser.validate(specPath);
    return api as Document;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new ParseError(`Failed to parse OpenAPI specification: ${message}`);
  }
}
