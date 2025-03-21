#!/usr/bin/env node

const program = require('commander');
const path = require('path');
const { startMockServer } = require('./server');
const { parseOpenAPISpec } = require('./parser');

program
  .name('mocker')
  .description('CLI to mock REST endpoints from OpenAPI specifications')
  .version('1.0.0')
  .option('-p, --port <number>', 'port to run the mock server on', '3000')
  .option('-s, --spec <path>', 'path to OpenAPI specification file', './openapi.yaml')
  .action(async (options) => {
    try {
      const specPath = path.resolve(process.cwd(), options.spec);
      const port = parseInt(options.port);

      // Parse OpenAPI specification
      const apiSpec = await parseOpenAPISpec(specPath);
      
      // Start mock server
      await startMockServer(apiSpec, port);
      
      console.log(`🚀 Mock server is running on http://localhost:${port}`);
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

program.parse(); 