import React, { useState } from 'react';
import { IngredientItem, Ingredient } from '../types/recipe';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';
import { IngredientCostBreakdown } from './IngredientCostBreakdown';

interface IngredientListProps {
  ingredients: IngredientItem[];
  servings: number;
  currentServings: number;
}

const QUALITATIVE_UNITS = ['to taste', 'as needed', 'după gust', 'dupa gust', 'după necesitate', 'dupa necesitate'];
const PIECE_UNITS = ['pcs', 'piece', 'pieces', 'buc', 'bucată', 'bucăți', 'bucata', 'bucati'];

export const IngredientList: React.FC<IngredientListProps> = ({
  ingredients,
  servings,
  currentServings,
}) => {
  const { language } = useLanguage();
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const ingredientCount = ingredients.filter(item => 'name' in item).length;
  const numberFormat = new Intl.NumberFormat(language === 'ro' ? 'ro-RO' : 'en-GB', {
    maximumFractionDigits: 2,
  });

  const formatAmount = (item: Ingredient): string => {
    const unit = item.unit[language].trim();
    const quantity = numberFormat.format(item.quantity * currentServings / servings);
    return PIECE_UNITS.includes(unit.toLowerCase()) ? quantity : `${quantity} ${unit}`;
  };

  const toggleIngredient = (index: number) => {
    setCheckedIngredients(previous => {
      const next = new Set(previous);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className="min-w-0 space-y-6">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <p className="text-sm text-ink-muted-light dark:text-ink-muted-dark" role="status">
            {getTranslation('checkedIngredients', language)
              .replace('{checked}', String(checkedIngredients.size))
              .replace('{total}', String(ingredientCount))}
          </p>
          <button
            type="button"
            onClick={() => setCheckedIngredients(new Set())}
            disabled={checkedIngredients.size === 0}
            className="min-h-[44px] px-2 text-sm underline underline-offset-4 text-ink-light dark:text-ink-dark disabled:no-underline disabled:text-ink-muted-light dark:disabled:text-ink-muted-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {getTranslation('resetChecklist', language)}
          </button>
        </div>

        <ul>
          {ingredients.map((item, index) => {
            if ('section' in item) {
              return (
                <li key={index} className="pt-6 pb-2 first:pt-2">
                  <h3 className="font-serif text-lg font-semibold text-ink-light dark:text-ink-dark">
                    {item.section[language]}
                  </h3>
                </li>
              );
            }

            const isChecked = checkedIngredients.has(index);
            const qualitative = QUALITATIVE_UNITS.includes(item.unit[language].toLowerCase().trim());

            return (
              <li key={index} className="border-b border-line-light dark:border-line-dark last:border-b-0">
                <label className="grid grid-cols-[20px_minmax(0,1fr)] items-start gap-x-3 min-h-[44px] py-3 px-1 cursor-pointer rounded-md hover:bg-card-2-light dark:hover:bg-card-2-dark">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleIngredient(index)}
                    className="ingredient-checkbox mt-1"
                  />
                  <span className={`min-w-0 break-words text-base leading-relaxed ${
                    isChecked
                      ? 'line-through text-ink-muted-light dark:text-ink-muted-dark'
                      : 'text-ink-light dark:text-ink-dark'
                  }`}>
                    {qualitative ? (
                      <>{item.name[language]} <span className="text-ink-muted-light dark:text-ink-muted-dark">— {item.unit[language]}</span></>
                    ) : (
                      <><strong className="font-semibold tabular-nums">{formatAmount(item)}</strong>{' '}{item.name[language]}</>
                    )}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      <IngredientCostBreakdown
        ingredients={ingredients}
        servings={servings}
        currentServings={currentServings}
      />
    </div>
  );
};
