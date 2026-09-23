import React from 'react';
import { Recipe } from '../types/recipe';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';
import { RecipeCost, formatPrice } from '../utils/pricing';

/**
 * RecipeMeta — the wall-label metadata line: "30 min   ≈2.04 lei"
 * (DESIGN.md → Prints). Units and "≈" in Soft Pencil; tabular figures.
 * The cost carries its full explanation in `title` and its accessible name.
 */
export const RecipeMeta: React.FC<{ recipe: Recipe; cost: RecipeCost; language: Language; className?: string }> = ({
  recipe,
  cost,
  language,
  className = '',
}) => {
  const hasPrice = cost.pricePerServing !== null && cost.status !== 'unavailable';
  const value = hasPrice ? formatPrice(cost.pricePerServing as number, false) : null;
  const costLabel = cost.status === 'complete' && value
    ? `${getTranslation('estimatedCost', language)}: ${value} ${getTranslation('perServing', language)}`
    : cost.status === 'partial' && value
      ? `${getTranslation('partialEstimate', language)} · ${getTranslation('knownSubtotal', language)}: ${value} ${getTranslation('perServing', language)}`
      : getTranslation('costUnavailable', language);
  const minutesLabel = `${getTranslation('prepTime', language)}: ${recipe.prepTime} ${getTranslation('minutes', language)}`;

  return (
    <p className={`flex flex-wrap items-baseline gap-x-3 text-sm text-ink-2 tabular-nums ${className}`}>
      <span role="img" aria-label={minutesLabel} title={minutesLabel} className="whitespace-nowrap">
        {recipe.prepTime}<span className="text-ink-3"> min</span>
      </span>
      <span role="img" aria-label={costLabel} title={costLabel} className="whitespace-nowrap">
        {cost.status === 'partial' && value && <span className="text-ink-3 mr-px">≈</span>}
        {value ?? '—'}<span className="text-ink-3"> lei</span>
      </span>
    </p>
  );
};
