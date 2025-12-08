/**
 * Pricing utilities for recipe cost calculation
 * Implements fuzzy ingredient matching and cost calculations based on prices.json
 */

import pricesData from '../data/prices.json';
import { Ingredient, Recipe } from '../types/recipe';

// Price configuration types
export interface PriceConfig {
  name: string;
  unit_type: 'mass' | 'volume' | 'piece';
  price_per_1000?: number;  // For mass/volume
  price_per_piece?: number;  // For pieces
}

export interface PricesData {
  ingredients: Record<string, PriceConfig>;
}

// Ingredient cost calculation results
export interface IngredientCost {
  ingredientName: string;
  costPerRecipe: number;  // Total cost for this ingredient in the recipe
  costPerServing: number; // Cost per serving for this ingredient
  matched: boolean;       // Whether a price was found or fallback used
}

export interface RecipeCost {
  ingredientCosts: IngredientCost[];
  totalCostRecipe: number;    // Total cost for entire recipe
  pricePerServing: number;    // Price per serving
}

// Constants
const FALLBACK_COST_PER_SERVING = 0.2; // RON per serving for unmatched ingredients
const MIN_MATCH_LENGTH = 4; // Minimum consecutive letters for fuzzy match

// Type guard for Ingredient (vs IngredientSection)
function isIngredient(item: any): item is Ingredient {
  return 'name' in item && 'quantity' in item && 'unit' in item && !('section' in item);
}

/**
 * Normalize a string for matching: lowercase, remove non-letters
 */
function normalizeForMatching(str: string): string {
  return str.toLowerCase().replace(/[^a-z]/g, '');
}

/**
 * Check if two strings share a substring of at least minLength consecutive letters
 */
function hasCommonSubstring(str1: string, str2: string, minLength: number): boolean {
  const normalized1 = normalizeForMatching(str1);
  const normalized2 = normalizeForMatching(str2);
  
  // Check all substrings of str1 of length >= minLength
  for (let i = 0; i < normalized1.length - minLength + 1; i++) {
    for (let len = minLength; len <= normalized1.length - i; len++) {
      const substring = normalized1.substring(i, i + len);
      if (normalized2.includes(substring)) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Find the longest common substring between two strings
 */
function longestCommonSubstring(str1: string, str2: string): number {
  const normalized1 = normalizeForMatching(str1);
  const normalized2 = normalizeForMatching(str2);
  let maxLength = 0;
  
  for (let i = 0; i < normalized1.length; i++) {
    for (let j = 0; j < normalized2.length; j++) {
      let length = 0;
      while (
        i + length < normalized1.length &&
        j + length < normalized2.length &&
        normalized1[i + length] === normalized2[j + length]
      ) {
        length++;
      }
      maxLength = Math.max(maxLength, length);
    }
  }
  
  return maxLength;
}

/**
 * Fuzzy match an ingredient name to price config entries
 * Returns the best matching price config, or undefined if no match
 */
export function fuzzyMatchIngredient(
  ingredientName: string,
  prices: PricesData = pricesData as PricesData
): PriceConfig | undefined {
  const candidates: Array<{ key: string; config: PriceConfig; matchLength: number }> = [];
  
  // Try to match against all price entries
  for (const [key, config] of Object.entries(prices.ingredients)) {
    // Check match against key
    if (hasCommonSubstring(ingredientName, key, MIN_MATCH_LENGTH)) {
      const matchLength = longestCommonSubstring(ingredientName, key);
      candidates.push({ key, config, matchLength });
    }
    // Check match against name field
    else if (hasCommonSubstring(ingredientName, config.name, MIN_MATCH_LENGTH)) {
      const matchLength = longestCommonSubstring(ingredientName, config.name);
      candidates.push({ key, config, matchLength });
    }
  }
  
  // No matches found
  if (candidates.length === 0) {
    return undefined;
  }
  
  // Sort by longest match and return the best one
  candidates.sort((a, b) => b.matchLength - a.matchLength);
  return candidates[0].config;
}

/**
 * Normalize quantity to base unit based on unit type
 * Returns quantity in grams (for mass), milliliters (for volume), or pieces
 */
function normalizeQuantity(
  quantity: number,
  unit: string,
  unitType: 'mass' | 'volume' | 'piece'
): number {
  const unitLower = unit.toLowerCase().trim();
  
  if (unitType === 'mass') {
    // Convert to grams
    if (unitLower === 'g' || unitLower === 'grams' || unitLower === 'gram') {
      return quantity;
    } else if (unitLower === 'kg' || unitLower === 'kilograms' || unitLower === 'kilogram') {
      return quantity * 1000;
    } else if (unitLower === 'linguriță' || unitLower === 'lingurita' || unitLower === 'tsp' || unitLower === 'teaspoon') {
      // 1 tsp ≈ 5g for most dry ingredients
      return quantity * 5;
    } else if (unitLower === 'lingură' || unitLower === 'lingura' || unitLower === 'linguri' || unitLower === 'tbsp' || unitLower === 'tablespoon') {
      // 1 tbsp ≈ 15g for most dry ingredients
      return quantity * 15;
    } else if (unitLower === 'praf' || unitLower === 'pinch') {
      // 1 pinch ≈ 0.5g
      return quantity * 0.5;
    }
    throw new Error(`Unsupported mass unit: ${unit}`);
  } else if (unitType === 'volume') {
    // Convert to milliliters
    if (unitLower === 'ml' || unitLower === 'milliliters' || unitLower === 'milliliter') {
      return quantity;
    } else if (unitLower === 'l' || unitLower === 'liters' || unitLower === 'liter') {
      return quantity * 1000;
    } else if (unitLower === 'linguriță' || unitLower === 'lingurita' || unitLower === 'tsp' || unitLower === 'teaspoon') {
      // 1 tsp ≈ 5ml
      return quantity * 5;
    } else if (unitLower === 'lingură' || unitLower === 'lingura' || unitLower === 'linguri' || unitLower === 'tbsp' || unitLower === 'tablespoon') {
      // 1 tbsp ≈ 15ml
      return quantity * 15;
    } else if (unitLower === 'cană' || unitLower === 'cana' || unitLower === 'căni' || unitLower === 'cani' || unitLower === 'cup' || unitLower === 'cups') {
      // 1 cup ≈ 240ml
      return quantity * 240;
    }
    throw new Error(`Unsupported volume unit: ${unit}`);
  } else if (unitType === 'piece') {
    // Pieces are already normalized
    if (unitLower === 'pcs' || unitLower === 'piece' || unitLower === 'pieces' || 
        unitLower === 'buc' || unitLower === 'bucată' || unitLower === 'bucăți' ||
        unitLower === 'bucata' || unitLower === 'bucati') {
      return quantity;
    }
    // For cloves, assume each clove counts as a piece
    if (unitLower === 'cloves' || unitLower === 'clove' || unitLower === 'căței' || unitLower === 'cățel' ||
        unitLower === 'catei' || unitLower === 'catel') {
      return quantity;
    }
    throw new Error(`Unsupported piece unit: ${unit}`);
  }
  
  throw new Error(`Unknown unit type: ${unitType}`);
}

/**
 * Calculate cost for a single ingredient
 */
export function calculateIngredientCost(
  ingredient: Ingredient,
  servings: number,
  language: 'en' | 'ro' = 'en',
  prices: PricesData = pricesData as PricesData
): IngredientCost {
  const ingredientName = ingredient.name[language];
  const unit = ingredient.unit[language];
  
  // Try to find a matching price
  const priceConfig = fuzzyMatchIngredient(ingredientName, prices);
  
  if (!priceConfig) {
    // Use fallback: 0.2 RON per serving
    return {
      ingredientName,
      costPerServing: FALLBACK_COST_PER_SERVING,
      costPerRecipe: FALLBACK_COST_PER_SERVING * servings,
      matched: false,
    };
  }
  
  // Calculate cost based on unit type
  try {
    const normalizedQty = normalizeQuantity(ingredient.quantity, unit, priceConfig.unit_type);
    let costPerRecipe: number;
    
    if (priceConfig.unit_type === 'mass' || priceConfig.unit_type === 'volume') {
      // Cost = (quantity / 1000) * price_per_1000
      costPerRecipe = (normalizedQty / 1000) * (priceConfig.price_per_1000 || 0);
    } else {
      // Cost = quantity * price_per_piece
      costPerRecipe = normalizedQty * (priceConfig.price_per_piece || 0);
    }
    
    return {
      ingredientName,
      costPerRecipe: Math.round(costPerRecipe * 100) / 100,
      costPerServing: Math.round((costPerRecipe / servings) * 100) / 100,
      matched: true,
    };
  } catch (error) {
    // If unit conversion fails, use fallback
    console.warn(`Failed to calculate cost for ${ingredientName}: ${error}`);
    return {
      ingredientName,
      costPerServing: FALLBACK_COST_PER_SERVING,
      costPerRecipe: FALLBACK_COST_PER_SERVING * servings,
      matched: false,
    };
  }
}

/**
 * Calculate total cost for a recipe
 */
export function calculateRecipeCost(
  recipe: Recipe,
  language: 'en' | 'ro' = 'en',
  prices: PricesData = pricesData as PricesData
): RecipeCost {
  const ingredientCosts: IngredientCost[] = [];
  
  for (const item of recipe.ingredients) {
    // Skip section headings
    if (!isIngredient(item)) {
      continue;
    }
    
    const cost = calculateIngredientCost(item, recipe.servings, language, prices);
    ingredientCosts.push(cost);
  }
  
  // Calculate totals
  const totalCostRecipe = ingredientCosts.reduce((sum, cost) => sum + cost.costPerRecipe, 0);
  const pricePerServing = ingredientCosts.reduce((sum, cost) => sum + cost.costPerServing, 0);
  
  return {
    ingredientCosts,
    totalCostRecipe: Math.round(totalCostRecipe * 100) / 100,
    pricePerServing: Math.round(pricePerServing * 100) / 100,
  };
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
