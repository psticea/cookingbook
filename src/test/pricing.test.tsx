import { describe, it, expect } from 'vitest';
import {
  matchIngredientById,
  calculateIngredientCost,
  calculateRecipeCost,
  compareRecipeCosts,
  formatPrice,
  formatPricePerServing,
  formatTotalCost,
  type PricesData,
  type PriceConfig,
} from '../utils/pricing';
import type { Recipe, Ingredient, IngredientItem } from '../types/recipe';

const mockPrices: PricesData = {
  ingredients: {
    oil: { id: 101, name: 'Olive oil', category: 'Pantry', unit_type: 'volume', price_per_1000: 15 },
    flour: { id: 102, name: 'White flour', category: 'Pantry', unit_type: 'mass', price_per_1000: 3 },
    eggs: { id: 103, name: 'Eggs', category: 'Proteins', unit_type: 'piece', price_per_piece: 0.8 },
    salt: { id: 104, name: 'Salt', category: 'Spices & Seasonings', unit_type: 'mass', price_per_1000: 1.5 },
  },
};

function ingredient(overrides: Partial<Ingredient> = {}): Ingredient {
  return { name: { en: 'flour', ro: 'făină' }, quantity: 250, unit: { en: 'g', ro: 'g' }, ingredientId: 102, ...overrides };
}

function recipe(ingredients: IngredientItem[], servings = 4): Pick<Recipe, 'ingredients' | 'servings'> {
  return { ingredients, servings };
}

function pricesWithRate(unitType: PriceConfig['unit_type'], rate: unknown): PricesData {
  return { ingredients: { item: {
    id: 102, name: 'Test', category: 'Pantry', unit_type: unitType,
    // Deliberately exercise malformed JSON values at the runtime boundary.
    ...(unitType === 'piece' ? { price_per_piece: rate as number } : { price_per_1000: rate as number }),
  } } };
}

const unavailable = (reason: string) => ({ matched: false, costPerRecipe: null, costPerServing: null, reason });

describe('matchIngredientById', () => {
  it('matches only by exact ID', () => {
    expect(matchIngredientById(101, mockPrices)?.name).toBe('Olive oil');
    expect(matchIngredientById(999, mockPrices)).toBeUndefined();
    expect(calculateIngredientCost(ingredient({ name: { en: 'Unknown', ro: 'Necunoscut' } }), 4, 'en', mockPrices))
      .toMatchObject({ matched: true, costPerRecipe: 0.75, costPerServing: 0.19 });
  });
});

describe('calculateIngredientCost - preserved conversions', () => {
  it.each([
    [102, 'g', 250, 0.75], [102, 'grams', 250, 0.75], [102, ' KG ', 1, 3],
    [102, 'teaspoon', 2, 0.03], [102, 'tablespoon', 2, 0.09], [102, 'pinch', 10, 0.02],
    [104, 'g', 5, 0.01], [104, 'g', 3, 0], [102, 'g', 333, 1],
    [101, 'ml', 50, 0.75], [101, 'l', 0.5, 7.5], [101, 'tsp', 2, 0.15],
    [101, 'tbsp', 2, 0.45], [101, 'cups', 1, 3.6],
    [103, 'pcs', 3, 2.4], [103, 'pieces', 2.5, 2], [103, 'clove', 2, 1.6],
    [103, 'slices', 2, 1.6], [103, 'packets', 2, 1.6],
    [102, 'lingurițe', 2, 0.03], [102, 'linguri', 2, 0.09], [102, 'praf', 10, 0.02],
    [101, 'litru', 0.5, 7.5], [101, 'căni', 1, 3.6], [103, 'bucăți', 3, 2.4],
    [103, 'căței', 2, 1.6], [103, 'felii', 2, 1.6], [103, 'plicuri', 2, 1.6],
    [102, 'teaspoons', 2, 0.03], [102, 'tablespoons', 2, 0.09], [102, 'pinches', 10, 0.02],
    [101, 'millilitres', 50, 0.75], [101, 'litres', 0.5, 7.5],
  ])('prices ID %s, %s x %s at %s RON', (ingredientId, unit, quantity, expected) => {
    const result = calculateIngredientCost(ingredient({ ingredientId, quantity, unit: { en: unit, ro: 'display only' } }), 4, 'en', mockPrices);
    expect(result).toMatchObject({ matched: true, costPerRecipe: expected });
    expect(result).not.toHaveProperty('reason');
  });

  it('preserves localized names but uses the English source unit in either locale', () => {
    const item = ingredient({ quantity: 2, unit: { en: 'tbsp', ro: 'display label without conversion' } });
    const en = calculateIngredientCost(item, 4, 'en', mockPrices);
    const ro = calculateIngredientCost(item, 4, 'ro', mockPrices);
    expect(en).toMatchObject({ ingredientName: 'flour', matched: true, costPerRecipe: 0.09 });
    expect(ro).toEqual({ ...en, ingredientName: 'făină' });
  });
});

describe('calculateIngredientCost - explicit unavailable reasons', () => {
  it.each([undefined, 999])('does not invent a price for missing ID %s', ingredientId => {
    expect(calculateIngredientCost(ingredient({ ingredientId }), 4, 'en', mockPrices))
      .toMatchObject({ ...unavailable('missing-price'), ingredientName: 'flour' });
  });

  it.each([
    [102, 'ml'], [102, 'cups'], [102, 'to taste'], [102, ''],
    [101, 'g'], [103, 'kg'], [103, 'handful'], [102, 'mystery'],
  ])('rejects unsupported source unit %s / %s without a density guess', (ingredientId, unit) => {
    expect(calculateIngredientCost(ingredient({ ingredientId, unit: { en: unit, ro: 'g' } }), 4, 'ro', mockPrices))
      .toMatchObject({ ...unavailable('unsupported-unit'), ingredientName: 'făină' });
  });

  describe.each(['mass', 'volume', 'piece'] as const)('%s rates', unitType => {
    const unit = unitType === 'mass' ? 'g' : unitType === 'volume' ? 'ml' : 'pcs';
    it.each([undefined, null, NaN, Infinity, -Infinity, -1, '3'])('rejects invalid/missing rate %s instead of pricing it as zero', rate => {
      expect(calculateIngredientCost(ingredient({ unit: { en: unit, ro: unit } }), 4, 'en', pricesWithRate(unitType, rate)))
        .toMatchObject(unavailable('invalid-price'));
    });

    it('accepts an explicit zero rate', () => {
      expect(calculateIngredientCost(ingredient({ unit: { en: unit, ro: unit } }), 4, 'en', pricesWithRate(unitType, 0)))
        .toMatchObject({ matched: true, costPerRecipe: 0, costPerServing: 0 });
    });
  });

  it('does not substitute a rate for a different unit type', () => {
    const prices: PricesData = { ingredients: { item: { ...mockPrices.ingredients.flour, price_per_1000: undefined, price_per_piece: 2 } } };
    expect(calculateIngredientCost(ingredient(), 4, 'en', prices)).toMatchObject(unavailable('invalid-price'));
  });

  it.each([NaN, Infinity, -Infinity, -1, undefined, null, '2'])('rejects invalid quantity %s', quantity => {
    expect(calculateIngredientCost(ingredient({ quantity: quantity as number }), 4, 'en', mockPrices))
      .toMatchObject(unavailable('invalid-quantity'));
  });

  it.each([0, -1, NaN, Infinity, -Infinity, undefined, null, '4'])('rejects invalid servings %s', servings => {
    expect(calculateIngredientCost(ingredient(), servings as number, 'en', mockPrices))
      .toMatchObject(unavailable('invalid-quantity'));
  });

  it('accepts an explicit zero quantity only when a usable rate exists', () => {
    expect(calculateIngredientCost(ingredient({ quantity: 0 }), 4, 'en', mockPrices))
      .toMatchObject({ matched: true, costPerRecipe: 0, costPerServing: 0 });
    expect(calculateIngredientCost(ingredient({ quantity: 0 }), 4, 'en', pricesWithRate('mass', undefined)))
      .toMatchObject(unavailable('invalid-price'));
  });

  it('rejects overflow during unit conversion and price calculation', () => {
    expect(calculateIngredientCost(ingredient({ quantity: Number.MAX_VALUE, unit: { en: 'kg', ro: 'kg' } }), 4, 'en', mockPrices))
      .toMatchObject(unavailable('invalid-quantity'));
    expect(calculateIngredientCost(ingredient({ quantity: 2000 }), 4, 'en', pricesWithRate('mass', Number.MAX_VALUE)))
      .toMatchObject(unavailable('invalid-price'));
  });
});

describe('calculateRecipeCost', () => {
  it('calculates a complete estimate from just ingredients and servings', () => {
    const result = calculateRecipeCost(recipe([
      ingredient({ quantity: 200 }),
      ingredient({ ingredientId: 101, quantity: 30, unit: { en: 'ml', ro: 'ml' } }),
      ingredient({ ingredientId: 103, quantity: 2, unit: { en: 'pcs', ro: 'buc' } }),
    ]), 'en', mockPrices);
    expect(result).toMatchObject({ status: 'complete', totalCostRecipe: 2.65, pricePerServing: 0.66, pricedIngredientCount: 3, unpricedIngredientCount: 0 });
    expect(result.ingredientCosts).toHaveLength(3);
  });

  it('returns only the known subtotal for partial estimates', () => {
    const result = calculateRecipeCost(recipe([ingredient(), ingredient({ ingredientId: undefined })]), 'en', mockPrices);
    expect(result).toMatchObject({ status: 'partial', totalCostRecipe: 0.75, pricePerServing: 0.19, pricedIngredientCount: 1, unpricedIngredientCount: 1 });
    expect(result.ingredientCosts[1]).toMatchObject(unavailable('missing-price'));
  });

  it('returns null amounts when no ingredients can be priced', () => {
    const result = calculateRecipeCost(recipe([ingredient({ ingredientId: 999 }), ingredient({ unit: { en: 'unknown', ro: 'g' } })]), 'en', mockPrices);
    expect(result).toMatchObject({ status: 'unavailable', totalCostRecipe: null, pricePerServing: null, pricedIngredientCount: 0, unpricedIngredientCount: 2 });
  });

  it('does not confuse a known zero subtotal with an unavailable estimate', () => {
    expect(calculateRecipeCost(recipe([ingredient({ quantity: 0 }), ingredient({ ingredientId: 999 })]), 'en', mockPrices))
      .toMatchObject({ status: 'partial', totalCostRecipe: 0, pricePerServing: 0, pricedIngredientCount: 1, unpricedIngredientCount: 1 });
  });

  it('excludes section headings from receipt lines, counts and status', () => {
    const result = calculateRecipeCost(recipe([
      { section: { en: 'Dry ingredients', ro: 'Ingrediente uscate' } }, ingredient(),
      { section: { en: 'Other', ro: 'Altele' } },
    ]), 'en', mockPrices);
    expect(result).toMatchObject({ status: 'complete', totalCostRecipe: 0.75, pricedIngredientCount: 1, unpricedIngredientCount: 0 });
    expect(result.ingredientCosts).toHaveLength(1);
  });

  it.each([{ ingredients: [] }, { ingredients: [{ section: { en: 'Empty section', ro: 'Secțiune goală' } }] }])('treats an empty ingredient list as unavailable', ({ ingredients }) => {
    expect(calculateRecipeCost(recipe(ingredients), 'en', mockPrices))
      .toEqual({ ingredientCosts: [], status: 'unavailable', totalCostRecipe: null, pricePerServing: null, pricedIngredientCount: 0, unpricedIngredientCount: 0 });
  });

  it.each([0, -1, NaN, Infinity, -Infinity, null, '4'])('rejects invalid base or selected servings %s', servings => {
    for (const result of [
      calculateRecipeCost(recipe([ingredient()], servings as number), 'en', mockPrices, 4),
      calculateRecipeCost(recipe([ingredient()]), 'en', mockPrices, servings as number),
    ]) {
      expect(result).toMatchObject({ status: 'unavailable', totalCostRecipe: null, pricePerServing: null, pricedIngredientCount: 0, unpricedIngredientCount: 1 });
      expect(result.ingredientCosts[0]).toMatchObject(unavailable('invalid-quantity'));
    }
  });

  it.each([NaN, Infinity, -Infinity, -1, undefined, null, '2'])('does not coerce invalid source quantity %s when scaling', quantity => {
    const result = calculateRecipeCost(recipe([ingredient({ quantity: quantity as number })]), 'en', mockPrices, 8);
    expect(result).toMatchObject({ status: 'unavailable', totalCostRecipe: null, pricePerServing: null });
    expect(result.ingredientCosts[0]).toMatchObject(unavailable('invalid-quantity'));
  });

  it('scales the original quantity, not the rounded baseline price', () => {
    const input = recipe([ingredient({ ingredientId: 104, quantity: 5 })]);
    const original = calculateRecipeCost(input, 'en', mockPrices);
    const doubled = calculateRecipeCost(input, 'en', mockPrices, 8);
    const halved = calculateRecipeCost(input, 'en', mockPrices, 2);
    expect(original.totalCostRecipe).toBe(0.01); // Raw cost: 0.0075.
    expect(doubled.totalCostRecipe).toBe(0.02); // Raw cost: 0.015.
    expect(halved.totalCostRecipe).toBe(0); // Raw cost: 0.00375, not 0.01 / 2 rounded up.
    const tripled = calculateRecipeCost(input, 'en', mockPrices, 12);
    expect(tripled.totalCostRecipe).toBe(0.02); // Raw cost: 0.0225, not 0.01 * 3.
    expect(input.ingredients[0]).toMatchObject({ quantity: 5 });
  });

  it('accepts positive fractional servings', () => {
    expect(calculateRecipeCost(recipe([ingredient()], 2), 'en', mockPrices, 1.5))
      .toMatchObject({ status: 'complete', totalCostRecipe: 0.56, pricePerServing: 0.37 });
  });

  it('reconciles displayed lines to cents and derives per-serving from that total', () => {
    const input = recipe([ingredient({ quantity: 5 }), ingredient({ quantity: 5 }), ingredient({ quantity: 5 })], 2);
    const result = calculateRecipeCost(input, 'en', mockPrices);
    // Each raw 0.015 line displays 0.02. Receipt is 0.06, not rounded raw sum 0.05.
    expect(result.ingredientCosts.map(cost => cost.costPerRecipe)).toEqual([0.02, 0.02, 0.02]);
    expect(result.totalCostRecipe).toBe(0.06);
    expect(result.pricePerServing).toBe(0.03);
    const servingLines = calculateRecipeCost(recipe([ingredient(), ingredient(), ingredient()]), 'en', mockPrices);
    expect(servingLines.totalCostRecipe).toBe(2.25);
    expect(servingLines.pricePerServing).toBe(0.56); // Not 3 * rounded ingredient serving price 0.19.
  });

  it.each([2, 4, 7, 12])('reconciles partial subtotals and preserves locale parity at %s servings', servings => {
    const input = recipe([ingredient({ quantity: 5 }), ingredient({ quantity: 333 }), ingredient({ ingredientId: 999 })]);
    const en = calculateRecipeCost(input, 'en', mockPrices, servings);
    const ro = calculateRecipeCost(input, 'ro', mockPrices, servings);
    const lineSum = en.ingredientCosts.reduce((sum, cost) => sum + (cost.matched ? Math.round(cost.costPerRecipe * 100) : 0), 0);
    expect(en.totalCostRecipe).toBe(lineSum / 100);
    expect(en.pricePerServing).toBe(Math.round((lineSum / 100 / servings + Number.EPSILON) * 100) / 100);
    expect(ro).toEqual({ ...en, ingredientCosts: en.ingredientCosts.map(cost => ({ ...cost, ingredientName: 'făină' })) });
  });

  it('keeps the default language, dataset and servings available', () => {
    // ID 101 is olive oil in both the production dataset and our fixture.
    const result = calculateRecipeCost(recipe([ingredient({ ingredientId: 101, quantity: 100, unit: { en: 'ml', ro: 'ml' } })]));
    expect(result).toMatchObject({ status: 'complete', totalCostRecipe: 1.5, pricePerServing: 0.38 });
  });
});

describe('compareRecipeCosts', () => {
  const cost = (quantity: number, unknown = false) => calculateRecipeCost(recipe([
    ingredient({ quantity }), ...(unknown ? [ingredient({ ingredientId: 999 })] : []),
  ]), 'en', mockPrices);
  const entries = [
    { id: 'partial-high', cost: cost(10000, true) },
    { id: 'unavailable', cost: calculateRecipeCost(recipe([ingredient({ ingredientId: 999 })]), 'en', mockPrices) },
    { id: 'expensive', cost: cost(1000) },
    { id: 'partial-low', cost: cost(1, true) },
    { id: 'cheap', cost: cost(100) },
    { id: 'free', cost: cost(0) },
  ];

  it.each(['asc', 'desc'] as const)('sorts only complete estimates numerically in %s order', order => {
    const sorted = [...entries].sort((a, b) => compareRecipeCosts(a.cost, b.cost, order));
    expect(sorted.map(entry => entry.id)).toEqual([
      ...(order === 'asc' ? ['free', 'cheap', 'expensive'] : ['expensive', 'cheap', 'free']),
      'partial-high', 'unavailable', 'partial-low',
    ]);
    expect(compareRecipeCosts(entries[0].cost, entries[3].cost, order)).toBe(0);
    expect(compareRecipeCosts(entries[0].cost, entries[1].cost, order)).toBe(0);
  });

  it('defaults to ascending and leaves equal complete costs stable', () => {
    expect(compareRecipeCosts(cost(100), cost(1000))).toBeLessThan(0);
    expect(compareRecipeCosts(cost(100), cost(100))).toBe(0);
  });
});

describe('formatting compatibility', () => {
  it('retains existing numeric formatting helpers', () => {
    expect(formatPrice(2.5)).toBe('2.50 RON');
    expect(formatPrice(2.5, false)).toBe('2.50');
    expect(formatPrice(2.123456)).toBe('2.12 RON');
    expect(formatPrice(2.999)).toBe('3.00 RON');
    expect(formatPricePerServing(1.234)).toBe('1.23 RON / serving');
    expect(formatTotalCost(9.456)).toBe('9.46 RON total');
  });
});
