import { describe, it, expect } from 'vitest';
import { getMetadataAttributeValue, getPublicAttributeValue } from '../src/utils';

describe('getMetadataAttributeValue', () => {
    it('returns null for null/undefined metadata', () => {
        expect(getMetadataAttributeValue(null, 'any')).toBeNull();
        expect(getMetadataAttributeValue(undefined, 'any')).toBeNull();
    });

    it('returns null when attributes array is missing', () => {
        // object without attributes
        const bare = { foo: 'bar' } as any;
        expect(getMetadataAttributeValue(bare, 'x')).toBeNull();

        // wrapper object with no metaData
        const wrapped = { metaData: null } as any;
        expect(getMetadataAttributeValue(wrapped, 'x')).toBeNull();
    });

    it('reads attribute from Metadata wrapper (metaData.attributes)', () => {
        const metadata = {
            metaData: {
                attributes: [
                    { trait_type: 'rarity', value: 'gold' }
                ]
            }
        } as any;

        expect(getMetadataAttributeValue(metadata, 'rarity')).toBe('gold');
        expect(getMetadataAttributeValue(metadata, 'missing')).toBeNull();
    });

    it('reads attribute from bare MetadataContent (attributes)', () => {
        const content = {
            attributes: [
                { trait_type: 'size', value: 'large' }
            ]
        } as any;

        expect(getMetadataAttributeValue(content, 'size')).toBe('large');
    });

    it('alias getPublicAttributeValue behaves identically', () => {
        const content = {
            attributes: [
                { trait_type: 'score', value: 0 }
            ]
        } as any;

        const a = getMetadataAttributeValue(content, 'score');
        const b = getPublicAttributeValue(content, 'score');
        expect(a).toEqual(b);
        // allow non-string values and ensure returned value matches stored value
        expect((a as any)).toBe(0);
    });
});
