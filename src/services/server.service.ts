import express, { Request, Response, NextFunction, Application } from 'express';
import { Server } from 'http';
import swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import { Document, OperationObject, ParameterObject, ResponseObject } from '../types';
import { generateMockResponse, generateMockHeaders } from './mock-generator.service';
import { validateSecurity } from './auth.service';
import { ValidationError } from '../utils/error-handler.util';
import { createLogger } from '../utils/logger.util';

const logger = createLogger('server');

export async function startMockServer(apiSpec: Document, port: number): Promise<Server> {
    const app = express();
    setupMiddleware(app);
    setupSwaggerUI(app, apiSpec);
    registerRoutes(app, apiSpec);
    setupErrorHandlers(app);

    return new Promise((resolve) => {
        const server = app.listen(port, () => {
            resolve(server);
        });
    });
}

function setupMiddleware(app: Application): void {
    app.use(express.json());
    app.use(cookieParser());
    app.use((_req: Request, res: Response, next: NextFunction) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    });
}

function setupSwaggerUI(app: Application, apiSpec: Document): void {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiSpec));
}

function registerRoutes(app: Application, apiSpec: Document): void {
    if (!apiSpec.paths) {
        return;
    }

    for (const [path, pathItem] of Object.entries(apiSpec.paths)) {
        if (!pathItem) {
            continue;
        }

        for (const [method, operation] of Object.entries(pathItem)) {
            if (method === 'parameters' || !isValidHttpMethod(method)) {
                continue;
            }

            const expressPath = convertToExpressPath(path);
            const httpMethod = method.toLowerCase() as keyof Application;

            app[httpMethod](expressPath, createRouteHandler(operation as OperationObject, apiSpec));
            app.options(expressPath, handleOptionsRequest(method));
        }
    }
}

function isValidHttpMethod(method: string): boolean {
    const validMethods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'];
    return validMethods.includes(method.toLowerCase());
}

function convertToExpressPath(openApiPath: string): string {
    return openApiPath.replace(/{([^}]+)}/g, ':$1');
}

function createRouteHandler(operation: OperationObject, apiSpec: Document): (req: Request, res: Response) => void {
    return (req: Request, res: Response): void => {
        try {
            validateSecurity(req, operation, apiSpec);
            validateRequiredParameters(req, operation);
            const { responseSpec, statusCode } = selectResponse(operation);
            const mockResponse = generateMockResponse(responseSpec);
            const mockHeaders = generateMockHeaders(responseSpec);
            const response = applyRequestBodyShape(req.body, mockResponse);

            res.status(statusCode).set(mockHeaders).json(response);
        } catch (error) {
            if (error instanceof ValidationError) {
                res.status(400).json({ error: error.message });
                return;
            }
            logger.error(`Error processing route: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    };
}

function validateRequiredParameters(req: Request, operation: OperationObject): void {
    if (!operation.parameters) {
        return;
    }

    const queryParams = operation.parameters.filter(
        (p) => (p as ParameterObject).in === 'query'
    ) as ParameterObject[];

    for (const param of queryParams) {
        if (param.required && !req.query[param.name]) {
            throw new ValidationError(`Missing required query parameter: ${param.name}`);
        }
    }
}

function selectResponse(operation: OperationObject): {
    responseSpec: ResponseObject;
    statusCode: number;
} {
    if (!operation.responses) {
        return { responseSpec: { description: 'No response defined' }, statusCode: 200 };
    }

    const responseEntries = Object.entries(operation.responses).filter(([code]) =>
        /^\d{3}$/.test(code)
    );
    if (responseEntries.length === 0) {
        const defaultResponse = operation.responses.default;
        if (isResponseObject(defaultResponse)) {
            return { responseSpec: defaultResponse, statusCode: 200 };
        }

        return { responseSpec: { description: 'Default response' }, statusCode: 200 };
    }

    const successfulResponses = responseEntries
        .map(([code, response]) => ({ code: Number(code), response }))
        .filter(({ code }) => code >= 200 && code < 300)
        .sort((a, b) => a.code - b.code);
    if (successfulResponses.length > 0) {
        const selected = successfulResponses[0];
        if (isResponseObject(selected.response)) {
            return { responseSpec: selected.response, statusCode: selected.code };
        }
    }

    const allResponses = responseEntries
        .map(([code, response]) => ({ code: Number(code), response }))
        .sort((a, b) => a.code - b.code);
    const selected = allResponses[0];
    if (!selected || !isResponseObject(selected.response)) {
        return { responseSpec: { description: 'Default response' }, statusCode: 200 };
    }

    return { responseSpec: selected.response, statusCode: selected.code };
}

function isResponseObject(response: unknown): response is ResponseObject {
    if (!response || typeof response !== 'object') {
        return false;
    }

    return !('$ref' in response);
}

function applyRequestBodyShape(requestBody: unknown, mockResponse: unknown): unknown {
    if (!isRecord(mockResponse)) {
        return mockResponse;
    }

    if (!isRecord(requestBody)) {
        return mockResponse;
    }

    return mergeResponseWithRequestBody(mockResponse, requestBody);
}

function mergeResponseWithRequestBody(
    mockResponse: Record<string, unknown>,
    requestBody: Record<string, unknown>
): Record<string, unknown> {
    const merged: Record<string, unknown> = { ...mockResponse };

    for (const [key, value] of Object.entries(requestBody)) {
        if (isRecord(value) && isRecord(merged[key])) {
            merged[key] = mergeResponseWithRequestBody(merged[key] as Record<string, unknown>, value);
            continue;
        }

        merged[key] = value;
    }

    return merged;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    if (!value || typeof value !== 'object') {
        return false;
    }

    return !Array.isArray(value);
}

function handleOptionsRequest(method: string): (req: Request, res: Response) => void {
    return (_req: Request, res: Response): void => {
        res.header('Access-Control-Allow-Methods', method.toUpperCase());
        res.sendStatus(200);
    };
}

function setupErrorHandlers(app: Application): void {
    app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
        logger.error(err.stack ?? err.message);
        res.status(500).json({
            error: 'Internal Server Error',
            message: err.message,
        });
    });

    app.use((_req: Request, res: Response) => {
        res.status(404).json({
            error: 'Not Found',
            message: 'The requested endpoint does not exist',
        });
    });
}
