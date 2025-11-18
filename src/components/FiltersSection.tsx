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
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedSubsections, setExpandedSubsections] = useState<Set<FilterKeywordType>>(
    new Set(['meat', 'cooking', 'vegetable', 'sauce'])
  );

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
    { type: 'difficulty', labelKey: 'difficulty' },
    { type: 'meat', labelKey: 'meatType' },
    { type: 'cooking', labelKey: 'cookingMethod' },
    { type: 'vegetable', labelKey: 'vegetables' },
    { type: 'sauce', labelKey: 'sauce' }
  ];

  const toggleSubsection = (type: FilterKeywordType) => {
    const newExpanded = new Set(expandedSubsections);
    if (newExpanded.has(type)) {
      newExpanded.delete(type);
    } else {
      newExpanded.add(type);
    }
    setExpandedSubsections(newExpanded);
  };

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
    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
      {/* Main section header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-3 text-left"
        aria-expanded={isExpanded}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {getTranslation('filters', language)}
        </h3>
        <svg
          className={`h-5 w-5 text-gray-600 dark:text-gray-400 transform transition-transform ${
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
        <div className="space-y-4 mt-2">
          {/* Filter subsections */}
          {subsections.map(({ type, labelKey }) => {
            const keywords = keywordsByType[type] || [];
            if (keywords.length === 0) return null;

            const isSubsectionExpanded = expandedSubsections.has(type);

            return (
              <div key={type} className="ml-2">
                {/* Subsection header */}
                <button
                  onClick={() => toggleSubsection(type)}
                  className="w-full flex items-center justify-between py-2 text-left"
                  aria-expanded={isSubsectionExpanded}
                >
                  <h4 className="text-base font-medium text-gray-800 dark:text-gray-200">
                    {getTranslation(labelKey, language)}
                  </h4>
                  <svg
                    className={`h-4 w-4 text-gray-500 dark:text-gray-500 transform transition-transform ${
                      isSubsectionExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Subsection keywords */}
                {isSubsectionExpanded && (
                  <div className="ml-4 space-y-2 mt-2">
                    {keywords.map((keyword) => (
                      <label
                        key={keyword.id}
                        className="flex items-center space-x-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedKeywords.has(keyword.id)}
                          onChange={() => handleKeywordToggle(keyword.id)}
                          className="h-4 w-4 text-accent-light dark:text-accent-dark border-gray-300 dark:border-gray-600 rounded focus:ring-accent-light dark:focus:ring-accent-dark"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                          {keyword.label[language]}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Clear all button */}
          {selectedKeywords.size > 0 && (
            <button
              onClick={handleClearAll}
              className="w-full mt-4 px-4 py-2 text-sm font-medium text-white bg-accent-light dark:bg-accent-dark rounded-md hover:opacity-90 transition-opacity"
            >
              {getTranslation('clearAllFilters', language)}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
