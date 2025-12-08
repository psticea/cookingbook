/**
 * Price-related type definitions
 */

export type UnitType = 'mass' | 'volume' | 'piece';

export interface PriceIngredient {
  name: string;
  unit_type: UnitType;
  price_per_1000?: number; // For mass/volume (RON per 1000g or 1000ml)
  price_per_piece?: number; // For pieces (RON per piece)
}

export interface PricesData {
  ingredients: {
    [key: string]: PriceIngredient;
  };
}

export interface IngredientCost {
  ingredientName: string;
  totalCost: number; // RON for the whole recipe
  costPerServing: number; // RON per serving
  matched: boolean; // Whether ingredient was matched in prices.json
}

export interface RecipeCost {
  totalCost: number; // RON for the whole recipe
  pricePerServing: number; // RON per serving
  ingredientCosts: IngredientCost[];
}
