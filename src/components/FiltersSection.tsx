import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';
import { FilterKeyword, FilterKeywordType } from '../types';
import filterKeywords from '../data/filter-keywords.json';

interface FiltersSectionProps {
  selectedKeywords: Set<string>;
  onKeywordsChange: (keywords: Set<string>) => void;
}

/**
 * FiltersSection — Card Stack design.
 * Always-visible card with chip-style keyword pills grouped by type.
 */
export const FiltersSection: React.FC<FiltersSectionProps> = ({
  selectedKeywords,
  onKeywordsChange,
}) => {
  const { language } = useLanguage();

  // Group keywords by type
  const keywordsByType = (filterKeywords as FilterKeyword[]).reduce((acc, keyword) => {
    if (!acc[keyword.type]) acc[keyword.type] = [];
    acc[keyword.type].push(keyword);
    return acc;
  }, {} as Record<FilterKeywordType, FilterKeyword[]>);

  const subsections: { type: FilterKeywordType; labelKey: string }[] = [
    { type: 'meatType', labelKey: 'meatType' },
    { type: 'cookType', labelKey: 'cookType' },
    { type: 'ingredient', labelKey: 'ingredient' },
  ];

  const handleKeywordToggle = (keywordId: string) => {
    const next = new Set(selectedKeywords);
    if (next.has(keywordId)) next.delete(keywordId);
    else next.add(keywordId);
    onKeywordsChange(next);
  };

  const handleClearAll = () => onKeywordsChange(new Set());

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-2xl p-4 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-[11px] font-bold tracking-[0.12em] uppercase text-ink-muted-light dark:text-ink-muted-dark">
          {getTranslation('filters', language)}
        </h4>
        {selectedKeywords.size > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs font-semibold text-brand-warm hover:opacity-80 transition-opacity"
          >
            {getTranslation('clearAllFilters', language)}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {subsections.map(({ type, labelKey }) => {
          const keywords = keywordsByType[type] || [];
          if (keywords.length === 0) return null;
          const displayKeywords = type === 'ingredient' ? keywords.slice(0, 6) : keywords;

          return (
            <div key={type}>
              <h5 className="text-[10px] font-semibold tracking-wider uppercase text-ink-soft-light dark:text-ink-soft-dark mb-2">
                {getTranslation(labelKey, language)}
              </h5>
              <div className="flex flex-wrap gap-2">
                {displayKeywords.map((keyword) => {
                  const isSelected = selectedKeywords.has(keyword.id);
                  return (
                    <button
                      key={keyword.id}
                      onClick={() => handleKeywordToggle(keyword.id)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent ${
                        isSelected
                          ? 'bg-brand-accent text-white border-transparent'
                          : 'bg-card-2-light dark:bg-card-2-dark text-ink-light dark:text-ink-dark border-line-light dark:border-line-dark hover:bg-card-3-light dark:hover:bg-card-3-dark'
                      }`}
                      aria-pressed={isSelected}
                      aria-label={`${getTranslation('filter', language)}: ${keyword.label[language]}`}
                    >
                      {keyword.label[language]}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
