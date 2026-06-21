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
 * RecipeCard — Card Stack design.
 * Square image, title below with two compact metadata pills.
 */
export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const { language } = useLanguage();
  const [imageError, setImageError] = React.useState(false);

  const recipeCost = React.useMemo(
    () => calculateRecipeCost(recipe, language),
    [recipe, language]
  );

  const imagePath = `${import.meta.env.BASE_URL}images/recipes/${recipe.category}/${recipe.id}.jpg`;

  return (
    <Link
      to={`/recipe/${recipe.id}`}
      className="group block bg-card-light dark:bg-card-dark rounded-2xl overflow-hidden shadow-card hover:shadow-overlay hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Image with pill overlay at bottom — saves vertical space */}
      <div className="relative aspect-square w-full overflow-hidden bg-card-2-light dark:bg-card-2-dark">
        <img
          src={imageError ? defaultImageUrl : imagePath}
          alt={recipe.title[language]}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={() => setImageError(true)}
        />
        {/* Dark gradient at the bottom so pills are always legible */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />
        <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5 flex-wrap">
          <span
            className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-black/45 backdrop-blur-sm rounded-full px-2 py-0.5"
            title={`${getTranslation('prepTime', language)}: ${recipe.prepTime} ${getTranslation('minutes', language)}`}
          >
            ⏱ {recipe.prepTime}m
          </span>
          <span
            className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-black/45 backdrop-blur-sm rounded-full px-2 py-0.5"
            title={formatPricePerServing(recipeCost.pricePerServing)}
          >
            💰 {recipeCost.pricePerServing.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Title only — pills moved into image overlay */}
      <div className="px-3 py-2.5">
        <h3 className="font-display text-base font-bold text-ink-light dark:text-ink-dark leading-tight line-clamp-2 min-h-[2.5em]">
          {recipe.title[language]}
        </h3>
      </div>
    </Link>
  );
};
