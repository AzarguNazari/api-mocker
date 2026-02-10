# REST Mocker

`rest-mock` is a CLI tool that turns OpenAPI specs into a running mock REST server with realistic response data.

## Features

- OpenAPI 3.x YAML or JSON input from a file or folder
- Recursive scan of `.yaml`, `.yml`, and `.json` files
- Realistic mock values for common fields
- Automatic merge for multiple specifications
- Swagger UI at `/api-docs`
- Built-in CORS headers

## Requirements

- Node.js `18.18.0` or newer

## Installation

```bash
npm install -g @nazariazargul/rest-mocker
```

Or run it without global install:

```bash
npx @nazariazargul/rest-mocker --path ./api.yaml --port 3000
```

## Usage

```bash
rest-mock --path ./api.yaml --port 3000
rest-mock --path ./specs -p 3000
rest-mock --help
```

### Command options

- `--path <path>`: OpenAPI file path or folder path (default `./openapi.yaml`)
- `-p, --port <number>`: server port (default `3000`)

### Logging

- Logging uses `pino`
- Set `LOG_LEVEL` to `debug`, `info`, `warn`, `error`, or `silent`

## Mock data behavior

- If a schema has `example`, it is returned as-is
- Arrays use `minItems` as count; default is `10`
- Strings support `date`, `date-time`, `email`, `uri`, `url`, `uuid`
- Enums return a random value from enum options
- Numeric fields respect `minimum` and `maximum` when provided

## Multi-spec behavior

- Folder input is scanned recursively for YAML and JSON files
- Specs are validated before merge
- Duplicate paths are resolved by first occurrence

## Troubleshooting

- `Path not found: ...`: check file/folder path and run from expected working directory
- `File must be an OpenAPI spec file`: input must end with `.yaml`, `.yml`, or `.json`
- `Failed to parse OpenAPI specification`: validate YAML/JSON and OpenAPI structure
- `Port must be a valid number between 1 and 65535`: pass a valid numeric port
- `EADDRINUSE`: selected port is already in use; choose another port

## Limitations

- Focused on OpenAPI 3 input

## Development

```bash
git clone https://github.com/AzarguNazari/rest-mock.git
cd rest-mock
npm install
npm run build
npm test
npm run lint
```

## Contributing

See `CONTRIBUTING.md` for setup, workflow, and pull request guidelines.

## License

MIT, see `LICENSE`.
