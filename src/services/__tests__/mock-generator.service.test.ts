import { generateMockResponse, generateMockData } from '../mock-generator.service';
import { SchemaObject, ResponseObject } from '../../types';

describe('Mock Generator Service', () => {
  describe('generateMockResponse', () => {
    it('should return empty object when responseSchema is undefined', () => {
      const result = generateMockResponse(undefined as unknown as ResponseObject);
      expect(result).toEqual({});
    });

    it('should return empty object when content is missing', () => {
      const responseSchema: ResponseObject = {
        description: 'Test response',
      };
      const result = generateMockResponse(responseSchema);
      expect(result).toEqual({});
    });

    it('should generate mock data from valid schema', () => {
      const responseSchema: ResponseObject = {
        description: 'Test response',
        content: {
          'application/json': {
            schema: {
              type: 'object' as const,
              properties: {
                id: { type: 'integer' as const },
                name: { type: 'string' as const },
              },
            },
          },
        },
      };

      const result = generateMockResponse(responseSchema) as Record<string, unknown>;
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(typeof result.id).toBe('number');
      expect(typeof result.name).toBe('string');
    });
  });

  describe('generateMockData', () => {
    it('should return example value if provided', () => {
      const schema: SchemaObject = {
        type: 'string' as const,
        example: 'test-value',
      };
      expect(generateMockData(schema)).toBe('test-value');
    });

    it('should generate object with properties', () => {
      const schema: SchemaObject = {
        type: 'object' as const,
        properties: {
          name: { type: 'string' as const },
          age: { type: 'integer' as const },
        },
      };

      const result = generateMockData(schema) as Record<string, unknown>;
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('age');
      expect(typeof result.name).toBe('string');
      expect(typeof result.age).toBe('number');
    });

    it('should generate array with correct item count', () => {
      const schema: SchemaObject = {
        type: 'array' as const,
        minItems: 3,
        items: { type: 'string' as const },
      };

      const result = generateMockData(schema) as unknown[];
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(3);
    });

    it('should generate string with email format', () => {
      const schema: SchemaObject = {
        type: 'string' as const,
        format: 'email',
      };

      const result = generateMockData(schema) as string;
      expect(result).toMatch(/^[a-z]+\.[a-z]+@[a-z]+\.(com|org|net|io|co|dev)$/);
    });

    it('should generate string with uuid format', () => {
      const schema: SchemaObject = {
        type: 'string' as const,
        format: 'uuid',
      };

      const result = generateMockData(schema) as string;
      expect(result).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });

    it('should generate string with date format', () => {
      const schema: SchemaObject = {
        type: 'string' as const,
        format: 'date',
      };

      const result = generateMockData(schema) as string;
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should generate string with date-time format', () => {
      const schema: SchemaObject = {
        type: 'string' as const,
        format: 'date-time',
      };

      const result = generateMockData(schema) as string;
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should generate string from enum values', () => {
      const schema: SchemaObject = {
        type: 'string' as const,
        enum: ['red', 'green', 'blue'],
      };

      const result = generateMockData(schema) as string;
      expect(['red', 'green', 'blue']).toContain(result);
    });

    it('should generate string from pattern', () => {
      const schema: SchemaObject = {
        type: 'string' as const,
        pattern: '[0-9][0-9]',
      };

      const result = generateMockData(schema) as string;
      expect(result).toBe('11');
    });

    it('should generate integer within range', () => {
      const schema: SchemaObject = {
        type: 'integer' as const,
        minimum: 10,
        maximum: 20,
      };

      const result = generateMockData(schema) as number;
      expect(result).toBeGreaterThanOrEqual(10);
      expect(result).toBeLessThanOrEqual(20);
      expect(Number.isInteger(result)).toBe(true);
    });

    it('should generate number within range', () => {
      const schema: SchemaObject = {
        type: 'number' as const,
        minimum: 0,
        maximum: 100,
      };

      const result = generateMockData(schema) as number;
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100);
    });

    it('should generate boolean value', () => {
      const schema: SchemaObject = {
        type: 'boolean' as const,
      };

      const result = generateMockData(schema) as boolean;
      expect(typeof result).toBe('boolean');
    });

    it('should return null for unsupported type', () => {
      const schema: SchemaObject = {
        type: undefined,
      };

      const result = generateMockData(schema);
      expect(result).toBeNull();
    });

    it('should generate realistic email by property name', () => {
      const schema: SchemaObject = {
        type: 'string' as const,
      };

      const result = generateMockData(schema, 'userEmail') as string;
      expect(result).toMatch(/^[a-z]+\.[a-z]+@[a-z]+\.(com|org|net|io|co|dev)$/);
    });

    it('should generate realistic phone by property name', () => {
      const schema: SchemaObject = {
        type: 'string' as const,
      };

      const result = generateMockData(schema, 'phoneNumber') as string;
      expect(result).toMatch(/^\+1 \(\d{3}\) \d{3}-\d{4}$/);
    });
  });
});
