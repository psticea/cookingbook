import React, { useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';
import { LanguageSelector } from './LanguageSelector';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

/**
 * SideMenu component
 * A side panel that slides in from the right, occupying 1/3 of screen width
 * Contains sections for Filters, Categories, Cooking Basics, and About
 * Can be closed by clicking outside, pressing Escape, or clicking close button
 */
export const SideMenu: React.FC<SideMenuProps> = ({
  isOpen,
  onClose,
  children
}) => {
  const { language } = useLanguage();

  // Handle Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when menu is open
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

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop with blur effect */}
      <div
        className={`fixed inset-0 bg-black backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Side Menu Panel - responsive width with enhanced styling */}
      <div
        className={`fixed top-0 right-0 h-full w-3/5 md:w-1/2 lg:w-1/3 bg-white dark:bg-neutral-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={getTranslation('menu', language)}
      >
        {/* Header with close button - enhanced styling */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-500 to-indigo-600 border-b border-indigo-600/30 px-4 sm:px-6 py-4 flex items-center justify-between z-10 shadow-md">
          <h2 className="text-2xl font-bold text-white font-display flex items-center gap-2">
            <span>🍽️</span>
            {getTranslation('menu', language)}
          </h2>
          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-white hover:bg-white/20 transition-all rounded-lg transform hover:scale-110"
            aria-label={getTranslation('close', language)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Menu content - enhanced padding and spacing */}
        <div className="px-4 sm:px-6 py-6 pb-24 space-y-4">
          {children}
        </div>

        {/* Footer with Language Selector - enhanced styling */}
        <div className="sticky bottom-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-center">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </>
  );
};
