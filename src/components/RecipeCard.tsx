import React from 'react';
import { Link } from 'react-router-dom';
import { Recipe } from '../types/recipe';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';
import defaultImageUrl from '/default-image.jpg';

interface RecipeCardProps {
  recipe: Recipe;
}

/**
 * RecipeCard component
 * Displays a recipe card with thumbnail, title, and metadata
 * Links to the recipe detail page
 * Category is not shown as it's displayed in the section header
 * Effort level is shown using puzzle piece icons (1-3 pieces)
 * Images are 1200x800 (3:2 aspect ratio)
 */
export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const { language } = useLanguage();
  const [imageError, setImageError] = React.useState(false);

  // Get effort level translation for tooltip
  const effortLevelKey = `effortLevel.${recipe.effortLevel}`;
  const effortLevel = getTranslation(effortLevelKey, language);

  // Generate puzzle piece icons based on effort level
  const getPuzzlePieces = (effortLevel: string): string => {
    const puzzlePiece = '🧩';
    switch (effortLevel) {
      case 'easy':
        return puzzlePiece;
      case 'medium':
        return puzzlePiece.repeat(2);
      case 'hard':
        return puzzlePiece.repeat(3);
      default:
        return puzzlePiece;
    }
  };

  // Construct image path from public/images/recipes folder
  // Use import.meta.env.BASE_URL to handle base path correctly
  const imagePath = `${import.meta.env.BASE_URL}images/recipes/${recipe.category}/${recipe.id}.jpg`;
  const defaultImage = defaultImageUrl;

  return (
    <Link
      to={`/recipe/${recipe.id}`}
      className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      {/* Recipe Image */}
      <div className="aspect-[3/2] w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
        <img
          src={imageError ? defaultImage : imagePath}
          alt={recipe.title[language]}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      </div>

      {/* Recipe Info */}
      <div className="p-3 sm:p-4">
        {/* Recipe Title */}
        <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100 line-clamp-2">
          {recipe.title[language]}
        </h3>

        {/* Recipe Metadata - Icons and numbers only */}
        <div className="flex items-center justify-between text-sm sm:text-base text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1" title={`${getTranslation('prepTime', language)}: ${recipe.prepTime} ${getTranslation('minutes', language)}`}>
            <span className="text-base sm:text-lg">⏱️</span>
            <span className="font-medium">{recipe.prepTime}</span>
          </div>
          <div className="flex items-center gap-1" title={`${getTranslation('servings', language)}: ${recipe.servings}`}>
            <span className="text-base sm:text-lg">🍽️</span>
            <span className="font-medium">{recipe.servings}</span>
          </div>
          <div className="flex items-center gap-1" title={effortLevel}>
            <span className="text-base sm:text-lg">{getPuzzlePieces(recipe.effortLevel)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
