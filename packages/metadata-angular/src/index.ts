import { Injectable, computed, signal } from '@angular/core';
import {
  createMetadataState,
  getMetadataAttributeValue,
  type CreateMetadataStateOptions,
  type Metadata,
  type MetadataState
} from '@digahash/metadata-core';

@Injectable({ providedIn: 'root' })
export class MetadataService {
  private coreState: MetadataState | null = null;
  private readonly itemsSignal = signal<Metadata[]>([]);
  private readonly isLoadingSignal = signal(false);
  private readonly allLoadedSignal = signal(false);
  private readonly nextTokenIdSignal = signal(0);

  readonly items = computed(() => this.itemsSignal());
  readonly isLoading = computed(() => this.isLoadingSignal());
  readonly allLoaded = computed(() => this.allLoadedSignal());
  readonly nextTokenId = computed(() => this.nextTokenIdSignal());
  readonly downloadedCount = computed(() => this.itemsSignal().length);
  readonly groupedNfts = computed(() => (this.coreState ? this.coreState.groupedNfts : []));

  initialize(options: CreateMetadataStateOptions): void {
    this.coreState = createMetadataState(options);
    this.sync();
  }

  async fetchBatch(): Promise<void> {
    const coreState = this.getCoreState();
    await coreState.fetchBatch();
    this.sync();
  }

  async fetchAllRemainingMetadata(): Promise<void> {
    const coreState = this.getCoreState();
    await coreState.fetchAllRemainingMetadata();
    this.sync();
  }

  fetchMetadataBatch(tokenIds: number[]) {
    const coreState = this.getCoreState();
    return coreState.fetchMetadataBatch(tokenIds);
  }

  fetchMetadata(tokenId: number) {
    const coreState = this.getCoreState();
    return coreState.fetchMetadata(tokenId);
  }

  getMetadataAttributeValue = getMetadataAttributeValue;

  private sync(): void {
    const coreState = this.getCoreState();
    this.itemsSignal.set([...coreState.items]);
    this.isLoadingSignal.set(coreState.isLoading);
    this.allLoadedSignal.set(coreState.allLoaded);
    this.nextTokenIdSignal.set(coreState.nextTokenId);
  }

  private getCoreState(): MetadataState {
    if (!this.coreState) {
      throw new Error('MetadataService is not initialized. Call initialize(options) first.');
    }

    return this.coreState;
  }
}

export function createMetadataService(options: CreateMetadataStateOptions): MetadataState {
  return createMetadataState(options);
}

export { getMetadataAttributeValue, getPublicAttributeValue } from '@digahash/metadata-core';
export type {
  CreateMetadataStateOptions,
  Metadata,
  MetadataAttribute,
  MetadataContent,
  UseMetadataOptions
} from '@digahash/metadata-core';
