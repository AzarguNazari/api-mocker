#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

import { Command } from 'commander';

import { loadSpecsFromPath, mergeSpecs } from './services/multi-spec-server.service';
import { startMockServer } from './services/server.service';
import { createLogger } from './utils/logger.util';

const logger = createLogger('cli');

const program = new Command();

program
  .name('rest-mock')
  .description('CLI to mock REST endpoints from OpenAPI specifications')
  .version(getCliVersion())
  .option('-p, --port <number>', 'port to run the mock server on', '3000')
  .option(
    '--path <path>',
    'path to OpenAPI file or folder containing YAML/JSON specs',
    './openapi.yaml'
  )
  .action(async (options: { port: string; path: string }) => {
    try {
      const specPath = path.resolve(process.cwd(), options.path);
      const port = parseInt(options.port, 10);

      if (isNaN(port) || port < 1 || port > 65535) {
        logger.error('Error: Port must be a valid number between 1 and 65535');
        process.exit(1);
      }

      logger.info(`Loading OpenAPI specs from: ${specPath}`);
      const specs = await loadSpecsFromPath(specPath);
      logger.info(`Loaded ${specs.length} specification(s)`);

      const apiSpec = mergeSpecs(specs);
      await startMockServer(apiSpec, port);

      logger.info(`Mock server is running on http://localhost:${port}`);
      logger.info(`API documentation available at http://localhost:${port}/api-docs`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      logger.error(`Error: ${message}`);
      process.exit(1);
    }
  });

program.parse();

function getCliVersion(): string {
  try {
    const packageJsonPath = path.resolve(__dirname, '../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8')) as {
      version?: string;
    };
    return packageJson.version ?? '0.0.0';
  } catch {
    return '0.0.0';
  }
}
