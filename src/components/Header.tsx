import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';
import { SearchBar } from './SearchBar';

interface HeaderProps {
  showSearch?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onMenuToggle?: () => void;
}

/**
 * Header component
 * Layout: Home link (left) | Search bar (center) | Menu button (right)
 * Search bar only visible on homepage
 */
export const Header: React.FC<HeaderProps> = ({ 
  showSearch = false, 
  searchQuery = '', 
  onSearchChange,
  onMenuToggle
}) => {
  const { language } = useLanguage();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHomePage) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="glass sticky top-0 z-40 shadow-sm">
      <nav className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Logo and Home link - touch-friendly on mobile */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">🍳</span>
            </div>
            <Link
              to="/"
              onClick={handleHomeClick}
              className="hidden sm:block text-xl font-bold font-display text-gradient whitespace-nowrap min-h-[44px] flex items-center px-0 hover:scale-105 transform transition-transform"
            >
              {getTranslation('home', language)}
            </Link>
            <Link
              to="/"
              onClick={handleHomeClick}
              className="sm:hidden text-sm font-bold text-accent-light dark:text-accent-dark whitespace-nowrap min-h-[44px] flex items-center px-1 hover:scale-105 transform transition-transform"
            >
              {getTranslation('home', language)}
            </Link>
          </div>
          
          {/* Center: Search Bar - only shown on home page */}
          <div className="flex-1 max-w-md mx-2 sm:mx-4">
            {showSearch && onSearchChange && isHomePage && (
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                language={language}
              />
            )}
          </div>

          {/* Right: Menu button - touch-friendly minimum 44x44px */}
          <div className="flex-shrink-0">
            <button
              onClick={onMenuToggle}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-neutral-700 dark:text-neutral-300 hover:text-accent-light dark:hover:text-accent-dark hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all rounded-xl transform hover:scale-105"
              aria-label={getTranslation('menu', language)}
            >
              <svg
                className="h-6 w-6 sm:h-7 sm:w-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
