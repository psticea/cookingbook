import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import { Theme } from '../types';
import { getTranslation } from '../utils/translations';

/**
 * ThemeSelector component
 * Displays dark and light theme options
 * Highlights the currently selected theme
 */
export const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { language } = useLanguage();

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleThemeChange('dark')}
        className={`min-w-[44px] min-h-[44px] px-3 py-2 text-base rounded transition-colors ${
          theme === 'dark'
            ? 'bg-accent-light dark:bg-accent-dark text-white font-semibold'
            : 'hover:bg-secondary-light dark:hover:bg-secondary-dark'
        }`}
        aria-label={getTranslation('dark', language)}
        aria-pressed={theme === 'dark'}
      >
        {getTranslation('dark', language)}
      </button>
      <span className="text-sm opacity-50">|</span>
      <button
        onClick={() => handleThemeChange('light')}
        className={`min-w-[44px] min-h-[44px] px-3 py-2 text-base rounded transition-colors ${
          theme === 'light'
            ? 'bg-accent-light dark:bg-accent-dark text-white font-semibold'
            : 'hover:bg-secondary-light dark:hover:bg-secondary-dark'
        }`}
        aria-label={getTranslation('light', language)}
        aria-pressed={theme === 'light'}
      >
        {getTranslation('light', language)}
      </button>
    </div>
  );
};
