import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createMetadataService, groupItemsIntoRows, fetchSupplyCounts } from '@digahash/metadata-angular';
import './styles.css';

const countsUrl = 'https://nft.dig-a-hash.com/profiles/wgoqc/meta-data/counts2.json';
let NEWS_TOTAL = 0;
try {
  const counts = await fetchSupplyCounts(countsUrl);
  const news = counts.find((c) => c.folder === 'news');
  NEWS_TOTAL = news?.count ?? 0;
} catch {
  NEWS_TOTAL = 0;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="page">
      <h1>Angular Metadata Demo</h1>

      <div class="status-row">
        <p>Downloaded: <strong>{{ downloadedCount() }}</strong></p>
        <p>Loading: <strong>{{ isLoading() ? 'yes' : 'no' }}</strong></p>
        <p>Entire collection requested: <strong>{{ allLoaded() ? 'yes' : 'no' }}</strong></p>
      </div>

      <button class="fetch-button" [disabled]="isLoading()" (click)="loadBatch()">{{ isLoading() ? 'Fetching...' : 'Fetch Next Batch' }}</button>

      <p *ngIf="lastError()" class="error-state">{{ lastError() }}</p>

      <section *ngIf="groupedItems().length" class="card-rows">
        <div *ngFor="let row of groupedItems()" class="card-row">
          <article *ngFor="let item of row" class="card">
            <header class="card-header">
              <span class="token-id">#{{ item.tokenId }}</span>
              <h2>{{ readName(item.metaData) }}</h2>
            </header>
            <div class="image-frame">
              <img *ngIf="readImage(item.metaData) as image" [src]="image" [alt]="readName(item.metaData)" class="card-image" />
              <div *ngIf="!readImage(item.metaData)" class="image-placeholder">No image</div>
            </div>
          </article>
        </div>
      </section>

      <p *ngIf="!groupedItems().length" class="empty-state">Fetch a batch to preview the cards.</p>
    </main>
  `
})
class AppComponent {
  private readonly metadata = createMetadataService({
    user: 'wgoqc',
    folder: 'news',
    totalSupply: NEWS_TOTAL,
    batchSize: 10,
    isAscending: true,
    startTokenId: 0,
    baseUrl: 'https://nft.dig-a-hash.com/profiles',
    chainId: 137
  });

  readonly downloadedCount = signal(this.metadata.downloadedCount);
  readonly isLoading = signal(this.metadata.isLoading);
  readonly allLoaded = signal(this.metadata.allLoaded);
  readonly lastError = signal<string | null>(null);
  readonly preview = signal(JSON.stringify(this.metadata.items.slice(0, 2), null, 2));
  readonly items = signal(this.metadata.items);
  readonly groupedItems = computed(() => groupItemsIntoRows(this.items(), 4));

  async loadBatch(): Promise<void> {
    this.lastError.set(null);
    try {
      await this.metadata.fetchBatch();
      this.downloadedCount.set(this.metadata.downloadedCount);
      this.isLoading.set(this.metadata.isLoading);
      this.allLoaded.set(this.metadata.allLoaded);
      this.preview.set(JSON.stringify(this.metadata.items.slice(0, 2), null, 2));
      this.items.set([...this.metadata.items]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch metadata batch.';
      this.lastError.set(message);
      console.error('Fetch batch failed', error);
    }
  }

  readName(metaData: unknown): string {
    if (!metaData || typeof metaData !== 'object') {
      return 'Untitled';
    }
    const name = (metaData as { name?: unknown }).name;
    return typeof name === 'string' && name.length > 0 ? name : 'Untitled';
  }

  readImage(metaData: unknown): string | null {
    if (!metaData || typeof metaData !== 'object') {
      return null;
    }
    const image = (metaData as { image?: unknown }).image;
    return typeof image === 'string' && image.length > 0 ? image : null;
  }
}

bootstrapApplication(AppComponent).catch((error: unknown) => {
  console.error(error);
});
