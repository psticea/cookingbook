import React, { useState } from 'react';
import { IngredientItem } from '../types/recipe';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';
import { IngredientScaler } from './IngredientScaler';

interface IngredientListProps {
  ingredients: IngredientItem[];
  prepTime: number;
  servings: number;
  effortLevel: 'easy' | 'medium' | 'hard';
}

/**
 * IngredientList component
 * Displays list of ingredients with quantities and units
 * Supports optional section headings mixed in with ingredients
 * Integrates IngredientScaler for adjusting quantities
 * Shows recipe metadata (prep time, servings, difficulty) next to scaler
 * Servings count updates dynamically based on multiplier
 * Supports both Romanian and English ingredient names, units, and section headings
 */
export const IngredientList: React.FC<IngredientListProps> = ({ 
  ingredients, 
  prepTime, 
  servings, 
  effortLevel 
}) => {
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

  /**
   * Type guard to check if an item is a section heading
   */
  const isSection = (item: IngredientItem): item is { section: { ro: string; en: string } } => {
    return 'section' in item;
  };

  /**
   * Generate puzzle piece icons based on effort level
   */
  const getPuzzlePieces = (effortLevel: string): string => {
    const puzzlePiece = '🧩';
    switch (effortLevel) {
      case 'easy':
        return puzzlePiece;
      case 'medium':
        return puzzlePiece.repeat(2);
      case 'hard':
        return puzzlePiece.repeat(3);
      default:
        return puzzlePiece;
    }
  };

  // Calculate scaled servings
  const scaledServings = Math.round(servings * multiplier);

  // Get effort level translation for tooltip
  const effortLevelText = getTranslation(effortLevel, language);

  return (
    <section className="mb-6">
      {/* Recipe Metadata - Icons and numbers */}
      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 text-gray-700 dark:text-gray-300">
        {/* Prep Time */}
        <div className="flex items-center gap-1" title={`${getTranslation('prepTime', language)}: ${prepTime} ${getTranslation('minutes', language)}`}>
          <span className="text-lg sm:text-xl">⏱️</span>
          <span className="text-sm sm:text-base font-medium">{prepTime}</span>
        </div>

        {/* Servings - Updates with multiplier */}
        <div className="flex items-center gap-1" title={`${getTranslation('servings', language)}: ${scaledServings}`}>
          <span className="text-lg sm:text-xl">🍽️</span>
          <span className="text-sm sm:text-base font-medium">{scaledServings}</span>
        </div>

        {/* Effort Level - Puzzle Pieces */}
        <div className="flex items-center gap-1" title={`${getTranslation('effortLevel', language)}: ${effortLevelText}`}>
          <span className="text-lg sm:text-xl">{getPuzzlePieces(effortLevel)}</span>
        </div>
      </div>

      {/* Ingredient Scaler */}
      <div className="mb-4">
        <IngredientScaler
          currentMultiplier={multiplier}
          onMultiplierChange={setMultiplier}
        />
      </div>

      {/* Ingredients Section Heading */}
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">
        {getTranslation('ingredients', language)}
      </h2>

      {/* Ingredients List */}
      <ul className="space-y-2">
        {ingredients.map((item, index) => {
          if (isSection(item)) {
            // Render section heading
            return (
              <li key={index} className="mt-4 first:mt-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  {item.section[language]}
                </h3>
              </li>
            );
          } else {
            // Render ingredient
            return (
              <li
                key={index}
                className="flex items-start gap-2 text-sm sm:text-base text-gray-800 dark:text-gray-200"
              >
                <span className="text-accent-light dark:text-accent-dark mt-1">•</span>
                <span>
                  <span className="font-semibold">
                    {getScaledQuantity(item.quantity)} {item.unit[language]}
                  </span>
                  {' '}
                  {item.name[language]}
                </span>
              </li>
            );
          }
        })}
      </ul>
    </section>
  );
};
