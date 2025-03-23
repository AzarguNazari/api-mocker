# API Mocker

A command-line tool to generate mock REST APIs from OpenAPI/Swagger specifications. This tool helps frontend developers by providing realistic mock data based on your API specification.

## Features

- Generate mock REST APIs from OpenAPI 3.0/Swagger specifications
- Support for path parameters and query parameters
- Realistic mock data generation based on schema types and formats
- Built-in Swagger UI for API documentation
- CORS support for cross-origin requests
- Automatic handling of different response status codes

## Installation

```bash
# Install globally
npm install -g @nazariazargul/api-mocker
```

## Usage

```bash
# Basic usage
api-mocker -s path/to/openapi.yaml --port 3000

# Options
api-mocker --help
```

### Command Line Options

- `--spec, -s`: Path to OpenAPI specification file (default: './openapi.yaml')
- `--port, -p`: Port to run the mock server on (default: 3000)

## Mock Data Generation

The tool generates realistic mock data based on the OpenAPI schema:

- Strings: Random strings with format support (date, date-time, email, uri, uuid)
- Numbers: Random numbers within specified ranges
- Integers: Random integers within specified ranges
- Booleans: Random true/false values
- Arrays: 1-3 random items by default
- Objects: All properties mocked according to their schemas
- Enums: Random selection from specified values
- Patterns: Basic regex pattern support

## Example

1. Create an OpenAPI specification file (e.g., `api.yaml`):

```yaml
openapi: 3.0.0
info:
  title: Sample API
  version: 1.0.0
paths:
  /users/{id}:
    get:
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: integer
                  name:
                    type: string
                  email:
                    type: string
                    format: email
```

2. Run the mock server:

```bash
api-mocker -s api.yaml --port 3000
```

3. Access your mock API:
- API Endpoints: `http://localhost:3000/users/123`
- Swagger UI: `http://localhost:3000/api-docs`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT 
