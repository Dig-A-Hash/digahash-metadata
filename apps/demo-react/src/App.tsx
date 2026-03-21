import { groupItemsIntoRows, useMetadata } from '@digahash/metadata-react';
import './styles.css';

export function App(props: { totalSupply?: number }) {
  const metadata = useMetadata({
    user: 'wgoqc',
    folder: 'news',
    totalSupply: props.totalSupply ?? 0,
    batchSize: 10,
    isAscending: true,
    startTokenId: 0,
    baseUrl: 'https://nft.dig-a-hash.com/profiles',
    chainId: 137
  });

  const groupedItems = groupItemsIntoRows(metadata.items, 4);

  return (
    <main className="page">
      <h1>React Metadata Demo</h1>

      <div className="status-row">
        <p>Downloaded: <strong>{metadata.downloadedCount}</strong></p>
        <p>Loading: <strong>{metadata.isLoading ? 'yes' : 'no'}</strong></p>
        <p>Entire collection requested: <strong>{metadata.allLoaded ? 'yes' : 'no'}</strong></p>
      </div>

      <button className="fetch-button" disabled={metadata.isLoading} onClick={() => void metadata.fetchBatch()}>
        {metadata.isLoading ? 'Fetching...' : 'Fetch Next Batch'}
      </button>

      {groupedItems.length ? (
        <section className="card-rows">
          {groupedItems.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="card-row">
              {row.map((item) => (
                <article key={item.tokenId} className="card">
                  <header className="card-header">
                    <span className="token-id">#{item.tokenId}</span>
                    <h2>{item.metaData.name}</h2>
                  </header>

                  <div className="image-frame">
                    {item.metaData.image ? (
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore allow string image URLs
                      <img src={item.metaData.image} alt={item.metaData.name} className="card-image" />
                    ) : (
                      <div className="image-placeholder">No image</div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ))}
        </section>
      ) : (
        <p className="empty-state">Fetch a batch to preview the cards.</p>
      )}
    </main>
  );
}
