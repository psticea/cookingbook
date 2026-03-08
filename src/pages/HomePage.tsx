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
  const [sortField, setSortField] = useState<SortField>('dateAdded');
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
          } else if (sortField === 'dateAdded') {
            const dateA = new Date(a.dateAdded).getTime();
            const dateB = new Date(b.dateAdded).getTime();
            const comparison = dateA - dateB;
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
    <div className="min-h-screen flex flex-col bg-surface-light dark:bg-surface-dark">
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
        {loading && (
          <div className="text-center py-8">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {getTranslation('loading', language)}
            </p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-xl text-red-600 dark:text-red-400">
              {getTranslation('errorOccurred', language)}
            </p>
          </div>
        )}

        {!loading && !error && (
          <>
            {recipes.length > 0 && (
              <>
                {/* Compact control bar: count + categories toggle + sort */}
                <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2 w-full min-w-0">
                  {/* Recipe count badge */}
                  <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 rounded-full bg-accent-light dark:bg-accent-dark text-white text-xs font-semibold shrink-0">
                    {totalFilteredCount}
                  </span>
                  <span className="flex-1" />

                  {/* Categories Toggle */}
                  <button
                    onClick={() => setShowCategories(!showCategories)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-light dark:focus:ring-accent-dark ${
                      showCategories
                        ? 'border-accent-light dark:border-accent-dark text-accent-light dark:text-accent-dark bg-accent-light/10 dark:bg-accent-dark/10'
                        : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                    role="switch"
                    aria-checked={showCategories}
                    aria-label={getTranslation('groupByCategories', language)}
                    title={getTranslation('groupByCategories', language)}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h8M4 18h8" />
                    </svg>
                    {getTranslation('categories', language)}
                  </button>

                  {/* Sort field */}
                  <select
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value as SortField)}
                    className="px-2.5 py-1 rounded-full text-xs font-medium border border-gray-300 dark:border-gray-600 bg-transparent text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark focus:ring-offset-2 transition-colors cursor-pointer"
                  >
                    {[
                      { value: 'name' as SortField, labelKey: 'sortByName' },
                      { value: 'dateAdded' as SortField, labelKey: 'sortByDateAdded' },
                      { value: 'prepTime' as SortField, labelKey: 'sortByPrepTime' },
                      { value: 'pricePerServing' as SortField, labelKey: 'sortByPrice' }
                    ].map((field) => (
                      <option key={field.value} value={field.value}>
                        {getTranslation(field.labelKey, language)}
                      </option>
                    ))}
                  </select>

                  {/* Sort order */}
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="flex items-center justify-center w-7 h-7 rounded-full border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-light dark:focus:ring-accent-dark"
                    title={getTranslation(sortOrder === 'asc' ? 'ascending' : 'descending', language)}
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
                            } else if (sortField === 'dateAdded') {
                              const dateA = new Date(a.dateAdded).getTime();
                              const dateB = new Date(b.dateAdded).getTime();
                              const comparison = dateA - dateB;
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
                          <div className="flex items-center gap-3 mb-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                              {category.name[language]}
                            </h2>
                            <div className="flex-1 h-px bg-gradient-to-r from-gray-300 dark:from-gray-600 to-transparent"></div>
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
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                      {getTranslation('noRecipesFound', language)}
                    </p>
                  </div>
                )}
              </>
            )}

            {recipes.length === 0 && (
              <div className="text-center py-8">
                <p className="text-xl text-gray-600 dark:text-gray-400">
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
