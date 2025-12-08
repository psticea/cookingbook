import { describe, it, expect } from 'vitest';
import { calculateRecipeCost, formatPrice } from '../utils/priceCalculator';
import { Ingredient, IngredientItem } from '../types/recipe';

describe('priceCalculator', () => {
  describe('calculateRecipeCost', () => {
    it('calculates cost for mass-based ingredients', () => {
      const ingredients: IngredientItem[] = [
        {
          name: { ro: 'făină', en: 'white flour' },
          quantity: 500,
          unit: { ro: 'g', en: 'g' },
        } as Ingredient,
      ];
      
      const result = calculateRecipeCost(ingredients, 4, 'en');
      expect(result.totalCost).toBeGreaterThan(0);
      expect(result.pricePerServing).toBeGreaterThan(0);
      expect(result.ingredientCosts.length).toBe(1);
      expect(result.ingredientCosts[0].matched).toBe(true);
    });

    it('calculates cost for volume-based ingredients', () => {
      const ingredients: IngredientItem[] = [
        {
          name: { ro: 'ulei de măsline', en: 'olive oil' },
          quantity: 100,
          unit: { ro: 'ml', en: 'ml' },
        } as Ingredient,
      ];
      
      const result = calculateRecipeCost(ingredients, 2, 'en');
      expect(result.totalCost).toBeGreaterThan(0);
      expect(result.pricePerServing).toBeGreaterThan(0);
      expect(result.ingredientCosts[0].matched).toBe(true);
    });

    it('calculates cost for piece-based ingredients', () => {
      const ingredients: IngredientItem[] = [
        {
          name: { ro: 'banane', en: 'banana' },
          quantity: 2,
          unit: { ro: 'buc', en: 'pcs' },
        } as Ingredient,
      ];
      
      const result = calculateRecipeCost(ingredients, 4, 'en');
      expect(result.totalCost).toBeGreaterThan(0);
      expect(result.pricePerServing).toBeGreaterThan(0);
      expect(result.ingredientCosts[0].matched).toBe(true);
    });

    it('uses fallback cost for unmatched ingredients', () => {
      const ingredients: IngredientItem[] = [
        {
          name: { ro: 'ingredient necunoscut', en: 'unknown ingredient xyz' },
          quantity: 100,
          unit: { ro: 'g', en: 'g' },
        } as Ingredient,
      ];
      
      const servings = 4;
      const result = calculateRecipeCost(ingredients, servings, 'en');
      
      // Fallback is 0.2 RON per serving
      expect(result.pricePerServing).toBe(0.2);
      expect(result.totalCost).toBe(0.2 * servings);
      expect(result.ingredientCosts[0].matched).toBe(false);
    });

    it('handles kg to g conversion', () => {
      const ingredients: IngredientItem[] = [
        {
          name: { ro: 'făină', en: 'flour' },
          quantity: 1,
          unit: { ro: 'kg', en: 'kg' },
        } as Ingredient,
      ];
      
      const result = calculateRecipeCost(ingredients, 4, 'en');
      expect(result.totalCost).toBeGreaterThan(0);
    });

    it('handles l to ml conversion', () => {
      const ingredients: IngredientItem[] = [
        {
          name: { ro: 'apă', en: 'water' },
          quantity: 1,
          unit: { ro: 'l', en: 'l' },
        } as Ingredient,
      ];
      
      const result = calculateRecipeCost(ingredients, 2, 'en');
      expect(result.totalCost).toBeGreaterThan(0);
    });

    it('handles Tbsp conversion', () => {
      const ingredients: IngredientItem[] = [
        {
          name: { ro: 'ulei', en: 'oil' },
          quantity: 2,
          unit: { ro: 'linguri', en: 'Tbsp' },
        } as Ingredient,
      ];
      
      const result = calculateRecipeCost(ingredients, 4, 'en');
      expect(result.totalCost).toBeGreaterThan(0);
    });

    it('handles tsp conversion', () => {
      const ingredients: IngredientItem[] = [
        {
          name: { ro: 'sare', en: 'salt' },
          quantity: 1,
          unit: { ro: 'linguriță', en: 'tsp' },
        } as Ingredient,
      ];
      
      const result = calculateRecipeCost(ingredients, 2, 'en');
      expect(result.totalCost).toBeGreaterThan(0);
    });

    it('skips section headings', () => {
      const ingredients: IngredientItem[] = [
        { section: { ro: 'Ingrediente principale', en: 'Main ingredients' } },
        {
          name: { ro: 'făină', en: 'flour' },
          quantity: 250,
          unit: { ro: 'g', en: 'g' },
        } as Ingredient,
      ];
      
      const result = calculateRecipeCost(ingredients, 4, 'en');
      expect(result.ingredientCosts.length).toBe(1);
    });

    it('calculates total cost correctly', () => {
      const ingredients: IngredientItem[] = [
        {
          name: { ro: 'banane', en: 'banana' },
          quantity: 2,
          unit: { ro: 'buc', en: 'pcs' },
        } as Ingredient,
        {
          name: { ro: 'făină', en: 'flour' },
          quantity: 250,
          unit: { ro: 'g', en: 'g' },
        } as Ingredient,
      ];
      
      const result = calculateRecipeCost(ingredients, 4, 'en');
      const manualTotal = result.ingredientCosts.reduce((sum, cost) => sum + cost.totalCost, 0);
      
      expect(result.totalCost).toBeCloseTo(manualTotal, 2);
      expect(result.pricePerServing).toBeCloseTo(result.totalCost / 4, 2);
    });

    it('rounds to 2 decimal places', () => {
      const ingredients: IngredientItem[] = [
        {
          name: { ro: 'banane', en: 'banana' },
          quantity: 1,
          unit: { ro: 'buc', en: 'pcs' },
        } as Ingredient,
      ];
      
      const result = calculateRecipeCost(ingredients, 3, 'en');
      
      // Check that values are properly rounded
      expect(result.totalCost.toString()).toMatch(/^\d+\.\d{1,2}$/);
      expect(result.pricePerServing.toString()).toMatch(/^\d+\.\d{1,2}$/);
    });
  });

  describe('formatPrice', () => {
    it('formats price without per serving suffix', () => {
      expect(formatPrice(10.5)).toBe('10.50 RON');
      expect(formatPrice(5)).toBe('5.00 RON');
    });

    it('formats price with per serving suffix', () => {
      expect(formatPrice(2.35, true)).toBe('2.35 RON / serving');
      expect(formatPrice(1.5, true)).toBe('1.50 RON / serving');
    });

    it('always shows 2 decimal places', () => {
      expect(formatPrice(10)).toBe('10.00 RON');
      expect(formatPrice(3.1)).toBe('3.10 RON');
      expect(formatPrice(7.999)).toBe('8.00 RON');
    });
  });
});
