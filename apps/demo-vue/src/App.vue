<script setup lang="ts">
import { useMetadata } from '@digahash/metadata-vue';

const {
  items,
  isLoading,
  allLoaded,
  downloadedCount,
  fetchBatch
} = useMetadata({
  user: 'wgoqc',
  folder: 'news',
  totalSupply: 90,
  batchSize: 10,
  isAscending: true,
  startTokenId: 0,
  baseUrl: 'https://nft.dig-a-hash.com/profiles',
  chainId: 137
});

const loadBatch = async () => {
  await fetchBatch();
};
</script>

<template>
  <main class="page">
    <h1>Vue Metadata Demo</h1>
    <div class="status-row">
      <p>Downloaded: <strong>{{ downloadedCount }}</strong></p>
      <p>Loading: <strong>{{ isLoading ? 'yes' : 'no' }}</strong></p>
      <p>Entire collection requested: <strong>{{ allLoaded ? 'yes' : 'no' }}</strong></p>
    </div>

    <button class="fetch-button" :disabled="isLoading" @click="loadBatch">
      {{ isLoading ? 'Fetching...' : 'Fetch Next Batch' }}
    </button>

    <section v-if="items.length" class="card-grid">
      <article v-for="item in items" :key="item.tokenId" class="card">
        <header class="card-header">
          <span class="token-id">#{{ item.tokenId }}</span>
          <h2>{{ item.metaData.name }}</h2>
        </header>

        <div class="image-frame">
          <img v-if="item.metaData.image" :src="item.metaData.image" :alt="item.metaData.name" class="card-image">
          <div v-else class="image-placeholder">No image</div>
        </div>
      </article>
    </section>

    <p v-else class="empty-state">Fetch a batch to preview the cards.</p>
  </main>
</template>

<style scoped>
.page {
  max-width: 1100px;
  margin: 2rem auto;
  padding: 0 1rem 2rem;
  font-family: sans-serif;
  line-height: 1.5;
}

.status-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.status-row p {
  margin: 0;
}

.fetch-button {
  padding: 0.65rem 1rem;
  border: 1px solid #c9c9c9;
  border-radius: 0.5rem;
  background: #f5f5f5;
  cursor: pointer;
}

.fetch-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.card {
  border: 1px solid #dddddd;
  border-radius: 0.75rem;
  padding: 1rem;
  background: #ffffff;
}

.card-header {
  margin-bottom: 0.75rem;
}

.card-header h2 {
  margin: 0.25rem 0 0;
  font-size: 1rem;
}

.token-id {
  color: #666666;
  font-size: 0.9rem;
}

.image-frame {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 220px;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: #f7f7f7;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.image-placeholder {
  color: #777777;
}

.description {
  margin: 0.75rem 0 0;
}

.description :deep(p) {
  margin: 0 0 0.75rem;
}

.description :deep(p:last-child) {
  margin-bottom: 0;
}

.description :deep(a) {
  color: inherit;
}

.empty-state {
  margin-top: 1.5rem;
  color: #666666;
}
</style>
