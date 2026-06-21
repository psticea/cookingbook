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
    <div className="inline-flex items-center bg-card-2-light dark:bg-card-2-dark rounded-full p-1 border border-line-light dark:border-line-dark">
      <button
        onClick={() => handleThemeChange('light')}
        className={`min-w-[44px] min-h-[36px] px-3 py-1 text-sm font-semibold rounded-full transition-colors ${
          theme === 'light'
            ? 'bg-brand-accent text-white'
            : 'text-ink-muted-light dark:text-ink-muted-dark hover:text-ink-light dark:hover:text-ink-dark'
        }`}
        aria-label={getTranslation('light', language)}
        aria-pressed={theme === 'light'}
      >
        ☀️
      </button>
      <button
        onClick={() => handleThemeChange('dark')}
        className={`min-w-[44px] min-h-[36px] px-3 py-1 text-sm font-semibold rounded-full transition-colors ${
          theme === 'dark'
            ? 'bg-brand-accent text-white'
            : 'text-ink-muted-light dark:text-ink-muted-dark hover:text-ink-light dark:hover:text-ink-dark'
        }`}
        aria-label={getTranslation('dark', language)}
        aria-pressed={theme === 'dark'}
      >
        🌙
      </button>
    </div>
  );
};
