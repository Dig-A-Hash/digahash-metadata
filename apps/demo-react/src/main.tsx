import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { fetchSupplyCounts } from '@digahash/metadata-react';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

async function bootstrap() {
  const countsUrl = 'https://nft.dig-a-hash.com/profiles/wgoqc/meta-data/counts2.json';
  let totalSupply = 0;
  try {
    const counts = await fetchSupplyCounts(countsUrl);
    const news = counts.find((c) => c.folder === 'news');
    totalSupply = news?.count ?? 0;
  } catch (e) {
    totalSupply = 0;
  }

  createRoot(rootElement).render(
    <StrictMode>
      <App totalSupply={totalSupply} />
    </StrictMode>
  );
}

void bootstrap();
