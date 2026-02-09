import { generateMockResponse } from '../mock-generator.service';
import { startMockServer } from '../server.service';
import { Document, ResponseObject } from '../../types';
import { Server } from 'http';

jest.setTimeout(10000);

describe('Server Service', () => {
    let server: Server | undefined;

    afterEach((done) => {
        if (!server) {
            done();
            return;
        }
        server.close(() => {
            server = undefined;
            done();
        });
    });

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
            server = await startMockServer(mockApiSpec, port);
            expect(server).toBeDefined();
        });
    });
});
