import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useRecipeData } from '../hooks/useRecipeData';
import { getTranslation } from '../utils/translations';
import { categories } from '../data';
import { MenuSection } from './SideMenu';

interface CategoriesSectionProps {
  onCategoryClick: (categoryId: string) => void;
  /** Visible recipe count per category (e.g. after filtering). Defaults to all recipes. */
  counts?: Record<string, number>;
}

/**
 * CategoriesSection — image-led category index (DESIGN.md → Navigation):
 * 44px thumbnail, name and count; categories with no visible recipes are disabled.
 */
export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ onCategoryClick, counts }) => {
  const { language } = useLanguage();
  const { recipes } = useRecipeData();
  const base = import.meta.env.BASE_URL;

  return (
    <MenuSection title={getTranslation('categories', language)}>
      <ul className="mt-1">
        {categories.map((category) => {
          const inCategory = recipes.filter((r) => r.category === category.id);
          const count = counts ? counts[category.id] ?? 0 : inCategory.length;
          const cover = inCategory[0];
          const word = count === 1 ? getTranslation('oneRecipe', language) : getTranslation('recipes', language).toLowerCase();
          return (
            <li key={category.id}>
              <button
                type="button"
                onClick={() => onCategoryClick(category.id)}
                disabled={recipes.length > 0 && count === 0}
                className="group w-full grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3.5 min-h-[56px] py-1.5 pr-1 text-left text-base text-ink rounded-ctl disabled:cursor-default"
              >
                <span className="block w-11 h-11 rounded-print overflow-hidden bg-frame group-disabled:opacity-45">
                  {cover && (
                    <img
                      src={`${base}images/recipes/${cover.category}/${cover.id}.thumb.webp`}
                      onError={(e) => {
                        const img = e.currentTarget;
                        if (img.src.endsWith('.thumb.webp')) img.src = `${base}images/recipes/${cover.category}/${cover.id}.jpg`;
                      }}
                      alt=""
                      width={44}
                      height={44}
                      loading="lazy"
                      decoding="async"
                      className="photo w-full h-full object-cover"
                    />
                  )}
                </span>
                <span className="group-[:not(:disabled):hover]:underline decoration-1 underline-offset-4 group-disabled:opacity-45">
                  {category.name[language]}
                </span>
                <span className="text-sm text-ink-3 tabular-nums">
                  {count}
                  <span className="sr-only"> {word}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </MenuSection>
  );
};
