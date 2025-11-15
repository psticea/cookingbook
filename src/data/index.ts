/**
 * Data exports for recipes, categories, filter keywords, and translations
 */

import categoriesData from './categories.json';
import filterKeywordsData from './filter-keywords.json';
import translationsData from './translations.json';

// Import recipe data
import recipe001 from './recipes/recipe-001.json';
import recipe002 from './recipes/recipe-002.json';
import recipe003 from './recipes/recipe-003.json';
import recipe004 from './recipes/recipe-004.json';
import recipe005 from './recipes/recipe-005.json';

import type { Recipe } from '../types/recipe';
import type { FilterKeyword } from '../types/filter';
import type { MultilingualText } from '../types/common';

// Export categories
export const categories = categoriesData as Array<{
  id: string;
  name: MultilingualText;
}>;

// Export filter keywords
export const filterKeywords = filterKeywordsData as FilterKeyword[];

// Export translations
export const translations = translationsData as {
  ro: Record<string, string>;
  en: Record<string, string>;
};

// Export all recipes as an array
export const recipes: Recipe[] = [
  recipe001,
  recipe002,
  recipe003,
  recipe004,
  recipe005,
] as Recipe[];

// Helper function to get recipe by ID
export const getRecipeById = (id: string): Recipe | undefined => {
  return recipes.find((recipe) => recipe.id === id);
};

// Helper function to get recipes by category
export const getRecipesByCategory = (categoryId: string): Recipe[] => {
  return recipes.filter((recipe) => recipe.category === categoryId);
};

// Helper function to get recipes by keywords (all keywords must match)
export const getRecipesByKeywords = (keywords: string[]): Recipe[] => {
  if (keywords.length === 0) return recipes;
  return recipes.filter((recipe) =>
    keywords.every((keyword) => recipe.keywords.includes(keyword))
  );
};
