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
    <div className="grid gap-0.5">
      {ingredients.map((item, index) => {
        if (isSection(item)) {
          return (
            <div key={index} className="pt-4 pb-2 first:pt-2">
              <h3 className="font-serif text-lg font-semibold text-ink-light dark:text-ink-dark tracking-tight">
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
              className="grid grid-cols-[20px_auto_1fr_auto] items-center gap-x-3 sm:gap-x-4 py-3 border-b border-line-2-light dark:border-line-2-dark last:border-b-0 cursor-pointer hover:bg-card-2-light dark:hover:bg-card-2-dark transition-colors rounded-md px-1"
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleIngredient(index)}
                className="ingredient-checkbox"
              />

              {/* Quantity in mono numerals, right-aligned for clean vertical column */}
              <span
                className={`font-mono text-sm font-semibold tabular-nums text-right min-w-[3.75rem] ${
                  isChecked
                    ? 'text-ink-soft-light dark:text-ink-soft-dark line-through'
                    : 'text-ink-light dark:text-ink-dark'
                }`}
              >
                {getScaledQuantity(item.quantity)} {item.unit[language]}
              </span>

              {/* Ingredient name takes remaining horizontal space */}
              <span
                className={`text-base ${
                  isChecked
                    ? 'line-through text-ink-soft-light dark:text-ink-soft-dark'
                    : 'text-ink-light dark:text-ink-dark'
                }`}
              >
                {item.name[language]}
              </span>

              {/* Cost — smallest element, muted, never competes for the eye */}
              <span className="text-xs font-medium text-ink-soft-light dark:text-ink-soft-dark tabular-nums whitespace-nowrap">
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
