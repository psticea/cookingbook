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
    <div className="rounded-xl bg-white/60 dark:bg-neutral-800/60 border border-neutral-200/50 dark:border-neutral-700/50 backdrop-blur-sm p-4 mb-4 shadow-sm">
      {/* Main section header - touch-friendly */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-2 text-left min-h-[44px] group"
        aria-expanded={isExpanded}
      >
        <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <span>🔍</span>
          {getTranslation('filters', language)}
        </h3>
        <svg
          className={`h-5 w-5 sm:h-6 sm:w-6 text-neutral-600 dark:text-neutral-400 transform transition-transform ${
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
        <div className="space-y-3 mt-4 border-t border-neutral-200 dark:border-neutral-700 pt-4">
          {/* Clear all button at the top - touch-friendly */}
          {selectedKeywords.size > 0 && (
            <button
              onClick={handleClearAll}
              className="w-full px-4 py-2.5 text-sm sm:text-base font-medium text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 dark:from-rose-600 dark:to-rose-700 dark:hover:from-rose-700 dark:hover:to-rose-800 rounded-xl transition-all min-h-[44px] shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
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
                <h4 className="text-sm sm:text-base font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                  {getTranslation(labelKey, language)}
                </h4>

                {/* Subsection keywords - enhanced chip style */}
                <div className="flex flex-wrap gap-2">
                  {displayKeywords.map((keyword) => (
                    <button
                      key={keyword.id}
                      onClick={() => handleKeywordToggle(keyword.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:-translate-y-0.5 min-h-[44px] flex items-center justify-center whitespace-nowrap ${
                        selectedKeywords.has(keyword.id)
                          ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md'
                          : 'bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-600 hover:border-indigo-400 dark:hover:border-indigo-400'
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
