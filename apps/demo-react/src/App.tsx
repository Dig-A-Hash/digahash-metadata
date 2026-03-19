import { useMetadata } from '@digahash/metadata-react';

export function App() {
  const metadata = useMetadata({
    user: 'dig-a-hash',
    folder: 'demo',
    totalSupply: 25,
    batchSize: 5,
    isAscending: true
  });

  return (
    <main style={{ fontFamily: 'sans-serif', maxWidth: 680, margin: '2rem auto', lineHeight: 1.5 }}>
      <h1>React Metadata Demo</h1>
      <p>Downloaded: <strong>{metadata.downloadedCount}</strong></p>
      <p>Loading: <strong>{metadata.isLoading ? 'yes' : 'no'}</strong></p>
      <p>All loaded: <strong>{metadata.allLoaded ? 'yes' : 'no'}</strong></p>
      <button onClick={() => void metadata.fetchBatch()}>Fetch Next Batch</button>
      <pre style={{ background: '#f6f6f6', padding: '1rem', overflow: 'auto' }}>
        {JSON.stringify(metadata.items.slice(0, 2), null, 2)}
      </pre>
    </main>
  );
}
