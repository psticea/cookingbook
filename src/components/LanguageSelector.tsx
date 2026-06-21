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
    <div className="inline-flex items-center bg-card-2-light dark:bg-card-2-dark rounded-full p-1 border border-line-light dark:border-line-dark">
      <button
        onClick={() => handleLanguageChange('ro')}
        className={`min-w-[44px] min-h-[36px] px-3 py-1 text-sm font-semibold rounded-full transition-colors ${
          language === 'ro'
            ? 'bg-brand-accent text-white'
            : 'text-ink-muted-light dark:text-ink-muted-dark hover:text-ink-light dark:hover:text-ink-dark'
        }`}
        aria-label={getTranslation('romanian', language)}
        aria-pressed={language === 'ro'}
      >
        RO
      </button>
      <button
        onClick={() => handleLanguageChange('en')}
        className={`min-w-[44px] min-h-[36px] px-3 py-1 text-sm font-semibold rounded-full transition-colors ${
          language === 'en'
            ? 'bg-brand-accent text-white'
            : 'text-ink-muted-light dark:text-ink-muted-dark hover:text-ink-light dark:hover:text-ink-dark'
        }`}
        aria-label={getTranslation('english', language)}
        aria-pressed={language === 'en'}
      >
        EN
      </button>
    </div>
  );
};
