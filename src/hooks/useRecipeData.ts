import { useState, useEffect } from 'react';
import { Recipe } from '../types/recipe';

// Dynamically import all recipe JSON files from all category folders
// This uses Vite's import.meta.glob feature to automatically discover and load all recipes
const recipeModules = import.meta.glob<{ default: Recipe }>('../data/recipes/**/*.json', { eager: true });

/**
 * Custom hook to load and manage all recipe data
 * Automatically loads all JSON files from all 8 category folders
 * Category is automatically assigned based on folder location
 * Recipes are sorted by dateAdded in ascending order (oldest first)
 * 
 * @returns Object containing recipes array and utility functions
 */
export function useRecipeData() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      // Load all recipes from the imported modules
      const allRecipes: Recipe[] = Object.entries(recipeModules).map(([path, module]) => {
        const recipe = module.default;
        
        // Extract category from file path (e.g., '../data/recipes/breakfast/omleta.json' -> 'breakfast')
        const pathParts = path.split('/');
        const categoryIndex = pathParts.findIndex(part => part === 'recipes') + 1;
        const category = pathParts[categoryIndex];
        
        // Extract recipe ID from filename (e.g., 'omleta.json' -> 'omleta')
        const filename = pathParts[pathParts.length - 1];
        const id = filename.replace('.json', '');
        
        return {
          ...recipe,
          id,
          category,
        };
      });

      // Sort recipes by dateAdded in ascending order (oldest first)
      allRecipes.sort((a, b) => {
        const dateA = new Date(a.dateAdded).getTime();
        const dateB = new Date(b.dateAdded).getTime();
        return dateA - dateB;
      });

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
