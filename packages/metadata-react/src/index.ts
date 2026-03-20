import { useCallback, useMemo, useRef, useState } from 'react';
import {
  createMetadataState,
  getMetadataAttributeValue,
  type CreateMetadataStateOptions,
  type Metadata,
  type MetadataState
} from '@digahash/metadata-core';

interface MetadataSnapshot {
  items: Metadata[];
  isLoading: boolean;
  allLoaded: boolean;
  nextTokenId: number;
  downloadedCount: number;
  groupedItems: Metadata[][];
}

function snapshot(state: MetadataState): MetadataSnapshot {
  return {
    items: [...state.items],
    isLoading: state.isLoading,
    allLoaded: state.allLoaded,
    nextTokenId: state.nextTokenId,
    downloadedCount: state.downloadedCount,
    groupedItems: state.groupedItems
  };
}

export function useMetadata(options: CreateMetadataStateOptions) {
  const stateRef = useRef<MetadataState | null>(null);
  if (!stateRef.current) {
    stateRef.current = createMetadataState(options);
  }

  const state = stateRef.current;
  const [view, setView] = useState<MetadataSnapshot>(() => snapshot(state));

  const sync = useCallback(() => {
    setView(snapshot(state));
  }, [state]);

  const fetchBatch = useCallback(async () => {
    await state.fetchBatch();
    sync();
  }, [state, sync]);

  const fetchAllRemainingMetadata = useCallback(async () => {
    await state.fetchAllRemainingMetadata();
    sync();
  }, [state, sync]);

  const fetchMetadataBatch = useCallback((tokenIds: number[]) => {
    return state.fetchMetadataBatch(tokenIds);
  }, [state]);

  const fetchMetadata = useCallback((tokenId: number) => {
    return state.fetchMetadata(tokenId);
  }, [state]);

  return useMemo(() => ({
    ...view,
    fetchBatch,
    fetchAllRemainingMetadata,
    fetchMetadataBatch,
    fetchMetadata,
    getMetadataAttributeValue
  }), [view, fetchBatch, fetchAllRemainingMetadata, fetchMetadataBatch, fetchMetadata]);
}

export { getMetadataAttributeValue, getPublicAttributeValue, groupItemsIntoRows } from '@digahash/metadata-core';
export type {
  CreateMetadataStateOptions,
  Metadata,
  MetadataAttribute,
  MetadataContent,
  UseMetadataOptions
} from '@digahash/metadata-core';
