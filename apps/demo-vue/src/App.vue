<script setup lang="ts">
import { useMetadata } from '@digahash/metadata-vue';

const metadata = useMetadata({
  user: 'wgoqc',
  folder: 'news',
  totalSupply: 90,
  batchSize: 6,
  isAscending: true,
  startTokenId: 0,
  baseUrl: 'https://nft.dig-a-hash.com/profiles',
  chainId: 137
});

const loadBatch = async () => {
  await metadata.fetchBatch();
};
</script>

<template>
  <main style="font-family: sans-serif; max-width: 680px; margin: 2rem auto; line-height: 1.5;">
    <h1>Vue Metadata Demo</h1>
    <p>Downloaded: <strong>{{ metadata.downloadedCount }}</strong></p>
    <p>Loading: <strong>{{ metadata.isLoading ? 'yes' : 'no' }}</strong></p>
    <p>All loaded: <strong>{{ metadata.allLoaded ? 'yes' : 'no' }}</strong></p>
    <button @click="loadBatch">Fetch Next Batch</button>
    <pre
      style="background: #f6f6f6; padding: 1rem; overflow: auto;">{{ JSON.stringify(metadata.items.value.slice(0, 2), null, 2) }}</pre>
  </main>
</template>
