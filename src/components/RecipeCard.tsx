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
      className="block bg-white dark:bg-gray-800/60 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:scale-105 transform border border-white/20 dark:border-gray-700/30"
    >
      {/* Recipe Image Container */}
      <div className="aspect-[3/2] w-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 relative">
        <img
          src={imageError ? defaultImage : imagePath}
          alt={recipe.title[language]}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          onError={() => setImageError(true)}
        />
        
        {/* Difficulty Badge Overlay */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className={`px-3 py-1 rounded-full text-white text-sm font-semibold backdrop-blur-sm ${
            recipe.effortLevel === 'easy' ? 'bg-green-500/80' :
            recipe.effortLevel === 'medium' ? 'bg-amber-500/80' :
            'bg-red-500/80'
          }`}>
            {effortLevel}
          </div>
        </div>
        
        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
      </div>

      {/* Recipe Info */}
      <div className="p-3 sm:p-4">
        {/* Recipe Title */}
        <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-gray-100 line-clamp-2 font-display group-hover:text-accent-light dark:group-hover:text-accent-dark transition-colors">
          {recipe.title[language]}
        </h3>

        {/* Recipe Metadata - Icons and numbers with labels */}
        <div className="flex items-center justify-between text-gray-600 dark:text-gray-400 text-sm">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-50 dark:bg-gray-700/40" title={`${getTranslation('prepTime', language)}: ${recipe.prepTime} ${getTranslation('minutes', language)}`}>
            <span className="text-base">⏱️</span>
            <span className="font-medium">{recipe.prepTime}m</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-50 dark:bg-gray-700/40" title={`${getTranslation('servings', language)}: ${recipe.servings}`}>
            <span className="text-base">🍽️</span>
            <span className="font-medium">{recipe.servings}</span>
          </div>
          <div className="flex items-center justify-center px-2 py-1 rounded-lg bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200 dark:border-amber-800/50" title={effortLevel}>
            <span className="text-lg">{getPuzzlePieces(recipe.effortLevel)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
