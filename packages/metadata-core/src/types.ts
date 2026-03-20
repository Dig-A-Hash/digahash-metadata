export interface MetadataAttribute {
  trait_type: string;
  value: string;
}

export interface MetadataContent {
  image: string;
  name: string;
  description: string;
  attributes?: MetadataAttribute[];
}

export interface Metadata {
  tokenId: number;
  metaData: MetadataContent;
  metaDataUrl: string;
  owner: string | null;
  privateData: object | null;
}

export interface UseMetadataOptions {
  user: string;
  folder: string;
  totalSupply: number;
  batchSize: number;
  isAscending: boolean;
  startTokenId?: number;
}

export interface CreateMetadataStateOptions extends UseMetadataOptions {
  baseUrl?: string;
  chainId?: number;
  groupSize?: number;
  fetcher?: typeof fetch;
}

export interface MetadataState {
  readonly items: Metadata[];
  readonly isLoading: boolean;
  readonly nextTokenId: number;
  readonly allLoaded: boolean;
  readonly downloadedCount: number;
  readonly groupedItems: Metadata[][];
  fetchMetadata: (tokenId: number) => Promise<Metadata | null>;
  fetchMetadataBatch: (tokenIds: number[]) => Promise<(Metadata | null)[]>;
  fetchBatch: () => Promise<void>;
  fetchAllRemainingMetadata: () => Promise<void>;
}

/**
 * Supply count for a single collection. Shared domain type.
 *
 * Notes:
 * - Preferred shape uses `user` and `folder` which map directly to the
 *   metadata URL template used by `createMetadataState`.
 * - Legacy payloads may still include `contractOwner` and `contractAddress`.
 *   These are accepted by the helper and treated as deprecated aliases.
 */
export interface SupplyCount {
  user?: string;
  folder?: string;
  /** @deprecated use `user` */
  contractOwner?: string;
  /** @deprecated use `folder` */
  contractAddress?: string;
  chainId: number;
  count: number;
}
