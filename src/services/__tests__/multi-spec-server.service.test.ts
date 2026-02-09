import { mergeSpecs } from '../multi-spec-server.service';
import { Document } from '../../types';
import { ParseError } from '../../utils/error-handler.util';

describe('Multi-Spec Server Service', () => {
    describe('mergeSpecs', () => {
        it('should throw error for empty specs array', () => {
            expect(() => mergeSpecs([])).toThrow(ParseError);
            expect(() => mergeSpecs([])).toThrow('No specs to merge');
        });

        it('should return single spec without merging', () => {
            const spec: Document = {
                openapi: '3.0.0',
                info: { title: 'Test API', version: '1.0.0' },
                paths: {
                    '/test': {
                        get: {
                            responses: {
                                '200': { description: 'Success' },
                            },
                        },
                    },
                },
            };

            const result = mergeSpecs([spec]);
            expect(result).toEqual(spec);
        });

        it('should merge multiple specs', () => {
            const spec1: Document = {
                openapi: '3.0.0',
                info: { title: 'API 1', version: '1.0.0' },
                paths: {
                    '/users': {
                        get: {
                            responses: {
                                '200': { description: 'Success' },
                            },
                        },
                    },
                },
            };

            const spec2: Document = {
                openapi: '3.0.0',
                info: { title: 'API 2', version: '1.0.0' },
                paths: {
                    '/products': {
                        get: {
                            responses: {
                                '200': { description: 'Success' },
                            },
                        },
                    },
                },
            };

            const result = mergeSpecs([spec1, spec2]);

            expect(result.paths).toHaveProperty('/users');
            expect(result.paths).toHaveProperty('/products');
            expect(result.info.title).toBe('Merged API Specifications');
        });

        it('should skip duplicate paths', () => {
            const spec1: Document = {
                openapi: '3.0.0',
                info: { title: 'API 1', version: '1.0.0' },
                paths: {
                    '/users': {
                        get: {
                            responses: {
                                '200': { description: 'First' },
                            },
                        },
                    },
                },
            };

            const spec2: Document = {
                openapi: '3.0.0',
                info: { title: 'API 2', version: '1.0.0' },
                paths: {
                    '/users': {
                        get: {
                            responses: {
                                '200': { description: 'Second' },
                            },
                        },
                    },
                },
            };

            const result = mergeSpecs([spec1, spec2]);

            const usersPath = result.paths!['/users'] as any;
            expect(usersPath.get.responses['200'].description).toBe('First');
        });
    });
});
