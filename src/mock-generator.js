function generateMockResponse(responseSchema) {
  if (!responseSchema || !responseSchema.content) {
    return {};
  }

  const schema = responseSchema.content['application/json']?.schema;
  if (!schema) {
    return {};
  }

  return generateMockData(schema);
}

function generateMockData(schema) {
  switch (schema.type) {
    case 'object':
      const obj = {};
      if (schema.properties) {
        for (const [key, prop] of Object.entries(schema.properties)) {
          obj[key] = generateMockData(prop);
        }
      }
      return obj;

    case 'array':
      return [generateMockData(schema.items)];

    case 'string':
      return 'mock-string';

    case 'number':
    case 'integer':
      return 123;

    case 'boolean':
      return true;

    default:
      return null;
  }
}

module.exports = {
  generateMockResponse
}; 