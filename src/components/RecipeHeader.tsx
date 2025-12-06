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
    <header className="mb-8 sm:mb-10">
      {/* Recipe Title - minimalist design */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
        {recipe.title[language]}
      </h1>
    </header>
  );
};
