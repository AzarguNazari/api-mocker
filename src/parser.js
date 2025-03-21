const SwaggerParser = require('@apidevtools/swagger-parser');

async function parseOpenAPISpec(specPath) {
  try {
    // Parse and validate OpenAPI document
    const api = await SwaggerParser.validate(specPath);
    return api;
  } catch (error) {
    throw new Error(`Failed to parse OpenAPI specification: ${error.message}`);
  }
}

module.exports = {
  parseOpenAPISpec
}; 