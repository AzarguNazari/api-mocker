import { startMockServer } from '../server.service';
import { Document } from '../../types';
import { Server } from 'http';
import axios from 'axios';

jest.setTimeout(10000);

describe('Auth Validation E2E', () => {
    let server: Server | undefined;
    let currentPort: number;

    const apiSpec: Document = {
        openapi: '3.0.0',
        info: { title: 'Auth API', version: '1.0.0' },
        components: {
            securitySchemes: {
                apiKeyHeader: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'X-API-Key',
                },
                apiKeyQuery: {
                    type: 'apiKey',
                    in: 'query',
                    name: 'api_key',
                },
                basicAuth: {
                    type: 'http',
                    scheme: 'basic',
                },
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                },
            },
        },
        paths: {
            '/secure-api-key-header': {
                get: {
                    security: [{ apiKeyHeader: [] }],
                    responses: { '200': { description: 'OK' } },
                },
            },
            '/secure-api-key-query': {
                get: {
                    security: [{ apiKeyQuery: [] }],
                    responses: { '200': { description: 'OK' } },
                },
            },
            '/secure-basic': {
                get: {
                    security: [{ basicAuth: [] }],
                    responses: { '200': { description: 'OK' } },
                },
            },
            '/secure-bearer': {
                get: {
                    security: [{ bearerAuth: [] }],
                    responses: { '200': { description: 'OK' } },
                },
            },
            '/secure-multiple': {
                get: {
                    security: [{ apiKeyHeader: [] }, { basicAuth: [] }],
                    responses: { '200': { description: 'OK' } },
                },
            },
        },
    };

    beforeEach(async () => {
        currentPort = 6000 + Math.floor(Math.random() * 2000);
        server = await startMockServer(apiSpec, currentPort);
    });

    afterEach(async () => {
        if (server) {
            await new Promise<void>((resolve) => {
                server?.close(() => {
                    server = undefined;
                    resolve();
                });
            });
        }
    });

    const getUrl = (path: string) => `http://localhost:${currentPort}${path}`;

    describe('API Key Authentication', () => {
        it('should allow request with valid header API key', async () => {
            const response = await axios.get(getUrl('/secure-api-key-header'), {
                headers: { 'X-API-Key': 'test-key' },
            });
            expect(response.status).toBe(200);
        });

        it('should fail request with missing header API key', async () => {
            try {
                await axios.get(getUrl('/secure-api-key-header'));
                throw new Error('Should have failed');
            } catch (error: any) {
                if (!error.response) {
                    throw new Error(`Request failed without response: ${error.message}`);
                }
                expect(error.response.status).toBe(400);
                expect(error.response.data.error).toContain('Missing API key "X-API-Key" in header');
            }
        });

        it('should allow request with valid query API key', async () => {
            const response = await axios.get(getUrl('/secure-api-key-query?api_key=test-key'));
            expect(response.status).toBe(200);
        });
    });

    describe('HTTP Authentication', () => {
        it('should allow valid Basic auth', async () => {
            const response = await axios.get(getUrl('/secure-basic'), {
                headers: { Authorization: 'Basic dGVzdDp0ZXN0' },
            });
            expect(response.status).toBe(200);
        });

        it('should fail invalid Basic auth prefix', async () => {
            try {
                await axios.get(getUrl('/secure-basic'), {
                    headers: { Authorization: 'Bearer dGVzdA==' },
                });
                throw new Error('Should have failed');
            } catch (error: any) {
                if (!error.response) {
                    throw new Error(`Request failed without response: ${error.message}`);
                }
                expect(error.response.status).toBe(400);
                expect(error.response.data.error).toContain('Authorization header must be Basic');
            }
        });

        it('should allow valid Bearer auth', async () => {
            const response = await axios.get(getUrl('/secure-bearer'), {
                headers: { Authorization: 'Bearer test-token' },
            });
            expect(response.status).toBe(200);
        });
    });

    describe('Multiple Security Requirements (OR logic)', () => {
        it('should allow if first requirement is met', async () => {
            const response = await axios.get(getUrl('/secure-multiple'), {
                headers: { 'X-API-Key': 'test-key' },
            });
            expect(response.status).toBe(200);
        });

        it('should allow if second requirement is met', async () => {
            const response = await axios.get(getUrl('/secure-multiple'), {
                headers: { Authorization: 'Basic dGVzdDp0ZXN0' },
            });
            expect(response.status).toBe(200);
        });

        it('should fail if neither requirement is met', async () => {
            try {
                await axios.get(getUrl('/secure-multiple'));
                throw new Error('Should have failed');
            } catch (error: any) {
                if (!error.response) {
                    throw new Error(`Request failed without response: ${error.message}`);
                }
                expect(error.response.status).toBe(400);
                expect(error.response.data.error).toContain('Authentication failed');
            }
        });
    });
});
