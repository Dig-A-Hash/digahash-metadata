import type { Metadata, MetadataContent, SupplyCount } from './types';

/**
 * Split a flat array into rows of a given size.
 *
 * Useful for grid layouts that expect an array-of-arrays (rows).
 * The `rowSize` is normalized to an integer >= 1.
 *
 * @typeParam T - Item type contained in the input array.
 * @param items - Readonly array of items to group.
 * @param rowSize - Desired number of items per row (default: 4).
 * @returns Array of rows where each row is an array of `T`.
 */
export function groupItemsIntoRows<T>(items: readonly T[], rowSize = 4): T[][] {
  const normalizedRowSize = Number.isFinite(rowSize) ? Math.max(1, Math.floor(rowSize)) : 1;
  const rows: T[][] = [];

  for (let index = 0; index < items.length; index += normalizedRowSize) {
    rows.push(items.slice(index, index + normalizedRowSize));
  }

  return rows;
}

/**
 * Read a named attribute value from metadata.
 *
 * The function accepts either a `Metadata` object (containing a `metaData`
 * property) or a bare `MetadataContent` object. If the attribute is not
 * present or the metadata is falsy, `null` is returned.
 *
 * @param metadata - `Metadata` or `MetadataContent` to read from.
 * @param attributeName - The attribute `trait_type` name to find.
 * @returns The attribute `value` as string, or `null` when not found.
 */
export function getMetadataAttributeValue(
  metadata: Metadata | MetadataContent | null | undefined,
  attributeName: string
): string | null {
  if (!metadata) {
    return null;
  }

  const attributes = 'metaData' in metadata ? metadata.metaData?.attributes : metadata.attributes;
  if (!attributes) {
    return null;
  }

  const attribute = attributes.find((item) => item.trait_type === attributeName);
  return attribute?.value ?? null;
}

/** Alias kept for compatibility with public-facing code. */
export const getPublicAttributeValue = getMetadataAttributeValue;

/**
 * Fetch supply counts from a remote URL and return the parsed array.
 * Pure helper: does not read env vars or mutate any application state.
 *
 * @param url - Endpoint returning JSON array of `SupplyCount`.
 * @param fetcher - Optional `fetch` implementation (useful for testing).
 * @returns Parsed `SupplyCount[]` on success.
 */
export async function fetchSupplyCounts(
  url: string,
  fetcher: typeof fetch = fetch
): Promise<SupplyCount[]> {
  const res = await fetcher(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch supply counts: ${res.status}`);
  }

  const raw = await res.json();
  if (!Array.isArray(raw)) {
    throw new Error('Unexpected response format: expected an array of supply counts');
  }

  // Normalize legacy and new payload shapes into the preferred shape
  const normalized: SupplyCount[] = raw.map((item: any) => {
    const user: string | undefined = item.user ?? item.contractOwner;
    const folder: string | undefined = item.folder ?? item.contractAddress;
    const chainId: number = Number(item.chainId);
    const count: number = Number(item.count);

    if (!user || !folder || Number.isNaN(chainId) || Number.isNaN(count)) {
      throw new Error('Invalid supply count entry: missing required fields');
    }

    return {
      // provide both forms so downstream TS/JS consumers can pick either
      user,
      folder,
      contractOwner: item.contractOwner,
      contractAddress: item.contractAddress,
      chainId,
      count
    } as SupplyCount;
  });

  return normalized;
}
