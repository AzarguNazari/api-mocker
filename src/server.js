const express = require('express');
const { generateMockResponse } = require('./mock-generator');

async function startMockServer(apiSpec, port) {
  const app = express();
  app.use(express.json());

  // Generate routes based on OpenAPI spec
  for (const [path, pathItem] of Object.entries(apiSpec.paths)) {
    for (const [method, operation] of Object.entries(pathItem)) {
      if (method === 'parameters') continue;

      app[method](path, (req, res) => {
        const mockResponse = generateMockResponse(operation.responses['200']);
        res.json(mockResponse);
      });
    }
  }

  return new Promise((resolve) => {
    app.listen(port, () => {
      resolve();
    });
  });
}

module.exports = {
  startMockServer
}; 