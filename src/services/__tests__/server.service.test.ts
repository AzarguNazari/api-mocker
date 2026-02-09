import { generateMockResponse } from '../mock-generator.service';
import { startMockServer } from '../server.service';
import { Document, ResponseObject } from '../../types';

jest.setTimeout(10000);

describe('Server Service', () => {
    const mockApiSpec: Document = {
        openapi: '3.0.0',
        info: {
            title: 'Test API',
            version: '1.0.0',
        },
        paths: {},
    };

    describe('Mock Response Generation', () => {
        it('should generate mock data from response schema', () => {
            const responseSchema: ResponseObject = {
                description: 'Success',
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

    describe('Server Initialization', () => {
        it('should start server successfully', async () => {
            const port = 3100 + Math.floor(Math.random() * 1000);
            await expect(startMockServer(mockApiSpec, port)).resolves.toBeUndefined();
        });
    });
});
