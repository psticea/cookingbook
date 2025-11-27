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
    <div className="rounded-lg bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm p-4 mb-4">
      {/* Main section header - touch-friendly */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-2 text-left min-h-[44px] group"
        aria-expanded={isExpanded}
      >
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <span>🔍</span>
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
        <div className="space-y-3 mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          {/* Clear all button at the top - touch-friendly */}
          {selectedKeywords.size > 0 && (
            <button
              onClick={handleClearAll}
              className="w-full px-4 py-2.5 text-sm sm:text-base font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 dark:from-red-600 dark:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 rounded-lg transition-all min-h-[44px] shadow-md hover:shadow-lg transform hover:scale-105"
            >
              ✕ {getTranslation('clearAllFilters', language)}
            </button>
          )}

          {/* Filter subsections */}
          {subsections.map(({ type, labelKey }) => {
            const keywords = keywordsByType[type] || [];
            if (keywords.length === 0) return null;

            // Limit ingredients to first 6
            const displayKeywords = type === 'ingredient' ? keywords.slice(0, 6) : keywords;

            return (
              <div key={type} className="space-y-2">
                {/* Subsection header */}
                <h4 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                  {getTranslation(labelKey, language)}
                </h4>

                {/* Subsection keywords - enhanced chip style */}
                <div className="flex flex-wrap gap-2">
                  {displayKeywords.map((keyword) => (
                    <button
                      key={keyword.id}
                      onClick={() => handleKeywordToggle(keyword.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 min-h-[44px] flex items-center justify-center whitespace-nowrap ${
                        selectedKeywords.has(keyword.id)
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-amber-400 dark:hover:border-amber-400'
                      }`}
                    >
                      {selectedKeywords.has(keyword.id) && '✓ '}
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
