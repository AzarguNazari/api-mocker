import { SchemaObject, ResponseObject } from '../types';
import { generateRandomInteger } from '../utils/number-generator.util';
import {
    generateUUID,
    generateEmail,
    generateURL,
    generateDateString,
    generateDateTimeString,
    generateRandomString,
    generateFromPattern,
    generateEnumValue,
    generateStringByPropertyName,
} from '../utils/string-generator.util';
import { generateRealisticPrice, generateRealisticAmount } from '../utils/finance-data.util';

export function generateMockResponse(responseSchema: ResponseObject): unknown {
    if (!responseSchema || !responseSchema.content) {
        return {};
    }

    const jsonContent = responseSchema.content['application/json'];
    if (!jsonContent || !jsonContent.schema) {
        return {};
    }

    return generateMockData(jsonContent.schema as SchemaObject);
}

export function generateMockHeaders(responseSchema: ResponseObject): Record<string, string> {
    const headers: Record<string, string> = {};

    if (!responseSchema.headers) {
        return headers;
    }

    for (const [name, headerSpec] of Object.entries(responseSchema.headers)) {
        if ('$ref' in headerSpec) {
            continue; // Basic implementation, skipping refs for now
        }

        if (headerSpec.schema) {
            const mockValue = generateMockData(headerSpec.schema as SchemaObject, name);
            headers[name] = String(mockValue);
        } else if (headerSpec.example !== undefined) {
            headers[name] = String(headerSpec.example);
        }
    }

    return headers;
}

export function generateMockData(schema: SchemaObject, propertyName = ''): unknown {
    if (schema.example !== undefined) {
        return schema.example;
    }

    const schemaType = schema.type;

    if (schemaType === 'object') {
        return generateObjectData(schema);
    }

    if (schemaType === 'array') {
        return generateArrayData(schema, propertyName);
    }

    if (schemaType === 'string') {
        return generateStringData(schema, propertyName);
    }

    if (schemaType === 'number' || schemaType === 'integer') {
        return generateNumericData(schema, propertyName);
    }

    if (schemaType === 'boolean') {
        return generateBooleanData();
    }

    return null;
}

function generateObjectData(schema: SchemaObject): Record<string, unknown> {
    const obj: Record<string, unknown> = {};

    if (!schema.properties) {
        return obj;
    }

    for (const [key, prop] of Object.entries(schema.properties)) {
        obj[key] = generateMockData(prop as SchemaObject, key);
    }

    return obj;
}

function generateArrayData(schema: SchemaObject, propertyName: string): unknown[] {
    const arraySchema = schema as SchemaObject & { items?: SchemaObject };

    if (!arraySchema.items) {
        return [];
    }

    const count = schema.minItems ?? 10;
    return Array(count)
        .fill(null)
        .map(() => generateMockData(arraySchema.items as SchemaObject, propertyName));
}

function generateStringData(schema: SchemaObject, propertyName: string): string {
    if (schema.format) {
        const formatted = generateStringByFormat(schema.format);
        if (formatted) {
            return formatted;
        }
    }

    const byPropertyName = generateStringByPropertyName(propertyName);
    if (byPropertyName) {
        return byPropertyName;
    }

    if (schema.enum) {
        return generateEnumValue(schema.enum as string[]);
    }

    if (schema.pattern) {
        return generateFromPattern(schema.pattern);
    }

    return generateRandomString();
}

function generateStringByFormat(format: string): string | null {
    switch (format) {
        case 'date':
            return generateDateString();
        case 'date-time':
            return generateDateTimeString();
        case 'email':
            return generateEmail();
        case 'uri':
        case 'url':
            return generateURL();
        case 'uuid':
            return generateUUID();
        default:
            return null;
    }
}

function generateNumericData(schema: SchemaObject, propertyName: string): number {
    const min = schema.minimum ?? 0;
    const max = schema.maximum ?? 1000;
    const lowerProp = propertyName.toLowerCase();

    if (lowerProp.includes('price') || lowerProp.includes('cost') || lowerProp.includes('rate')) {
        return generateRealisticPrice(min, max);
    }

    if (lowerProp.includes('amount') || lowerProp.includes('quantity') || lowerProp.includes('total')) {
        return generateRealisticAmount(min, max);
    }

    if (schema.type === 'integer') {
        return generateRandomInteger(min, max);
    }

    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

function generateBooleanData(): boolean {
    return Math.random() > 0.5;
}
