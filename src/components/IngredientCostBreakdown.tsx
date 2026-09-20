import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { IngredientItem } from '../types/recipe';
import { calculateRecipeCost, formatPrice } from '../utils/pricing';
import { getTranslation } from '../utils/translations';

interface IngredientCostBreakdownProps {
  ingredients: IngredientItem[];
  servings: number;
  currentServings: number;
}

const reasonKeys = {
  'missing-price': 'missingPriceReason',
  'unsupported-unit': 'unsupportedUnitReason',
  'invalid-price': 'invalidPriceReason',
  'invalid-quantity': 'invalidQuantityReason',
} as const;

export const IngredientCostBreakdown: React.FC<IngredientCostBreakdownProps> = ({
  ingredients,
  servings,
  currentServings,
}) => {
  const { language } = useLanguage();
  const cost = useMemo(
    () => calculateRecipeCost({ ingredients, servings }, language, undefined, currentServings),
    [ingredients, servings, language, currentServings]
  );
  const title = getTranslation(
    cost.status === 'complete' ? 'estimatedCost' : cost.status === 'partial' ? 'knownSubtotal' : 'costUnavailable',
    language
  );
  const excluded = cost.status === 'unavailable'
    ? getTranslation('noIngredientsPriced', language)
    : getTranslation(cost.unpricedIngredientCount === 1 ? 'ingredientNotPriced' : 'ingredientsNotPriced', language)
      .replace('{count}', String(cost.unpricedIngredientCount));

  return (
    <details className="ingredient-costs rounded-xl bg-card-2-light dark:bg-card-2-dark border border-line-light dark:border-line-dark">
      <summary className="cursor-pointer list-none rounded-xl p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
        <span className="flex items-start gap-2 text-base text-ink-light dark:text-ink-dark">
          <svg className="cost-disclosure-arrow mt-1 shrink-0 w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="flex min-w-0 flex-1 flex-wrap justify-between gap-x-3 gap-y-1">
            <span>{title}</span>
            {cost.totalCostRecipe !== null && (
              <span className="font-semibold tabular-nums whitespace-nowrap">{formatPrice(cost.totalCostRecipe)}</span>
            )}
          </span>
        </span>
        <span className="mt-2 block text-sm text-ink-muted-light dark:text-ink-muted-dark">
          {getTranslation(currentServings === 1 ? 'costForOneServing' : 'costForServings', language)
            .replace('{count}', String(currentServings))}
          {cost.pricePerServing !== null && (
            <span className="block">
              {getTranslation(cost.status === 'complete' ? 'estimatedPerServing' : 'knownPerServing', language)
                .replace('{price}', formatPrice(cost.pricePerServing))}
            </span>
          )}
        </span>
        {cost.status !== 'complete' && (
          <span className="mt-2 block text-sm text-ink-light dark:text-ink-dark">{excluded}</span>
        )}
      </summary>

      <div className="px-4 pb-4">
        <dl className="border-t border-line-light dark:border-line-dark">
          {cost.ingredientCosts.map((item, index) => (
            <div key={index} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-1 py-2.5 text-sm">
              <dt className="min-w-0 break-words text-ink-light dark:text-ink-dark">{item.ingredientName}</dt>
              <dd className="whitespace-nowrap text-right tabular-nums text-ink-light dark:text-ink-dark">
                {item.matched ? formatPrice(item.costPerRecipe) : getTranslation('priceUnavailable', language)}
              </dd>
              {!item.matched && (
                <dd className="col-span-2 text-xs text-ink-muted-light dark:text-ink-muted-dark">
                  {getTranslation(reasonKeys[item.reason], language)}
                </dd>
              )}
            </div>
          ))}
          {cost.totalCostRecipe !== null && (
            <div className="flex flex-wrap justify-between gap-x-3 gap-y-1 border-t border-line-light dark:border-line-dark py-3 text-base font-semibold text-ink-light dark:text-ink-dark">
              <dt>{getTranslation(cost.status === 'complete' ? 'recipeTotal' : 'knownSubtotal', language)}</dt>
              <dd className="tabular-nums whitespace-nowrap">{formatPrice(cost.totalCostRecipe)}</dd>
            </div>
          )}
        </dl>
        <p className="mt-3 text-sm text-ink-muted-light dark:text-ink-muted-dark">
          {getTranslation('costQuantityNote', language)}
        </p>
        <p className="mt-2 text-xs text-ink-muted-light dark:text-ink-muted-dark">
          {getTranslation('costConversionNote', language)}
        </p>
        <Link
          to="/prices"
          className="mt-3 inline-flex min-h-[44px] items-center text-sm underline underline-offset-4 text-ink-light dark:text-ink-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {getTranslation('costAssumptions', language)}
        </Link>
      </div>
    </details>
  );
};
