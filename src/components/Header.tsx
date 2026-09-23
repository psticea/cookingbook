import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';
import { SearchBar } from './SearchBar';
import { MenuIcon, SearchIcon } from './icons';

interface HeaderProps {
  showSearch?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onMenuToggle?: () => void;
  /** Number of active filters, shown as a China Marker badge on the menu button. */
  filterCount?: number;
  isMenuOpen?: boolean;
  /** Skip the scroll hairline when a sticky strip directly below draws its own. */
  borderless?: boolean;
}

/**
 * Header — wordmark, search and menu (DESIGN.md → Navigation).
 * The wordmark scrolls to top on the homepage and links home elsewhere.
 */
export const Header: React.FC<HeaderProps> = ({
  showSearch = false,
  searchQuery = '',
  onSearchChange,
  onMenuToggle,
  filterCount = 0,
  isMenuOpen,
  borderless = false,
}) => {
  const { language } = useLanguage();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const hasSearch = showSearch && !!onSearchChange && isHomePage;
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (borderless) return;
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [borderless]);

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHomePage) {
      e.preventDefault();
      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    }
  };

  const menuLabel = getTranslation('menu', language) +
    (filterCount ? ` (${filterCount} ${getTranslation('filters', language).toLowerCase()})` : '');

  return (
    <header
      className={`sticky top-0 z-30 h-[var(--bar-h)] bg-wall border-b transition-colors duration-300 ease-ease ${
        scrolled && !borderless ? 'border-line' : 'border-transparent'
      }`}
      style={{ viewTransitionName: 'site-header' } as React.CSSProperties}
    >
      <nav className="h-full max-w-page mx-auto flex items-center gap-2 pl-[var(--gutter)] pr-[calc(var(--gutter)-6px)]">
        <Link
          to="/"
          onClick={handleHomeClick}
          aria-label={`Paul's Cookbook, ${getTranslation('home', language)}`}
          className={`wordmark min-h-target items-center text-md md:text-[1.1875rem] text-ink no-underline ${
            hasSearch && searchOpen ? 'hidden md:inline-flex' : 'inline-flex'
          }`}
        >
          <span className="wordmark__a">Paul's</span>&nbsp;<span className="wordmark__b">Cookbook</span>
        </Link>

        {hasSearch && (
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={onSearchChange!}
            language={language}
            autoFocus={searchOpen}
            onClose={searchOpen ? () => setSearchOpen(false) : undefined}
            className={`flex-1 md:flex-none md:w-[360px] md:ml-auto ${searchOpen ? 'flex' : 'hidden md:flex'}`}
          />
        )}

        <div className={`flex items-center gap-0.5 ${hasSearch ? (searchOpen ? 'ml-1 md:ml-3' : 'ml-auto md:ml-3') : 'ml-auto'}`}>
          {hasSearch && !searchOpen && (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="md:hidden grid place-items-center w-11 h-11 rounded-full text-ink hover:bg-ink/[.06] transition-colors"
              aria-label={getTranslation('openSearch', language)}
              aria-expanded={false}
            >
              <SearchIcon />
            </button>
          )}
          <button
            type="button"
            onClick={onMenuToggle}
            data-menu-toggle
            aria-haspopup="dialog"
            aria-expanded={isMenuOpen}
            aria-label={menuLabel}
            className="relative inline-flex items-center justify-center gap-2.5 min-w-target h-11 px-2.5 md:pl-4 md:pr-3 rounded-full text-ui font-[550] text-ink hover:bg-ink/[.06] transition-colors"
          >
            <span className="hidden md:inline" aria-hidden="true">{getTranslation('menu', language)}</span>
            <MenuIcon />
            {filterCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute top-px -right-px md:static md:order-3 min-w-5 h-5 px-[5px] inline-grid place-items-center rounded-full bg-mark text-on-mark text-xs font-[650] leading-none tabular-nums"
              >
                {filterCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
};
