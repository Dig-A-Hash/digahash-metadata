import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { Component, signal } from '@angular/core';
import { createMetadataService } from '@digahash/metadata-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <main style="max-width: 680px; margin: 2rem auto; line-height: 1.5;">
      <h1>Angular Metadata Demo</h1>
      <p>Downloaded: <strong>{{ downloadedCount() }}</strong></p>
      <p>Loading: <strong>{{ isLoading() ? 'yes' : 'no' }}</strong></p>
      <p>All loaded: <strong>{{ allLoaded() ? 'yes' : 'no' }}</strong></p>
      <button (click)="loadBatch()">Fetch Next Batch</button>
      <pre style="background: #f6f6f6; padding: 1rem; overflow: auto;">{{ preview() }}</pre>
    </main>
  `
})
class AppComponent {
  private readonly metadata = createMetadataService({
    user: 'dig-a-hash',
    folder: 'demo',
    totalSupply: 25,
    batchSize: 5,
    isAscending: true
  });

  readonly downloadedCount = signal(this.metadata.downloadedCount);
  readonly isLoading = signal(this.metadata.isLoading);
  readonly allLoaded = signal(this.metadata.allLoaded);
  readonly preview = signal(JSON.stringify(this.metadata.items.slice(0, 2), null, 2));

  async loadBatch(): Promise<void> {
    await this.metadata.fetchBatch();
    this.downloadedCount.set(this.metadata.downloadedCount);
    this.isLoading.set(this.metadata.isLoading);
    this.allLoaded.set(this.metadata.allLoaded);
    this.preview.set(JSON.stringify(this.metadata.items.slice(0, 2), null, 2));
  }
}

bootstrapApplication(AppComponent).catch((error: unknown) => {
  console.error(error);
});
