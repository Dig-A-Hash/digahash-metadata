import { createMetadataState } from '@digahash/metadata-core';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) {
  throw new Error('App root not found');
}

const state = createMetadataState({
  user: 'dig-a-hash',
  folder: 'demo',
  totalSupply: 25,
  batchSize: 5,
  isAscending: true
});

const render = () => {
  app.innerHTML = `
    <main style="font-family: sans-serif; max-width: 680px; margin: 2rem auto; line-height: 1.5;">
      <h1>Vanilla Metadata Demo</h1>
      <p>Downloaded: <strong>${state.downloadedCount}</strong></p>
      <p>Loading: <strong>${state.isLoading ? 'yes' : 'no'}</strong></p>
      <p>All loaded: <strong>${state.allLoaded ? 'yes' : 'no'}</strong></p>
      <button id="load">Fetch Next Batch</button>
      <pre style="background: #f6f6f6; padding: 1rem; overflow: auto;">${JSON.stringify(state.items.slice(0, 2), null, 2)}</pre>
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
