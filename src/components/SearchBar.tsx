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
    <div className="relative w-full">
      {/* Search icon */}
      <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
        <svg
          className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
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

      {/* Text input - touch-friendly height on mobile */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-8 sm:pl-9 pr-10 sm:pr-11 py-2.5 sm:py-2 text-sm sm:text-base 
                   border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                   placeholder-gray-400 dark:placeholder-gray-500
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   transition-colors min-h-[44px] sm:min-h-0"
        aria-label={placeholder}
      />

      {/* Clear button (X symbol) - touch-friendly minimum 44x44px on mobile */}
      {searchQuery && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center text-gray-400 hover:text-gray-600 
                     dark:hover:text-gray-300 transition-colors min-w-[44px] justify-center"
          aria-label={language === 'ro' ? 'Șterge căutarea' : 'Clear search'}
        >
          <svg
            className="h-4 w-4 sm:h-5 sm:w-5"
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
