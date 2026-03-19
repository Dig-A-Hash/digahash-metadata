# @digahash/metadata-vue

## What It Is

Vue 3 composable wrapper around @digahash/metadata-core.

## Install

```bash
npm install @digahash/metadata-vue
pnpm add @digahash/metadata-vue
yarn add @digahash/metadata-vue
```

## Peer Dependencies

- vue ^3.5.0

## Quick Start

```ts
import { useMetadata } from '@digahash/metadata-vue';

const metadata = useMetadata({
  user: 'digahash',
  folder: 'my-collection',
  totalSupply: 100,
  batchSize: 10,
  isAscending: true
});

await metadata.fetchBatch();
```

## API

- useMetadata(options)
- getMetadataAttributeValue(metadata, attributeName)

## TypeScript

```ts
import type { Metadata, CreateMetadataStateOptions } from '@digahash/metadata-vue';
```

## ESM and CJS Imports

```ts
import { useMetadata } from '@digahash/metadata-vue';
```

```js
const { useMetadata } = require('@digahash/metadata-vue');
```

## Docker Development

```bash
docker run --rm -it -v "$(pwd):/app" -w /app node:24-slim sh -lc "corepack enable && pnpm --filter @digahash/metadata-vue build"
```

## Compatibility

Vue 3.5+ and modern runtimes.

## Release Process

Use repository-level changesets workflow to version and publish.

## License

MIT
