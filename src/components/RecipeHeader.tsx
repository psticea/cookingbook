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
      <h1 className="text-3xl font-bold text-text-main-light dark:text-text-main-dark tracking-tight">
        {recipe.title[language]}
      </h1>
    </header>
  );
};
