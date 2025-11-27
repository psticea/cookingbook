import React from 'react';
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
    <div className="rounded-lg bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm p-4 mb-4">
      {/* Section header - always visible, not clickable */}
      <div className="py-2 min-h-[44px] flex items-center mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <span>📚</span>
          {getTranslation('categories', language)}
        </h3>
      </div>

      {/* Categories list - always expanded, enhanced chip style */}
      <div className="space-y-2">
        {categories.map((category) => {
          // Simple category icons
          const icons: Record<string, string> = {
            'breakfast': '🌅',
            'pasta': '🍝',
            'stir-fries': '🥘',
            'soups-and-stews': '🍲',
            'main-courses': '🍽️',
            'burgers-and-wraps': '🌮',
            'salads-and-bites': '🥗',
            'basics': '🔥',
          };

          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="w-full text-left px-4 py-3 text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 rounded-lg transition-all border border-gray-200 dark:border-gray-600 hover:border-amber-300 dark:hover:border-amber-700 min-h-[44px] flex items-center gap-3 transform hover:scale-105 hover:shadow-md"
            >
              <span className="text-xl">{icons[category.id] || '📖'}</span>
              <span>{category.name[language]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
