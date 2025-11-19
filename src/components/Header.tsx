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

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
      <nav className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-1.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Home link - touch-friendly on mobile */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className={`text-sm sm:text-base font-medium transition-colors duration-200 whitespace-nowrap min-h-[44px] flex items-center px-2 sm:px-0 ${
                isHomePage
                  ? 'text-accent-light dark:text-accent-dark'
                  : 'text-gray-700 dark:text-gray-300 hover:text-accent-light dark:hover:text-accent-dark'
              }`}
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
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-gray-700 dark:text-gray-300 hover:text-accent-light dark:hover:text-accent-dark transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
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
