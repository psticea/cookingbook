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
    <footer className="mt-auto border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <Link
            to="/about"
            className="text-base font-medium text-gray-700 dark:text-gray-300 hover:text-accent-light dark:hover:text-accent-dark transition-colors"
          >
            {getTranslation('about', language)}
          </Link>
          <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
          <LanguageSelector />
          <TextSizeSelector />
          <ThemeSelector />
        </div>
      </div>
    </footer>
  );
};
