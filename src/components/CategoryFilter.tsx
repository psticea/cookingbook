import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';
import { categories } from '../data';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

/**
 * CategoryFilter component
 * Dropdown filter for selecting a recipe category
 * Allows users to filter recipes by category or show all categories
 */
export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange
}) => {
  const { language } = useLanguage();

  return (
    <div className="mb-6 border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <label 
          htmlFor="category-filter"
          className="text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap"
        >
          {getTranslation('filterByCategory', language)}:
        </label>
        <select
          id="category-filter"
          value={selectedCategory || ''}
          onChange={(e) => onCategoryChange(e.target.value || null)}
          className="flex-1 px-3 py-2 rounded-md text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark focus:border-transparent"
        >
          <option value="">
            {getTranslation('allCategories', language)}
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name[language]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
