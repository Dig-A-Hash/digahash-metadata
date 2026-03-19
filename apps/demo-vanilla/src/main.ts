import { createMetadataState } from '@digahash/metadata-core';
import './styles.css';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) {
  throw new Error('App root not found');
}

const state = createMetadataState({
  user: 'wgoqc',
  folder: 'news',
  totalSupply: 90,
  batchSize: 50,
  isAscending: true,
  startTokenId: 0,
  baseUrl: 'https://nft.dig-a-hash.com/profiles',
  chainId: 137
});

const render = () => {
  const itemsHtml = state.items.length
    ? state.items
      .map((item) => {
        const image = item.metaData.image
          ? `<img src="${item.metaData.image}" alt="${(item.metaData.name ?? '').replace(/"/g, '&quot;')}" class="card-image">`
          : `<div class="image-placeholder">No image</div>`;

        return `
            <article class="card">
              <header class="card-header">
                <span class="token-id">#${item.tokenId}</span>
                <h2>${(item.metaData.name ?? '').replace(/</g, '&lt;')}</h2>
              </header>
              <div class="image-frame">${image}</div>
            </article>
          `;
      })
      .join('\n')
    : '';

  app.innerHTML = `
    <main class="page">
      <h1>Vanilla Metadata Demo</h1>

      <div class="status-row">
        <p>Downloaded: <strong>${state.downloadedCount}</strong></p>
        <p>Loading: <strong>${state.isLoading ? 'yes' : 'no'}</strong></p>
        <p>Entire collection requested: <strong>${state.allLoaded ? 'yes' : 'no'}</strong></p>
      </div>

      <button id="load" class="fetch-button" ${state.isLoading ? 'disabled' : ''}>${state.isLoading ? 'Fetching...' : 'Fetch Next Batch'}</button>

      ${state.items.length ? `<section class="card-grid">${itemsHtml}</section>` : `<p class="empty-state">Fetch a batch to preview the cards.</p>`}
    </main>
  `;

  const loadButton = document.querySelector<HTMLButtonElement>('#load');
  if (loadButton) {
    loadButton.onclick = async () => {
      await state.fetchBatch();
      render();
    };
  }
};

render();
