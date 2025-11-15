import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';

interface IngredientScalerProps {
  currentMultiplier: number;
  onMultiplierChange: (multiplier: number) => void;
}

/**
 * IngredientScaler component
 * Allows users to adjust ingredient quantities
 * Range: 0.5x to 3x in 0.5x increments
 */
export const IngredientScaler: React.FC<IngredientScalerProps> = ({
  currentMultiplier,
  onMultiplierChange,
}) => {
  const { language } = useLanguage();

  const MIN_MULTIPLIER = 0.5;
  const MAX_MULTIPLIER = 3;
  const STEP = 0.5;

  const handleDecrement = () => {
    const newValue = currentMultiplier - STEP;
    if (newValue >= MIN_MULTIPLIER) {
      onMultiplierChange(newValue);
    }
  };

  const handleIncrement = () => {
    const newValue = currentMultiplier + STEP;
    if (newValue <= MAX_MULTIPLIER) {
      onMultiplierChange(newValue);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {getTranslation('servingMultiplier', language)}:
      </span>
      
      <div className="flex items-center gap-3">
        {/* Decrement Button */}
        <button
          onClick={handleDecrement}
          disabled={currentMultiplier <= MIN_MULTIPLIER}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xl shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Decrease multiplier"
        >
          −
        </button>

        {/* Current Multiplier Display */}
        <span className="text-xl font-bold text-gray-900 dark:text-gray-100 min-w-[4rem] text-center">
          {currentMultiplier.toFixed(1)}x
        </span>

        {/* Increment Button */}
        <button
          onClick={handleIncrement}
          disabled={currentMultiplier >= MAX_MULTIPLIER}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xl shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Increase multiplier"
        >
          +
        </button>
      </div>
    </div>
  );
};
