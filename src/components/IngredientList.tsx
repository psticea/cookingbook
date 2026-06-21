import React, { useState, useMemo } from 'react';
import { IngredientItem, Ingredient } from '../types/recipe';
import { useLanguage } from '../hooks/useLanguage';
import { calculateIngredientCost, formatPrice } from '../utils/pricing';

interface IngredientListProps {
  ingredients: IngredientItem[];
  servings: number;
  currentServings: number;
}

/**
 * IngredientList component
 * Displays list of ingredients with quantities and units
 * Supports optional section headings mixed in with ingredients
 * Shows individual ingredient costs in lighter text
 * Supports both Romanian and English ingredient names, units, and section headings
 */
export const IngredientList: React.FC<IngredientListProps> = ({ 
  ingredients, 
  servings,
  currentServings,
}) => {
  const { language } = useLanguage();
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

  const getScaledQuantity = (quantity: number): string => {
    const ratio = currentServings / servings;
    const scaled = quantity * ratio;
    if (scaled % 1 === 0) {
      return scaled.toString();
    }
    return scaled.toFixed(2).replace(/\.?0+$/, '');
  };

  const isSection = (item: IngredientItem): item is { section: { ro: string; en: string } } => {
    return 'section' in item;
  };

  const isIngredientItem = (item: IngredientItem): item is Ingredient => {
    return 'name' in item && 'quantity' in item && 'unit' in item && !('section' in item);
  };

  const toggleIngredient = (index: number) => {
    setCheckedIngredients(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const ingredientCosts = useMemo(() => {
    return ingredients.map((item) => {
      if (isIngredientItem(item)) {
        const cost = calculateIngredientCost(item, servings, language);
        const ratio = currentServings / servings;
        return {
          ...cost,
          costPerRecipe: Math.round(cost.costPerRecipe * ratio * 100) / 100,
        };
      }
      return null;
    });
  }, [ingredients, currentServings, servings, language]);

  return (
    <div className="bg-card-2-light dark:bg-card-2-dark rounded-2xl px-3 sm:px-4 divide-y divide-line-2-light dark:divide-line-2-dark">
      {ingredients.map((item, index) => {
        if (isSection(item)) {
          return (
            <div key={index} className="pt-4 pb-2 first:pt-3">
              <h3 className="font-display text-base font-bold text-ink-light dark:text-ink-dark tracking-tight">
                {item.section[language]}
              </h3>
            </div>
          );
        } else if (isIngredientItem(item)) {
          const isChecked = checkedIngredients.has(index);
          const ingredientCost = ingredientCosts[index];
          if (!ingredientCost) return null;

          return (
            <label
              key={index}
              className="flex items-center gap-3 py-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleIngredient(index)}
                className="ingredient-checkbox"
              />

              {/* Quantity badge — colored, fixed width, tabular */}
              <span
                className={`flex-none inline-flex items-center justify-center min-w-[3.25rem] px-2 py-1 rounded-lg text-sm font-bold tabular-nums ${
                  isChecked
                    ? 'bg-card-3-light dark:bg-card-3-dark text-ink-soft-light dark:text-ink-soft-dark line-through'
                    : 'bg-brand-warm/12 text-brand-warm dark:bg-brand-warm/20'
                }`}
              >
                {getScaledQuantity(item.quantity)} {item.unit[language]}
              </span>

              <span
                className={`flex-1 text-base ${
                  isChecked
                    ? 'line-through text-ink-soft-light dark:text-ink-soft-dark'
                    : 'text-ink-light dark:text-ink-dark'
                }`}
              >
                {item.name[language]}
              </span>

              <span className="text-sm font-semibold text-ink-soft-light dark:text-ink-soft-dark tabular-nums whitespace-nowrap">
                {formatPrice(ingredientCost.costPerRecipe)}
              </span>
            </label>
          );
        }
        return null;
      })}
    </div>
  );
};
