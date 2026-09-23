import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';

const FOOTER_LINKS = [
  { to: '/about', labelKey: 'about' },
  { to: '/cooking-basics', labelKey: 'cookingBasics' },
  { to: '/prices', labelKey: 'ingredientPrices' },
] as const;

/** Footer — wordmark, subtitle and underlined links (preferences live in the side menu). */
export const Footer: React.FC = () => {
  const { language } = useLanguage();

  return (
    <footer className="mt-24 border-t border-line">
      <div className="max-w-page mx-auto gutter pt-7 pb-[calc(36px+env(safe-area-inset-bottom))] grid gap-1">
        <p className="wordmark text-base text-ink">
          <span className="wordmark__a">Paul's</span> <span className="wordmark__b">Cookbook</span>
        </p>
        <nav aria-label={getTranslation('more', language)} className="flex flex-wrap gap-x-[22px] mt-1">
          {FOOTER_LINKS.map(({ to, labelKey }) => (
            <Link
              key={to}
              to={to}
              className="inline-flex items-center min-h-target text-ui text-ink underline decoration-line-strong decoration-1 underline-offset-4 hover:decoration-current"
            >
              {getTranslation(labelKey, language)}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
};
