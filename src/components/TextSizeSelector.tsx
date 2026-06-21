import React from 'react';
import { useTextSize } from '../hooks/useTextSize';
import { useLanguage } from '../hooks/useLanguage';
import { TextSize } from '../types';
import { getTranslation } from '../utils/translations';

/**
 * TextSizeSelector component
 * Displays normal and large text size options
 * Highlights the currently selected text size
 */
export const TextSizeSelector: React.FC = () => {
  const { textSize, setTextSize } = useTextSize();
  const { language } = useLanguage();

  const handleTextSizeChange = (newSize: TextSize) => {
    setTextSize(newSize);
  };

  return (
    <div className="inline-flex items-center bg-card-2-light dark:bg-card-2-dark rounded-full p-1 border border-line-light dark:border-line-dark">
      <button
        onClick={() => handleTextSizeChange('normal')}
        className={`min-w-[44px] min-h-[36px] px-3 py-1 text-sm font-semibold rounded-full transition-colors ${
          textSize === 'normal'
            ? 'bg-brand-accent text-white'
            : 'text-ink-muted-light dark:text-ink-muted-dark hover:text-ink-light dark:hover:text-ink-dark'
        }`}
        aria-label={getTranslation('normal', language)}
        aria-pressed={textSize === 'normal'}
      >
        A
      </button>
      <button
        onClick={() => handleTextSizeChange('large')}
        className={`min-w-[44px] min-h-[36px] px-3 py-1 text-base font-semibold rounded-full transition-colors ${
          textSize === 'large'
            ? 'bg-brand-accent text-white'
            : 'text-ink-muted-light dark:text-ink-muted-dark hover:text-ink-light dark:hover:text-ink-dark'
        }`}
        aria-label={getTranslation('large', language)}
        aria-pressed={textSize === 'large'}
      >
        A
      </button>
    </div>
  );
};
