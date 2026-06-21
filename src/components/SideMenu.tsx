import React, { useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';
import { LanguageSelector } from './LanguageSelector';
import { TextSizeSelector } from './TextSizeSelector';
import { ThemeSelector } from './ThemeSelector';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

/**
 * SideMenu — Card Stack design.
 * Slide-in drawer occupying ~80% of viewport width on mobile and ~33% on desktop.
 * Dimmed backdrop, Escape to close, body scroll lock.
 */
export const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, children }) => {
  const { language } = useLanguage();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Drawer panel — 80% on mobile, narrower on larger screens */}
      <aside
        className={`fixed top-0 right-0 h-full w-4/5 sm:w-[60%] md:w-[45%] lg:w-[33%] max-w-md
                    bg-bg-light dark:bg-bg-dark
                    shadow-2xl z-50 transform transition-transform duration-300 ease-in-out
                    overflow-y-auto flex flex-col
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label={getTranslation('menu', language)}
      >
        {/* Sticky header */}
        <div className="sticky top-0 z-10 bg-card-light dark:bg-card-dark border-b border-line-light dark:border-line-dark px-5 py-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink-light dark:text-ink-dark">
            {getTranslation('menu', language)}
          </h2>
          <button
            onClick={onClose}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center text-ink-light dark:text-ink-dark hover:bg-card-2-light dark:hover:bg-card-2-dark transition-colors rounded-xl"
            aria-label={getTranslation('close', language)}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer body — children render their own card sections */}
        <div className="px-4 py-4 space-y-3">{children}</div>

        {/* Preferences card — always shown */}
        <div className="px-4 pb-6 mt-auto">
          <div className="bg-card-light dark:bg-card-dark rounded-2xl p-4 shadow-card">
            <h4 className="text-[11px] font-bold tracking-[0.12em] uppercase text-ink-muted-light dark:text-ink-muted-dark mb-3">
              {getTranslation('preferences', language)}
            </h4>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-ink-muted-light dark:text-ink-muted-dark">
                  {getTranslation('language', language)}
                </span>
                <LanguageSelector />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-ink-muted-light dark:text-ink-muted-dark">
                  {getTranslation('theme', language)}
                </span>
                <ThemeSelector />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-ink-muted-light dark:text-ink-muted-dark">
                  {getTranslation('textSize', language)}
                </span>
                <TextSizeSelector />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
