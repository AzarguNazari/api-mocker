const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { generateMockResponse } = require('./mock-generator');

async function startMockServer(apiSpec, port) {
  const app = express();
  app.use(express.json());

  // Serve Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiSpec));

  // Generate routes based on OpenAPI spec
  for (const [path, pathItem] of Object.entries(apiSpec.paths)) {
    for (const [method, operation] of Object.entries(pathItem)) {
      if (method === 'parameters') continue;

      // Convert OpenAPI path params to Express path params
      const expressPath = path.replace(/{([^}]+)}/g, ':$1');

      app[method](expressPath, (req, res) => {
        // Get the appropriate response based on status codes
        let responseSpec = operation.responses['200'] || 
                         operation.responses['201'] || 
                         operation.responses['default'];
        
        // Handle query parameters
        if (operation.parameters) {
          const queryParams = operation.parameters.filter(p => p.in === 'query');
          for (const param of queryParams) {
            if (param.required && !req.query[param.name]) {
              return res.status(400).json({
                error: `Missing required query parameter: ${param.name}`
              });
            }
          }
        }

        // Generate mock response
        const mockResponse = generateMockResponse(responseSpec);

        // Set response status code
        const statusCode = responseSpec === operation.responses['201'] ? 201 : 200;
        res.status(statusCode).json(mockResponse);
      });

      // Add OPTIONS handler for CORS if needed
      app.options(expressPath, (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', method.toUpperCase());
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.sendStatus(200);
      });
    }
  }

  // Add error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      error: 'Internal Server Error',
      message: err.message
    });
  });

  // Handle 404 for undefined routes
  app.use((req, res) => {
    res.status(404).json({
      error: 'Not Found',
      message: 'The requested endpoint does not exist'
    });
  });

  return new Promise((resolve) => {
    app.listen(port, () => {
      resolve();
    });
  });
}

module.exports = {
  startMockServer
}; 