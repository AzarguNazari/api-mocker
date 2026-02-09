import { loadSpecsFromPath, mergeSpecs } from '../multi-spec-server.service';
import { Document } from '../../types';
import { ParseError } from '../../utils/error-handler.util';
import * as parserService from '../parser.service';
import * as fileScannerUtil from '../../utils/file-scanner.util';

jest.mock('../parser.service');
jest.mock('../../utils/file-scanner.util');

describe('Multi-Spec Server Service', () => {
    const mockFileScanner = fileScannerUtil as jest.Mocked<typeof fileScannerUtil>;
    const mockParserService = parserService as jest.Mocked<typeof parserService>;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('loadSpecsFromPath', () => {
        it('should load single YAML file', async () => {
            const specPath = '/specs/api.yaml';
            const parsedSpec: Document = {
                openapi: '3.0.0',
                info: { title: 'Single', version: '1.0.0' },
                paths: {},
            };
            mockFileScanner.isFile.mockReturnValue(true);
            mockFileScanner.isSpecFile.mockReturnValue(true);
            mockParserService.parseOpenAPISpec.mockResolvedValue(parsedSpec);

            const result = await loadSpecsFromPath(specPath);

            expect(result).toEqual([parsedSpec]);
            expect(mockParserService.parseOpenAPISpec).toHaveBeenCalledWith(specPath);
        });

        it('should load single JSON file', async () => {
            const specPath = '/specs/api.json';
            const parsedSpec: Document = {
                openapi: '3.0.0',
                info: { title: 'Single JSON', version: '1.0.0' },
                paths: {},
            };
            mockFileScanner.isFile.mockReturnValue(true);
            mockFileScanner.isSpecFile.mockReturnValue(true);
            mockParserService.parseOpenAPISpec.mockResolvedValue(parsedSpec);

            const result = await loadSpecsFromPath(specPath);
            expect(result).toEqual([parsedSpec]);
        });

        it('should throw for unsupported file input', async () => {
            mockFileScanner.isFile.mockReturnValue(true);
            mockFileScanner.isSpecFile.mockReturnValue(false);

            await expect(loadSpecsFromPath('/specs/api.json')).rejects.toThrow(ParseError);
            await expect(loadSpecsFromPath('/specs/api.json')).rejects.toThrow(
                'File must be an OpenAPI spec file (.yaml, .yml, or .json)'
            );
        });

        it('should throw for missing path', async () => {
            mockFileScanner.isFile.mockReturnValue(false);
            mockFileScanner.isDirectory.mockReturnValue(false);

            await expect(loadSpecsFromPath('/missing')).rejects.toThrow(ParseError);
            await expect(loadSpecsFromPath('/missing')).rejects.toThrow('Path not found: /missing');
        });

        it('should load valid specs and skip invalid files from directory', async () => {
            const dir = '/specs';
            const files = ['/specs/a.yaml', '/specs/b.yaml'];
            const parsedSpec: Document = {
                openapi: '3.0.0',
                info: { title: 'A', version: '1.0.0' },
                paths: {},
            };
            mockFileScanner.isFile.mockReturnValue(false);
            mockFileScanner.isDirectory.mockReturnValue(true);
            mockFileScanner.findSpecFiles.mockReturnValue(files);
            mockParserService.parseOpenAPISpec
                .mockResolvedValueOnce(parsedSpec)
                .mockRejectedValueOnce(new ParseError('invalid'));

            const result = await loadSpecsFromPath(dir);

            expect(result).toEqual([parsedSpec]);
            expect(mockParserService.parseOpenAPISpec).toHaveBeenCalledTimes(2);
        });

        it('should throw when directory has no YAML files', async () => {
            mockFileScanner.isFile.mockReturnValue(false);
            mockFileScanner.isDirectory.mockReturnValue(true);
            mockFileScanner.findSpecFiles.mockReturnValue([]);

            await expect(loadSpecsFromPath('/specs')).rejects.toThrow(ParseError);
            await expect(loadSpecsFromPath('/specs')).rejects.toThrow(
                'No OpenAPI spec files found in directory: /specs'
            );
        });

        it('should throw when directory has no valid specs', async () => {
            mockFileScanner.isFile.mockReturnValue(false);
            mockFileScanner.isDirectory.mockReturnValue(true);
            mockFileScanner.findSpecFiles.mockReturnValue(['/specs/a.yaml']);
            mockParserService.parseOpenAPISpec.mockRejectedValue(new ParseError('invalid'));

            await expect(loadSpecsFromPath('/specs')).rejects.toThrow(ParseError);
            await expect(loadSpecsFromPath('/specs')).rejects.toThrow('No valid OpenAPI specs found');
        });
    });

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
