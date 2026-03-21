import { createApp } from 'vue';
import App from './App.vue';
import { fetchSupplyCounts } from '@digahash/metadata-vue';

async function bootstrap() {
    const countsUrl = 'https://nft.dig-a-hash.com/profiles/wgoqc/meta-data/counts2.json';
    let totalSupply = 0;
    try {
        const counts = await fetchSupplyCounts(countsUrl);
        const news = counts.find((c) => c.folder === 'news');
        totalSupply = news?.count ?? 0;
    } catch {
        totalSupply = 0;
    }

    createApp(App, { totalSupply }).mount('#app');
}

void bootstrap();
