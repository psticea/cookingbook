import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';
import { categories } from '../data';

interface CategoriesSectionProps {
  onCategoryClick: (categoryId: string) => void;
}

/**
 * CategoriesSection component
 * Expandable/collapsible section displaying all 8 food categories
 * Clicking a category scrolls to that section on the homepage
 */
export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  onCategoryClick
}) => {
  const { language } = useLanguage();

  const handleCategoryClick = (categoryId: string) => {
    onCategoryClick(categoryId);
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
      {/* Section header - always visible, not clickable */}
      <div className="py-2 min-h-[44px] flex items-center">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
          {getTranslation('categories', language)}
        </h3>
      </div>

      {/* Categories list - always expanded, touch-friendly buttons */}
      <div className="space-y-0.5 mt-1 ml-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className="w-full text-left px-3 py-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors min-h-[36px] flex items-center"
          >
            • {category.name[language]}
          </button>
        ))}
      </div>
    </div>
  );
};
