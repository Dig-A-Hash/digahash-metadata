import { describe, it, expect } from 'vitest';
import { createMetadataState } from '../src/state';

function makeFetcher(successIds: Set<number>) {
    return async (input: RequestInfo | URL) => {
        const url = String(input);
        const match = url.match(/(\d+)\.json$/);
        const id = match ? Number(match[1]) : NaN;

        const ok = Number.isFinite(id) && successIds.has(id);
        return {
            ok,
            status: ok ? 200 : 404,
            json: async () => ({ name: ok ? `item-${id}` : null })
        } as Response;
    };
}

describe('createMetadataState (fetchMetadata / fetchBatch / fetchAllRemainingMetadata)', () => {
    it('fetchMetadata returns Metadata on success and null on failure', async () => {
        const fetcher = makeFetcher(new Set([0]));
        const state = createMetadataState({
            user: 'u',
            folder: 'f',
            totalSupply: 3,
            batchSize: 1,
            isAscending: true,
            startTokenId: 0,
            fetcher
        });

        const ok = await state.fetchMetadata(0);
        expect(ok).not.toBeNull();
        expect(ok?.tokenId).toBe(0);
        expect(ok?.metaData.name).toBe('item-0');

        const missing = await state.fetchMetadata(1);
        expect(missing).toBeNull();
    });

    it('fetchBatch advances nextTokenId and appends only successful items (ascending)', async () => {
        const fetcher = makeFetcher(new Set([0, 1]));
        const state = createMetadataState({
            user: 'u',
            folder: 'f',
            totalSupply: 4,
            batchSize: 2,
            isAscending: true,
            startTokenId: 0,
            fetcher
        });

        expect(state.downloadedCount).toBe(0);
        await state.fetchBatch();
        expect(state.downloadedCount).toBe(2);
        expect(state.nextTokenId).toBe(2);
        expect(state.allLoaded).toBe(false);
    });

    it('fetchBatch sets allLoaded when end is reached', async () => {
        const fetcher = makeFetcher(new Set([0, 1]));
        const state = createMetadataState({
            user: 'u',
            folder: 'f',
            totalSupply: 2,
            batchSize: 2,
            isAscending: true,
            startTokenId: 0,
            fetcher
        });

        await state.fetchBatch();
        expect(state.allLoaded).toBe(true);
        expect(state.nextTokenId).toBe(2);
    });

    it('fetchAllRemainingMetadata loads all remaining items', async () => {
        const fetcher = makeFetcher(new Set([0, 1, 2]));
        const state = createMetadataState({
            user: 'u',
            folder: 'f',
            totalSupply: 3,
            batchSize: 1,
            isAscending: true,
            startTokenId: 0,
            fetcher
        });

        await state.fetchAllRemainingMetadata();
        expect(state.downloadedCount).toBe(3);
        expect(state.allLoaded).toBe(true);
    });

    it('fetchBatch works descending (isAscending=false) and sets allLoaded', async () => {
        // descending from totalSupply-1 downwards
        const fetcher = makeFetcher(new Set([3, 2]));
        const state = createMetadataState({
            user: 'u',
            folder: 'f',
            totalSupply: 4,
            batchSize: 2,
            isAscending: false,
            startTokenId: 3,
            fetcher
        });

        expect(state.nextTokenId).toBe(3);
        await state.fetchBatch();
        // implementation fetches the first id (3) for the first descending batch
        expect(state.downloadedCount).toBe(1);
        expect(state.nextTokenId).toBe(2);
        expect(state.allLoaded).toBe(false);

        // advance until loader marks allLoaded (ids 1 and 0 will be attempted but mocked to fail)
        while (!state.allLoaded) {
            // eslint-disable-next-line no-await-in-loop
            await state.fetchBatch();
        }
        expect(state.allLoaded).toBe(true);
    });

    it('partial failures in batch only append successful items', async () => {
        const fetcher = makeFetcher(new Set([0]));
        const state = createMetadataState({
            user: 'u',
            folder: 'f',
            totalSupply: 3,
            batchSize: 3,
            isAscending: true,
            startTokenId: 0,
            fetcher
        });

        await state.fetchBatch();
        // only id 0 succeeded
        expect(state.downloadedCount).toBe(1);
        expect(state.items[0].tokenId).toBe(0);
    });

    it('groupedItems groups items into rows of groupSize', async () => {
        const fetcher = makeFetcher(new Set([0, 1, 2, 3]));
        const state = createMetadataState({
            user: 'u',
            folder: 'f',
            totalSupply: 4,
            batchSize: 4,
            isAscending: true,
            startTokenId: 0,
            groupSize: 2,
            fetcher
        });

        await state.fetchBatch();
        const groups = state.groupedItems;
        expect(groups.length).toBe(2);
        expect(groups[0].length).toBe(2);
    });

    it('handles zero or negative totalSupply by marking allLoaded', async () => {
        const fetcher = makeFetcher(new Set());
        const stateZero = createMetadataState({
            user: 'u',
            folder: 'f',
            totalSupply: 0,
            batchSize: 1,
            isAscending: true,
            startTokenId: 0,
            fetcher
        });
        await stateZero.fetchBatch();
        expect(stateZero.allLoaded).toBe(true);

        const stateNeg = createMetadataState({
            user: 'u',
            folder: 'f',
            totalSupply: -1,
            batchSize: 1,
            isAscending: false,
            startTokenId: 0,
            fetcher
        });
        await stateNeg.fetchBatch();
        expect(stateNeg.allLoaded).toBe(true);
    });
});
