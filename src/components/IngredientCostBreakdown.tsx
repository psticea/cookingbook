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

/**
 * IngredientCostBreakdown — the receipt (DESIGN.md → Receipt): a Paper sheet
 * that opens to hairline rows with right-aligned tabular prices and a total
 * in Ink 600 above a 1px Ink rule.
 */
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
    <details className="ingredient-costs bg-paper rounded-ctl">
      <summary className="grid grid-cols-[20px_minmax(0,1fr)] gap-x-2.5 cursor-pointer rounded-ctl px-4 py-4 sm:px-5 select-none">
        <svg className="cost-disclosure-arrow mt-[3px] w-5 h-5 text-ink-2 transition-transform duration-300 ease-ease" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="m8 5 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="min-w-0">
          <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
            <span className="type-section text-ink">{title}</span>
            {cost.totalCostRecipe !== null && (
              <span className="text-md font-semibold text-ink tabular-nums whitespace-nowrap">{formatPrice(cost.totalCostRecipe)}</span>
            )}
          </span>
          <span className="mt-1 block text-sm text-ink-2 tabular-nums">
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
            <span className="mt-2 block text-sm text-ink">{excluded}</span>
          )}
        </span>
      </summary>

      <div className="pb-5 pl-[46px] pr-4 sm:pl-[50px] sm:pr-5">
        <dl className="m-0 border-t border-line">
          {cost.ingredientCosts.map((item, index) => (
            <div key={index} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 py-2.5 border-line [&+&]:border-t text-ui">
              <dt className="min-w-0 break-words text-ink">{item.ingredientName}</dt>
              <dd className={`m-0 whitespace-nowrap text-right tabular-nums ${item.matched ? 'text-ink' : 'text-ink-3'}`}>
                {item.matched ? formatPrice(item.costPerRecipe) : getTranslation('priceUnavailable', language)}
              </dd>
              {!item.matched && (
                <dd className="col-span-2 m-0 mt-0.5 text-sm text-ink-2">
                  {getTranslation(reasonKeys[item.reason], language)}
                </dd>
              )}
            </div>
          ))}
          {cost.totalCostRecipe !== null && (
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 py-2.5 border-t border-ink text-base font-semibold text-ink">
              <dt>{getTranslation(cost.status === 'complete' ? 'recipeTotal' : 'knownSubtotal', language)}</dt>
              <dd className="m-0 tabular-nums whitespace-nowrap">{formatPrice(cost.totalCostRecipe)}</dd>
            </div>
          )}
        </dl>
        <p className="mt-5 text-sm text-ink-2 text-pretty">
          {getTranslation('costQuantityNote', language)}
        </p>
        <p className="mt-1.5 text-sm text-ink-2 text-pretty">
          {getTranslation('costConversionNote', language)}
        </p>
        <Link
          to="/prices"
          className="mt-2 inline-flex items-center min-h-target text-ui text-ink underline decoration-line-strong decoration-1 underline-offset-4 hover:decoration-current"
        >
          {getTranslation('costAssumptions', language)}
        </Link>
      </div>
    </details>
  );
};
