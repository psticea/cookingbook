import React from 'react';
import { LanguageSelector } from './LanguageSelector';
import { TextSizeSelector } from './TextSizeSelector';
import { ThemeSelector } from './ThemeSelector';

/**
 * Footer component
 * Combines all preference selectors (language, text size, theme)
 * Positioned at the bottom of all pages
 */
export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
          <LanguageSelector />
          <TextSizeSelector />
          <ThemeSelector />
        </div>
      </div>
    </footer>
  );
};
