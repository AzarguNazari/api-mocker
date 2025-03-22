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
  if (schema.example) {
    return schema.example;
  }

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
      const count = schema.minItems || 10; // Default to 10 items if minItems not specified
      return Array(count).fill().map(() => generateMockData(schema.items));

    case 'string':
      if (schema.format) {
        switch (schema.format) {
          case 'date':
            return new Date().toISOString().split('T')[0];
          case 'date-time':
            return new Date().toISOString();
          case 'email':
            return `user${Math.floor(Math.random() * 1000)}@example.com`;
          case 'uri':
            return `https://example.com/resource/${Math.floor(Math.random() * 1000)}`;
          case 'uuid':
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
              const r = Math.random() * 16 | 0;
              const v = c === 'x' ? r : (r & 0x3 | 0x8);
              return v.toString(16);
            });
        }
      }
      if (schema.enum) {
        return schema.enum[Math.floor(Math.random() * schema.enum.length)];
      }
      if (schema.pattern) {
        // Basic pattern support
        return schema.pattern.replace(/\[a-zA-Z\]/g, 'A')
                           .replace(/\[0-9\]/g, '1')
                           .replace(/\[a-zA-Z0-9\]/g, 'X');
      }
      return `mock-${Math.random().toString(36).substring(7)}`;

    case 'number':
    case 'integer':
      const min = schema.minimum || 0;
      const max = schema.maximum || 1000;
      if (schema.type === 'integer') {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      return (Math.random() * (max - min) + min).toFixed(2);

    case 'boolean':
      return Math.random() > 0.5;

    default:
      return null;
  }
}

module.exports = {
  generateMockResponse
}; 