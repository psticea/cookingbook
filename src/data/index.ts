/**
 * Data exports for recipes, categories, filter keywords, and translations
 * Recipes are dynamically loaded from all 8 category folders
 * Just add or remove JSON files - no need to update this file!
 */

import categoriesData from './categories.json';
import filterKeywordsData from './filter-keywords.json';
import translationsData from './translations.json';

import type { Recipe } from '../types/recipe';
import type { FilterKeyword } from '../types/filter';
import type { MultilingualText } from '../types/common';

// Export categories with folder mappings
export const categories = categoriesData as Array<{
  id: string;
  folder: string;
  name: MultilingualText;
}>;

// Export filter keywords
export const filterKeywords = filterKeywordsData as FilterKeyword[];

// Export translations
export const translations = translationsData as {
  ro: Record<string, string>;
  en: Record<string, string>;
};

// Dynamically import all recipe JSON files from all category folders
// This uses Vite's import.meta.glob to automatically load all .json files
// Just add or remove recipe files - they'll be loaded automatically!
const recipeModules = import.meta.glob<{ default: Recipe }>('./recipes/**/*.json', { 
  eager: true 
});

// Extract recipes from the imported modules
export const recipes: Recipe[] = Object.values(recipeModules).map(
  (module) => module.default
);

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
