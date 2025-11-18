import React from 'react';
import { Recipe } from '../types/recipe';
import { useLanguage } from '../hooks/useLanguage';

interface RecipeHeaderProps {
  recipe: Recipe;
}

/**
 * RecipeHeader component
 * Displays recipe title only
 * Metadata (prep time, servings, difficulty) is now shown in IngredientList component
 * Supports both Romanian and English text
 */
export const RecipeHeader: React.FC<RecipeHeaderProps> = ({ recipe }) => {
  const { language } = useLanguage();

  return (
    <header className="mb-4">
      {/* Recipe Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
        {recipe.title[language]}
      </h1>
    </header>
  );
};
