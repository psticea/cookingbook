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
    <div className="p-4 space-y-4">
      {ingredients.map((item, index) => {
        if (isSection(item)) {
          return (
            <div key={index} className="mt-2 first:mt-0">
              <h3 className="text-lg font-semibold text-text-main-light dark:text-text-main-dark mb-1">
                {item.section[language]}
              </h3>
            </div>
          );
        } else if (isIngredientItem(item)) {
          const isChecked = checkedIngredients.has(index);
          const ingredientCost = ingredientCosts[index];
          if (!ingredientCost) return null;

          return (
            <label key={index} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleIngredient(index)}
                className="ingredient-checkbox"
              />
              <span className={`text-lg ${isChecked ? 'line-through text-gray-400 dark:text-gray-500' : 'text-text-main-light dark:text-text-main-dark'}`}>
                {getScaledQuantity(item.quantity)} {item.unit[language]} {item.name[language]}
                {' '}
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({formatPrice(ingredientCost.costPerRecipe)})
                </span>
              </span>
            </label>
          );
        }
        return null;
      })}
    </div>
  );
};
