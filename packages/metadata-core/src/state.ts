import type { CreateMetadataStateOptions, Metadata, MetadataState } from './types';

const DEFAULT_BASE_URL = 'https://nft.dig-a-hash.com/profiles';
const DEFAULT_CHAIN_ID = 137;
const DEFAULT_GROUP_SIZE = 4;

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

  const fetchMetadataBatch = async (tokenIds: number[]): Promise<(Metadata | null)[]> => {
    return Promise.all(tokenIds.map((id) => fetchMetadata(id)));
  };

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
    get items() {
      return state.items;
    },
    get isLoading() {
      return state.isLoading;
    },
    get nextTokenId() {
      return state.nextTokenId;
    },
    get allLoaded() {
      return state.allLoaded;
    },
    get downloadedCount() {
      return state.items.length;
    },
    get groupedNfts() {
      const rows: Metadata[][] = [];
      for (let i = 0; i < state.items.length; i += groupSize) {
        rows.push(state.items.slice(i, i + groupSize));
      }
      return rows;
    },
    fetchMetadata,
    fetchMetadataBatch,
    fetchBatch,
    fetchAllRemainingMetadata
  };
}
