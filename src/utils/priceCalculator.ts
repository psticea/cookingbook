/**
 * Price calculation utilities
 */

import { PricesData, PriceIngredient, IngredientCost, RecipeCost } from '../types/price';
import { Ingredient, IngredientItem } from '../types/recipe';
import { findMatchingIngredient } from './fuzzyMatch';
import pricesData from '../data/prices.json';

const FALLBACK_COST_PER_SERVING = 0.2; // RON

/**
 * Convert quantity to base unit (grams for mass, ml for volume, pieces for pieces)
 */
function normalizeQuantity(quantity: number, unit: string, unitType: string): number {
  const normalizedUnit = unit.toLowerCase().trim();
  
  if (unitType === 'mass') {
    if (normalizedUnit === 'g') return quantity;
    if (normalizedUnit === 'kg') return quantity * 1000;
    // Handle Tbsp, tsp conversions for mass (approximate)
    if (normalizedUnit === 'tbsp' || normalizedUnit === 'lingură' || normalizedUnit === 'linguri') {
      return quantity * 15; // 1 Tbsp ≈ 15g (approximate for dry ingredients)
    }
    if (normalizedUnit === 'tsp' || normalizedUnit === 'linguriță') {
      return quantity * 5; // 1 tsp ≈ 5g (approximate for dry ingredients)
    }
    // Default to grams if unit is unclear
    return quantity;
  }
  
  if (unitType === 'volume') {
    if (normalizedUnit === 'ml') return quantity;
    if (normalizedUnit === 'l') return quantity * 1000;
    // Handle Tbsp, tsp conversions (approximate)
    if (normalizedUnit === 'tbsp' || normalizedUnit === 'lingură' || normalizedUnit === 'linguri') {
      return quantity * 15; // 1 Tbsp ≈ 15ml
    }
    if (normalizedUnit === 'tsp' || normalizedUnit === 'linguriță') {
      return quantity * 5; // 1 tsp ≈ 5ml
    }
    // Default to ml if unit is unclear
    return quantity;
  }
  
  if (unitType === 'piece') {
    // Handle various piece representations
    if (normalizedUnit === 'pcs' || normalizedUnit === 'piece' || normalizedUnit === 'pieces' || normalizedUnit === 'buc') {
      return quantity;
    }
    // Default to quantity as-is for pieces
    return quantity;
  }
  
  return quantity;
}

/**
 * Calculate cost for a single ingredient
 */
function calculateIngredientCost(
  ingredient: Ingredient,
  priceInfo: PriceIngredient,
  servings: number,
  language: 'ro' | 'en'
): IngredientCost {
  const ingredientName = ingredient.name[language];
  const unit = ingredient.unit[language];
  const quantity = ingredient.quantity;
  
  const normalizedQty = normalizeQuantity(quantity, unit, priceInfo.unit_type);
  
  let totalCost = 0;
  
  if (priceInfo.unit_type === 'mass' || priceInfo.unit_type === 'volume') {
    // Price per 1000 units
    const pricePerUnit = priceInfo.price_per_1000 || 0;
    totalCost = (normalizedQty / 1000) * pricePerUnit;
  } else if (priceInfo.unit_type === 'piece') {
    // Price per piece
    const pricePerPiece = priceInfo.price_per_piece || 0;
    totalCost = normalizedQty * pricePerPiece;
  }
  
  const costPerServing = totalCost / servings;
  
  return {
    ingredientName,
    totalCost,
    costPerServing,
    matched: true,
  };
}

/**
 * Calculate fallback cost for unmatched ingredient
 */
function calculateFallbackCost(
  ingredient: Ingredient,
  servings: number,
  language: 'ro' | 'en'
): IngredientCost {
  return {
    ingredientName: ingredient.name[language],
    totalCost: FALLBACK_COST_PER_SERVING * servings,
    costPerServing: FALLBACK_COST_PER_SERVING,
    matched: false,
  };
}

/**
 * Check if item is an ingredient (not a section heading)
 */
function isIngredient(item: IngredientItem): item is Ingredient {
  return 'name' in item && 'quantity' in item && 'unit' in item;
}

/**
 * Calculate total recipe cost
 */
export function calculateRecipeCost(
  ingredients: IngredientItem[],
  servings: number,
  language: 'ro' | 'en' = 'en'
): RecipeCost {
  const prices = pricesData as PricesData;
  const ingredientCosts: IngredientCost[] = [];
  
  for (const item of ingredients) {
    if (!isIngredient(item)) {
      continue; // Skip section headings
    }
    
    const ingredient = item as Ingredient;
    const ingredientName = ingredient.name[language];
    
    // Try to find matching price
    const matchedKey = findMatchingIngredient(ingredientName, prices.ingredients);
    
    if (matchedKey && prices.ingredients[matchedKey]) {
      const priceInfo = prices.ingredients[matchedKey];
      const cost = calculateIngredientCost(ingredient, priceInfo, servings, language);
      ingredientCosts.push(cost);
    } else {
      // Use fallback cost
      const cost = calculateFallbackCost(ingredient, servings, language);
      ingredientCosts.push(cost);
    }
  }
  
  const totalCost = ingredientCosts.reduce((sum, cost) => sum + cost.totalCost, 0);
  const pricePerServing = totalCost / servings;
  
  return {
    totalCost: Math.round(totalCost * 100) / 100, // Round to 2 decimals
    pricePerServing: Math.round(pricePerServing * 100) / 100,
    ingredientCosts,
  };
}

/**
 * Format price for display
 */
export function formatPrice(price: number, includePerServing: boolean = false): string {
  const formatted = price.toFixed(2);
  return includePerServing ? `${formatted} RON / serving` : `${formatted} RON`;
}
