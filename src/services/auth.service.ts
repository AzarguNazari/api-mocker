import { Request } from 'express';
import { OpenAPIV3 } from 'openapi-types';
import { ValidationError } from '../utils/error-handler.util';

export function validateSecurity(
    req: Request,
    operation: OpenAPIV3.OperationObject,
    apiSpec: OpenAPIV3.Document
): void {
    const security = operation.security ?? apiSpec.security;

    if (!security || security.length === 0) {
        return;
    }

    // Security is an array of requirements. Any one of them must be satisfied (OR logic).
    // Each requirement is an object where keys are security scheme names (AND logic within the object).
    const securitySchemes = apiSpec.components?.securitySchemes;

    if (!securitySchemes) {
        // If security is required but no schemes are defined, we might want to warn or fail.
        return;
    }

    const errors: string[] = [];

    for (const requirement of security) {
        let allMet = true;
        const requirementErrors: string[] = [];

        for (const [schemeName] of Object.entries(requirement)) {
            const scheme = securitySchemes[schemeName];
            if (!scheme) {
                requirementErrors.push(`Security scheme "${schemeName}" not found in components/securitySchemes`);
                allMet = false;
                continue;
            }

            // Type guard for ReferenceObject
            if ('$ref' in scheme) {
                continue; // We don't handle $ref for security schemes yet
            }

            try {
                validateScheme(req, scheme as OpenAPIV3.SecuritySchemeObject);
            } catch (error) {
                if (error instanceof Error) {
                    requirementErrors.push(error.message);
                }
                allMet = false;
            }
        }

        if (allMet) {
            return; // At least one requirement met
        }

        errors.push(`Requirement [${Object.keys(requirement).join(', ')}] failed: ${requirementErrors.join('; ')}`);
    }

    throw new ValidationError(`Authentication failed: ${errors.join(' OR ')}`);
}

function validateScheme(req: Request, scheme: OpenAPIV3.SecuritySchemeObject): void {
    switch (scheme.type) {
        case 'apiKey':
            validateApiKey(req, scheme as OpenAPIV3.ApiKeySecurityScheme);
            break;
        case 'http':
            validateHttpSecurity(req, scheme as OpenAPIV3.HttpSecurityScheme);
            break;
        case 'oauth2':
        case 'openIdConnect':
            validateBearerToken(req);
            break;
        default:
            // For now, accept unknown types if present (be lenient)
            break;
    }
}

function getHeader(req: Request, name: string): string | undefined {
    const value = req.header(name);
    if (Array.isArray(value)) {
        return value[0];
    }
    return value;
}

function validateApiKey(req: Request, scheme: OpenAPIV3.ApiKeySecurityScheme): void {
    const { name, in: location } = scheme;
    let value: string | undefined;

    switch (location) {
        case 'header':
            value = getHeader(req, name);
            break;
        case 'query':
            value = req.query[name] as string;
            break;
        case 'cookie':
            value = req.cookies?.[name];
            break;
    }

    if (!value) {
        throw new Error(`Missing API key "${name}" in ${location}`);
    }
}

function validateHttpSecurity(req: Request, scheme: OpenAPIV3.HttpSecurityScheme): void {
    const authHeader = getHeader(req, 'Authorization');

    if (!authHeader) {
        throw new Error('Missing Authorization header');
    }

    const schemeName = scheme.scheme?.toLowerCase();

    if (schemeName === 'basic') {
        if (!authHeader.toLowerCase().startsWith('basic ')) {
            throw new Error('Authorization header must be Basic');
        }
    } else if (schemeName === 'bearer') {
        if (!authHeader.toLowerCase().startsWith('bearer ')) {
            throw new Error('Authorization header must be Bearer');
        }
    }
}

function validateBearerToken(req: Request): void {
    const authHeader = getHeader(req, 'Authorization');

    if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
        throw new Error('Missing or invalid Bearer token in Authorization header');
    }
}
