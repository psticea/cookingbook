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
    <div className="flex items-center gap-2">
      <span className="text-sm opacity-70">📏</span>
      <button
        onClick={() => handleTextSizeChange('normal')}
        className={`px-3 py-1 text-sm rounded transition-colors ${
          textSize === 'normal'
            ? 'bg-accent-light dark:bg-accent-dark text-white font-semibold'
            : 'hover:bg-secondary-light dark:hover:bg-secondary-dark'
        }`}
        aria-label={getTranslation('normal', language)}
        aria-pressed={textSize === 'normal'}
      >
        A
      </button>
      <span className="text-sm opacity-50">|</span>
      <button
        onClick={() => handleTextSizeChange('large')}
        className={`px-3 py-1 text-base rounded transition-colors ${
          textSize === 'large'
            ? 'bg-accent-light dark:bg-accent-dark text-white font-semibold'
            : 'hover:bg-secondary-light dark:hover:bg-secondary-dark'
        }`}
        aria-label={getTranslation('large', language)}
        aria-pressed={textSize === 'large'}
      >
        A
      </button>
    </div>
  );
};
