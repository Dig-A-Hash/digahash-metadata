# @digahash/metadata-react

## What It Is

React hook wrapper around @digahash/metadata-core.

## Install

```bash
npm install @digahash/metadata-react
pnpm add @digahash/metadata-react
yarn add @digahash/metadata-react
```

## Peer Dependencies

- react ^18 or ^19

## Quick Start

```tsx
import { useMetadata } from '@digahash/metadata-react';

export function Example() {
  const metadata = useMetadata({
    user: 'digahash',
    folder: 'my-collection',
    totalSupply: 100,
    batchSize: 10,
    isAscending: true
  });

  return (
    <button onClick={() => void metadata.fetchBatch()}>
      Load metadata ({metadata.downloadedCount})
    </button>
  );
}
```

## API

- useMetadata(options)
- getMetadataAttributeValue(metadata, attributeName)

## TypeScript

```ts
import type { Metadata, CreateMetadataStateOptions } from '@digahash/metadata-react';
```

## ESM and CJS Imports

```ts
import { useMetadata } from '@digahash/metadata-react';
```

```js
const { useMetadata } = require('@digahash/metadata-react');
```

## Docker Development

```bash
docker run --rm -it -v "$(pwd):/app" -w /app node:24-slim sh -lc "corepack enable && pnpm --filter @digahash/metadata-react build"
```

## Compatibility

React 18+ and modern runtimes.

## Release Process

Use repository-level changesets workflow to version and publish.

## License

MIT
