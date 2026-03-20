import { computed, ref } from 'vue';
import {
  createMetadataState,
  getMetadataAttributeValue,
  type CreateMetadataStateOptions,
  type Metadata
} from '@digahash/metadata-core';

export function useMetadata(options: CreateMetadataStateOptions) {
  const state = createMetadataState(options);

  const items = ref<Metadata[]>([]);
  const isLoading = ref(false);
  const allLoaded = ref(false);
  const nextTokenId = ref(0);

  const syncFromCore = () => {
    items.value = [...state.items];
    isLoading.value = state.isLoading;
    allLoaded.value = state.allLoaded;
    nextTokenId.value = state.nextTokenId;
  };

  const fetchBatch = async () => {
    const inFlight = state.fetchBatch();
    syncFromCore();
    await inFlight;
    syncFromCore();
  };

  const fetchAllRemainingMetadata = async () => {
    const inFlight = state.fetchAllRemainingMetadata();
    syncFromCore();
    await inFlight;
    syncFromCore();
  };

  const fetchMetadataBatch = async (tokenIds: number[]) => {
    return state.fetchMetadataBatch(tokenIds);
  };

  const fetchMetadata = async (tokenId: number) => {
    return state.fetchMetadata(tokenId);
  };

  syncFromCore();

  const downloadedCount = computed(() => items.value.length);
  const groupedItems = computed(() => state.groupedItems);

  return {
    items,
    isLoading,
    allLoaded,
    nextTokenId,
    downloadedCount,
    groupedItems,
    fetchBatch,
    fetchAllRemainingMetadata,
    fetchMetadataBatch,
    fetchMetadata,
    getMetadataAttributeValue
  };
}

export { getMetadataAttributeValue, getPublicAttributeValue, groupItemsIntoRows } from '@digahash/metadata-core';
export type {
  CreateMetadataStateOptions,
  Metadata,
  MetadataAttribute,
  MetadataContent,
  UseMetadataOptions
} from '@digahash/metadata-core';
