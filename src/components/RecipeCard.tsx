import React from 'react';
import { Link } from 'react-router-dom';
import { Recipe } from '../types/recipe';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';
import { calculateRecipeCost, formatPricePerServing } from '../utils/pricing';
import defaultImageUrl from '/default-image.jpg';

interface RecipeCardProps {
  recipe: Recipe;
}

/**
 * RecipeCard component
 * Displays a compact recipe card with image and overlay title
 * Links to the recipe detail page
 * Title is overlayed on the image with a semi-transparent background
 * Category is not shown as it's displayed in the section header
 * Price per serving is shown instead of difficulty puzzle pieces
 * Images are 1200x800 (3:2 aspect ratio)
 */
export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const { language } = useLanguage();
  const [imageError, setImageError] = React.useState(false);

  // Calculate recipe cost - memoized to avoid recalculation on every render
  const recipeCost = React.useMemo(() => calculateRecipeCost(recipe, language), [recipe, language]);

  // Construct image path from public/images/recipes folder
  // Use import.meta.env.BASE_URL to handle base path correctly
  const imagePath = `${import.meta.env.BASE_URL}images/recipes/${recipe.category}/${recipe.id}.jpg`;
  const defaultImage = defaultImageUrl;

  return (
    <Link
      to={`/recipe/${recipe.id}`}
      className="block bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      {/* Recipe Image - clean, no overlay */}
      <div className="aspect-square w-full overflow-hidden bg-gray-200 dark:bg-zinc-700">
        <img
          src={imageError ? defaultImage : imagePath}
          alt={recipe.title[language]}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      </div>

      {/* Title + Metadata below image */}
      <div className="p-2.5 space-y-1.5">
        <h3 className="text-sm font-bold text-text-main-light dark:text-text-main-dark line-clamp-2 leading-tight">
          {recipe.title[language]}
        </h3>

        {/* Compact metadata pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center gap-0.5 text-sm text-text-main-light/60 dark:text-text-main-dark/60 bg-primary-light/15 dark:bg-primary-dark/15 rounded-full px-2.5 py-0.5" title={`${getTranslation('prepTime', language)}: ${recipe.prepTime} ${getTranslation('minutes', language)}`}>
            ⏱️ {recipe.prepTime}{getTranslation('minutes', language).substring(0, 1)}
          </span>
          <span className="inline-flex items-center gap-0.5 text-sm text-text-main-light/60 dark:text-text-main-dark/60 bg-secondary-light/15 dark:bg-secondary-dark/15 rounded-full px-2.5 py-0.5" title={`${getTranslation('servings', language)}: ${recipe.servings}`}>
            🍽️ {recipe.servings}
          </span>
          <span className="inline-flex items-center gap-0.5 text-sm text-text-main-light/60 dark:text-text-main-dark/60 bg-accent-light/15 dark:bg-accent-dark/15 rounded-full px-2.5 py-0.5" title={formatPricePerServing(recipeCost.pricePerServing)}>
            💰 {recipeCost.pricePerServing.toFixed(2)}
          </span>
        </div>
      </div>
    </Link>
  );
};
