import { startMockServer } from '../server.service';
import { Document } from '../../types';
import { Server } from 'http';
import axios from 'axios';

jest.setTimeout(10000);

describe('Header Mocking', () => {
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

    it('should return mocked headers defined in the response spec', async () => {
        const port = 6100 + Math.floor(Math.random() * 1000);
        const apiSpec: Document = {
            openapi: '3.0.0',
            info: { title: 'Header API', version: '1.0.0' },
            paths: {
                '/test-headers': {
                    get: {
                        responses: {
                            '200': {
                                description: 'OK',
                                headers: {
                                    'X-Custom-Header': {
                                        schema: {
                                            type: 'string',
                                            example: 'custom-value'
                                        },
                                        description: 'A custom header'
                                    },
                                    'X-Rate-Limit': {
                                        schema: {
                                            type: 'integer',
                                            example: 100
                                        },
                                        description: 'Rate limit'
                                    }
                                },
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                message: { type: 'string' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };

        server = await startMockServer(apiSpec, port);
        const response = await axios.get(`http://localhost:${port}/test-headers`);

        expect(response.status).toBe(200);
        expect(response.headers['x-custom-header']).toBe('custom-value');
        expect(response.headers['x-rate-limit']).toBe('100'); // Axios converts headers to lowercase and values to string
    });
});
