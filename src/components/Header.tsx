import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';
import { SearchBar } from './SearchBar';

interface HeaderProps {
  showSearch?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

/**
 * Header component
 * Displays navigation links to all main pages
 * Optionally displays search bar on home page
 */
export const Header: React.FC<HeaderProps> = ({ 
  showSearch = false, 
  searchQuery = '', 
  onSearchChange 
}) => {
  const { language } = useLanguage();
  const location = useLocation();

  const navLinks = [
    { path: '/', label: getTranslation('home', language) },
    { path: '/cooking-basics', label: getTranslation('cookingBasics', language) },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {/* Navigation Links */}
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-base font-medium transition-colors duration-200 whitespace-nowrap ${
                  isActive
                    ? 'text-accent-light dark:text-accent-dark border-b-2 border-accent-light dark:border-accent-dark'
                    : 'text-gray-700 dark:text-gray-300 hover:text-accent-light dark:hover:text-accent-dark'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          
          {/* Search Bar - only shown on home page */}
          {showSearch && onSearchChange && (
            <div className="w-64">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                language={language}
              />
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};
