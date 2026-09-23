import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';
import { FilterKeyword, FilterKeywordType } from '../types';
import filterKeywords from '../data/filter-keywords.json';
import { MenuSection } from './SideMenu';

interface FiltersSectionProps {
  selectedKeywords: Set<string>;
  onKeywordsChange: (keywords: Set<string>) => void;
}

const GROUPS: { type: FilterKeywordType; labelKey: string }[] = [
  { type: 'meatType', labelKey: 'meatType' },
  { type: 'cookType', labelKey: 'cookType' },
  { type: 'ingredient', labelKey: 'ingredient' },
];

/**
 * FiltersSection — keyword chips grouped by type (DESIGN.md → Chips).
 * Multi-select with AND logic; the first 12 ingredient keywords are shown.
 */
export const FiltersSection: React.FC<FiltersSectionProps> = ({ selectedKeywords, onKeywordsChange }) => {
  const { language } = useLanguage();

  const byType = (filterKeywords as FilterKeyword[]).reduce((acc, keyword) => {
    (acc[keyword.type] ||= []).push(keyword);
    return acc;
  }, {} as Record<FilterKeywordType, FilterKeyword[]>);

  const toggle = (id: string) => {
    const next = new Set(selectedKeywords);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onKeywordsChange(next);
  };

  return (
    <MenuSection
      title={getTranslation('filters', language)}
      action={selectedKeywords.size > 0 && (
        <button
          type="button"
          onClick={() => onKeywordsChange(new Set())}
          className="min-h-target px-0.5 text-sm font-medium text-ink-2 underline decoration-line-strong decoration-1 underline-offset-4 hover:decoration-current"
        >
          {getTranslation('clearAllFilters', language)}
        </button>
      )}
    >
      <div className="space-y-3.5">
        {GROUPS.map(({ type, labelKey }) => {
          const keywords = byType[type] || [];
          if (!keywords.length) return null;
          const shown = type === 'ingredient' ? keywords.slice(0, 12) : keywords;
          const groupId = `filter-group-${type}`;
          return (
            <div key={type} role="group" aria-labelledby={groupId}>
              <h4 id={groupId} className="text-sm font-medium text-ink-2 mt-1.5 mb-2">
                {getTranslation(labelKey, language)}
              </h4>
              <div className="flex flex-wrap gap-2">
                {shown.map((keyword) => {
                  const on = selectedKeywords.has(keyword.id);
                  return (
                    <button
                      key={keyword.id}
                      type="button"
                      data-filter-chip
                      onClick={() => toggle(keyword.id)}
                      aria-pressed={on}
                      aria-label={`${getTranslation('filter', language)}: ${keyword.label[language]}`}
                      className={`min-h-target px-3.5 rounded-ctl border text-ui transition-colors duration-200 ease-ease ${
                        on ? 'bg-ink border-ink text-paper font-[560]' : 'bg-transparent border-line-strong text-ink font-[480] hover:border-ink'
                      }`}
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
    </MenuSection>
  );
};
