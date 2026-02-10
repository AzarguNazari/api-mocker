import { generateMockResponse } from '../mock-generator.service';
import { startMockServer } from '../server.service';
import { Document, ResponseObject } from '../../types';
import { Server } from 'http';
import axios from 'axios';

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

  describe('Response Selection', () => {
    it('should prioritize the lowest 2xx response', async () => {
      const port = 4100 + Math.floor(Math.random() * 1000);
      const apiSpec: Document = {
        openapi: '3.0.0',
        info: { title: 'Response API', version: '1.0.0' },
        paths: {
          '/test': {
            get: {
              responses: {
                '202': {
                  description: 'Accepted',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: { status: { type: 'string' } },
                      },
                    },
                  },
                },
                '400': {
                  description: 'Bad Request',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: { error: { type: 'string' } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };

      server = await startMockServer(apiSpec, port);
      const response = await axios.get(`http://localhost:${port}/test`);
      expect(response.status).toBe(202);
      expect(response.data).toHaveProperty('status');
    });
  });

  describe('Request Body Shaping', () => {
    it('should shape object response using request body fields', async () => {
      const port = 5100 + Math.floor(Math.random() * 1000);
      const apiSpec: Document = {
        openapi: '3.0.0',
        info: { title: 'Body API', version: '1.0.0' },
        paths: {
          '/users': {
            post: {
              requestBody: {
                required: true,
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        name: { type: 'string' },
                        email: { type: 'string' },
                        profile: {
                          type: 'object',
                          properties: {
                            city: { type: 'string' },
                          },
                        },
                      },
                    },
                  },
                },
              },
              responses: {
                '201': {
                  description: 'Created',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer' },
                          name: { type: 'string' },
                          email: { type: 'string' },
                          profile: {
                            type: 'object',
                            properties: {
                              city: { type: 'string' },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };

      server = await startMockServer(apiSpec, port);
      const payload = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        profile: { city: 'Hamburg' },
      };
      const response = await axios.post(`http://localhost:${port}/users`, payload);

      expect(response.status).toBe(201);
      expect(response.data.name).toBe(payload.name);
      expect(response.data.email).toBe(payload.email);
      expect(response.data.profile.city).toBe(payload.profile.city);
      expect(typeof response.data.id).toBe('number');
    });
  });
});
