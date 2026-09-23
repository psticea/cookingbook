import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { RecipeGrid } from '../components/RecipeGrid';
import { Footer } from '../components/Footer';
import { SideMenu } from '../components/SideMenu';
import { FiltersSection } from '../components/FiltersSection';
import { CategoriesSection } from '../components/CategoriesSection';
import { MenuLinks } from '../components/MenuLinks';
import { TodaysPlate } from '../components/TodaysPlate';
import { CloseIcon, FiltersIcon, PencilMark, SortArrow } from '../components/icons';
import { useRecipeData, getRecipesByCategory } from '../hooks/useRecipeData';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';
import { calculateRecipeCost, compareRecipeCosts } from '../utils/pricing';
import { categories } from '../data';
import filterKeywords from '../data/filter-keywords.json';
import { FilterKeyword, Recipe } from '../types';

export type SortField = 'name' | 'prepTime' | 'pricePerServing';
export type SortOrder = 'asc' | 'desc';

const SORT_FIELDS: { value: SortField; labelKey: string }[] = [
  { value: 'name', labelKey: 'sortByName' },
  { value: 'prepTime', labelKey: 'sortByPrepTime' },
  { value: 'pricePerServing', labelKey: 'sortByPrice' },
];

const prefersReducedMotion = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Run a state update inside a View Transition when supported, so prints glide to their new place. */
function withViewTransition(update: () => void) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (typeof doc.startViewTransition === 'function' && !prefersReducedMotion()) {
    doc.startViewTransition(() => flushSync(update));
  } else {
    update();
  }
}

/**
 * HomePage — "The Light Table" (DESIGN.md): greeting and today's plate, a sticky
 * control strip, then category rooms of square prints. Search, filters, sorting
 * and grouping behave exactly as before.
 */
const HomePage: React.FC = () => {
  const { recipes, loading, error } = useRecipeData();
  const { language } = useLanguage();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [menuFocus, setMenuFocus] = useState<string | undefined>();
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [showCategories, setShowCategories] = useState(true);
  const [stuck, setStuck] = useState(false);
  const controlsRef = useRef<HTMLDivElement>(null);

  // Save scroll position before leaving the page
  useEffect(() => {
    const saveScrollPosition = () => sessionStorage.setItem('homeScrollPosition', window.scrollY.toString());
    window.addEventListener('beforeunload', saveScrollPosition);
    return () => window.removeEventListener('beforeunload', saveScrollPosition);
  }, []);

  // Restore scroll position when returning to the page
  useEffect(() => {
    const savedPosition = sessionStorage.getItem('homeScrollPosition');
    if (savedPosition && !location.state) {
      const position = parseInt(savedPosition, 10);
      setTimeout(() => {
        window.scrollTo(0, position);
        sessionStorage.removeItem('homeScrollPosition');
      }, 100);
    }
  }, [location.state]);

  // Scroll to top when filters change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedKeywords]);

  // Handle navigation from other pages (category scroll or filters)
  useEffect(() => {
    if (!location.state) return;
    const state = location.state as { scrollToCategory?: string; selectedKeywords?: string[] };
    if (state.scrollToCategory) {
      setTimeout(() => {
        document.getElementById(`category-${state.scrollToCategory}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
    if (state.selectedKeywords) setSelectedKeywords(new Set(state.selectedKeywords));
  }, [location.state]);

  // Hairline under the control strip only once it is stuck below the header.
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = controlsRef.current;
        if (!el) return;
        const barHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bar-h')) || 56;
        setStuck(window.scrollY > 0 && el.getBoundingClientRect().top <= barHeight + 1);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, [loading]);

  const trimmedQuery = searchQuery.trim();
  const isSearching = trimmedQuery.length >= 2;
  const isFiltered = isSearching || selectedKeywords.size > 0;

  // Keywords: recipes must contain ALL selected keywords. Search: title match from 2+ characters.
  const filteredRecipes = useMemo(() => {
    let filtered = recipes;
    if (selectedKeywords.size > 0) {
      filtered = filtered.filter((recipe: Recipe) => Array.from(selectedKeywords).every((k) => recipe.keywords.includes(k)));
    }
    if (isSearching) {
      const query = trimmedQuery.toLowerCase();
      filtered = filtered.filter((recipe: Recipe) => recipe.title[language].toLowerCase().includes(query));
    }
    return filtered;
  }, [recipes, trimmedQuery, isSearching, selectedKeywords, language]);

  const sortRecipeList = useCallback((list: Recipe[]): Recipe[] => {
    if (sortField === 'pricePerServing') {
      return list
        .map((recipe) => ({ recipe, cost: calculateRecipeCost(recipe, language) }))
        .sort((a, b) => compareRecipeCosts(a.cost, b.cost, sortOrder))
        .map((item) => item.recipe);
    }
    return [...list].sort((a, b) => {
      const comparison = sortField === 'name'
        ? a.title[language].toLowerCase().localeCompare(b.title[language].toLowerCase())
        : a.prepTime - b.prepTime;
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [sortField, sortOrder, language]);

  const sections = useMemo(
    () => categories
      .map((category) => ({ category, recipes: sortRecipeList(getRecipesByCategory(filteredRecipes, category.id)) }))
      .filter((section) => section.recipes.length > 0),
    [filteredRecipes, sortRecipeList]
  );
  const flatRecipes = useMemo(() => sortRecipeList(filteredRecipes), [filteredRecipes, sortRecipeList]);
  const categoryCounts = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, getRecipesByCategory(filteredRecipes, c.id).length])),
    [filteredRecipes]
  );

  const count = filteredRecipes.length;
  const recipesWord = (n: number) => (n === 1 ? getTranslation('oneRecipe', language) : getTranslation('recipes', language).toLowerCase());

  const openMenu = (focus?: string) => {
    setMenuFocus(focus);
    setIsSideMenuOpen(true);
  };
  const closeMenu = useCallback(() => setIsSideMenuOpen(false), []);

  const handleSort = (field: SortField) => withViewTransition(() => {
    if (field === sortField) setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    else setSortField(field);
  });

  const handleCategoryClick = (categoryId: string) => {
    if (!showCategories) flushSync(() => setShowCategories(true));
    closeMenu();
    requestAnimationFrame(() => {
      const section = document.getElementById(`category-${categoryId}`);
      section?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
      section?.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
    });
  };

  const removeKeyword = (id: string) => withViewTransition(() => {
    const next = new Set(selectedKeywords);
    next.delete(id);
    setSelectedKeywords(next);
  });

  const clearAll = () => withViewTransition(() => {
    setSearchQuery('');
    setSelectedKeywords(new Set());
  });

  const keywordLabel = (id: string) => (filterKeywords as FilterKeyword[]).find((k) => k.id === id)?.label[language] ?? id;
  const quoted = language === 'ro' ? `„${trimmedQuery}”` : `“${trimmedQuery}”`;

  const dirLabel = getTranslation(sortOrder === 'asc' ? 'ascending' : 'descending', language);

  return (
    <div className="min-h-screen flex flex-col bg-wall">
      <Header
        showSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onMenuToggle={() => (isSideMenuOpen ? closeMenu() : openMenu())}
        filterCount={selectedKeywords.size}
        isMenuOpen={isSideMenuOpen}
        borderless
      />

      <SideMenu isOpen={isSideMenuOpen} onClose={closeMenu} initialFocusSelector={menuFocus}>
        <FiltersSection selectedKeywords={selectedKeywords} onKeywordsChange={setSelectedKeywords} />
        <CategoriesSection onCategoryClick={handleCategoryClick} counts={categoryCounts} />
        <MenuLinks onLinkClick={closeMenu} />
      </SideMenu>

      <main className="flex-1 w-full" id="recipes">
        {loading && <p className="py-16 text-center text-base text-ink-2">{getTranslation('loading', language)}</p>}
        {error && <p className="py-16 text-center text-base text-ink">{getTranslation('errorOccurred', language)}</p>}

        {!loading && !error && recipes.length === 0 && (
          <p className="py-16 text-center type-title text-ink">{getTranslation('noRecipesFound', language)}</p>
        )}

        {!loading && !error && recipes.length > 0 && (
          <>
            {!isFiltered && <TodaysPlate recipes={recipes} />}

            {/* Control strip: count · group switch · filters · sort */}
            <div
              ref={controlsRef}
              className={`sticky top-[var(--bar-h)] z-20 mt-5 lg:mt-8 bg-wall border-b transition-colors duration-300 ease-ease ${
                stuck ? 'border-line' : 'border-transparent'
              }`}
              style={{ viewTransitionName: 'control-strip' } as React.CSSProperties}
            >
              <div className="max-w-page mx-auto min-h-[52px] py-1 pl-[var(--gutter)] pr-[calc(var(--gutter)-8px)] flex flex-wrap items-center gap-x-2 xs:gap-x-3 sm:gap-x-3.5">
                <p className="grid leading-[1.1] sm:block sm:leading-normal whitespace-nowrap" aria-live="polite" aria-atomic="true">
                  <span className="text-md sm:text-base font-[650] tabular-nums text-ink">{count}</span>{' '}
                  <span className="text-xs sm:text-ui text-ink-2">{recipesWord(count)}</span>
                </p>

                <button
                  type="button"
                  role="switch"
                  aria-checked={showCategories}
                  aria-label={getTranslation('groupByCategories', language)}
                  onClick={() => withViewTransition(() => setShowCategories((v) => !v))}
                  className={`group inline-flex items-center gap-[7px] sm:gap-2 min-h-target px-0.5 text-ui font-[520] transition-colors duration-200 ease-ease ${
                    showCategories ? 'text-ink' : 'text-ink-2 hover:text-ink'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`relative w-7 sm:w-[30px] h-[18px] rounded-[9px] border-[1.5px] transition-colors duration-300 ease-ease ${
                      showCategories ? 'bg-ink border-ink' : 'border-current'
                    }`}
                  >
                    <span
                      className={`absolute top-[2.5px] left-[2.5px] w-2.5 h-2.5 rounded-full transition-transform duration-[350ms] ease-ease ${
                        showCategories ? 'bg-wall translate-x-2.5 sm:translate-x-3' : 'bg-current'
                      }`}
                    />
                  </span>
                  <span aria-hidden="true">{getTranslation('categories', language)}</span>
                </button>

                <button
                  type="button"
                  onClick={() => openMenu('[data-filter-chip]')}
                  aria-haspopup="dialog"
                  aria-label={getTranslation('filters', language) + (selectedKeywords.size ? ` (${selectedKeywords.size})` : '')}
                  className="hidden sm:inline-flex items-center gap-2 min-h-target px-1 text-ui font-[520] text-ink-2 hover:text-ink transition-colors"
                >
                  <FiltersIcon size={20} />
                  <span aria-hidden="true">{getTranslation('filters', language)}</span>
                  {selectedKeywords.size > 0 && (
                    <span aria-hidden="true" className="min-w-5 h-5 px-[5px] inline-grid place-items-center rounded-full bg-mark text-on-mark text-xs font-[650] leading-none tabular-nums">
                      {selectedKeywords.size}
                    </span>
                  )}
                </button>

                <div className="ml-auto flex" role="group" aria-label={getTranslation('sort', language)}>
                  {SORT_FIELDS.map((field) => {
                    const active = sortField === field.value;
                    return (
                      <button
                        key={field.value}
                        type="button"
                        onClick={() => handleSort(field.value)}
                        aria-pressed={active}
                        title={active ? dirLabel : undefined}
                        className={`relative inline-flex items-center gap-1 min-h-target px-[7px] xs:px-2 sm:px-[9px] text-ui transition-colors duration-200 ease-ease ${
                          active ? 'text-ink font-[620]' : 'text-ink-2 font-[520] hover:text-ink'
                        }`}
                      >
                        {getTranslation(field.labelKey, language)}
                        {active && (
                          <SortArrow className={`transition-transform duration-[450ms] ease-ease ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                        )}
                        <PencilMark />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Active search / filters, each removable */}
            {isFiltered && (
              <div className="max-w-page mx-auto gutter pt-2.5 flex flex-wrap items-center gap-2">
                {isSearching && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label={`${getTranslation('removeFilter', language)}: ${quoted}`}
                    className="inline-flex items-center gap-1.5 min-h-target pl-3 pr-2.5 rounded-ctl border border-line-strong text-ui font-medium text-ink hover:border-ink transition-colors"
                  >
                    {quoted}
                    <CloseIcon size={16} className="text-ink-2" />
                  </button>
                )}
                {Array.from(selectedKeywords).map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => removeKeyword(id)}
                    aria-label={`${getTranslation('removeFilter', language)}: ${keywordLabel(id)}`}
                    className="inline-flex items-center gap-1.5 min-h-target pl-3 pr-2.5 rounded-ctl border border-line-strong text-ui font-medium text-ink hover:border-ink transition-colors"
                  >
                    {keywordLabel(id)}
                    <CloseIcon size={16} className="text-ink-2" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={clearAll}
                  className="ml-1 min-h-target px-0.5 text-ui font-medium text-ink underline decoration-line-strong decoration-1 underline-offset-4 hover:decoration-current"
                >
                  {getTranslation('clearFilters', language)}
                </button>
              </div>
            )}

            <div className="max-w-page mx-auto gutter pt-4 lg:pt-6">
              {count === 0 ? (
                <div role="status" className="grid justify-items-center text-center pt-10 pb-6 px-2">
                  <div aria-hidden="true" className="relative w-[120px] aspect-square mb-6 border-[1.5px] border-dashed border-line-strong rounded-print">
                    {(['-top-[9px] -left-[9px] border-t-[1.5px] border-l-[1.5px]', '-top-[9px] -right-[9px] border-t-[1.5px] border-r-[1.5px]', '-bottom-[9px] -left-[9px] border-b-[1.5px] border-l-[1.5px]', '-bottom-[9px] -right-[9px] border-b-[1.5px] border-r-[1.5px]']).map((pos) => (
                      <span key={pos} className={`absolute w-3 h-3 border-ink-3 ${pos}`} />
                    ))}
                  </div>
                  <h2 className="type-headline !text-xl text-ink">{getTranslation('pantryEmpty', language)}</h2>
                  <p className="mt-2 max-w-[34ch] text-ui text-ink-2">{getTranslation('pantryEmptyMessage', language)}</p>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="mt-[22px] inline-flex items-center gap-2 min-h-[46px] px-5 rounded-ctl bg-ink text-wall text-ui font-semibold transition-transform duration-200 ease-ease active:scale-[.97]"
                  >
                    <CloseIcon size={16} />
                    {getTranslation('clearFilters', language)}
                  </button>
                </div>
              ) : showCategories ? (
                sections.map(({ category, recipes: list }, index) => (
                  <section
                    key={category.id}
                    id={`category-${category.id}`}
                    aria-labelledby={`room-${category.id}`}
                    className="scroll-mt-[calc(var(--bar-h)+64px)] [&+&]:mt-[52px] md:[&+&]:mt-[72px]"
                  >
                    <div className="flex items-baseline gap-2.5 mb-3.5">
                      {/* Contact-sheet frame number, in China Marker */}
                      <span aria-hidden="true" className="type-figure text-sm md:text-ui font-medium text-mark">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h2 id={`room-${category.id}`} tabIndex={-1} className="type-headline text-ink focus:outline-none focus-visible:outline-2">
                        {category.name[language]}
                      </h2>
                      <span className="text-sm font-medium text-ink-3 tabular-nums">
                        {list.length}
                        <span className="sr-only"> {recipesWord(list.length)}</span>
                      </span>
                    </div>
                    <RecipeGrid recipes={list} />
                  </section>
                ))
              ) : (
                <>
                  <h2 className="sr-only">{getTranslation('recipes', language)}</h2>
                  <RecipeGrid recipes={flatRecipes} />
                </>
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
