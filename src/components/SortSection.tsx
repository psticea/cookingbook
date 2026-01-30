import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';

export type SortField = 'name' | 'dateAdded';
export type SortOrder = 'asc' | 'desc';

interface SortSectionProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onSortFieldChange: (field: SortField) => void;
  onSortOrderChange: (order: SortOrder) => void;
}

/**
 * SortSection component
 * Expandable/collapsible section for sorting controls
 * Allows users to sort recipes by name or date added in ascending/descending order
 */
export const SortSection: React.FC<SortSectionProps> = ({
  sortField,
  sortOrder,
  onSortFieldChange,
  onSortOrderChange
}) => {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  const sortFields: { value: SortField; labelKey: string }[] = [
    { value: 'name', labelKey: 'sortByName' },
    { value: 'dateAdded', labelKey: 'sortByDateAdded' }
  ];

  const sortOrders: { value: SortOrder; labelKey: string }[] = [
    { value: 'asc', labelKey: 'ascending' },
    { value: 'desc', labelKey: 'descending' }
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
      {/* Main section header - touch-friendly */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-2 text-left min-h-[44px]"
        aria-expanded={isExpanded}
      >
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
          {getTranslation('sortBy', language)}
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

      {/* Expanded content */}
      {isExpanded && (
        <div className="space-y-2 mt-1">
          {/* Sort Field Selection */}
          <div className="ml-2">
            <h4 className="text-base font-medium text-gray-800 dark:text-gray-200 py-1">
              {getTranslation('sortBy', language)}
            </h4>
            <div className="ml-2 sm:ml-4 flex flex-wrap gap-2 mt-1">
              {sortFields.map((field) => {
                const isSelected = sortField === field.value;
                const baseClasses = 'px-3 py-1.5 rounded-full text-sm font-medium transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-offset-2';
                const selectedClasses = 'bg-accent-light dark:bg-accent-dark text-white focus:ring-white dark:focus:ring-gray-900';
                const unselectedClasses = 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-accent-light dark:focus:ring-accent-dark';
                
                return (
                  <button
                    key={field.value}
                    onClick={() => onSortFieldChange(field.value)}
                    className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
                    aria-pressed={isSelected}
                  >
                    {getTranslation(field.labelKey, language)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort Order Selection */}
          <div className="ml-2">
            <h4 className="text-base font-medium text-gray-800 dark:text-gray-200 py-1">
              {getTranslation('sortBy', language)} ({getTranslation(sortField === 'name' ? 'sortByName' : 'sortByDateAdded', language)})
            </h4>
            <div className="ml-2 sm:ml-4 flex flex-wrap gap-2 mt-1">
              {sortOrders.map((order) => {
                const isSelected = sortOrder === order.value;
                const baseClasses = 'px-3 py-1.5 rounded-full text-sm font-medium transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-offset-2';
                const selectedClasses = 'bg-accent-light dark:bg-accent-dark text-white focus:ring-white dark:focus:ring-gray-900';
                const unselectedClasses = 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-accent-light dark:focus:ring-accent-dark';
                
                return (
                  <button
                    key={order.value}
                    onClick={() => onSortOrderChange(order.value)}
                    className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
                    aria-pressed={isSelected}
                  >
                    {getTranslation(order.labelKey, language)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
