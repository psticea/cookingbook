import { describe, it, expect } from 'vitest';
import {
  matchIngredientById,
  calculateIngredientCost,
  calculateRecipeCost,
  formatPrice,
  formatPricePerServing,
  formatTotalCost,
  type PricesData,
} from '../utils/pricing';
import { Recipe, Ingredient } from '../types/recipe';

// Mock prices data for testing
const mockPrices: PricesData = {
  ingredients: {
    olive_oil: {
      id: 101,
      name: 'Olive oil',
      category: 'Pantry',
      unit_type: 'volume',
      price_per_1000: 15.0,
    },
    flour: {
      id: 102,
      name: 'White flour',
      category: 'Pantry',
      unit_type: 'mass',
      price_per_1000: 3.0,
    },
    eggs: {
      id: 103,
      name: 'Eggs',
      category: 'Proteins',
      unit_type: 'piece',
      price_per_piece: 0.8,
    },
    salt: {
      id: 104,
      name: 'Salt',
      category: 'Spices & Seasonings',
      unit_type: 'mass',
      price_per_1000: 1.5,
    },
    chicken: {
      id: 105,
      name: 'Chicken breast',
      category: 'Proteins',
      unit_type: 'mass',
      price_per_1000: 25.0,
    },
  },
};

describe('matchIngredientById', () => {
  it('matches ingredient by exact ID', () => {
    const result = matchIngredientById(101, mockPrices);
    expect(result).toBeDefined();
    expect(result?.name).toBe('Olive oil');
  });

  it('returns undefined for non-existent ID', () => {
    const result = matchIngredientById(999, mockPrices);
    expect(result).toBeUndefined();
  });

  it('matches different ingredient types', () => {
    const oil = matchIngredientById(101, mockPrices);
    const flour = matchIngredientById(102, mockPrices);
    const eggs = matchIngredientById(103, mockPrices);
    
    expect(oil?.name).toBe('Olive oil');
    expect(flour?.name).toBe('White flour');
    expect(eggs?.name).toBe('Eggs');
  });
});

describe('calculateIngredientCost - mass ingredients', () => {
  it('calculates cost for grams with ID', () => {
    const ingredient: Ingredient = {
      name: { en: 'white flour', ro: 'făină albă' },
      quantity: 250,
      unit: { en: 'g', ro: 'g' },
      ingredientId: 102,
    };
    
    const result = calculateIngredientCost(ingredient, 4, 'en', mockPrices);
    
    expect(result.matched).toBe(true);
    expect(result.costPerRecipe).toBe(0.75); // (250/1000) * 3.0 = 0.75
    expect(result.costPerServing).toBe(0.19); // 0.75 / 4 = 0.1875, rounded to 0.19
  });

  it('uses ID matching for ingredients', () => {
    const ingredient: Ingredient = {
      name: { en: 'unknown name', ro: 'nume necunoscut' },
      quantity: 250,
      unit: { en: 'g', ro: 'g' },
      ingredientId: 102, // flour ID
    };
    
    const result = calculateIngredientCost(ingredient, 4, 'en', mockPrices);
    
    expect(result.matched).toBe(true);
    expect(result.costPerRecipe).toBe(0.75); // Matched by ID
    expect(result.costPerServing).toBe(0.19);
  });

  it('uses fallback if ID not found', () => {
    const ingredient: Ingredient = {
      name: { en: 'white flour', ro: 'făină albă' },
      quantity: 250,
      unit: { en: 'g', ro: 'g' },
      ingredientId: 999, // Non-existent ID
    };
    
    const result = calculateIngredientCost(ingredient, 4, 'en', mockPrices);
    
    expect(result.matched).toBe(false); // Falls back to default pricing
    expect(result.costPerServing).toBe(0.2); // Fallback price
    expect(result.costPerRecipe).toBe(0.8); // 0.2 * 4 servings
  });

  it('calculates cost for kilograms', () => {
    const ingredient: Ingredient = {
      name: { en: 'flour', ro: 'făină' },
      quantity: 1,
      unit: { en: 'kg', ro: 'kg' },
      ingredientId: 102,
    };
    
    const result = calculateIngredientCost(ingredient, 4, 'en', mockPrices);
    
    expect(result.matched).toBe(true);
    expect(result.costPerRecipe).toBe(3.0); // (1000/1000) * 3.0 = 3.0
    expect(result.costPerServing).toBe(0.75); // 3.0 / 4 = 0.75
  });

  it('handles small quantities', () => {
    const ingredient: Ingredient = {
      name: { en: 'salt', ro: 'sare' },
      quantity: 5,
      unit: { en: 'g', ro: 'g' },
      ingredientId: 104,
    };
    
    const result = calculateIngredientCost(ingredient, 2, 'en', mockPrices);
    
    expect(result.matched).toBe(true);
    expect(result.costPerRecipe).toBe(0.01); // (5/1000) * 1.5 = 0.0075, rounded to 0.01
  });
});

describe('calculateIngredientCost - volume ingredients', () => {
  it('calculates cost for milliliters', () => {
    const ingredient: Ingredient = {
      name: { en: 'olive oil', ro: 'ulei de măsline' },
      quantity: 50,
      unit: { en: 'ml', ro: 'ml' },
      ingredientId: 101,
    };
    
    const result = calculateIngredientCost(ingredient, 4, 'en', mockPrices);
    
    expect(result.matched).toBe(true);
    expect(result.costPerRecipe).toBe(0.75); // (50/1000) * 15.0 = 0.75
    expect(result.costPerServing).toBe(0.19); // 0.75 / 4 = 0.1875, rounded to 0.19
  });

  it('calculates cost for liters', () => {
    const ingredient: Ingredient = {
      name: { en: 'olive oil', ro: 'ulei de măsline' },
      quantity: 0.5,
      unit: { en: 'l', ro: 'l' },
      ingredientId: 101,
    };
    
    const result = calculateIngredientCost(ingredient, 4, 'en', mockPrices);
    
    expect(result.matched).toBe(true);
    expect(result.costPerRecipe).toBe(7.5); // (500/1000) * 15.0 = 7.5
    expect(result.costPerServing).toBe(1.88); // 7.5 / 4 = 1.875, rounded to 1.88
  });
});

describe('calculateIngredientCost - piece ingredients', () => {
  it('calculates cost for pieces (pcs)', () => {
    const ingredient: Ingredient = {
      name: { en: 'eggs', ro: 'ouă' },
      quantity: 3,
      unit: { en: 'pcs', ro: 'buc' },
      ingredientId: 103,
    };
    
    const result = calculateIngredientCost(ingredient, 4, 'en', mockPrices);
    
    expect(result.matched).toBe(true);
    expect(result.costPerRecipe).toBe(2.4); // 3 * 0.8 = 2.4
    expect(result.costPerServing).toBe(0.6); // 2.4 / 4 = 0.6
  });

  it('handles fractional pieces', () => {
    const ingredient: Ingredient = {
      name: { en: 'eggs', ro: 'ouă' },
      quantity: 2.5,
      unit: { en: 'pcs', ro: 'buc' },
      ingredientId: 103,
    };
    
    const result = calculateIngredientCost(ingredient, 2, 'en', mockPrices);
    
    expect(result.matched).toBe(true);
    expect(result.costPerRecipe).toBe(2.0); // 2.5 * 0.8 = 2.0
    expect(result.costPerServing).toBe(1.0); // 2.0 / 2 = 1.0
  });
});

describe('calculateIngredientCost - fallback for missing prices', () => {
  it('uses fallback cost for unmatched ingredient', () => {
    const ingredient: Ingredient = {
      name: { en: 'exotic spice xyz', ro: 'condiment exotic xyz' },
      quantity: 10,
      unit: { en: 'g', ro: 'g' },
    };
    
    const result = calculateIngredientCost(ingredient, 4, 'en', mockPrices);
    
    expect(result.matched).toBe(false);
    expect(result.costPerServing).toBe(0.2); // Fallback: 0.2 RON per serving
    expect(result.costPerRecipe).toBe(0.8); // 0.2 * 4 servings
  });

  it('fallback cost scales with servings', () => {
    const ingredient: Ingredient = {
      name: { en: 'unknown ingredient', ro: 'ingredient necunoscut' },
      quantity: 100,
      unit: { en: 'g', ro: 'g' },
    };
    
    const result = calculateIngredientCost(ingredient, 8, 'en', mockPrices);
    
    expect(result.matched).toBe(false);
    expect(result.costPerServing).toBe(0.2);
    expect(result.costPerRecipe).toBe(1.6); // 0.2 * 8 servings
  });
});

describe('calculateRecipeCost', () => {
  it('calculates total cost for a recipe', () => {
    const recipe: Recipe = {
      id: 'test-recipe',
      category: 'test',
      title: { en: 'Test Recipe', ro: 'Rețetă Test' },
      prepTime: 30,
      servings: 4,
      effortLevel: 'easy',
      image: '/test.jpg',
      ingredients: [
        {
          name: { en: 'flour', ro: 'făină' },
          quantity: 200,
          unit: { en: 'g', ro: 'g' },
          ingredientId: 102,
        },
        {
          name: { en: 'olive oil', ro: 'ulei de măsline' },
          quantity: 30,
          unit: { en: 'ml', ro: 'ml' },
          ingredientId: 101,
        },
        {
          name: { en: 'eggs', ro: 'ouă' },
          quantity: 2,
          unit: { en: 'pcs', ro: 'buc' },
          ingredientId: 103,
        },
      ],
      instructions: { en: ['Test'], ro: ['Test'] },
      personalNotes: { en: '', ro: '' },
      keywords: [],
      dateAdded: '2025-01-01',
    };
    
    const result = calculateRecipeCost(recipe, 'en', mockPrices);
    
    expect(result.ingredientCosts).toHaveLength(3);
    // Flour: (200/1000) * 3.0 = 0.6
    // Oil: (30/1000) * 15.0 = 0.45
    // Eggs: 2 * 0.8 = 1.6
    // Total: 2.65
    expect(result.totalCostRecipe).toBe(2.65);
    expect(result.pricePerServing).toBe(0.66); // 2.65 / 4 = 0.6625, rounded to 0.66
  });

  it('skips section headings', () => {
    const recipe: Recipe = {
      id: 'test-recipe',
      category: 'test',
      title: { en: 'Test Recipe', ro: 'Rețetă Test' },
      prepTime: 30,
      servings: 2,
      effortLevel: 'easy',
      image: '/test.jpg',
      ingredients: [
        { section: { en: 'Dry ingredients', ro: 'Ingrediente uscate' } },
        {
          name: { en: 'flour', ro: 'făină' },
          quantity: 100,
          unit: { en: 'g', ro: 'g' },
          ingredientId: 102,
        },
      ] as any,
      instructions: { en: ['Test'], ro: ['Test'] },
      personalNotes: { en: '', ro: '' },
      keywords: [],
      dateAdded: '2025-01-01',
    };
    
    const result = calculateRecipeCost(recipe, 'en', mockPrices);
    
    expect(result.ingredientCosts).toHaveLength(1);
    expect(result.totalCostRecipe).toBe(0.3); // (100/1000) * 3.0
  });

  it('includes fallback costs in total', () => {
    const recipe: Recipe = {
      id: 'test-recipe',
      category: 'test',
      title: { en: 'Test Recipe', ro: 'Rețetă Test' },
      prepTime: 30,
      servings: 4,
      effortLevel: 'easy',
      image: '/test.jpg',
      ingredients: [
        {
          name: { en: 'flour', ro: 'făină' },
          quantity: 100,
          unit: { en: 'g', ro: 'g' },
          ingredientId: 102,
        },
        {
          name: { en: 'mystery ingredient', ro: 'ingredient misterios' },
          quantity: 50,
          unit: { en: 'g', ro: 'g' },
          // No ingredientId - should use fallback
        },
      ],
      instructions: { en: ['Test'], ro: ['Test'] },
      personalNotes: { en: '', ro: '' },
      keywords: [],
      dateAdded: '2025-01-01',
    };
    
    const result = calculateRecipeCost(recipe, 'en', mockPrices);
    
    expect(result.ingredientCosts).toHaveLength(2);
    expect(result.ingredientCosts[1].matched).toBe(false);
    // Flour: (100/1000) * 3.0 = 0.3
    // Mystery: 0.2 * 4 = 0.8
    // Total: 1.1
    expect(result.totalCostRecipe).toBe(1.1);
  });
});

describe('formatPrice', () => {
  it('formats price with RON unit', () => {
    expect(formatPrice(2.5)).toBe('2.50 RON');
  });

  it('formats price without unit when specified', () => {
    expect(formatPrice(2.5, false)).toBe('2.50');
  });

  it('formats to 2 decimal places', () => {
    expect(formatPrice(2.123456)).toBe('2.12 RON');
    expect(formatPrice(2.999)).toBe('3.00 RON');
  });
});

describe('formatPricePerServing', () => {
  it('formats price per serving', () => {
    expect(formatPricePerServing(1.25)).toBe('1.25 RON / serving');
  });

  it('formats to 2 decimal places', () => {
    expect(formatPricePerServing(1.234)).toBe('1.23 RON / serving');
  });
});

describe('formatTotalCost', () => {
  it('formats total cost', () => {
    expect(formatTotalCost(9.4)).toBe('9.40 RON total');
  });

  it('formats to 2 decimal places', () => {
    expect(formatTotalCost(9.456)).toBe('9.46 RON total');
  });
});

describe('rounding behavior', () => {
  it('rounds ingredient costs correctly', () => {
    const ingredient: Ingredient = {
      name: { en: 'salt', ro: 'sare' },
      quantity: 3,
      unit: { en: 'g', ro: 'g' },
      ingredientId: 104,
    };
    
    const result = calculateIngredientCost(ingredient, 7, 'en', mockPrices);
    
    // (3/1000) * 1.5 = 0.0045, rounds to 0.00
    expect(result.costPerRecipe).toBe(0.00);
    // 0.0045 / 7 = 0.00064..., rounds to 0.00
    expect(result.costPerServing).toBe(0.00);
  });

  it('rounds up when necessary', () => {
    const ingredient: Ingredient = {
      name: { en: 'flour', ro: 'făină' },
      quantity: 333,
      unit: { en: 'g', ro: 'g' },
      ingredientId: 102,
    };
    
    const result = calculateIngredientCost(ingredient, 3, 'en', mockPrices);
    
    // (333/1000) * 3.0 = 0.999, rounds to 1.00
    expect(result.costPerRecipe).toBe(1.0);
    // 0.999 / 3 = 0.333, rounds to 0.33
    expect(result.costPerServing).toBe(0.33);
  });
});

describe('ingredient categorization', () => {
  it('assigns correct categories to ingredients', () => {
    expect(mockPrices.ingredients.olive_oil.category).toBe('Pantry');
    expect(mockPrices.ingredients.flour.category).toBe('Pantry');
    expect(mockPrices.ingredients.eggs.category).toBe('Proteins');
    expect(mockPrices.ingredients.salt.category).toBe('Spices & Seasonings');
    expect(mockPrices.ingredients.chicken.category).toBe('Proteins');
  });

  it('all categories are valid enum values', () => {
    const validCategories = ['Proteins', 'Dairy', 'Fruits and Vegetables', 'Spices & Seasonings', 'Pantry'];
    
    Object.values(mockPrices.ingredients).forEach((ingredient) => {
      expect(validCategories).toContain(ingredient.category);
    });
  });

  it('all actual price data has valid categories', async () => {
    const pricesData = await import('../data/prices.json');
    const validCategories = ['Proteins', 'Dairy', 'Fruits and Vegetables', 'Spices & Seasonings', 'Pantry', 'Meat & Poultry', 'Seafood', 'Grains & Pasta', 'Baking'];
    
    Object.values(pricesData.ingredients).forEach((ingredient: any) => {
      expect(ingredient).toHaveProperty('category');
      expect(validCategories).toContain(ingredient.category);
    });
  });
});
