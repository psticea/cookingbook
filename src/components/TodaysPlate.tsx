import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Recipe } from '../types/recipe';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';
import { calculateRecipeCost } from '../utils/pricing';
import { RecipeMeta } from './RecipeMeta';
import { ArrowRightIcon } from './icons';

/** Deterministic PRNG (mulberry32) so everyone sees the same plate on a given day. */
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function dailyOrder(count: number): number[] {
  const day = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
  const rnd = seeded(day);
  const order = Array.from({ length: count }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

/**
 * TodaysPlate — the homepage opening (DESIGN.md → Featured print): the greeting
 * and one real recipe per day, shown large; the photo "develops" when it loads.
 */
export const TodaysPlate: React.FC<{ recipes: Recipe[] }> = ({ recipes }) => {
  const { language } = useLanguage();
  const order = useMemo(() => dailyOrder(recipes.length), [recipes.length]);
  const [position, setPosition] = useState(0);
  const recipe = recipes.length ? recipes[order[position % order.length]] : undefined;
  const cost = useMemo(() => (recipe ? calculateRecipeCost(recipe, language) : null), [recipe, language]);
  const href = recipe ? `/recipe/${recipe.id}` : '/';

  return (
    <section
      aria-labelledby="greeting"
      className="pt-[18px] md:max-w-page md:mx-auto md:gutter md:pt-8 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:pt-10"
    >
      <div className="gutter md:px-0 lg:col-start-1 lg:row-start-1 lg:pt-1">
        <h1 id="greeting" className="type-display text-ink">{getTranslation('greetingTitle', language)}</h1>
      </div>

      {recipe && cost && (
        <>
          <Link
            to={href}
            tabIndex={-1}
            aria-hidden="true"
            className="group relative block mt-[18px] aspect-[3/2] overflow-hidden bg-frame md:rounded-print lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:mt-0 lg:aspect-video"
          >
            <img
              key={recipe.id}
              src={`${import.meta.env.BASE_URL}images/recipes/${recipe.category}/${recipe.id}.jpg`}
              alt=""
              width={1200}
              height={800}
              decoding="async"
              {...{ fetchpriority: 'high' }}
              className="photo develop w-full h-full object-cover transition-transform duration-[1200ms] ease-ease [@media(hover:hover)]:group-hover:scale-[1.015]"
            />
          </Link>

          <div className="flex items-center justify-between gap-3 pt-2.5 pl-[var(--gutter)] pr-[calc(var(--gutter)-4px)] md:px-0 lg:col-start-1 lg:row-start-2 lg:self-end lg:items-end lg:pt-6 lg:border-t lg:border-line">
            <Link to={href} className="group flex flex-col justify-center gap-0.5 min-w-0 min-h-target text-ink no-underline">
              <span className="sr-only">{getTranslation('todaysRecipe', language)}: </span>
              <span className="text-md font-[560] leading-[1.3] line-clamp-2 lg:text-xl lg:font-medium lg:[font-stretch:106%] lg:tracking-[-0.01em] decoration-mark decoration-[1.5px] underline-offset-4 [@media(hover:hover)]:group-hover:underline">
                {recipe.title[language]}
              </span>
              <RecipeMeta recipe={recipe} cost={cost} language={language} className="lg:text-ui lg:mt-1" />
            </Link>
            {recipes.length > 1 && (
              <button
                type="button"
                onClick={() => setPosition((p) => p + 1)}
                className="grid place-items-center shrink-0 w-11 h-11 rounded-full border border-line-strong text-ink hover:bg-ink/[.06] transition-colors"
                aria-label={getTranslation('anotherRecipe', language)}
              >
                <ArrowRightIcon size={20} />
              </button>
            )}
          </div>
        </>
      )}
    </section>
  );
};
