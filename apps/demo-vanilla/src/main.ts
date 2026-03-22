import { createMetadataState, groupItemsIntoRows, fetchSupplyCounts, getMetadataAttributeValue } from '@digahash/metadata-core';
import './styles.css';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) {
  throw new Error('App root not found');
}

let state = createMetadataState({
  user: 'wgoqc',
  folder: 'news',
  totalSupply: 0,
  batchSize: 10,
  isAscending: true,
  startTokenId: 0,
  baseUrl: 'https://nft.dig-a-hash.com/profiles',
  chainId: 137
});

async function initCounts() {
  try {
    const countsUrl = 'https://nft.dig-a-hash.com/profiles/wgoqc/meta-data/counts2.json';
    const counts = await fetchSupplyCounts(countsUrl);
    const news = counts.find((c) => c.folder === 'news');
    const totalSupply = news?.count ?? 0;
    state = createMetadataState({
      user: 'wgoqc',
      folder: 'news',
      totalSupply,
      batchSize: 10,
      isAscending: true,
      startTokenId: 0,
      baseUrl: 'https://nft.dig-a-hash.com/profiles',
      chainId: 137
    });
    render();
  } catch {
    render();
  }
}

void initCounts();

const render = () => {
  const rowsHtml = groupItemsIntoRows(state.items, 4)
    .map((row) => {
      const itemsHtml = row
        .map((item) => {
          const image = item.metaData.image
            ? `<img src="${item.metaData.image}" alt="${(item.metaData.name ?? '').replace(/"/g, '&quot;')}" class="card-image">`
            : `<div class="image-placeholder">No image</div>`;
          const dateAdded = getMetadataAttributeValue(item.metaData, 'date-added');
          const dateHtml = dateAdded ? `<div class="date-added">${dateAdded}</div>` : '';

          return `
              <article class="card">
                <header class="card-header">
                  <span class="token-id">#${item.tokenId}</span>
                  <h2>${(item.metaData.name ?? '').replace(/</g, '&lt;')}</h2>
                </header>
                <div class="image-frame">${image}</div>
                ${dateHtml}
              </article>
            `;
        })
        .join('\n');

      return `<div class="card-row">${itemsHtml}</div>`;
    })
    .join('\n');

  app.innerHTML = `
    <main class="page">
      <h1>Vanilla Metadata Demo</h1>

      <div class="status-row">
        <p>Downloaded: <strong>${state.downloadedCount}</strong></p>
        <p>Loading: <strong>${state.isLoading ? 'yes' : 'no'}</strong></p>
        <p>Entire collection requested: <strong>${state.allLoaded ? 'yes' : 'no'}</strong></p>
      </div>

      <button id="load" class="fetch-button" ${state.isLoading ? 'disabled' : ''}>${state.isLoading ? 'Fetching...' : 'Fetch Next Batch'}</button>

      ${rowsHtml ? `<section class="card-rows">${rowsHtml}</section>` : `<p class="empty-state">Fetch a batch to preview the cards.</p>`}
    </main>
  `;

  const loadButton = document.querySelector<HTMLButtonElement>('#load');
  if (loadButton) {
    loadButton.onclick = async () => {
      const inFlight = state.fetchBatch();
      render();
      await inFlight;
      render();
    };
  }
};

// initial render will be invoked after counts init (or immediately if it fails)
