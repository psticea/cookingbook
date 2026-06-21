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
 * Header — Card Stack design.
 * Layout: brand link (left) | optional search (center) | menu button (right).
 * Brand reads "Paul's Cookbook" on the home page; "← Home" on other pages.
 */
export const Header: React.FC<HeaderProps> = ({
  showSearch = false,
  searchQuery = '',
  onSearchChange,
  onMenuToggle,
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
    <header className="bg-card-light dark:bg-card-dark border-b border-line-light dark:border-line-dark sticky top-0 z-40">
      <nav className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-2">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          {/* Left: brand / back link */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              onClick={handleHomeClick}
              className="font-display font-bold text-base sm:text-lg whitespace-nowrap min-h-[44px] flex items-center px-2 sm:px-0 text-brand-accent dark:text-brand-accent-bright hover:opacity-80 transition-opacity"
            >
              {isHomePage ? "Paul's Cookbook" : `← ${getTranslation('home', language)}`}
            </Link>
          </div>

          {/* Center: search (home only) */}
          <div className="flex-1 max-w-md mx-2 sm:mx-3">
            {showSearch && onSearchChange && isHomePage && (
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                language={language}
              />
            )}
          </div>

          {/* Right: menu */}
          <div className="flex-shrink-0">
            <button
              onClick={onMenuToggle}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-ink-light dark:text-ink-dark hover:bg-card-2-light dark:hover:bg-card-2-dark transition-colors rounded-xl"
              aria-label={getTranslation('menu', language)}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
