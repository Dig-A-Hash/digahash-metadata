import type { CreateMetadataStateOptions, Metadata, MetadataState } from './types';
import { groupItemsIntoRows } from './utils';

/** Default base URL used to construct metadata file locations. */
const DEFAULT_BASE_URL = 'https://nft.dig-a-hash.com/profiles';

/** Default blockchain chain id (Polygon). */
const DEFAULT_CHAIN_ID = 137;

/** Default number of items per visual row when grouping results. */
const DEFAULT_GROUP_SIZE = 4;

/**
 * Create a MetadataState for paginated fetching of metadata JSON files.
 *
 * The returned object exposes read-only getters for state and functions
 * for fetching metadata in batches. Options allow configuring sort
 * direction, batch size, start token, and a custom `fetch` implementation
 * for testing or environment-specific fetching.
 *
 * @param options - Configuration for the metadata state instance.
 * @returns A `MetadataState` with getters and fetch helpers.
 */
export function createMetadataState(options: CreateMetadataStateOptions): MetadataState {
  const {
    user,
    folder,
    totalSupply,
    batchSize,
    isAscending,
    startTokenId = 0,
    baseUrl = DEFAULT_BASE_URL,
    chainId = DEFAULT_CHAIN_ID,
    groupSize = DEFAULT_GROUP_SIZE,
    fetcher = fetch
  } = options;

  const state = {
    items: [] as Metadata[],
    isLoading: false,
    nextTokenId: isAscending ? startTokenId : totalSupply - 1,
    allLoaded: false
  };

  /**
   * Fetch a single metadata JSON for the given `tokenId`.
   * Returns a `Metadata` object on success or `null` when the fetch fails
   * (non-2xx response or network error).
   */
  const fetchMetadata = async (tokenId: number): Promise<Metadata | null> => {
    try {
      const url = `${baseUrl}/${user}/meta-data/${chainId}/${folder}/${tokenId}.json`;
      const res = await fetcher(url);
      if (!res.ok) {
        return null;
      }

      const data = (await res.json()) as Metadata['metaData'];
      return {
        tokenId,
        metaData: data,
        metaDataUrl: url,
        owner: null,
        privateData: null
      };
    } catch {
      return null;
    }
  };

  /**
   * Fetch multiple metadata files in parallel. Returns an array where
   * individual entries may be `null` for failed fetches.
   */
  const fetchMetadataBatch = async (tokenIds: number[]): Promise<(Metadata | null)[]> => {
    return Promise.all(tokenIds.map((id) => fetchMetadata(id)));
  };

  /**
   * Fetch the next batch of metadata based on the configured `batchSize`
   * and current `nextTokenId`. Updates internal state (`items`,
   * `nextTokenId`, `allLoaded`, `isLoading`). This is the primary
   * incremental loading method used by callers.
   */
  const fetchBatch = async (): Promise<void> => {
    if (state.isLoading || state.allLoaded) {
      return;
    }

    if (isAscending) {
      if (totalSupply <= 0 || state.nextTokenId >= totalSupply) {
        state.allLoaded = true;
        return;
      }
    } else if (totalSupply <= 0 || state.nextTokenId < 0) {
      state.allLoaded = true;
      return;
    }

    state.isLoading = true;

    const idsToFetch: number[] = [];
    if (isAscending) {
      const batchEnd = Math.min(state.nextTokenId + batchSize, totalSupply);
      for (let id = state.nextTokenId; id < batchEnd; id += 1) {
        idsToFetch.push(id);
      }
      state.nextTokenId = batchEnd;
    } else {
      const batchEnd = Math.max(state.nextTokenId - batchSize + 1, -1);
      for (let id = state.nextTokenId; id > batchEnd; id -= 1) {
        idsToFetch.push(id);
      }
      state.nextTokenId = batchEnd;
    }

    const results = await fetchMetadataBatch(idsToFetch);
    state.items.push(...results.filter((item): item is Metadata => item !== null));

    if ((isAscending && state.nextTokenId >= totalSupply) || (!isAscending && state.nextTokenId < 0)) {
      state.allLoaded = true;
    }

    state.isLoading = false;
  };

  /**
   * Repeatedly fetch batches until all metadata has been loaded or a
   * fetch is already in progress. Useful for preloading everything.
   */
  const fetchAllRemainingMetadata = async (): Promise<void> => {
    if (state.isLoading) {
      return;
    }

    while (!state.allLoaded) {
      const before = state.items.length;
      await fetchBatch();
      if (state.items.length === before && state.allLoaded) {
        break;
      }
    }
  };

  return {
    /** Current array of loaded `Metadata` items. */
    get items() {
      return state.items;
    },
    /** Whether a fetch operation is currently in progress. */
    get isLoading() {
      return state.isLoading;
    },
    /** Next token id that will be used for the following batch fetch. */
    get nextTokenId() {
      return state.nextTokenId;
    },
    /** True when all metadata (based on `totalSupply`) has been attempted. */
    get allLoaded() {
      return state.allLoaded;
    },
    /** Number of successfully downloaded metadata entries. */
    get downloadedCount() {
      return state.items.length;
    },
    /** Items grouped into rows of `groupSize` for UI consumption. */
    get groupedItems() {
      return groupItemsIntoRows(state.items, groupSize);
    },
    fetchMetadata,
    fetchMetadataBatch,
    fetchBatch,
    fetchAllRemainingMetadata
  };
}
