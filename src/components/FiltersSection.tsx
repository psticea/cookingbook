import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';
import { FilterKeyword, FilterKeywordType } from '../types';
import filterKeywords from '../data/filter-keywords.json';

interface FiltersSectionProps {
  selectedKeywords: Set<string>;
  onKeywordsChange: (keywords: Set<string>) => void;
}

/**
 * FiltersSection component
 * Expandable/collapsible section with filter subsections
 * Groups filters by type: Difficulty, Meat Type, Cook Type, Ingredient
 */
export const FiltersSection: React.FC<FiltersSectionProps> = ({
  selectedKeywords,
  onKeywordsChange
}) => {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  // Group keywords by type
  const keywordsByType = (filterKeywords as FilterKeyword[]).reduce((acc, keyword) => {
    if (!acc[keyword.type]) {
      acc[keyword.type] = [];
    }
    acc[keyword.type].push(keyword);
    return acc;
  }, {} as Record<FilterKeywordType, FilterKeyword[]>);

  // Define subsection order and labels
  const subsections: { type: FilterKeywordType; labelKey: string }[] = [
    { type: 'meatType', labelKey: 'meatType' },
    { type: 'cookType', labelKey: 'cookType' },
    { type: 'ingredient', labelKey: 'ingredient' }
  ];

  const handleKeywordToggle = (keywordId: string) => {
    const newKeywords = new Set(selectedKeywords);
    if (newKeywords.has(keywordId)) {
      newKeywords.delete(keywordId);
    } else {
      newKeywords.add(keywordId);
    }
    onKeywordsChange(newKeywords);
  };

  const handleClearAll = () => {
    onKeywordsChange(new Set());
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
      {/* Main section header - touch-friendly */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-2 text-left min-h-[44px]"
        aria-expanded={isExpanded}
      >
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
          {getTranslation('filters', language)}
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
          {/* Clear all button at the top - touch-friendly */}
          {selectedKeywords.size > 0 && (
            <button
              onClick={handleClearAll}
              className="w-full px-4 py-2.5 text-base font-medium text-white bg-accent-light dark:bg-accent-dark rounded-md hover:opacity-90 transition-opacity min-h-[44px]"
            >
              {getTranslation('clearAllFilters', language)}
            </button>
          )}

          {/* Filter subsections */}
          {subsections.map(({ type, labelKey }) => {
            const keywords = keywordsByType[type] || [];
            if (keywords.length === 0) return null;

            // Limit ingredients to first 6
            const displayKeywords = type === 'ingredient' ? keywords.slice(0, 6) : keywords;

            return (
              <div key={type} className="ml-2">
                {/* Subsection header */}
                <h4 className="text-base font-medium text-gray-800 dark:text-gray-200 py-1">
                  {getTranslation(labelKey, language)}
                </h4>

                {/* Subsection keywords - modern button-style selectors */}
                <div className="ml-2 sm:ml-4 flex flex-wrap gap-2 mt-1">
                  {displayKeywords.map((keyword) => (
                    <button
                      key={keyword.id}
                      onClick={() => handleKeywordToggle(keyword.id)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-light dark:focus:ring-accent-dark ${
                        selectedKeywords.has(keyword.id)
                          ? 'bg-accent-light dark:bg-accent-dark text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                      aria-pressed={selectedKeywords.has(keyword.id)}
                      aria-label={`${getTranslation('filter', language)}: ${keyword.label[language]}`}
                    >
                      {keyword.label[language]}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
