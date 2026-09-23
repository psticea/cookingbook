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

/**
 * IngredientList — the checklist (DESIGN.md → Checklist rows): full-width
 * hairline rows, tabular Ink quantities, and the cost receipt below.
 */
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
    <div className="min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-x-4 min-h-target">
        <p className="m-0 text-sm text-ink-2 tabular-nums" role="status">
          {getTranslation('checkedIngredients', language)
            .replace('{checked}', String(checkedIngredients.size))
            .replace('{total}', String(ingredientCount))}
        </p>
        <button
          type="button"
          onClick={() => setCheckedIngredients(new Set())}
          disabled={checkedIngredients.size === 0}
          className="-mr-0.5 inline-flex items-center min-h-target px-0.5 text-ui font-medium text-ink underline decoration-line-strong decoration-1 underline-offset-4 hover:decoration-current transition-colors duration-200 ease-ease disabled:text-ink-3 disabled:no-underline disabled:cursor-default"
        >
          {getTranslation('resetChecklist', language)}
        </button>
      </div>

      <ul className="m-0 p-0 list-none border-b border-line">
        {ingredients.map((item, index) => {
          if ('section' in item) {
            return (
              <li key={index} className="pt-8 pb-2.5 first:pt-4">
                <h3 className="type-section text-ink">{item.section[language]}</h3>
              </li>
            );
          }

          const isChecked = checkedIngredients.has(index);
          const qualitative = QUALITATIVE_UNITS.includes(item.unit[language].toLowerCase().trim());

          return (
            <li key={index} className="border-t border-line">
              <label className="flex items-center gap-3.5 min-h-12 py-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleIngredient(index)}
                  className="ingredient-checkbox"
                />
                <span className={`min-w-0 flex-1 break-words text-base leading-[1.45] transition-colors duration-300 ease-ease ${
                  isChecked ? 'text-ink-3 line-through decoration-1' : 'text-ink'
                }`}>
                  {qualitative ? (
                    <>{item.name[language]} <span className={isChecked ? undefined : 'text-ink-2'}>— {item.unit[language]}</span></>
                  ) : (
                    <><strong className="font-semibold tabular-nums">{formatAmount(item)}</strong>{' '}{item.name[language]}</>
                  )}
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      <div className="mt-10">
        <IngredientCostBreakdown
          ingredients={ingredients}
          servings={servings}
          currentServings={currentServings}
        />
      </div>
    </div>
  );
};
