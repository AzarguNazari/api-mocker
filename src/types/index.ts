import { OpenAPIV3 } from 'openapi-types';

export interface ServerOptions {
    port: number;
    spec: string;
}

export interface MockConfig {
    minArrayItems?: number;
    maxArrayItems?: number;
    stringLength?: number;
}

export interface RouteHandler {
    path: string;
    method: string;
    handler: (req: unknown, res: unknown) => void;
}

export type SchemaObject = OpenAPIV3.SchemaObject;
export type ResponseObject = OpenAPIV3.ResponseObject;
export type ParameterObject = OpenAPIV3.ParameterObject;
export type PathItemObject = OpenAPIV3.PathItemObject;
export type OperationObject = OpenAPIV3.OperationObject;
export type Document = OpenAPIV3.Document;
