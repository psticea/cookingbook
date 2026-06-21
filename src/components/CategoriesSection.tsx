import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';
import { categories } from '../data';

interface CategoriesSectionProps {
  onCategoryClick: (categoryId: string) => void;
}

// Map category id → emoji for the card-stack design
const CATEGORY_EMOJI: Record<string, string> = {
  breakfast: '🥐',
  pasta: '🍝',
  'stir-fries': '🥘',
  'soups-and-stews': '🍲',
  'main-courses': '🍖',
  'burgers-and-wraps': '🍔',
  'salads-and-bites': '🥗',
  basics: '🍳',
};

/**
 * CategoriesSection — Card Stack design.
 * Card with row buttons (emoji + name) — clicking scrolls to the category on home.
 */
export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ onCategoryClick }) => {
  const { language } = useLanguage();

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-2xl p-4 shadow-card">
      <h4 className="text-[11px] font-bold tracking-[0.12em] uppercase text-ink-muted-light dark:text-ink-muted-dark mb-3">
        {getTranslation('categories', language)}
      </h4>

      <div className="space-y-1.5">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryClick(category.id)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-card-2-light dark:bg-card-2-dark text-ink-light dark:text-ink-dark text-sm font-semibold hover:bg-card-3-light dark:hover:bg-card-3-dark transition-colors"
          >
            <span className="text-lg leading-none">{CATEGORY_EMOJI[category.id] ?? '•'}</span>
            <span>{category.name[language]}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
