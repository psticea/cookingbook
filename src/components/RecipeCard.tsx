import React from 'react';
import { Link } from 'react-router-dom';
import { Recipe } from '../types/recipe';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';

interface RecipeCardProps {
  recipe: Recipe;
}

/**
 * RecipeCard component
 * Displays a recipe card with thumbnail, title, and metadata
 * Links to the recipe detail page
 * Category is not shown as it's displayed in the section header
 */
export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const { language } = useLanguage();

  // Get effort level translation
  const effortLevelKey = `effortLevel.${recipe.effortLevel}`;
  const effortLevel = getTranslation(effortLevelKey, language);

  return (
    <Link
      to={`/recipe/${recipe.id}`}
      className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      {/* Recipe Image */}
      <div className="aspect-square w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
        <img
          src={recipe.image}
          alt={recipe.title[language]}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Recipe Info */}
      <div className="p-4">
        {/* Recipe Title */}
        <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-gray-100 line-clamp-2">
          {recipe.title[language]}
        </h3>

        {/* Recipe Metadata */}
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <span>⏱️</span>
            <span>{recipe.prepTime} {getTranslation('minutes', language)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🍽️</span>
            <span>{recipe.servings} {getTranslation('servings', language)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>💪</span>
            <span>{effortLevel}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
