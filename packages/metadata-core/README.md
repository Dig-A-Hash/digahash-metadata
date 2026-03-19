# @digahash/metadata-core

Framework-agnostic metadata state management and utility functions used to publish web content from simple hosted JSON files, often eliminating the need for a more expensive database.

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
  user: 'wgoqc',
  folder: 'news',
  totalSupply: 90,
  batchSize: 50,
  isAscending: true,
  startTokenId: 0,
  baseUrl: 'https://nft.dig-a-hash.com/profiles',
  chainId: 137
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

## Project orientation and legacy `chainId`

This project was originally inspired by NFTs on Ethereum, which is why a `chainId` field appears in some APIs and data models. Dig-A-Hash has since adopted a Bitcoin-first ethos rooted in Bitcoin-first principles. As a result, on-chain support implemented via Ethers.js has been removed and is not maintained.

### Data URL and required `meta-data` folder

Metadata files are expected to be stored as sequentially numbered JSON files under a required `meta-data` folder. The exact fetch URL used by `createMetadataState` is:

`${baseUrl}/${user}/meta-data/${chainId}/${folder}/${tokenId}.json`

The `meta-data` path segment is required. `baseUrl`, `user`, `chainId`, `folder`, and `tokenId` are substituted into the template above.

Default values in the implementation:

- `baseUrl`: `https://nft.dig-a-hash.com/profiles`
- `chainId`: `137` (legacy default; use `0` as a neutral placeholder for Bitcoin-first items)
- `groupSize`: `4`

### Options (CreateMetadataStateOptions)

The `createMetadataState` factory accepts the following `options`:

- `user` (string) — collection owner or profile identifier (required).
- `folder` (string) — collection folder name (required).
- `totalSupply` (number) — size of the collection (required).
- `batchSize` (number) — how many items to request per fetch (required).
- `isAscending` (boolean) — whether token IDs increment (required).
- `startTokenId` (number, default `0`) — starting token id for ascending flows.
- `baseUrl` (string, default `https://nft.dig-a-hash.com/profiles`) — base host for metadata files.
- `chainId` (number, default `137`) — legacy chain id; use `0` when a placeholder is required.
- `groupSize` (number, default `4`) — number of items per `groupedNfts` row.
- `fetcher` (function, default global `fetch`) — custom fetch function for testing or polyfills.

The following options are used to build the metadata fetch URL (see template above): `baseUrl`, `user`, `chainId`, and `folder`. The `tokenId` is substituted at request time by fetch methods (not an input option).

### Returned API (MetadataState)

The factory returns an object with getters and async methods used by consumers:

- `items` (getter) — `Metadata[]` array of loaded items.
- `isLoading` (getter) — `boolean` indicating active fetch.
- `nextTokenId` (getter) — `number` next id to fetch.
- `allLoaded` (getter) — `boolean` whether the collection has been fully requested.
- `downloadedCount` (getter) — `number` of items currently loaded.
- `groupedNfts` (getter) — `Metadata[][]` grouped by `groupSize`.
- `fetchMetadata(tokenId: number): Promise<Metadata | null>` — fetch a single item.
- `fetchMetadataBatch(tokenIds: number[]): Promise<(Metadata | null)[]>` — fetch multiple items in parallel.
- `fetchBatch(): Promise<void>` — fetch the next batch according to `batchSize` and `isAscending`.
- `fetchAllRemainingMetadata(): Promise<void>` — iterate until all items are loaded.

Detailed returned values and usage

- `items`: contains loaded `Metadata` objects. Each object includes `tokenId`, `metaData` (the parsed JSON), `metaDataUrl` (the exact fetched URL), and `owner`/`privateData` (currently `null`). Use `items` to render UI lists or serialize state.
- `isLoading`: indicates whether a network fetch is in progress; useful to disable UI controls or show spinners.
- `nextTokenId`: the next token id the state will request when `fetchBatch` is called; useful for progress reporting and resuming partial reads.
- `allLoaded`: becomes `true` when the implementation has attempted (or determined) that all token ids in the collection have been requested.
- `downloadedCount`: a convenience number equal to `items.length` for quick metrics.
- `groupedNfts`: a convenience grouping of `items` into rows of length `groupSize`, useful for grid layouts.
- `fetchMetadata(tokenId)`: resolves a single `Metadata` entry or `null` if missing/unavailable. The returned `Metadata` includes `metaDataUrl` — the resolved URL using the template — which you can store, audit, or resolve further assets from.
- `fetchMetadataBatch(tokenIds)`: returns an array where each element is a `Metadata` or `null` corresponding to the requested token ids; useful for prefetching or parallel hydration.
- `fetchBatch()`: advances `nextTokenId` and populates `items` with the next `batchSize` items according to `isAscending`; returns when that batch completes.
- `fetchAllRemainingMetadata()`: sequentially calls `fetchBatch()` until `allLoaded` becomes `true`; useful for background preloading or export operations.

### Metadata item shape

Each fetched item has this shape as returned by `fetchMetadata`:

```ts
{
  tokenId: number,
  metaData: Record<string, unknown>,
  metaDataUrl: string,
  owner: null,
  privateData: null
}
```

For exact TypeScript types, see the package exports: `CreateMetadataStateOptions`, `Metadata`, and `MetadataState`.

## License

MIT
