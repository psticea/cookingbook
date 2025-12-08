import { describe, it, expect } from 'vitest';
import {
  matchIngredient,
  calculateIngredientCost,
  calculateRecipeCosts,
  formatPrice,
  formatPricePerServing,
  formatTotalPrice,
  formatIngredientPrice
} from '../utils/pricing';

describe('Pricing Utilities', () => {
  describe('matchIngredient', () => {
    it('should match ingredient by key with fuzzy matching', () => {
      const result = matchIngredient('olive oil');
      expect(result).toBeTruthy();
      expect(result?.name).toBe('Extra virgin olive oil');
    });

    it('should match ingredient by name with fuzzy matching', () => {
      const result = matchIngredient('extra virgin olive oil');
      expect(result).toBeTruthy();
      expect(result?.name).toBe('Extra virgin olive oil');
    });

    it('should match with at least 4 consecutive letters', () => {
      const result = matchIngredient('garlic minced');
      expect(result).toBeTruthy();
      expect(result?.name).toBe('Garlic');
    });

    it('should return null when no match found', () => {
      const result = matchIngredient('xyz');
      expect(result).toBeNull();
    });

    it('should be case insensitive', () => {
      const result = matchIngredient('BUTTER');
      expect(result).toBeTruthy();
      expect(result?.name).toBe('Butter');
    });

    it('should ignore non-letter characters', () => {
      const result = matchIngredient('black-pepper');
      expect(result).toBeTruthy();
      expect(result?.name).toBe('Black pepper');
    });

    it('should prefer longest match', () => {
      const result = matchIngredient('chicken breast');
      expect(result).toBeTruthy();
      expect(result?.name).toBe('Chicken breast');
    });
  });

  describe('calculateIngredientCost', () => {
    it('should calculate cost for mass ingredients (grams)', () => {
      const result = calculateIngredientCost('butter', 100, 'g', 4);
      expect(result.matched).toBe(true);
      expect(result.totalCost).toBeCloseTo(1.2, 2); // (100/1000) * 12
      expect(result.costPerServing).toBeCloseTo(0.3, 2); // 1.2 / 4
    });

    it('should calculate cost for mass ingredients (kg)', () => {
      const result = calculateIngredientCost('flour', 1, 'kg', 4);
      expect(result.matched).toBe(false); // flour not in our test data
      expect(result.totalCost).toBe(0.8); // 0.2 * 4 (fallback)
      expect(result.costPerServing).toBe(0.2);
    });

    it('should calculate cost for volume ingredients (ml)', () => {
      const result = calculateIngredientCost('olive oil', 100, 'ml', 4);
      expect(result.matched).toBe(true);
      expect(result.totalCost).toBeCloseTo(2.5, 2); // (100/1000) * 25
      expect(result.costPerServing).toBeCloseTo(0.625, 2);
    });

    it('should calculate cost for volume ingredients (liters)', () => {
      const result = calculateIngredientCost('milk', 1, 'l', 4);
      expect(result.matched).toBe(true);
      expect(result.totalCost).toBeCloseTo(5.0, 2); // (1000/1000) * 5
      expect(result.costPerServing).toBeCloseTo(1.25, 2);
    });

    it('should calculate cost for piece ingredients', () => {
      const result = calculateIngredientCost('egg', 2, 'pcs', 4);
      expect(result.matched).toBe(true);
      expect(result.totalCost).toBeCloseTo(1.6, 2); // 2 * 0.8
      expect(result.costPerServing).toBeCloseTo(0.4, 2);
    });

    it('should calculate cost for piece ingredients with different units', () => {
      const result = calculateIngredientCost('garlic', 3, 'cloves', 4);
      expect(result.matched).toBe(true);
      expect(result.totalCost).toBeCloseTo(0.45, 2); // 3 * 0.15
      expect(result.costPerServing).toBeCloseTo(0.1125, 2);
    });

    it('should handle tsp for volume ingredients', () => {
      const result = calculateIngredientCost('soy sauce', 2, 'tbsp', 4);
      expect(result.matched).toBe(true);
      // 2 tbsp = 30ml, (30/1000) * 8 = 0.24
      expect(result.totalCost).toBeCloseTo(0.24, 2);
    });

    it('should use fallback for unmatched ingredients', () => {
      const result = calculateIngredientCost('unknown ingredient xyz', 100, 'g', 4);
      expect(result.matched).toBe(false);
      expect(result.totalCost).toBe(0.8); // 0.2 * 4
      expect(result.costPerServing).toBe(0.2);
    });
  });

  describe('calculateRecipeCosts', () => {
    it('should calculate total costs for a recipe', () => {
      const ingredients = [
        {
          name: { ro: 'ulei de măsline', en: 'olive oil' },
          quantity: 30,
          unit: { ro: 'ml', en: 'ml' }
        },
        {
          name: { ro: 'ouă', en: 'eggs' },
          quantity: 2,
          unit: { ro: 'buc', en: 'pcs' }
        },
        {
          name: { ro: 'unt', en: 'butter' },
          quantity: 50,
          unit: { ro: 'g', en: 'g' }
        }
      ];

      const result = calculateRecipeCosts(ingredients, 4, 'en');
      
      // olive oil: (30/1000) * 25 = 0.75
      // eggs: 2 * 0.8 = 1.6
      // butter: (50/1000) * 12 = 0.6
      // total: 2.95
      expect(result.totalCost).toBeCloseTo(2.95, 2);
      expect(result.pricePerServing).toBeCloseTo(0.7375, 2);
      expect(result.ingredientCosts.size).toBe(3);
    });

    it('should skip section headers', () => {
      const ingredients = [
        { section: { ro: 'Secțiune', en: 'Section' } },
        {
          name: { ro: 'sare', en: 'salt' },
          quantity: 1,
          unit: { ro: 'linguriță', en: 'tsp' }
        }
      ];

      const result = calculateRecipeCosts(ingredients, 4, 'en');
      
      expect(result.ingredientCosts.size).toBe(1);
      expect(result.ingredientCosts.has(0)).toBe(false); // Section header at index 0
      expect(result.ingredientCosts.has(1)).toBe(true); // Salt at index 1
    });

    it('should handle mix of matched and unmatched ingredients', () => {
      const ingredients = [
        {
          name: { ro: 'sare', en: 'salt' },
          quantity: 1,
          unit: { ro: 'linguriță', en: 'tsp' }
        },
        {
          name: { ro: 'ingredient necunoscut', en: 'unknown ingredient' },
          quantity: 100,
          unit: { ro: 'g', en: 'g' }
        }
      ];

      const result = calculateRecipeCosts(ingredients, 4, 'en');
      
      // salt: matched, (5/1000) * 0.5 = 0.0025
      // unknown: fallback, 0.2 * 4 = 0.8
      expect(result.totalCost).toBeCloseTo(0.8025, 2);
    });
  });

  describe('Formatting functions', () => {
    it('should format price with 2 decimals', () => {
      expect(formatPrice(2.3)).toBe('2.30');
      expect(formatPrice(2.356)).toBe('2.36');
      expect(formatPrice(2)).toBe('2.00');
    });

    it('should format price per serving', () => {
      expect(formatPricePerServing(2.35)).toBe('2.35 RON / serving');
    });

    it('should format total price', () => {
      expect(formatTotalPrice(9.4)).toBe('9.40 RON total');
    });

    it('should format ingredient price', () => {
      expect(formatIngredientPrice(1.1)).toBe('1.10 RON');
    });
  });
});
