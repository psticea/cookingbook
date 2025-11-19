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
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCategoryClick = (categoryId: string) => {
    onCategoryClick(categoryId);
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
      {/* Section header - touch-friendly */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-2 text-left min-h-[44px]"
        aria-expanded={isExpanded}
      >
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
          {getTranslation('categories', language)}
        </h3>
        <svg
          className={`h-5 w-5 sm:h-6 sm:w-6 text-gray-600 dark:text-gray-400 transform transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded content - touch-friendly buttons */}
      {isExpanded && (
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
      )}
    </div>
  );
};
