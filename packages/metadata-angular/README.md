# @digahash/metadata-angular

Angular service wrapper around @digahash/metadata-core. Used to publish web content from simple hosted JSON files, often eliminating the need for a more expensive database.

![digahash-metadata-angular](https://images.dig-a-hash.com/dig-a-hash/digahash-metadata-angular.webp)

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
	user: 'wgoqc',
	folder: 'news',
	totalSupply: 90,
	batchSize: 10,
	isAscending: true,
	startTokenId: 0,
	baseUrl: 'https://nft.dig-a-hash.com/profiles',
	chainId: 137
});

await metadataService.fetchBatch();
```

## API

- MetadataService
- createMetadataService(options)
- getMetadataAttributeValue(metadata, attributeName)

## TypeScript

```ts
import type { Metadata } from '@digahash/metadata-angular';
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
## Project orientation and legacy `chainId`

This project was originally inspired by NFTs on Ethereum, which is why a `chainId` field appears in some APIs and data models. Dig-A-Hash has since adopted a Bitcoin-first ethos rooted in Bitcoin-first principles. As a result, on-chain support implemented via Ethers.js has been removed and is not maintained.

### Data URL and required `meta-data` folder

Metadata files are expected to be stored as sequentially numbered JSON files under a required `meta-data` folder. The fetch URL used by the underlying implementation follows this template:

`${baseUrl}/${user}/meta-data/${chainId}/${folder}/${tokenId}.json`

The `meta-data` path segment is required. Default `baseUrl` is `https://nft.dig-a-hash.com/profiles` and the legacy `chainId` default is `137` (use `0` as a neutral placeholder for Bitcoin-first items).

### Options (MetadataService)

The service accepts these options (passed into the internal state factory):

- `user` (string) — collection owner or profile identifier (required). [used in URL]
- `folder` (string) — collection folder name (required). [used in URL]
- `totalSupply` (number) — size of the collection (required).
- `batchSize` (number) — how many items to request per fetch (required).
- `isAscending` (boolean) — whether token IDs increment (required).
- `startTokenId` (number, default `0`) — starting token id for ascending flows.
- `baseUrl` (string, default `https://nft.dig-a-hash.com/profiles`) — base host for metadata files. [used in URL]
- `chainId` (number, default `137`) — legacy chain id; use `0` when a placeholder is required. [used in URL]
- `groupSize` (number, default `4`) — number of items per `groupedItems` row.
- `fetcher` (function, default `fetch`) — custom fetch function for testing or polyfills.

URL template used by the implementation:

`${baseUrl}/${user}/meta-data/${chainId}/${folder}/${tokenId}.json`

(`meta-data` is required; `tokenId` is provided at request time.)

### Returned API

The service exposes the `MetadataState` surface (getters for `items`, `isLoading`, `nextTokenId`, `allLoaded`, `downloadedCount`, `groupedItems`, and the async methods `fetchMetadata`, `fetchMetadataBatch`, `fetchBatch`, `fetchAllRemainingMetadata`).

Detailed return values and usage:

- `items`: loaded `Metadata` objects with `tokenId`, `metaData`, `metaDataUrl`, `owner`, and `privateData`.
- `isLoading`: boolean for active network operations.
- `nextTokenId`: next id to be requested.
- `allLoaded`: whether fetching has completed for the collection.
- `downloadedCount`: convenience count equal to `items.length`.
- `groupedItems`: `items` partitioned into rows of `groupSize` for UI layouts.
- `fetchMetadata(tokenId)`: returns `Metadata | null`; `metaDataUrl` shows the resolved URL.
- `fetchMetadataBatch(tokenIds)`: returns `(Metadata | null)[]`.
- `fetchBatch()`: requests the next `batchSize` items.
- `fetchAllRemainingMetadata()`: fetches until `allLoaded`.

## SupplyCount payload and migration notes

SupplyCounts are JSON endpoints that list total supply for one or many metadata collections. Keep counts for multiple collections in a single file (for example `counts2.json`) so consumers can retrieve supply data for all collections in one request. An accurate total supply is critical because metadata files are sequentially numbered; knowing the total enables correct paging, prevents fetching beyond available files, and supports efficient UI pagination.

Preferred payload fields returned by the counts endpoint are an array of objects with the following shape:

- `user`: string — profile user id (preferred over legacy `contractOwner`)
- `folder`: string — folder name (preferred over legacy `contractAddress`)
- `chainId`: number
- `count`: number

Legacy aliases supported by `fetchSupplyCounts()`:

- `contractOwner` -> `user`
- `contractAddress` -> `folder`

Example usage (core helper):

```ts
import { fetchSupplyCounts } from '@digahash/metadata-core';

const counts = await fetchSupplyCounts('https://.../counts2.json');
const news = counts.find((c) => c.folder === 'news');
const totalSupply = news?.count ?? 0;
```

Migration notes for consumers:

- Use the `user` and `folder` fields when available.
- `fetchSupplyCounts()` normalizes legacy shapes and will skip invalid entries instead of throwing.
- If a counts endpoint is unavailable or malformed, code should fall back to a sensible default (for example `0`).

## How To Contribute

[![GitHub - digahash-metadata](https://img.shields.io/badge/GitHub-digahash--metadata-181717?logo=github&logoColor=white)](https://github.com/Dig-A-Hash/digahash-metadata)

## License

MIT
