import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { RecipeGrid } from '../components/RecipeGrid';
import { Footer } from '../components/Footer';
import { SideMenu } from '../components/SideMenu';
import { FiltersSection } from '../components/FiltersSection';
import { SortField, SortOrder } from '../components/SortSection';
import { CategoriesSection } from '../components/CategoriesSection';
import { MenuLinks } from '../components/MenuLinks';
import { useRecipeData, getRecipesByCategory } from '../hooks/useRecipeData';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';
import { calculateRecipeCost } from '../utils/pricing';
import { categories } from '../data';
import { Recipe } from '../types';

/**
 * HomePage component
 * Displays recipes organized by 8 categories with search functionality
 * Each category is shown as a section with its recipes
 * Includes Header with navigation, SearchBar, and Footer with preference selectors
 */
const HomePage: React.FC = () => {
  const { recipes, loading, error } = useRecipeData();
  const { language } = useLanguage();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [showCategories, setShowCategories] = useState(true);

  // Save scroll position before leaving the page
  useEffect(() => {
    const saveScrollPosition = () => {
      sessionStorage.setItem('homeScrollPosition', window.scrollY.toString());
    };

    window.addEventListener('beforeunload', saveScrollPosition);
    
    return () => {
      window.removeEventListener('beforeunload', saveScrollPosition);
    };
  }, []);

  // Restore scroll position when returning to the page
  useEffect(() => {
    const savedPosition = sessionStorage.getItem('homeScrollPosition');
    
    // Only restore if coming back from another page (not on initial load or filter change)
    if (savedPosition && !location.state) {
      const position = parseInt(savedPosition, 10);
      // Wait for content to load
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
    if (location.state) {
      const state = location.state as { scrollToCategory?: string; selectedKeywords?: string[] };
      
      // Handle category scrolling
      if (state.scrollToCategory) {
        // Wait for DOM to be ready
        setTimeout(() => {
          const element = document.getElementById(`category-${state.scrollToCategory}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
      
      // Handle filter keywords
      if (state.selectedKeywords) {
        setSelectedKeywords(new Set(state.selectedKeywords));
      }
    }
  }, [location.state]);

  // Filter recipes based on search query and selected keywords
  // Search: Only filter when 2+ characters are typed
  // Keywords: Show only recipes containing ALL selected keywords
  // Category: Filter by selected category if one is selected
  const filteredRecipes = useMemo(() => {
    let filtered = recipes;

    // Apply keyword filtering
    if (selectedKeywords.size > 0) {
      filtered = filtered.filter((recipe: Recipe) => {
        // Recipe must contain ALL selected keywords
        return Array.from(selectedKeywords).every(keyword => 
          recipe.keywords.includes(keyword)
        );
      });
    }

    // Apply search filtering (only if 2+ characters)
    if (searchQuery.length >= 2) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((recipe: Recipe) => {
        const title = recipe.title[language].toLowerCase();
        return title.includes(query);
      });
    }

    return filtered;
  }, [recipes, searchQuery, selectedKeywords, language]);

  // Apply sorting - either globally or within categories
  const sortedRecipes = useMemo(() => {
    const sortRecipeList = (recipesToSort: Recipe[]): Recipe[] => {
      if (sortField === 'pricePerServing') {
        // For price sorting, pre-calculate prices to avoid redundant calculations
        const recipesWithPrices = recipesToSort.map(recipe => ({
          recipe,
          price: calculateRecipeCost(recipe, language).pricePerServing
        }));
        
        recipesWithPrices.sort((a, b) => {
          const comparison = a.price - b.price;
          return sortOrder === 'asc' ? comparison : -comparison;
        });
        
        return recipesWithPrices.map(item => item.recipe);
      } else {
        // For other sorting fields, sort directly
        return [...recipesToSort].sort((a, b) => {
          if (sortField === 'name') {
            const nameA = a.title[language].toLowerCase();
            const nameB = b.title[language].toLowerCase();
            const comparison = nameA.localeCompare(nameB);
            return sortOrder === 'asc' ? comparison : -comparison;
          } else if (sortField === 'prepTime') {
            const comparison = a.prepTime - b.prepTime;
            return sortOrder === 'asc' ? comparison : -comparison;
          }
          return 0;
        });
      }
    };

    // If categories are disabled, sort all recipes together
    if (!showCategories) {
      return sortRecipeList(filteredRecipes);
    }

    // If categories are enabled, we'll sort within each category later
    // Return the filtered recipes as-is
    return filteredRecipes;
  }, [filteredRecipes, sortField, sortOrder, language, showCategories]);

  // Count total filtered recipes
  const totalFilteredCount = sortedRecipes.length;

  // Toggle side menu
  const handleMenuToggle = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  // Close side menu
  const handleMenuClose = () => {
    setIsSideMenuOpen(false);
  };

  // Handle category click - scroll to category section
  const handleCategoryClick = (categoryId: string) => {
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    handleMenuClose();
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-light dark:bg-bg-dark">
      <Header
        showSearch={true}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onMenuToggle={handleMenuToggle}
      />

      {/* Side Menu */}
      <SideMenu
        isOpen={isSideMenuOpen}
        onClose={handleMenuClose}
      >
        <FiltersSection
          selectedKeywords={selectedKeywords}
          onKeywordsChange={setSelectedKeywords}
        />
        <CategoriesSection onCategoryClick={handleCategoryClick} />
        <MenuLinks onLinkClick={handleMenuClose} />
      </SideMenu>

      <main className="flex-1 max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 w-full">
        {/* Greeting card */}
        <section className="bg-card-light dark:bg-card-dark rounded-3xl shadow-overlay dark:shadow-overlay-dark px-5 py-5 sm:px-6 sm:py-6 mb-5">
          <span className="inline-block bg-brand-accent text-white text-[10px] font-bold tracking-[0.1em] uppercase px-3 py-1 rounded-full">
            {getTranslation('welcome', language)}
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink-light dark:text-ink-dark mt-2.5 mb-1 tracking-tight">
            {getTranslation('greetingTitle', language)}
          </h1>
          <p className="text-sm text-ink-muted-light dark:text-ink-muted-dark">
            {recipes.length} {getTranslation('recipes', language).toLowerCase()} · {getTranslation('greetingSubtitle', language)}
          </p>
        </section>

        {loading && (
          <div className="text-center py-8">
            <p className="text-base text-ink-muted-light dark:text-ink-muted-dark">
              {getTranslation('loading', language)}
            </p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-base text-brand-warm">
              {getTranslation('errorOccurred', language)}
            </p>
          </div>
        )}

        {!loading && !error && (
          <>
            {recipes.length > 0 && (
              <>
                {/* Control bar: count + categories toggle + sort pills */}
                <div className="mb-5 flex flex-wrap items-center gap-2 w-full min-w-0">
                  {/* Recipe count badge */}
                  <span className="inline-flex items-center justify-center min-w-[1.75rem] h-7 px-2.5 rounded-full bg-brand-accent text-white text-xs font-bold shrink-0">
                    {totalFilteredCount}
                  </span>
                  <span className="flex-1" />

                  {/* Categories Toggle */}
                  <button
                    onClick={() => setShowCategories(!showCategories)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent ${
                      showCategories
                        ? 'border-transparent text-white bg-brand-accent'
                        : 'border-line-light dark:border-line-dark text-ink-muted-light dark:text-ink-muted-dark hover:text-ink-light dark:hover:text-ink-dark bg-card-light dark:bg-card-dark'
                    }`}
                    role="switch"
                    aria-checked={showCategories}
                    aria-label={getTranslation('groupByCategories', language)}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h8M4 18h8" />
                    </svg>
                    {getTranslation('categories', language)}
                  </button>

                  {/* Sort field pills */}
                  <div className="inline-flex items-center rounded-full border border-line-light dark:border-line-dark bg-card-light dark:bg-card-dark overflow-hidden">
                    {[
                      { value: 'name' as SortField, labelKey: 'sortByName' },
                      { value: 'prepTime' as SortField, labelKey: 'sortByPrepTime' },
                      { value: 'pricePerServing' as SortField, labelKey: 'sortByPrice' }
                    ].map((field, idx, arr) => (
                      <button
                        key={field.value}
                        onClick={() => setSortField(field.value)}
                        className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                          sortField === field.value
                            ? 'bg-brand-accent text-white'
                            : 'text-ink-muted-light dark:text-ink-muted-dark hover:text-ink-light dark:hover:text-ink-dark'
                        } ${idx < arr.length - 1 ? 'border-r border-line-light dark:border-line-dark' : ''}`}
                      >
                        {getTranslation(field.labelKey, language)}
                      </button>
                    ))}
                  </div>

                  {/* Sort order */}
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border border-line-light dark:border-line-dark bg-card-light dark:bg-card-dark text-ink-muted-light dark:text-ink-muted-dark hover:text-ink-light dark:hover:text-ink-dark transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    aria-label={getTranslation(sortOrder === 'asc' ? 'ascending' : 'descending', language)}
                  >
                    <svg
                      className={`w-3.5 h-3.5 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                </div>

                {/* Recipe sections by category or flat list */}
                {showCategories ? (
                  // Display recipes grouped by category
                  <div className="space-y-8">
                    {categories.map((category) => {
                      const categoryRecipes = getRecipesByCategory(sortedRecipes, category.id);
                      
                      // Only show category if it has recipes
                      if (categoryRecipes.length === 0) return null;
                      
                      // Sort recipes within this category
                      const sortRecipesInCategory = (recipesToSort: Recipe[]): Recipe[] => {
                        if (sortField === 'pricePerServing') {
                          const recipesWithPrices = recipesToSort.map(recipe => ({
                            recipe,
                            price: calculateRecipeCost(recipe, language).pricePerServing
                          }));
                          
                          recipesWithPrices.sort((a, b) => {
                            const comparison = a.price - b.price;
                            return sortOrder === 'asc' ? comparison : -comparison;
                          });
                          
                          return recipesWithPrices.map(item => item.recipe);
                        } else {
                          return [...recipesToSort].sort((a, b) => {
                            if (sortField === 'name') {
                              const nameA = a.title[language].toLowerCase();
                              const nameB = b.title[language].toLowerCase();
                              const comparison = nameA.localeCompare(nameB);
                              return sortOrder === 'asc' ? comparison : -comparison;
                            } else if (sortField === 'prepTime') {
                              const comparison = a.prepTime - b.prepTime;
                              return sortOrder === 'asc' ? comparison : -comparison;
                            }
                            return 0;
                          });
                        }
                      };

                      const sortedCategoryRecipes = sortRecipesInCategory(categoryRecipes);
                      
                      return (
                        <section
                          key={category.id}
                          id={`category-${category.id}`}
                          className="category-section scroll-mt-16 sm:scroll-mt-20"
                        >
                          <div className="flex items-baseline justify-between mb-3">
                            <h2 className="font-display text-lg sm:text-xl font-bold text-ink-light dark:text-ink-dark tracking-tight">
                              {category.name[language]}
                            </h2>
                            <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-ink-soft-light dark:text-ink-soft-dark">
                              {sortedCategoryRecipes.length} {getTranslation('recipes', language).toLowerCase()}
                            </span>
                          </div>
                          <RecipeGrid recipes={sortedCategoryRecipes} />
                        </section>
                      );
                    })}
                  </div>
                ) : (
                  // Display all recipes in a flat list (no category sections)
                  <div className="space-y-8">
                    <RecipeGrid recipes={sortedRecipes} />
                  </div>
                )}

                {/* No results message */}
                {sortedRecipes.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-base text-ink-muted-light dark:text-ink-muted-dark">
                      {getTranslation('noRecipesFound', language)}
                    </p>
                  </div>
                )}
              </>
            )}

            {recipes.length === 0 && (
              <div className="text-center py-8">
                <p className="text-base text-ink-muted-light dark:text-ink-muted-dark">
                  {getTranslation('noRecipesFound', language)}
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
