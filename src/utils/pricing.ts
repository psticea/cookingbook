/**
 * Pricing utilities for calculating recipe costs
 */

import pricesData from '../data/prices.json';
import { IngredientItem } from '../types/recipe';

/**
 * Conversion factors for unit normalization
 */
const CONVERSIONS = {
  // Teaspoon conversions (approximate)
  TSP_TO_GRAMS: 5,
  TSP_TO_ML: 5,
  // Tablespoon conversions
  TBSP_TO_GRAMS: 15,
  TBSP_TO_ML: 15,
  // Cup conversions (approximate)
  CUP_TO_GRAMS: 200,
  CUP_TO_ML: 240,
  // Larger units
  KG_TO_GRAMS: 1000,
  LITERS_TO_ML: 1000,
} as const;

export interface PriceConfig {
  name: string;
  unit_type: 'mass' | 'volume' | 'piece';
  price_per_1000?: number; // For mass/volume
  price_per_piece?: number; // For pieces
}

export interface PricesData {
  ingredients: Record<string, PriceConfig>;
}

export interface IngredientCost {
  totalCost: number; // Total cost for the recipe
  costPerServing: number; // Cost per serving
  matched: boolean; // Whether ingredient was matched in prices.json
}

const prices: PricesData = pricesData as PricesData;

/**
 * Find common substring of at least minLength consecutive letters between two strings
 * Case-insensitive, ignores non-letter characters
 * Special case: if both strings are identical after cleaning and < minLength, returns the string
 * Also checks if one string contains the other for short matches
 */
function findCommonSubstring(str1: string, str2: string, minLength: number = 4): string | null {
  const clean1 = str1.toLowerCase().replace(/[^a-z]/g, '');
  const clean2 = str2.toLowerCase().replace(/[^a-z]/g, '');
  
  // Special case: exact match for short words
  if (clean1 === clean2 && clean1.length > 0) {
    return clean1;
  }
  
  // Special case: one contains the other and both are short
  if (clean1.length < minLength && clean2.includes(clean1)) {
    return clean1;
  }
  if (clean2.length < minLength && clean1.includes(clean2)) {
    return clean2;
  }
  
  let longestMatch = '';
  
  // Early termination: if remaining string is shorter than current longest match, we can stop
  for (let i = 0; i < clean1.length; i++) {
    // Skip if remaining string can't produce a longer match
    if (clean1.length - i <= longestMatch.length) {
      break;
    }
    
    for (let len = minLength; i + len <= clean1.length; len++) {
      const substring = clean1.substring(i, i + len);
      if (clean2.includes(substring) && substring.length > longestMatch.length) {
        longestMatch = substring;
      }
    }
  }
  
  return longestMatch.length >= minLength ? longestMatch : null;
}

/**
 * Fuzzy match an ingredient name to a price config
 * Returns the best matching price config or null
 */
export function matchIngredient(ingredientName: string): PriceConfig | null {
  const candidates: Array<{ key: string; config: PriceConfig; matchLength: number }> = [];
  
  for (const [key, config] of Object.entries(prices.ingredients)) {
    // Try matching against both the key and the name
    const keyMatch = findCommonSubstring(ingredientName, key);
    const nameMatch = findCommonSubstring(ingredientName, config.name);
    
    const bestMatch = [keyMatch, nameMatch]
      .filter(m => m !== null)
      .sort((a, b) => (b?.length || 0) - (a?.length || 0))[0];
    
    if (bestMatch) {
      candidates.push({
        key,
        config,
        matchLength: bestMatch.length
      });
    }
  }
  
  if (candidates.length === 0) {
    return null;
  }
  
  // Return the candidate with the longest match
  candidates.sort((a, b) => b.matchLength - a.matchLength);
  return candidates[0].config;
}

/**
 * Normalize quantity to base units based on unit type
 * Returns normalized quantity in grams, milliliters, or pieces
 */
function normalizeQuantity(quantity: number, unit: string, unitType: 'mass' | 'volume' | 'piece'): number {
  const unitLower = unit.toLowerCase();
  
  if (unitType === 'mass') {
    if (unitLower === 'kg') return quantity * CONVERSIONS.KG_TO_GRAMS;
    if (unitLower === 'g') return quantity;
    // For other units like tsp, tbsp - these are tricky because they depend on ingredient
    // We'll make some reasonable assumptions
    if (unitLower === 'tsp' || unitLower === 'linguriță') return quantity * CONVERSIONS.TSP_TO_GRAMS;
    if (unitLower === 'tbsp' || unitLower === 'lingură') return quantity * CONVERSIONS.TBSP_TO_GRAMS;
    if (unitLower === 'cup') return quantity * CONVERSIONS.CUP_TO_GRAMS;
    if (unitLower === 'cups') return quantity * CONVERSIONS.CUP_TO_GRAMS;
  } else if (unitType === 'volume') {
    if (unitLower === 'l' || unitLower === 'liters') return quantity * CONVERSIONS.LITERS_TO_ML;
    if (unitLower === 'ml') return quantity;
    if (unitLower === 'tsp' || unitLower === 'linguriță') return quantity * CONVERSIONS.TSP_TO_ML;
    if (unitLower === 'tbsp' || unitLower === 'lingură') return quantity * CONVERSIONS.TBSP_TO_ML;
    if (unitLower === 'cup') return quantity * CONVERSIONS.CUP_TO_ML;
    if (unitLower === 'cups') return quantity * CONVERSIONS.CUP_TO_ML;
  } else if (unitType === 'piece') {
    if (unitLower === 'pcs' || unitLower === 'piece' || unitLower === 'pieces' || 
        unitLower === 'buc' || unitLower === 'cloves' || unitLower === 'căței') {
      return quantity;
    }
    // For units like lemon, assume 1 lemon = 1 piece
    if (unitLower === 'lemon') return quantity;
  }
  
  // Default: return as-is
  return quantity;
}

/**
 * Calculate the cost of a single ingredient
 */
export function calculateIngredientCost(
  ingredientName: string,
  quantity: number,
  unit: string,
  servings: number
): IngredientCost {
  const priceConfig = matchIngredient(ingredientName);
  
  if (!priceConfig) {
    // Use fallback: 0.2 RON per serving
    return {
      totalCost: 0.2 * servings,
      costPerServing: 0.2,
      matched: false
    };
  }
  
  const normalizedQty = normalizeQuantity(quantity, unit, priceConfig.unit_type);
  
  let totalCost: number;
  
  if (priceConfig.unit_type === 'piece') {
    totalCost = normalizedQty * (priceConfig.price_per_piece || 0);
  } else {
    // mass or volume
    totalCost = (normalizedQty / 1000) * (priceConfig.price_per_1000 || 0);
  }
  
  return {
    totalCost,
    costPerServing: totalCost / servings,
    matched: true
  };
}

/**
 * Calculate total recipe costs
 */
export interface RecipeCosts {
  pricePerServing: number;
  totalCost: number;
  ingredientCosts: Map<number, IngredientCost>; // Map from ingredient index to cost
}

export function calculateRecipeCosts(
  ingredients: IngredientItem[],
  servings: number,
  language: 'ro' | 'en' = 'en'
): RecipeCosts {
  const ingredientCosts = new Map<number, IngredientCost>();
  let totalCost = 0;
  
  ingredients.forEach((item, index) => {
    if ('section' in item) {
      // Skip section headers
      return;
    }
    
    const ingredientName = item.name[language];
    const unit = item.unit[language];
    
    const cost = calculateIngredientCost(ingredientName, item.quantity, unit, servings);
    ingredientCosts.set(index, cost);
    totalCost += cost.totalCost;
  });
  
  return {
    pricePerServing: totalCost / servings,
    totalCost,
    ingredientCosts
  };
}

/**
 * Format a price value as RON with 2 decimal places
 */
export function formatPrice(price: number): string {
  return price.toFixed(2);
}

/**
 * Format price per serving
 */
export function formatPricePerServing(price: number): string {
  return `${formatPrice(price)} RON / serving`;
}

/**
 * Format total price
 */
export function formatTotalPrice(price: number): string {
  return `${formatPrice(price)} RON total`;
}

/**
 * Format ingredient price (just the amount)
 */
export function formatIngredientPrice(price: number): string {
  return `${formatPrice(price)} RON`;
}
