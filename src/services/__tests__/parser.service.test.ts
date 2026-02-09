import { parseOpenAPISpec } from '../parser.service';
import { ParseError } from '../../utils/error-handler.util';
import SwaggerParser from '@apidevtools/swagger-parser';

jest.mock('@apidevtools/swagger-parser');

describe('Parser Service', () => {
    const mockSwaggerParser = SwaggerParser as jest.Mocked<typeof SwaggerParser>;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('parseOpenAPISpec', () => {
        it('should successfully parse valid OpenAPI spec', async () => {
            const mockSpec = {
                openapi: '3.0.0',
                info: { title: 'Test API', version: '1.0.0' },
                paths: {},
            };

            mockSwaggerParser.validate.mockResolvedValue(mockSpec as never);

            const result = await parseOpenAPISpec('/path/to/spec.yaml');

            expect(result).toEqual(mockSpec);
            expect(mockSwaggerParser.validate).toHaveBeenCalledWith('/path/to/spec.yaml');
        });

        it('should throw ParseError on invalid spec', async () => {
            mockSwaggerParser.validate.mockRejectedValue(new Error('Invalid spec') as never);

            await expect(parseOpenAPISpec('/invalid/spec.yaml')).rejects.toThrow(ParseError);
            await expect(parseOpenAPISpec('/invalid/spec.yaml')).rejects.toThrow(
                'Failed to parse OpenAPI specification: Invalid spec'
            );
        });

        it('should handle non-Error rejections', async () => {
            mockSwaggerParser.validate.mockRejectedValue('string error' as never);

            await expect(parseOpenAPISpec('/invalid/spec.yaml')).rejects.toThrow(ParseError);
        });
    });
});
