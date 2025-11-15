import React, { useState } from 'react';
import { Ingredient } from '../types/recipe';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';
import { IngredientScaler } from './IngredientScaler';

interface IngredientListProps {
  ingredients: Ingredient[];
}

/**
 * IngredientList component
 * Displays list of ingredients with quantities and units
 * Integrates IngredientScaler for adjusting quantities
 * Supports both Romanian and English ingredient names and units
 */
export const IngredientList: React.FC<IngredientListProps> = ({ ingredients }) => {
  const { language } = useLanguage();
  const [multiplier, setMultiplier] = useState(1);

  /**
   * Calculate scaled quantity based on multiplier
   * Formats the number to remove unnecessary decimals
   */
  const getScaledQuantity = (quantity: number): string => {
    const scaled = quantity * multiplier;
    
    // If the result is a whole number, don't show decimals
    if (scaled % 1 === 0) {
      return scaled.toString();
    }
    
    // Otherwise, show up to 2 decimal places and remove trailing zeros
    return scaled.toFixed(2).replace(/\.?0+$/, '');
  };

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        {getTranslation('ingredients', language)}
      </h2>

      {/* Ingredient Scaler */}
      <IngredientScaler
        currentMultiplier={multiplier}
        onMultiplierChange={setMultiplier}
      />

      {/* Ingredients List */}
      <ul className="space-y-3">
        {ingredients.map((ingredient, index) => (
          <li
            key={index}
            className="flex items-start gap-3 text-gray-800 dark:text-gray-200"
          >
            <span className="text-accent-light dark:text-accent-dark mt-1">•</span>
            <span>
              <span className="font-semibold">
                {getScaledQuantity(ingredient.quantity)} {ingredient.unit[language]}
              </span>
              {' '}
              {ingredient.name[language]}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};
