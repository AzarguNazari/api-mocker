import axios from 'axios';
import { startMockServer } from '../services/server.service';
import { loadSpecsFromPath, mergeSpecs } from '../services/multi-spec-server.service';
import path from 'path';
import { Server } from 'http';

describe('End-to-End Integration Tests', () => {
    const TEST_PORT = 4500 + Math.floor(Math.random() * 500);
    const BASE_URL = `http://localhost:${TEST_PORT}`;
    let server: Server | undefined;

    beforeAll(async () => {
        const specsPath = path.resolve(__dirname, '../../test-specs');
        const specs = await loadSpecsFromPath(specsPath);
        const mergedSpec = mergeSpecs(specs);
        server = await startMockServer(mergedSpec, TEST_PORT);
        await new Promise((resolve) => setTimeout(resolve, 1000));
    });

    afterAll((done) => {
        if (!server) {
            done();
            return;
        }
        server.close(() => {
            server = undefined;
            done();
        });
    });

    describe('Users API', () => {
        it('should get all users with realistic data', async () => {
            const response = await axios.get(`${BASE_URL}/users`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.data)).toBe(true);
            expect(response.data.length).toBeGreaterThan(0);

            const user = response.data[0];
            expect(user).toHaveProperty('id');
            expect(user).toHaveProperty('name');
            expect(user).toHaveProperty('email');
            expect(user).toHaveProperty('phone');
            expect(user).toHaveProperty('company');

            expect(typeof user.id).toBe('number');
            expect(typeof user.name).toBe('string');
            expect(user.email).toMatch(/^[a-z]+\.[a-z]+@/);
            expect(user.phone).toMatch(/^\+1 \(\d{3}\) \d{3}-\d{4}$/);
            expect(typeof user.company).toBe('string');
        });

        it('should get user by ID with all realistic fields', async () => {
            const response = await axios.get(`${BASE_URL}/users/123`);

            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('id');
            expect(response.data).toHaveProperty('firstName');
            expect(response.data).toHaveProperty('lastName');
            expect(response.data).toHaveProperty('email');
            expect(response.data).toHaveProperty('phone');
            expect(response.data).toHaveProperty('address');
            expect(response.data).toHaveProperty('city');
            expect(response.data).toHaveProperty('zipCode');
            expect(response.data).toHaveProperty('country');

            expect(response.data.email).toMatch(/^[a-z]+\.[a-z]+@/);
            expect(response.data.phone).toMatch(/^\+1 \(\d{3}\) \d{3}-\d{4}$/);
            expect(response.data.zipCode).toMatch(/^\d{5}$/);
            expect(response.data.address).toMatch(/^\d+ [A-Za-z]+ Street$/);
        });

        it('should create user with 201 status', async () => {
            const response = await axios.post(`${BASE_URL}/users`, {
                name: 'Test User',
                email: 'test@example.com',
            });

            expect(response.status).toBe(201);
            expect(response.data).toHaveProperty('id');
            expect(response.data).toHaveProperty('status');
            expect(['created', 'pending', 'active']).toContain(response.data.status);
        });
    });

    describe('Products API', () => {
        it('should get all products', async () => {
            const response = await axios.get(`${BASE_URL}/products`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.data)).toBe(true);
            expect(response.data.length).toBeGreaterThan(0);

            const product = response.data[0];
            expect(product).toHaveProperty('id');
            expect(product).toHaveProperty('title');
            expect(product).toHaveProperty('description');
            expect(product).toHaveProperty('price');
            expect(product).toHaveProperty('inStock');

            expect(typeof product.price).toBe('number');
            expect(typeof product.inStock).toBe('boolean');
        });

        it('should get product by ID with enum and date fields', async () => {
            const response = await axios.get(`${BASE_URL}/products/456`);

            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('id');
            expect(response.data).toHaveProperty('category');
            expect(response.data).toHaveProperty('createdAt');

            expect(['electronics', 'clothing', 'books', 'toys']).toContain(response.data.category);
            expect(response.data.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
            expect(response.data.price).toBeGreaterThanOrEqual(1);
            expect(response.data.price).toBeLessThanOrEqual(10000);
        });
    });

    describe('CORS and Error Handling', () => {
        it('should have CORS headers', async () => {
            const response = await axios.get(`${BASE_URL}/users`);

            expect(response.headers['access-control-allow-origin']).toBe('*');
        });

        it('should return 404 for non-existent routes', async () => {
            try {
                await axios.get(`${BASE_URL}/non-existent`);
                fail('Should have thrown an error');
            } catch (error: any) {
                expect(error.response.status).toBe(404);
                expect(error.response.data).toHaveProperty('error');
                expect(error.response.data.error).toBe('Not Found');
            }
        });
    });

    describe('Swagger UI', () => {
        it('should serve Swagger UI documentation', async () => {
            const response = await axios.get(`${BASE_URL}/api-docs/`);

            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('text/html');
        });
    });
});
