import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';

export type SortField = 'name' | 'dateAdded' | 'prepTime' | 'pricePerServing';
export type SortOrder = 'asc' | 'desc';

interface SortSectionProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onSortFieldChange: (field: SortField) => void;
  onSortOrderChange: (order: SortOrder) => void;
}

/**
 * SortSection component
 * Horizontal inline sorting controls displayed on the home page
 * Allows users to sort recipes by name, date added, cooking time, or price in ascending/descending order
 */
export const SortSection: React.FC<SortSectionProps> = ({
  sortField,
  sortOrder,
  onSortFieldChange,
  onSortOrderChange
}) => {
  const { language } = useLanguage();

  const sortFields: { value: SortField; labelKey: string }[] = [
    { value: 'name', labelKey: 'sortByName' },
    { value: 'dateAdded', labelKey: 'sortByDateAdded' },
    { value: 'prepTime', labelKey: 'sortByPrepTime' },
    { value: 'pricePerServing', labelKey: 'sortByPrice' }
  ];

  return (
    <div className="mb-6 border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Sort By Label and Field Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
            {getTranslation('sortBy', language)}:
          </label>
          <select 
            value={sortField}
            onChange={(e) => onSortFieldChange(e.target.value as SortField)}
            className="px-3 py-1.5 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark focus:ring-offset-2"
          >
            {sortFields.map((field) => (
              <option key={field.value} value={field.value}>
                {getTranslation(field.labelKey, language)}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center justify-center px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-light dark:focus:ring-accent-dark"
            title={getTranslation(sortOrder === 'asc' ? 'ascending' : 'descending', language)}
            aria-label={getTranslation(sortOrder === 'asc' ? 'ascending' : 'descending', language)}
          >
            <svg 
              className={`w-5 h-5 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
