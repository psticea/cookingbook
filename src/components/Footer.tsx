import React from 'react';
import { Link } from 'react-router-dom';
import { LanguageSelector } from './LanguageSelector';
import { TextSizeSelector } from './TextSizeSelector';
import { ThemeSelector } from './ThemeSelector';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';

/**
 * Footer component
 * Combines all preference selectors (language, text size, theme) and About link
 * Positioned at the bottom of all pages
 */
export const Footer: React.FC = () => {
  const { language } = useLanguage();

  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-zinc-700 bg-surface-light dark:bg-surface-dark">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-2.5">
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4">
          {/* About link - touch-friendly */}
          <Link
            to="/about"
            className="text-lg font-medium text-text-main-light dark:text-text-main-dark hover:text-accent-light dark:hover:text-accent-dark transition-colors min-h-[44px] flex items-center px-2"
          >
            {getTranslation('about', language)}
          </Link>
          
          {/* Divider - hidden on mobile */}
          <div className="hidden sm:block h-4 w-px bg-gray-300 dark:bg-zinc-600" />
          
          {/* Preference selectors - stacked on mobile, inline on larger screens */}
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
