import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createMetadataService } from '@digahash/metadata-angular';
import './styles.css';

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

      <section *ngIf="items().length" class="card-grid">
        <article *ngFor="let item of items()" class="card">
          <header class="card-header">
            <span class="token-id">#{{ item.tokenId }}</span>
            <h2>{{ item.metaData.name }}</h2>
          </header>
          <div class="image-frame">
            <img *ngIf="item.metaData.image" [src]="item.metaData.image" [alt]="item.metaData.name" class="card-image" />
            <div *ngIf="!item.metaData.image" class="image-placeholder">No image</div>
          </div>
        </article>
      </section>

      <p *ngIf="!items().length" class="empty-state">Fetch a batch to preview the cards.</p>
    </main>
  `
})
class AppComponent {
  private readonly metadata = createMetadataService({
    user: 'wgoqc',
    folder: 'news',
    totalSupply: 90,
    batchSize: 10,
    isAscending: true,
    startTokenId: 0,
    baseUrl: 'https://nft.dig-a-hash.com/profiles',
    chainId: 137
  });

  readonly downloadedCount = signal(this.metadata.downloadedCount);
  readonly isLoading = signal(this.metadata.isLoading);
  readonly allLoaded = signal(this.metadata.allLoaded);
  readonly preview = signal(JSON.stringify(this.metadata.items.slice(0, 2), null, 2));
  readonly items = signal(this.metadata.items);

  async loadBatch(): Promise<void> {
    await this.metadata.fetchBatch();
    this.downloadedCount.set(this.metadata.downloadedCount);
    this.isLoading.set(this.metadata.isLoading);
    this.allLoaded.set(this.metadata.allLoaded);
    this.preview.set(JSON.stringify(this.metadata.items.slice(0, 2), null, 2));
    this.items.set(this.metadata.items);
  }
}

bootstrapApplication(AppComponent).catch((error: unknown) => {
  console.error(error);
});
