import React from 'react';
import { Recipe } from '../types/recipe';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';

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

  // Get effort level translation
  const effortLevelText = getTranslation(recipe.effortLevel, language);

  return (
    <header className="mb-6">
      {/* Recipe Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        {recipe.title[language]}
      </h1>

      {/* Recipe Metadata Row - Icons only */}
      <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
        {/* Prep Time */}
        <div className="flex items-center gap-1" title={`${getTranslation('prepTime', language)}: ${recipe.prepTime} ${getTranslation('minutes', language)}`}>
          <span className="text-xl">⏱️</span>
          <span className="text-sm">{recipe.prepTime} {getTranslation('minutes', language)}</span>
        </div>

        {/* Servings */}
        <div className="flex items-center gap-1" title={`${getTranslation('servings', language)}: ${recipe.servings}`}>
          <span className="text-xl">🍽️</span>
          <span className="text-sm">{recipe.servings}</span>
        </div>

        {/* Effort Level */}
        <div className="flex items-center gap-1" title={`${getTranslation('effortLevel', language)}: ${effortLevelText}`}>
          <span className="text-xl">💪</span>
          <span className="text-sm">{effortLevelText}</span>
        </div>
      </div>
    </header>
  );
};
