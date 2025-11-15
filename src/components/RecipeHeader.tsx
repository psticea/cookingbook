import React from 'react';
import { Recipe } from '../types/recipe';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';
import categoriesData from '../data/categories.json';

interface RecipeHeaderProps {
  recipe: Recipe;
}

/**
 * RecipeHeader component
 * Displays recipe title, category badge, preparation time, servings, and effort level
 * Supports both Romanian and English text
 */
export const RecipeHeader: React.FC<RecipeHeaderProps> = ({ recipe }) => {
  const { language } = useLanguage();

  // Find the category name
  const category = categoriesData.find(cat => cat.id === recipe.category);
  const categoryName = category ? category.name[language] : recipe.category;

  // Get effort level translation
  const effortLevelText = getTranslation(recipe.effortLevel, language);

  return (
    <header className="mb-6">
      {/* Recipe Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-gray-100">
        {recipe.title[language]}
      </h1>

      {/* Category Badge */}
      <div className="mb-4">
        <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-accent-light dark:bg-accent-dark text-white">
          {categoryName}
        </span>
      </div>

      {/* Recipe Metadata Row */}
      <div className="flex flex-wrap gap-4 md:gap-6 text-gray-700 dark:text-gray-300">
        {/* Prep Time */}
        <div className="flex items-center gap-2">
          <span className="text-xl">⏱️</span>
          <div>
            <span className="font-semibold">{getTranslation('prepTime', language)}:</span>
            <span className="ml-1">{recipe.prepTime} {getTranslation('minutes', language)}</span>
          </div>
        </div>

        {/* Servings */}
        <div className="flex items-center gap-2">
          <span className="text-xl">🍽️</span>
          <div>
            <span className="font-semibold">{getTranslation('servings', language)}:</span>
            <span className="ml-1">{recipe.servings}</span>
          </div>
        </div>

        {/* Effort Level */}
        <div className="flex items-center gap-2">
          <span className="text-xl">💪</span>
          <div>
            <span className="font-semibold">{getTranslation('effortLevel', language)}:</span>
            <span className="ml-1">{effortLevelText}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
