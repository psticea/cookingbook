/**
 * Pricing utilities for recipe cost calculation
 * Implements ID-based ingredient matching and cost calculations based on prices.json
 */

import pricesData from '../data/prices.json';
import type { Ingredient, IngredientItem, Recipe } from '../types/recipe';

// Price configuration types
export interface PriceConfig {
  id?: number;            // Optional 3-digit ingredient ID (100-999) - used for recipe matching
  name: string;
  category: 'Proteins' | 'Dairy' | 'Fruits and Vegetables' | 'Spices & Seasonings' | 'Pantry';
  unit_type: 'mass' | 'volume' | 'piece';
  price_per_1000?: number;  // For mass/volume
  price_per_piece?: number;  // For pieces
}

export interface PricesData {
  ingredients: Record<string, PriceConfig>;
}

export type IngredientCost = {
  ingredientName: string;
} & (
  | { matched: true; costPerRecipe: number; costPerServing: number }
  | {
      matched: false;
      costPerRecipe: null;
      costPerServing: null;
      reason: 'missing-price' | 'unsupported-unit' | 'invalid-price' | 'invalid-quantity';
    }
);

export interface RecipeCost {
  ingredientCosts: IngredientCost[];
  // For partial estimates these amounts are the known subtotal, not a full cost.
  totalCostRecipe: number | null;
  pricePerServing: number | null;
  status: 'complete' | 'partial' | 'unavailable';
  pricedIngredientCount: number;
  unpricedIngredientCount: number;
}

function isIngredient(item: IngredientItem): item is Ingredient {
  return !('section' in item);
}

function unavailableCost(
  ingredientName: string,
  reason: Extract<IngredientCost, { matched: false }>['reason']
): IngredientCost {
  return { ingredientName, matched: false, costPerRecipe: null, costPerServing: null, reason };
}

function validServings(servings: number): boolean {
  return Number.isFinite(servings) && servings > 0;
}

function roundPrice(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Match ingredient by ID to price config entries
 * Returns the price config with matching ID, or undefined if not found
 */
export function matchIngredientById(
  ingredientId: number,
  prices: PricesData = pricesData as PricesData
): PriceConfig | undefined {
  // Find the price entry with matching ID
  for (const config of Object.values(prices.ingredients)) {
    if (config.id === ingredientId) {
      return config;
    }
  }
  return undefined;
}

/**
 * Normalize to grams, milliliters or pieces; null means no supported conversion.
 * Preserve the existing spoon/pinch assumptions, without adding density guesses.
 */
function normalizeQuantity(
  quantity: number,
  unit: string,
  unitType: PriceConfig['unit_type']
): number | null {
  if (typeof unit !== 'string') return null;
  const normalizedUnit = unit.toLowerCase().trim();
  const teaspoon = ['linguriță', 'lingurita', 'lingurițe', 'lingurite', 'tsp', 'teaspoon', 'teaspoons'];
  const tablespoon = ['lingură', 'lingura', 'linguri', 'tbsp', 'tablespoon', 'tablespoons'];

  if (unitType === 'mass') {
    if (['g', 'grams', 'gram'].includes(normalizedUnit)) return quantity;
    if (['kg', 'kilograms', 'kilogram'].includes(normalizedUnit)) return quantity * 1000;
    if (teaspoon.includes(normalizedUnit)) return quantity * 5;
    if (tablespoon.includes(normalizedUnit)) return quantity * 15;
    if (['praf', 'pinch', 'pinches'].includes(normalizedUnit)) return quantity * 0.5;
  } else if (unitType === 'volume') {
    if (['ml', 'milliliters', 'milliliter', 'millilitres', 'millilitre'].includes(normalizedUnit)) return quantity;
    if (['l', 'liters', 'liter', 'litres', 'litre', 'litri', 'litru'].includes(normalizedUnit)) return quantity * 1000;
    if (teaspoon.includes(normalizedUnit)) return quantity * 5;
    if (tablespoon.includes(normalizedUnit)) return quantity * 15;
    if (['cană', 'cana', 'căni', 'cani', 'cup', 'cups'].includes(normalizedUnit)) return quantity * 240;
  } else if (unitType === 'piece') {
    // Keep existing clove, slice and packet mappings to the priced piece.
    if ([
      'pcs', 'piece', 'pieces', 'buc', 'bucată', 'bucăți', 'bucata', 'bucati',
      'cloves', 'clove', 'căței', 'cățel', 'catei', 'catel',
      'slices', 'slice', 'felii', 'felie', 'packet', 'packets', 'plic', 'plicuri',
    ].includes(normalizedUnit)) return quantity;
  }
  return null;
}

/** Calculate one ingredient at the supplied quantity (no placeholder prices). */
export function calculateIngredientCost(
  ingredient: Ingredient,
  servings: number,
  language: 'en' | 'ro' = 'en',
  prices: PricesData = pricesData as PricesData
): IngredientCost {
  const ingredientName = ingredient.name[language];
  // Zero is a valid quantity/rate; missing, negative and non-finite values are not.
  if (!validServings(servings) || !Number.isFinite(ingredient.quantity) || ingredient.quantity < 0) {
    return unavailableCost(ingredientName, 'invalid-quantity');
  }

  const priceConfig = ingredient.ingredientId === undefined
    ? undefined
    : matchIngredientById(ingredient.ingredientId, prices);
  if (!priceConfig) return unavailableCost(ingredientName, 'missing-price');

  // Conversion is based on the recipe's source unit, never its translated label.
  const normalizedQuantity = normalizeQuantity(ingredient.quantity, ingredient.unit.en, priceConfig.unit_type);
  if (normalizedQuantity === null) return unavailableCost(ingredientName, 'unsupported-unit');
  if (!Number.isFinite(normalizedQuantity)) return unavailableCost(ingredientName, 'invalid-quantity');

  const rate = priceConfig.unit_type === 'piece' ? priceConfig.price_per_piece : priceConfig.price_per_1000;
  if (typeof rate !== 'number' || !Number.isFinite(rate) || rate < 0) {
    return unavailableCost(ingredientName, 'invalid-price');
  }

  const rawCost = priceConfig.unit_type === 'piece'
    ? normalizedQuantity * rate
    : (normalizedQuantity / 1000) * rate;
  const costPerRecipe = roundPrice(rawCost);
  const costPerServing = roundPrice(costPerRecipe / servings);
  if (!Number.isFinite(costPerRecipe) || !Number.isFinite(costPerServing)) {
    return unavailableCost(ingredientName, 'invalid-price');
  }
  return { ingredientName, matched: true, costPerRecipe, costPerServing };
}

/** Calculate selected quantities before rounding, rather than scaling rounded costs. */
export function calculateRecipeCost(
  recipe: Pick<Recipe, 'ingredients' | 'servings'>,
  language: 'en' | 'ro' = 'en',
  prices: PricesData = pricesData as PricesData,
  currentServings: number = recipe.servings
): RecipeCost {
  const servingsAreValid = validServings(recipe.servings) && validServings(currentServings);
  const ingredientCosts = recipe.ingredients.filter(isIngredient).map(item =>
    servingsAreValid && Number.isFinite(item.quantity) && item.quantity >= 0
      ? calculateIngredientCost(
          { ...item, quantity: item.quantity * (currentServings / recipe.servings) },
          currentServings,
          language,
          prices
        )
      : unavailableCost(item.name[language], 'invalid-quantity')
  );
  const pricedIngredientCount = ingredientCosts.filter(cost => cost.matched).length;
  const unpricedIngredientCount = ingredientCosts.length - pricedIngredientCount;
  const status = pricedIngredientCount === 0 ? 'unavailable' : unpricedIngredientCount > 0 ? 'partial' : 'complete';

  // Sum rounded receipt lines in integer cents so the displayed lines reconcile.
  // Derive the per-serving estimate from that same total, not rounded serving lines.
  const totalCents = ingredientCosts.reduce((sum, cost) =>
    cost.matched ? sum + Math.round(cost.costPerRecipe * 100) : sum, 0);
  const totalCostRecipe = pricedIngredientCount > 0 ? totalCents / 100 : null;
  const pricePerServing = totalCostRecipe === null ? null : roundPrice(totalCostRecipe / currentServings);

  return { ingredientCosts, totalCostRecipe, pricePerServing, status, pricedIngredientCount, unpricedIngredientCount };
}

/** Complete estimates first in BOTH directions; incomplete estimates retain input order. */
export function compareRecipeCosts(a: RecipeCost, b: RecipeCost, order: 'asc' | 'desc' = 'asc'): number {
  const aComplete = a.status === 'complete' && a.pricePerServing !== null && Number.isFinite(a.pricePerServing);
  const bComplete = b.status === 'complete' && b.pricePerServing !== null && Number.isFinite(b.pricePerServing);
  if (aComplete !== bComplete) return aComplete ? -1 : 1;
  if (!aComplete || !bComplete || a.pricePerServing === null || b.pricePerServing === null) return 0;
  const comparison = a.pricePerServing - b.pricePerServing;
  return order === 'asc' ? comparison : -comparison;
}

/**
 * Format a price for display
 */
export function formatPrice(price: number, showUnit: boolean = true): string {
  const formatted = price.toFixed(2);
  return showUnit ? `${formatted} RON` : formatted;
}

/**
 * Format price per serving for display
 */
export function formatPricePerServing(price: number): string {
  return `${price.toFixed(2)} RON / serving`;
}

/**
 * Format total recipe cost for display
 */
export function formatTotalCost(price: number): string {
  return `${price.toFixed(2)} RON total`;
}
