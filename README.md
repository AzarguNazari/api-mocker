# REST Mocker

CLI tool that turns OpenAPI specs into a running mock REST server.

## Install

```bash
npm install -g @nazariazargul/rest-mocker
```

## Usage

```bash
rest-mock --path ./api.yaml --port 3000
rest-mock --path ./specs
```

| Option              | Default          | Description                    |
| ------------------- | ---------------- | ------------------------------ |
| `--path <path>`     | `./openapi.yaml` | OpenAPI file or folder         |
| `-p, --port <port>` | `3000`           | Server port                    |

Swagger UI is available at `/api-docs`.

## License

MIT
