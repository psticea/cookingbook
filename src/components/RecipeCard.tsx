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
      className="block bg-white dark:bg-neutral-800/60 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group hover:-translate-y-1 transform border border-neutral-200/50 dark:border-neutral-700/30"
    >
      {/* Recipe Image Container */}
      <div className="aspect-[3/2] w-full overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 relative">
        <img
          src={imageError ? defaultImage : imagePath}
          alt={recipe.title[language]}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
          onError={() => setImageError(true)}
        />
        
        {/* Difficulty Badge Overlay */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className={`px-3 py-1.5 rounded-full text-white text-xs font-semibold backdrop-blur-md ${
            recipe.effortLevel === 'easy' ? 'bg-emerald-500/90' :
            recipe.effortLevel === 'medium' ? 'bg-indigo-500/90' :
            'bg-rose-500/90'
          }`}>
            {effortLevel}
          </div>
        </div>
        
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Recipe Info */}
      <div className="p-4">
        {/* Recipe Title */}
        <h3 className="text-lg font-bold mb-3 text-neutral-900 dark:text-neutral-100 line-clamp-2 font-display group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {recipe.title[language]}
        </h3>

        {/* Recipe Metadata - Icons and numbers with labels */}
        <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400 text-sm">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-700/40" title={`${getTranslation('prepTime', language)}: ${recipe.prepTime} ${getTranslation('minutes', language)}`}>
            <span className="text-base">⏱️</span>
            <span className="font-medium">{recipe.prepTime}m</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-700/40" title={`${getTranslation('servings', language)}: ${recipe.servings}`}>
            <span className="text-base">🍽️</span>
            <span className="font-medium">{recipe.servings}</span>
          </div>
          <div className="flex items-center justify-center px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800/50" title={effortLevel}>
            <span className="text-base">{getPuzzlePieces(recipe.effortLevel)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
