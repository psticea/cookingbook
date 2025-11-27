import React from 'react';
import { Language } from '../types';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  language: Language;
}

/**
 * SearchBar component
 * Displays a text input field with search icon and clear button
 * Filters recipes by title in real-time
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  language,
}) => {
  const handleClear = () => {
    onSearchChange('');
  };

  const placeholder = language === 'ro' ? 'Caută rețete...' : 'Search recipes...';

  return (
    <div className="relative w-full group">
      {/* Search icon */}
      <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-amber-500 group-focus-within:text-amber-600 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Text input - enhanced with gradient border on focus */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-10 sm:pl-12 pr-12 sm:pr-14 py-2.5 sm:py-3 text-base sm:text-lg
                   border-2 border-gray-200 dark:border-gray-600 rounded-xl 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                   placeholder-gray-400 dark:placeholder-gray-500
                   focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 focus:ring-4 focus:ring-amber-100 dark:focus:ring-amber-900/30
                   transition-all duration-200 min-h-[44px] sm:min-h-0 shadow-sm"
        aria-label={placeholder}
      />

      {/* Clear button (X symbol) - enhanced styling */}
      {searchQuery && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-red-500 
                     dark:hover:text-red-400 transition-all duration-200 min-w-[44px] justify-center transform hover:scale-125"
          aria-label={language === 'ro' ? 'Șterge căutarea' : 'Clear search'}
        >
          <svg
            className="h-5 w-5"
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
      )}
    </div>
  );
};
