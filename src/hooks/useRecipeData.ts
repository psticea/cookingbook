import { useState, useEffect } from 'react';
import { Recipe } from '../types/recipe';

// Import recipes from all 8 category folders
import sarmaleCuMamaliga from '../data/recipes/main-courses/sarmale-cu-mamaliga.json';
import ciorbaDeBurta from '../data/recipes/soups-and-stews/ciorba-de-burta.json';
import spaghettiCarbonara from '../data/recipes/pasta/spaghetti-carbonara.json';
import omletaCuBranza from '../data/recipes/breakfast/omleta-cu-branza.json';
import puiCuLegume from '../data/recipes/stir-fries/pui-cu-legume.json';
import salataCaesar from '../data/recipes/salads-and-bites/salata-caesar.json';
import burgerClasic from '../data/recipes/burgers-and-wraps/burger-clasic.json';
import orezFiert from '../data/recipes/basics/orez-fiert.json';

/**
 * Custom hook to load and manage all recipe data
 * Loads recipes from all 8 category folders dynamically
 * Category is automatically assigned based on folder location
 * 
 * @returns Object containing recipes array and utility functions
 */
export function useRecipeData() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      // Combine all imported recipes from all category folders
      const allRecipes: Recipe[] = [
        sarmaleCuMamaliga as Recipe,
        ciorbaDeBurta as Recipe,
        spaghettiCarbonara as Recipe,
        omletaCuBranza as Recipe,
        puiCuLegume as Recipe,
        salataCaesar as Recipe,
        burgerClasic as Recipe,
        orezFiert as Recipe,
      ];

      setRecipes(allRecipes);
      setLoading(false);
    } catch (err) {
      console.error('Error loading recipe data:', err);
      setError(err instanceof Error ? err : new Error('Failed to load recipes'));
      setLoading(false);
    }
  }, []);

  return {
    recipes,
    loading,
    error,
  };
}

/**
 * Find a recipe by its unique ID
 * 
 * @param recipes - Array of all recipes
 * @param id - The recipe ID to search for
 * @returns The matching recipe or undefined if not found
 */
export function getRecipeById(recipes: Recipe[], id: string): Recipe | undefined {
  return recipes.find(recipe => recipe.id === id);
}

/**
 * Get all recipes belonging to a specific category
 * 
 * @param recipes - Array of all recipes
 * @param category - The category ID to filter by
 * @returns Array of recipes in the specified category
 */
export function getRecipesByCategory(recipes: Recipe[], category: string): Recipe[] {
  return recipes.filter(recipe => recipe.category === category);
}

/**
 * Get recipes that match ALL specified filter keywords
 * If no keywords are provided, returns all recipes
 * 
 * @param recipes - Array of all recipes
 * @param keywords - Array of keyword IDs to filter by
 * @returns Array of recipes matching all keywords
 */
export function getRecipesByKeywords(recipes: Recipe[], keywords: string[]): Recipe[] {
  // If no keywords selected, return all recipes
  if (keywords.length === 0) {
    return recipes;
  }

  // Return only recipes that contain ALL selected keywords
  return recipes.filter(recipe => 
    keywords.every(keyword => recipe.keywords.includes(keyword))
  );
}
