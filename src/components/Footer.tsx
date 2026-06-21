import React from 'react';
import { Link } from 'react-router-dom';
import { LanguageSelector } from './LanguageSelector';
import { TextSizeSelector } from './TextSizeSelector';
import { ThemeSelector } from './ThemeSelector';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';

/**
 * Footer — Card Stack design.
 * About link plus preference selectors (language, text size, theme).
 */
export const Footer: React.FC = () => {
  const { language } = useLanguage();

  return (
    <footer className="mt-auto border-t border-line-light dark:border-line-dark bg-card-light dark:bg-card-dark">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-3">
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            to="/about"
            className="font-display font-semibold text-base text-ink-light dark:text-ink-dark hover:text-brand-accent dark:hover:text-brand-accent-bright transition-colors min-h-[44px] flex items-center px-2"
          >
            {getTranslation('about', language)}
          </Link>

          <div className="hidden sm:block h-4 w-px bg-line-light dark:bg-line-dark" />

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <LanguageSelector />
            <TextSizeSelector />
            <ThemeSelector />
          </div>
        </div>
      </div>
    </footer>
  );
};
