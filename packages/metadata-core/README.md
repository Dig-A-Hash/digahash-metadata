# @digahash/metadata-core

## What It Is

Framework-agnostic metadata state management and utility functions.

## Install

```bash
npm install @digahash/metadata-core
pnpm add @digahash/metadata-core
yarn add @digahash/metadata-core
```

## Quick Start

```ts
import { createMetadataState } from '@digahash/metadata-core';

const metadata = createMetadataState({
  user: 'digahash',
  folder: 'my-collection',
  totalSupply: 100,
  batchSize: 10,
  isAscending: true
});

await metadata.fetchBatch();
console.log(metadata.items.length);
```

## API

- createMetadataState(options)
- getMetadataAttributeValue(metadata, attributeName)
- getPublicAttributeValue(metadata, attributeName)

## TypeScript

```ts
import type { Metadata, CreateMetadataStateOptions } from '@digahash/metadata-core';
```

## ESM and CJS Imports

```ts
import { createMetadataState } from '@digahash/metadata-core';
```

```js
const { createMetadataState } = require('@digahash/metadata-core');
```

## Docker Development

```bash
docker run --rm -it -v "$(pwd):/app" -w /app node:24-slim sh -lc "corepack enable && pnpm --filter @digahash/metadata-core build"
```

## Compatibility

Works in modern browsers and Node.js runtimes with fetch support.

## Release Process

Use repository-level changesets workflow to version and publish.

## License

MIT
