/**
 * Data exports for recipes, categories, filter keywords, and translations
 * Recipes are organized in 8 category folders for easy management
 */

import categoriesData from './categories.json';
import filterKeywordsData from './filter-keywords.json';
import translationsData from './translations.json';

// Import recipes from all 8 category folders
import sarmaleCuMamaliga from './recipes/main-courses/sarmale-cu-mamaliga.json';
import puiMarinatLaCuptor from './recipes/main-courses/pui-marinat-la-cuptor.json';
import ciorbaDeBurta from './recipes/soups-and-stews/ciorba-de-burta.json';
import spaghettiCarbonara from './recipes/pasta/spaghetti-carbonara.json';
import omletaCuBranza from './recipes/breakfast/omleta-cu-branza.json';
import puiCuLegume from './recipes/stir-fries/pui-cu-legume.json';
import salataCaesar from './recipes/salads-and-bites/salata-caesar.json';
import burgerClasic from './recipes/burgers-and-wraps/burger-clasic.json';
import orezFiert from './recipes/basics/orez-fiert.json';

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

// Export all recipes from all category folders
// Category is automatically set based on folder location
export const recipes: Recipe[] = [
  sarmaleCuMamaliga,
  puiMarinatLaCuptor,
  ciorbaDeBurta,
  spaghettiCarbonara,
  omletaCuBranza,
  puiCuLegume,
  salataCaesar,
  burgerClasic,
  orezFiert,
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
