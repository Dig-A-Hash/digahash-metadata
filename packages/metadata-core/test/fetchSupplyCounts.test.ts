import { describe, it, expect } from 'vitest';
import { fetchSupplyCounts } from '../src/utils';

function makeFetcher(payload: any): typeof fetch {
    return async (_input: RequestInfo | URL, _init?: RequestInit) => ({
        ok: true,
        status: 200,
        json: async () => payload
    } as Response);
}

describe('fetchSupplyCounts', () => {
    it('normalizes new payload shape (user + folder)', async () => {
        const payload = [
            { user: 'alice', folder: 'news', chainId: '1', count: '10' }
        ];

        const res = await fetchSupplyCounts('http://example.test/counts.json', makeFetcher(payload));
        expect(res).toHaveLength(1);
        expect(res[0].user).toBe('alice');
        expect(res[0].folder).toBe('news');
        expect(res[0].chainId).toBe(1);
        expect(res[0].count).toBe(10);
    });

    it('normalizes legacy payload shape (contractOwner + contractAddress)', async () => {
        const payload = [
            { contractOwner: 'bob', contractAddress: 'news', chainId: 2, count: 5 }
        ];

        const res = await fetchSupplyCounts('http://example.test/counts.json', makeFetcher(payload));
        expect(res).toHaveLength(1);
        expect(res[0].user).toBe('bob');
        // legacy contractAddress should be present as folder
        expect(res[0].folder).toBe('news');
        expect(res[0].chainId).toBe(2);
        expect(res[0].count).toBe(5);
    });

    it('skips invalid entries and returns only valid normalized entries', async () => {
        const payload = [
            { user: 'valid', folder: 'news', chainId: '1', count: '3' },
            { user: null, folder: 'bad', chainId: 1, count: 2 },
            { contractOwner: 'also-valid', contractAddress: 'old', chainId: '3', count: '7' },
            { contractOwner: 'missing-count', contractAddress: 'x' }
        ];

        const res = await fetchSupplyCounts('http://example.test/counts.json', makeFetcher(payload));
        expect(res.map((r) => r.user)).toEqual(['valid', 'also-valid']);
        expect(res.map((r) => r.folder)).toEqual(['news', 'old']);
        expect(res).toHaveLength(2);
    });
});
