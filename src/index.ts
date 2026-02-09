#!/usr/bin/env node

import { Command } from 'commander';
import path from 'path';
import { loadSpecsFromPath, mergeSpecs } from './services/multi-spec-server.service';
import { startMockServer } from './services/server.service';

const program = new Command();

program
    .name('api-mock')
    .description('CLI to mock REST endpoints from OpenAPI specifications')
    .version('1.0.3')
    .option('-p, --port <number>', 'port to run the mock server on', '3000')
    .option('--path <path>', 'path to OpenAPI file or folder containing YAML specs', './openapi.yaml')
    .action(async (options: { port: string; path: string }) => {
        try {
            const specPath = path.resolve(process.cwd(), options.path);
            const port = parseInt(options.port, 10);

            if (isNaN(port) || port < 1 || port > 65535) {
                console.error('Error: Port must be a valid number between 1 and 65535');
                process.exit(1);
            }

            console.log(`📂 Loading OpenAPI specs from: ${specPath}`);
            const specs = await loadSpecsFromPath(specPath);
            console.log(`✓ Loaded ${specs.length} specification(s)`);

            const apiSpec = mergeSpecs(specs);
            await startMockServer(apiSpec, port);

            console.log(`🚀 Mock server is running on http://localhost:${port}`);
            console.log(`📚 API documentation available at http://localhost:${port}/api-docs`);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error occurred';
            console.error('Error:', message);
            process.exit(1);
        }
    });

program.parse();
