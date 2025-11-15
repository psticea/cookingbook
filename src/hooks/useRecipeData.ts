import { useState, useEffect } from 'react';
import { Recipe } from '../types/recipe';

// Import all recipe JSON files
import recipe001 from '../data/recipes/recipe-001.json';
import recipe002 from '../data/recipes/recipe-002.json';
import recipe003 from '../data/recipes/recipe-003.json';
import recipe004 from '../data/recipes/recipe-004.json';
import recipe005 from '../data/recipes/recipe-005.json';

/**
 * Custom hook to load and manage all recipe data
 * Provides access to all recipes and utility functions for filtering
 * 
 * @returns Object containing recipes array and utility functions
 */
export function useRecipeData() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      // Combine all imported recipes into a single array
      const allRecipes: Recipe[] = [
        recipe001 as Recipe,
        recipe002 as Recipe,
        recipe003 as Recipe,
        recipe004 as Recipe,
        recipe005 as Recipe,
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
