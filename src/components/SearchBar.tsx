import React, { useEffect, useRef } from 'react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';
import { CloseIcon, SearchIcon } from './icons';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  language: Language;
  /** Called by the close button when the field is empty (mobile collapses the field). */
  onClose?: () => void;
  autoFocus?: boolean;
  className?: string;
}

/**
 * SearchBar — an underlined field, like a caption rule (DESIGN.md → Inputs / Search).
 * Filters recipes by title in real time.
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  language,
  onClose,
  autoFocus,
  className = '',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const placeholder = getTranslation('searchRecipes', language);
  const showClose = searchQuery.length > 0 || !!onClose;

  // The field stays mounted (hidden on mobile), so focus it whenever it is opened.
  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const handleClose = () => {
    if (searchQuery) {
      onSearchChange('');
      inputRef.current?.focus();
    } else {
      onClose?.();
    }
  };

  return (
    <form
      role="search"
      onSubmit={(e) => e.preventDefault()}
      className={`relative flex items-center min-w-0 h-11 border-b border-line-strong focus-within:border-ink transition-colors duration-200 ease-ease ${className}`}
    >
      <SearchIcon size={20} className="ml-0.5 mr-2 text-ink-2" />
      <input
        ref={inputRef}
        type="search"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && !searchQuery && onClose) onClose();
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="search"
        className="flex-1 min-w-0 h-full bg-transparent border-0 outline-none text-base text-ink placeholder:text-ink-3 appearance-none [&::-webkit-search-cancel-button]:hidden focus-visible:outline-none"
      />
      {showClose && (
        <button
          type="button"
          onClick={handleClose}
          className="grid place-items-center w-10 h-10 -mr-1 rounded-full text-ink hover:bg-ink/[.06] transition-colors"
          aria-label={getTranslation(searchQuery ? 'clearSearch' : 'closeSearch', language)}
        >
          <CloseIcon size={18} />
        </button>
      )}
    </form>
  );
};
