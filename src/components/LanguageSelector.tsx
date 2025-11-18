import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';

/**
 * LanguageSelector component
 * Displays Romanian and English language options
 * Highlights the currently selected language
 */
export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleLanguageChange('ro')}
        className={`min-w-[44px] min-h-[44px] px-3 py-2 text-sm sm:text-base rounded transition-colors ${
          language === 'ro'
            ? 'bg-accent-light dark:bg-accent-dark text-white font-semibold'
            : 'hover:bg-secondary-light dark:hover:bg-secondary-dark'
        }`}
        aria-label={getTranslation('romanian', language)}
        aria-pressed={language === 'ro'}
      >
        RO
      </button>
      <span className="text-sm opacity-50">|</span>
      <button
        onClick={() => handleLanguageChange('en')}
        className={`min-w-[44px] min-h-[44px] px-3 py-2 text-sm sm:text-base rounded transition-colors ${
          language === 'en'
            ? 'bg-accent-light dark:bg-accent-dark text-white font-semibold'
            : 'hover:bg-secondary-light dark:hover:bg-secondary-dark'
        }`}
        aria-label={getTranslation('english', language)}
        aria-pressed={language === 'en'}
      >
        EN
      </button>
    </div>
  );
};
