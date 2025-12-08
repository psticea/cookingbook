import { describe, it, expect } from 'vitest';
import { hasCommonSubstring, findMatchingIngredient, getAllMatches } from '../utils/fuzzyMatch';

describe('fuzzyMatch', () => {
  describe('hasCommonSubstring', () => {
    it('finds 4+ letter common substrings', () => {
      expect(hasCommonSubstring('olive oil', 'olive')).toBe(true);
      expect(hasCommonSubstring('white flour', 'flour_white')).toBe(true);
      expect(hasCommonSubstring('extra virgin olive oil', 'olive_oil')).toBe(true);
    });

    it('rejects substrings shorter than 4 letters', () => {
      expect(hasCommonSubstring('abc', 'xyz')).toBe(false);
      expect(hasCommonSubstring('egg', 'leg')).toBe(false);
    });

    it('is case insensitive', () => {
      expect(hasCommonSubstring('OLIVE OIL', 'olive')).toBe(true);
      expect(hasCommonSubstring('Butter', 'BUTTER')).toBe(true);
    });

    it('handles non-matching strings', () => {
      expect(hasCommonSubstring('salt', 'pepper')).toBe(false);
      expect(hasCommonSubstring('milk', 'water')).toBe(false);
    });
  });

  describe('findMatchingIngredient', () => {
    const pricesData = {
      olive_oil: { name: 'Olive oil' },
      flour_white: { name: 'White flour' },
      salt: { name: 'Salt' },
      pepper: { name: 'Black pepper' },
    };

    it('matches by key', () => {
      expect(findMatchingIngredient('olive oil', pricesData)).toBe('olive_oil');
      expect(findMatchingIngredient('flour', pricesData)).toBe('flour_white');
    });

    it('matches by name', () => {
      expect(findMatchingIngredient('white flour', pricesData)).toBe('flour_white');
      expect(findMatchingIngredient('black pepper', pricesData)).toBe('pepper');
    });

    it('returns longest match when multiple candidates exist', () => {
      expect(findMatchingIngredient('extra virgin olive oil', pricesData)).toBe('olive_oil');
    });

    it('returns undefined for no match', () => {
      expect(findMatchingIngredient('xyz', pricesData)).toBeUndefined();
      expect(findMatchingIngredient('ab', pricesData)).toBeUndefined();
    });

    it('is case insensitive', () => {
      expect(findMatchingIngredient('OLIVE OIL', pricesData)).toBe('olive_oil');
      expect(findMatchingIngredient('Salt', pricesData)).toBe('salt');
    });
  });

  describe('getAllMatches', () => {
    const pricesData = {
      olive_oil: { name: 'Olive oil' },
      vegetable_oil: { name: 'Vegetable oil' },
      salt: { name: 'Salt' },
    };

    it('returns all matches sorted by length', () => {
      const matches = getAllMatches('olive oil', pricesData);
      expect(matches.length).toBeGreaterThan(0);
      expect(matches[0].key).toBe('olive_oil');
    });

    it('returns empty array for no matches', () => {
      const matches = getAllMatches('xyz', pricesData);
      expect(matches).toEqual([]);
    });

    it('sorts by match length descending', () => {
      const matches = getAllMatches('oil', pricesData);
      if (matches.length > 1) {
        for (let i = 1; i < matches.length; i++) {
          expect(matches[i - 1].matchLength).toBeGreaterThanOrEqual(matches[i].matchLength);
        }
      }
    });
  });
});
