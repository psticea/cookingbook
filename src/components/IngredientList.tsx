import React, { useState } from 'react';
import { IngredientItem } from '../types/recipe';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';

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
  const [currentServings, setCurrentServings] = useState(servings);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

  /**
   * Calculate scaled quantity based on servings ratio
   * Formats the number to remove unnecessary decimals
   */
  const getScaledQuantity = (quantity: number): string => {
    const ratio = currentServings / servings;
    const scaled = quantity * ratio;
    
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
   * Toggle checkbox state for an ingredient
   */
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

  // Get effort level translation for tooltip
  const effortLevelText = getTranslation(effortLevel, language);

  // Calculate the position of the yellow marker (original servings) as a percentage
  const markerPosition = ((servings - 1) / (8 - 1)) * 100;

  return (
    <section className="mb-6">
      {/* Combined Metadata and Scaler */}
      <div className="flex flex-col gap-4 mb-4 p-3 sm:p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        {/* Top: Recipe Metadata */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 text-gray-700 dark:text-gray-300">
          {/* Prep Time */}
          <div className="flex items-center gap-1" title={`${getTranslation('prepTime', language)}: ${prepTime} ${getTranslation('minutes', language)}`}>
            <span className="text-xl">⏱️</span>
            <span className="text-base font-medium">{prepTime} {getTranslation('minutes', language)}</span>
          </div>

          {/* Servings - Updates with slider */}
          <div className="flex items-center gap-1" title={`${getTranslation('servings', language)}: ${currentServings}`}>
            <span className="text-xl">🍽️</span>
            <span className="text-base font-medium">{currentServings} {getTranslation('servings', language)}</span>
          </div>

          {/* Effort Level - Puzzle Pieces */}
          <div className="flex items-center gap-1" title={`${getTranslation('effortLevel', language)}: ${effortLevelText}`}>
            <span className="text-xl">{getPuzzlePieces(effortLevel)}</span>
          </div>
        </div>

        {/* Bottom: Servings Slider */}
        <div className="flex flex-col gap-2">
          {/* Slider Container with Yellow Marker */}
          <div className="relative px-2 py-1">
            {/* Range Slider */}
            <input
              type="range"
              min="1"
              max="8"
              step="1"
              value={currentServings}
              onChange={(e) => setCurrentServings(Number(e.target.value))}
              className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider-thumb"
              aria-label={`${getTranslation('servings', language)}: ${currentServings}`}
            />
            
            {/* Yellow Marker - Triangle below slider at original servings position */}
            <div 
              className="absolute bottom-0 w-0 h-0 pointer-events-none"
              style={{ 
                left: `calc(${markerPosition}%)`,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderBottom: '10px solid #fbbf24',
              }}
              title={`Original: ${servings} ${getTranslation('servings', language)}`}
            />
          </div>

          {/* Servings Range Labels */}
          <div className="flex justify-between text-base text-gray-500 dark:text-gray-400 px-2">
            <span>1</span>
            <span>8</span>
          </div>
        </div>
      </div>

      {/* Ingredients Section Heading */}
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
        {getTranslation('ingredients', language)}
      </h2>

      {/* Ingredients List */}
      <ul className="space-y-0">
        {ingredients.map((item, index) => {
          if (isSection(item)) {
            // Render section heading (not clickable)
            return (
              <li key={index} className="mt-3 first:mt-0">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {item.section[language]}
                </h3>
              </li>
            );
          } else {
            // Render ingredient with checkbox
            const isChecked = checkedIngredients.has(index);
            return (
              <li
                key={index}
                onClick={() => toggleIngredient(index)}
                className="flex items-start gap-2 text-base text-gray-800 dark:text-gray-200 cursor-pointer py-0.5 px-1 -mx-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                role="checkbox"
                aria-checked={isChecked}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleIngredient(index);
                  }
                }}
              >
                {/* Checkbox Icon */}
                <span className="text-lg mt-0.5 flex-shrink-0 min-w-[24px]">
                  {isChecked ? '☑' : '☐'}
                </span>
                
                {/* Ingredient Text */}
                <span className={isChecked ? 'line-through opacity-50' : ''}>
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
