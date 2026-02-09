import express, { Request, Response, NextFunction, Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import { Document, OperationObject, ParameterObject, ResponseObject } from '../types';
import { generateMockResponse } from './mock-generator.service';
import { ValidationError } from '../utils/error-handler.util';

export async function startMockServer(apiSpec: Document, port: number): Promise<void> {
    const app = express();
    setupMiddleware(app);
    setupSwaggerUI(app, apiSpec);
    registerRoutes(app, apiSpec);
    setupErrorHandlers(app);

    return new Promise((resolve) => {
        app.listen(port, () => {
            resolve();
        });
    });
}

function setupMiddleware(app: Application): void {
    app.use(express.json());
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

            app[httpMethod](expressPath, createRouteHandler(operation as OperationObject));
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

function createRouteHandler(operation: OperationObject) {
    return (req: Request, res: Response): void => {
        try {
            validateRequiredParameters(req, operation);
            const responseSpec = selectResponseSpec(operation);
            const mockResponse = generateMockResponse(responseSpec);
            const statusCode = determineStatusCode(operation, responseSpec);

            res.status(statusCode).json(mockResponse);
        } catch (error) {
            if (error instanceof ValidationError) {
                res.status(400).json({ error: error.message });
                return;
            }
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

function selectResponseSpec(operation: OperationObject): ResponseObject {
    if (!operation.responses) {
        return { description: 'No response defined' };
    }

    return (
        (operation.responses['200'] as ResponseObject) ||
        (operation.responses['201'] as ResponseObject) ||
        (operation.responses['default'] as ResponseObject) ||
        { description: 'Default response' }
    );
}

function determineStatusCode(operation: OperationObject, responseSpec: ResponseObject): number {
    if (!operation.responses) {
        return 200;
    }

    if (responseSpec === operation.responses['201']) {
        return 201;
    }

    return 200;
}

function handleOptionsRequest(method: string) {
    return (_req: Request, res: Response): void => {
        res.header('Access-Control-Allow-Methods', method.toUpperCase());
        res.sendStatus(200);
    };
}

function setupErrorHandlers(app: Application): void {
    app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
        console.error(err.stack);
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
