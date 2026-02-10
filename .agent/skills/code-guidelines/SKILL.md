---
name: Code Guidelines
description: TypeScript coding standards, conventions, and best practices for the rest-mocker codebase. Enforces consistent style, architecture patterns, and quality standards across all contributions.
---

# Code Guidelines

This skill defines the **mandatory coding standards** for the rest-mocker project. Every code change — whether a new feature, refactor, or bug fix — must comply with these guidelines.

---

## 1. Core Rules (from AGENTS.md)

These are the **non-negotiable** rules for this codebase:

### 1.1 No Code Comments (Unless Super Important)

- **Do not add comments to code.** The code must be self-documenting through clear naming, small functions, and explicit types.
- A comment is justified **only** when explaining a non-obvious business rule, a workaround for a known bug, or a critical safety constraint.
- If you feel the need to comment, first try renaming the variable/function or extracting a well-named helper instead.

```typescript
// BAD
// Check if the port is valid
if (isNaN(port) || port < 1 || port > 65535) { ... }

// GOOD (self-documenting — no comment needed)
const isInvalidPort = isNaN(port) || port < 1 || port > 65535;
if (isInvalidPort) { ... }
```

### 1.2 Guard Clauses Over if-else

- Always use **guard clauses** (early returns) instead of `if-else` chains or deep nesting.
- The ESLint rule `no-else-return` is enforced to catch violations.

```typescript
// BAD
function processSpec(spec: Document): Result {
  if (spec.paths) {
    if (spec.info) {
      return buildResult(spec);
    } else {
      throw new Error('Missing info');
    }
  } else {
    throw new Error('Missing paths');
  }
}

// GOOD
function processSpec(spec: Document): Result {
  if (!spec.paths) {
    throw new Error('Missing paths');
  }

  if (!spec.info) {
    throw new Error('Missing info');
  }

  return buildResult(spec);
}
```

### 1.3 No Emoji in Code

- **Never use emoji characters** anywhere in source code: variable names, strings, log messages, error messages, or comments.
- This includes test files, utility constants, and generated data.

---

## 2. TypeScript Strictness

### 2.1 Strict Mode Is Mandatory

The project uses the following strict compiler options in `tsconfig.json`. **Never relax them:**

| Option                          | Value  | Purpose                                      |
| ------------------------------- | ------ | -------------------------------------------- |
| `strict`                        | `true` | Enables all strict type-checking options      |
| `noUnusedLocals`                | `true` | Disallows unused local variables              |
| `noUnusedParameters`            | `true` | Disallows unused function parameters          |
| `noImplicitReturns`             | `true` | All code paths must return a value            |
| `noFallthroughCasesInSwitch`    | `true` | Prevents fall-through in switch statements    |
| `forceConsistentCasingInFileNames` | `true` | Ensures import paths match actual casing   |

### 2.2 Explicit Return Types

- **Every exported and named function must have an explicit return type.**  
- The ESLint rule `@typescript-eslint/explicit-function-return-type` is set to `error`.

```typescript
// BAD
export function loadSpecs(path: string) { ... }

// GOOD
export function loadSpecs(path: string): Promise<Document[]> { ... }
```

### 2.3 Avoid `any`

- **Never use `any`** in production code. The ESLint rule `@typescript-eslint/no-explicit-any` is set to `warn`.
- Use `unknown` when the type is truly unknown, then narrow with type guards.
- In test files, `any` is relaxed — but prefer typed mocks where possible.

```typescript
// BAD
function parse(input: any): any { ... }

// GOOD
function parse(input: unknown): Document {
  if (!isValidInput(input)) {
    throw new ParseError('Invalid input');
  }
  return input as Document;
}
```

### 2.4 Use Type Aliases from the Central Types Module

- All shared types must be defined in `src/types/index.ts` as re-exports from source libraries.
- Import types from `../types` — never from the underlying library directly in service/util files.

```typescript
// BAD
import { OpenAPIV3 } from 'openapi-types';
const schema: OpenAPIV3.SchemaObject = { ... };

// GOOD
import { SchemaObject } from '../types';
const schema: SchemaObject = { ... };
```

### 2.5 Prefer `??` Over `||` for Nullish Coalescing

- Use `??` when defaulting values that could be `null` or `undefined`.
- Use `||` only when you intentionally want to fall through on falsy values like `0` or `""`.

```typescript
// BAD (0 would be replaced)
const count = schema.minItems || 10;

// GOOD (0 is preserved)
const count = schema.minItems ?? 10;
```

### 2.6 Prefer `const` Assertions and Literal Types

- Use `as const` for arrays and objects that should be treated as readonly literal types.

```typescript
// GOOD
const VALID_METHODS = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'] as const;
type HttpMethod = typeof VALID_METHODS[number];
```

---

## 3. Naming Conventions

### 3.1 Files

| Type       | Pattern                          | Example                          |
| ---------- | -------------------------------- | -------------------------------- |
| Service    | `<name>.service.ts`              | `server.service.ts`              |
| Utility    | `<name>.util.ts`                 | `file-scanner.util.ts`           |
| Types      | `index.ts` in `types/`           | `src/types/index.ts`             |
| Test       | `<name>.test.ts` in `__tests__/` | `server.service.test.ts`         |
| Config     | `<tool>.config.ts`               | `jest.config.ts`                 |

- Use **kebab-case** for all file names (lowercase with hyphens).
- Test files live in a `__tests__/` directory alongside the files they test.

### 3.2 Variables, Functions, and Classes

| Kind                          | Convention      | Example                           |
| ----------------------------- | --------------- | --------------------------------- |
| Local variable / parameter    | `camelCase`     | `specPath`, `portNumber`          |
| Function                      | `camelCase`     | `generateMockData`, `mergeSpecs`  |
| Constant (module-level data)  | `UPPER_SNAKE`   | `FIRST_NAMES`, `VALID_METHODS`    |
| Type alias / Interface        | `PascalCase`    | `SchemaObject`, `Document`        |
| Class                         | `PascalCase`    | `ParseError`, `ValidationError`   |
| Enum (if needed)              | `PascalCase`    | `LogLevel`                        |
| Unused parameter              | Prefix with `_` | `_req`, `_next`                   |

### 3.3 Function Naming Guidelines

- Use **verb-first** names: `create`, `generate`, `parse`, `validate`, `setup`, `register`, `load`, `merge`, `find`, `is`, `has`.
- Boolean-returning functions start with `is` or `has`: `isDirectory`, `isSpecFile`, `isValidHttpMethod`.
- Factory functions start with `create`: `createLogger`, `createRouteHandler`.
- Generator functions start with `generate`: `generateMockData`, `generateUUID`.

---

## 4. Architecture & File Structure

### 4.1 Project Layout

```
src/
├── index.ts                    # CLI entry point — thin orchestration only
├── services/                   # Business logic modules
│   ├── server.service.ts       # Express server setup and routing
│   ├── parser.service.ts       # OpenAPI spec parsing
│   ├── mock-generator.service.ts  # Mock data generation from schemas
│   ├── multi-spec-server.service.ts  # Multi-file spec loading & merging
│   └── __tests__/              # Unit tests for services
├── utils/                      # Pure utility functions
│   ├── error-handler.util.ts   # Custom error classes
│   ├── file-scanner.util.ts    # File system helpers
│   ├── logger.util.ts          # Logging configuration
│   ├── number-generator.util.ts # Numeric generation utilities
│   ├── string-generator.util.ts # String generation utilities
│   ├── realistic-data.util.ts  # Realistic mock data pools
│   └── __tests__/              # Unit tests for utilities
└── types/
    └── index.ts                # Central type re-exports
```

### 4.2 Module Responsibilities

- **Services** contain domain logic. They orchestrate utilities and interact with external libraries.
- **Utilities** are **pure functions** with no domain knowledge. They are reusable and have no side effects (except logging).
- **Types** is a barrel module that re-exports types from third-party libraries to decouple the codebase from external type definitions.
- **`index.ts`** (root) is the CLI entry point. Keep it thin — it only parses CLI args and delegates to services.

### 4.3 Dependency Direction

```
index.ts → services → utils
                    → types
```

- **Services may import from** `utils/` and `types/`.
- **Utilities must not import from** `services/`.
- **Types must not import from** `services/` or `utils/`.
- This ensures a clean, unidirectional dependency graph.

---

## 5. Functions

### 5.1 Keep Functions Small and Focused

- A function should do **one thing**. If a function name requires "and" to describe it, split it.
- Aim for **under 30 lines** per function. Larger functions should be decomposed.

```typescript
// GOOD — each function has a single responsibility
function setupMiddleware(app: Application): void { ... }
function setupSwaggerUI(app: Application, apiSpec: Document): void { ... }
function registerRoutes(app: Application, apiSpec: Document): void { ... }
function setupErrorHandlers(app: Application): void { ... }
```

### 5.2 Prefer Named Functions Over Anonymous Inline Functions

- Use named function declarations or named function expressions for any non-trivial logic.
- Short callbacks (e.g., `.map()`, `.filter()`) can remain inline.

### 5.3 Prefer Top-Level Functions Over Classes

- This codebase uses a **functional style**. Avoid classes unless modelling a custom error or a genuinely stateful entity.
- Export standalone functions from modules.

```typescript
// BAD — unnecessary class
export class SpecLoader {
  async load(path: string): Promise<Document[]> { ... }
}

// GOOD — exported function
export async function loadSpecsFromPath(path: string): Promise<Document[]> { ... }
```

### 5.4 Function Parameter Guidelines

- **Maximum 3 parameters.** If more are needed, use an options object.
- Use destructuring for options objects.

```typescript
// BAD
function createServer(spec: Document, port: number, host: string, cors: boolean): void { ... }

// GOOD
interface ServerOptions {
  spec: Document;
  port: number;
  host: string;
  cors: boolean;
}
function createServer({ spec, port, host, cors }: ServerOptions): void { ... }
```

---

## 6. Error Handling

### 6.1 Use Custom Error Classes

- Define custom errors in `src/utils/error-handler.util.ts`.
- Each error class must extend `Error` and set `this.name`.

```typescript
export class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParseError';
  }
}
```

### 6.2 Discriminate Errors with `instanceof`

- Use `instanceof` checks, not string-based error matching.

```typescript
// GOOD
if (error instanceof ValidationError) {
  res.status(400).json({ error: error.message });
  return;
}
throw error;
```

### 6.3 Safe Error Message Extraction

- Always narrow `unknown` catches with `instanceof Error` before accessing `.message`.

```typescript
catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error occurred';
  logger.error(`Error: ${message}`);
}
```

### 6.4 Never Swallow Errors Silently

- If you catch an error and choose not to rethrow, **always log it** at minimum.
- Use `logger.warn(...)` for recoverable issues and `logger.error(...)` for critical ones.

---

## 7. Imports

### 7.1 Import Order

Organize imports in the following order, separated by blank lines:

1. **Node.js built-in modules** (`fs`, `path`, `http`)
2. **Third-party packages** (`express`, `pino`, `commander`)
3. **Internal modules** — services, then utils, then types

```typescript
import fs from 'fs';
import path from 'path';

import { Command } from 'commander';
import express from 'express';

import { loadSpecsFromPath, mergeSpecs } from './services/multi-spec-server.service';
import { startMockServer } from './services/server.service';
import { createLogger } from './utils/logger.util';
```

### 7.2 Use Named Imports

- Prefer named imports over default imports (except for modules that export a default by convention, like `express`).
- Never use `import * as` unless necessary for a specific library compatibility reason.

---

## 8. Formatting (Prettier)

The project enforces consistent formatting via Prettier with the following configuration:

| Setting          | Value    |
| ---------------- | -------- |
| `semi`           | `true`   |
| `trailingComma`  | `es5`    |
| `singleQuote`    | `true`   |
| `printWidth`     | `100`    |
| `tabWidth`       | `2`      |
| `arrowParens`    | `always` |

- **Always run** `npm run format` before committing.
- **Always check** `npm run format:check` in CI.

---

## 9. Testing

### 9.1 Test File Placement

- Tests live in `__tests__/` directories adjacent to the files they test.
- Test files are named `<module-name>.test.ts`.

### 9.2 Test Structure

- Use `describe` blocks to group tests by function or feature.
- Use clear, sentence-like test names that describe the expected behavior.
- Follow the **Arrange → Act → Assert** pattern.

```typescript
describe('generateMockData', () => {
  it('should return an example value when the schema has one', () => {
    const schema: SchemaObject = { type: 'string', example: 'hello' };
    const result = generateMockData(schema);
    expect(result).toBe('hello');
  });

  it('should return null for unknown schema types', () => {
    const schema = { type: 'custom' } as SchemaObject;
    const result = generateMockData(schema);
    expect(result).toBeNull();
  });
});
```

### 9.3 Coverage Thresholds

The project enforces **minimum 70% coverage** across branches, functions, lines, and statements. Do not lower these thresholds.

### 9.4 `any` in Tests

- `@typescript-eslint/no-explicit-any` is relaxed to `off` in test files.
- Prefer typed mocks regardless; fall back to `any` only when necessary for partial mocking.

### 9.5 Test Isolation

- Tests must not depend on file system state, network calls, or shared mutable state.
- Mock external dependencies (e.g., file system reads) at the module level using `jest.mock()`.

---

## 10. Logging

### 10.1 Use `createLogger` from `utils/logger.util.ts`

- Never use `console.log`, `console.error`, or `console.warn` in production code.
- Create a scoped logger at the top of each module:

```typescript
const logger = createLogger('server');
```

### 10.2 Log Levels

| Level   | Use When                                                |
| ------- | ------------------------------------------------------- |
| `debug` | Verbose diagnostics (path resolution, parsed values)    |
| `info`  | Normal operational events (server started, spec loaded) |
| `warn`  | Recoverable issues (skipped invalid file, duplicate path)|
| `error` | Failures that stop or degrade the operation             |

### 10.3 Environment-Aware Logging

- `LOG_LEVEL` environment variable controls verbosity.
- In `test` environment (`NODE_ENV=test`), logging defaults to `silent`.

---

## 11. Async / Promises

### 11.1 Use `async`/`await` Over Raw Promises

- Prefer `async`/`await` syntax for readability.
- Avoid `.then()` chains in new code.

### 11.2 Always Handle Promise Rejections

- Every `await` must be inside a `try/catch` or the function must propagate the error.

### 11.3 Sequential vs. Parallel

- Use `Promise.all` when operations are independent and can run in parallel.
- Use sequential `for...of` loops when order matters or when each iteration depends on the previous result.

```typescript
// Sequential (order matters or might skip on failure)
for (const file of specFiles) {
  const spec = await parseOpenAPISpec(file);
  specs.push(spec);
}

// Parallel (independent operations)
const results = await Promise.all(urls.map((url) => fetch(url)));
```

---

## 12. Immutability & Data Handling

### 12.1 Prefer Immutable Patterns

- Use the spread operator `{ ...obj }` or `[...arr]` to create copies instead of mutating originals.
- Use `Object.entries()`, `.map()`, `.filter()`, and `.reduce()` for data transformations.

```typescript
// GOOD — clone before mutating
const taggedPathItem: PathItemObject = { ...pathItem };
```

### 12.2 Use `Record<string, T>` for Dynamic Object Types

- Prefer `Record<string, unknown>` over `{ [key: string]: unknown }`.

### 12.3 Type Narrowing Over Casting

- Use type guard functions (`isRecord`, `isResponseObject`) instead of `as` casts.
- Define reusable guard functions for repeated type checks.

```typescript
function isRecord(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object') {
    return false;
  }
  return !Array.isArray(value);
}
```

---

## 13. Module Constants

### 13.1 Static Data Arrays

- Define static data as **module-level `const` arrays** with `UPPER_SNAKE_CASE` names.
- Keep each array focused on a single domain concept.

```typescript
const FIRST_NAMES = [
  'James', 'Emma', 'Michael', 'Olivia', ...
];
```

### 13.2 Reusable Picker Pattern

- Use a generic `pickRandom<T>(array: T[]): T` helper for selecting from constant arrays.
- Keep the random selection logic in a single place.

---

## 14. CLI & Entry Point

### 14.1 Thin Entry Point

- `src/index.ts` should only handle CLI argument parsing and top-level orchestration.
- All logic is delegated to services.

### 14.2 Validation at the Boundary

- Validate all user inputs (port, path) in the CLI layer before passing to services.
- Use `process.exit(1)` only in the entry point, never in services or utilities.

---

## 15. Pull Request Checklist

Before opening a PR, ensure:

- [ ] `npm run build` passes with zero errors
- [ ] `npm run lint` passes with zero errors
- [ ] `npm test` passes with all tests green
- [ ] `npm run format:check` passes
- [ ] No code comments added (unless justified)
- [ ] Guard clauses used instead of `if-else`
- [ ] No emoji in code
- [ ] All exported functions have explicit return types
- [ ] No `any` in production code
- [ ] New logic has corresponding test coverage
- [ ] `README.md` updated if user-facing behavior changed

---

## Quick Reference Commands

```bash
npm run build          # Compile TypeScript
npm run dev            # Run in development mode
npm run lint           # Check for lint errors
npm run lint:fix       # Auto-fix lint errors
npm run format         # Format all source files
npm run format:check   # Check formatting without writing
npm test               # Run all tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report
```
