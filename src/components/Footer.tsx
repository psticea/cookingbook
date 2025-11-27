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
    <footer className="mt-auto border-t border-gradient-to-r border-gray-200 dark:border-gray-700 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-6">
          {/* About link - enhanced styling */}
          <Link
            to="/about"
            className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-accent-light dark:hover:text-accent-dark hover:scale-110 transition-all min-h-[44px] flex items-center px-3 py-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20"
          >
            ℹ️ {getTranslation('about', language)}
          </Link>
          
          {/* Divider - styled better */}
          <div className="hidden sm:block h-6 w-px bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
          
          {/* Preference selectors - enhanced with better spacing */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">🌐</span>
              <LanguageSelector />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">🔤</span>
              <TextSizeSelector />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">🎨</span>
              <ThemeSelector />
            </div>
          </div>
        </div>
        
        {/* Decorative footer text */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Made with <span className="text-red-500">❤️</span> for home cooking
          </p>
        </div>
      </div>
    </footer>
  );
};
