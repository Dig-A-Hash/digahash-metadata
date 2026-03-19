import type { Metadata, MetadataContent } from './types';

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

export const getPublicAttributeValue = getMetadataAttributeValue;
