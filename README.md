# API Mocker

A command-line tool to generate mock REST APIs from OpenAPI/Swagger specifications. This tool helps frontend developers by providing realistic mock data based on your API specification.

## Features

- Generate mock REST APIs from OpenAPI 3.0/Swagger specifications
- Support for **single files or entire folders** of YAML specifications
- **Realistic mock data generation** for common fields (names, emails, addresses, companies, etc.)
- Automatic merging of multiple API specifications
- Path parameters and query parameters support
- Built-in Swagger UI for API documentation
- CORS support for cross-origin requests
- Automatic handling of different response status codes

## Installation

```bash
npm install -g @nazariazargul/api-mocker
```

## Usage

```bash
# Using a single file
api-mock --path path/to/api.yaml --port 3000

# Using a folder with multiple specs
api-mock --path path/to/specs-folder --port 3000

# Using short option for port
api-mock --path path/to/api.yaml -p 3000

# Get help
api-mock --help
```

### Command Line Options

- `--path <path>`: Path to OpenAPI file or folder containing YAML specs (default: './openapi.yaml')
- `-p, --port <number>`: Port to run the mock server on (default: 3000)

## Mock Data Generation

The tool generates **realistic mock data** based on the OpenAPI schema:

- **Strings**: Contextual generation based on field names
  - `email`, `user_email` → realistic emails (e.g., `john.smith@example.com`)
  - `phone`, `phoneNumber` → formatted phone numbers (e.g., `+1 (555) 123-4567`)
  - `name`, `firstName`, `lastName` → realistic names
  - `address`, `street` → street addresses
  - `city` → city names
  - `company` → company names
  - `title`, `position`, `job` → job titles
  - `description`, `bio` → descriptions
  - Format support (date, date-time, email, uri, uuid)
- **Numbers**: Random numbers within specified ranges
- **Integers**: Random integers within specified ranges
- **Booleans**: Random true/false values
- **Arrays**: Default 10 items (configurable via minItems)
- **Objects**: All properties mocked according to their schemas
- **Enums**: Random selection from specified values

## Examples

### Single File

Create an OpenAPI specification file:

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
                  company:
                    type: string
```

Run the mock server:

```bash
api-mock --path api.yaml --port 3000
```

### Multiple Specifications (Folder)

Organize multiple API specs in a folder:

```
specs/
  ├── users-api.yaml
  ├── products-api.yaml
  └── orders-api.yaml
```

Run the mock server with all specifications:

```bash
api-mock --path ./specs --port 3000
```

The tool will:
1. Scan the folder recursively for YAML files
2. Load and validate all OpenAPI specifications
3. Merge them into a single API
4. Start the mock server

### Access Your Mock API

- API Endpoints: `http://localhost:3000/users/123`
- Swagger UI: `http://localhost:3000/api-docs`

Example response with realistic data:
```json
{
  "id": 123,
  "name": "Michael Johnson",
  "email": "michael.johnson@example.com",
  "company": "Tech Solutions"
}
```

## Development

This project is written in TypeScript. To contribute:

```bash
git clone https://github.com/AzarguNazari/api-mocker.git
cd api-mocker
npm install

npm run build
npm test
npm run lint
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## TODO

- Add response header mocking
- Support for authentication schemes
- Custom data generators via plugins
- Configurable array item counts
- Request body validation
