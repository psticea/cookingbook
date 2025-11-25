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
    <header className="mb-6 sm:mb-8">
      {/* Recipe Title with decorative underline */}
      <div className="border-b-4 border-amber-400 dark:border-amber-500 pb-3 mb-2 inline-block">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
          {recipe.title[language]}
        </h1>
      </div>
    </header>
  );
};
