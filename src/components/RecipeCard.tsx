import React from 'react';
import { Link } from 'react-router-dom';
import { Recipe } from '../types/recipe';
import { useLanguage } from '../hooks/useLanguage';
import { calculateRecipeCost } from '../utils/pricing';
import { RecipeMeta } from './RecipeMeta';
import defaultImageUrl from '/default-image.jpg';

interface RecipeCardProps {
  recipe: Recipe;
}

/**
 * RecipeCard — a square print with a wall label below it (DESIGN.md → Prints).
 * No text or pills on the photo; the print and label are one link.
 */
export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const { language } = useLanguage();
  const [loaded, setLoaded] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  const cost = React.useMemo(() => calculateRecipeCost(recipe, language), [recipe, language]);

  // Prefer the small .thumb.webp (npm run generate-thumbnails), then the JPG.
  const base = `${import.meta.env.BASE_URL}images/recipes/${recipe.category}/${recipe.id}`;

  return (
    <Link to={`/recipe/${recipe.id}`} className="group block text-inherit no-underline rounded-print focus-visible:outline-offset-[5px]">
      <figure className="relative m-0 aspect-square overflow-hidden rounded-print bg-frame transition-transform duration-500 ease-ease group-active:scale-[.985]">
        <img
          src={failed ? defaultImageUrl : `${base}.thumb.webp`}
          alt=""
          width={480}
          height={480}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={(e) => {
            const img = e.currentTarget;
            if (img.src.endsWith('.thumb.webp')) img.src = `${base}.jpg`;
            else setFailed(true);
          }}
          className={`photo w-full h-full object-cover transition-[transform,opacity] duration-[900ms] ease-ease [@media(hover:hover)]:group-hover:scale-[1.04] ${
            loaded || failed ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </figure>
      <div className="pt-2.5">
        <h3 className="text-base md:text-md font-[520] leading-[1.3] tracking-[-0.003em] text-ink line-clamp-2 text-pretty decoration-mark decoration-[1.5px] underline-offset-4 [@media(hover:hover)]:group-hover:underline">
          {recipe.title[language]}
        </h3>
        <RecipeMeta recipe={recipe} cost={cost} language={language} className="mt-1" />
      </div>
    </Link>
  );
};
