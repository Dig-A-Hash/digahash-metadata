# @digahash/metadata-angular

## What It Is

Angular service wrapper around @digahash/metadata-core.

## Install

```bash
npm install @digahash/metadata-angular
pnpm add @digahash/metadata-angular
yarn add @digahash/metadata-angular
```

## Peer Dependencies

- @angular/core ^19
- rxjs ^7.8

## Quick Start

```ts
import { MetadataService } from '@digahash/metadata-angular';

// Inject MetadataService, then initialize once.
metadataService.initialize({
	user: 'digahash',
	folder: 'my-collection',
	totalSupply: 100,
	batchSize: 10,
	isAscending: true
});

await metadataService.fetchBatch();
```

## API

- MetadataService
- createMetadataService(options)
- getMetadataAttributeValue(metadata, attributeName)

## TypeScript

```ts
import type { Metadata, CreateMetadataStateOptions } from '@digahash/metadata-angular';
```

## ESM and CJS Imports

```ts
import { MetadataService } from '@digahash/metadata-angular';
```

```js
const { MetadataService } = require('@digahash/metadata-angular');
```

## Docker Development

```bash
docker run --rm -it -v "$(pwd):/app" -w /app node:24-slim sh -lc "corepack enable && pnpm --filter @digahash/metadata-angular build"
```

## Compatibility

Angular 19+ and modern runtimes.

## Release Process

Use repository-level changesets workflow to version and publish.

## License

MIT
