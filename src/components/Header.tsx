import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';

/**
 * Header component
 * Displays navigation links to all main pages
 */
export const Header: React.FC = () => {
  const { language } = useLanguage();
  const location = useLocation();

  const navLinks = [
    { path: '/', label: getTranslation('home', language) },
    { path: '/about', label: getTranslation('about', language) },
    { path: '/cooking-basics', label: getTranslation('cookingBasics', language) },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-base font-medium transition-colors duration-200 ${
                  isActive
                    ? 'text-accent-light dark:text-accent-dark border-b-2 border-accent-light dark:border-accent-dark'
                    : 'text-gray-700 dark:text-gray-300 hover:text-accent-light dark:hover:text-accent-dark'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
