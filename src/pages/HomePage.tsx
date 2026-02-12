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
    <div className="min-h-screen flex flex-col">
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
                {/* Recipe count */}
                <div className="mb-4">
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    {getTranslation('allRecipes', language)} ({totalFilteredCount})
                  </p>
                </div>

                {/* Control Section: Categories Toggle, Sorting, and Order */}
                <div className="mb-6 border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Categories Toggle */}
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {getTranslation('groupByCategories', language)}:
                      </label>
                      <button
                        onClick={() => setShowCategories(!showCategories)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-light dark:focus:ring-accent-dark ${
                          showCategories ? 'bg-accent-light dark:bg-accent-dark' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                        role="switch"
                        aria-checked={showCategories}
                        aria-label={getTranslation('groupByCategories', language)}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            showCategories ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Sort By Label and Field Buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {getTranslation('sortBy', language)}:
                      </label>
                      <select 
                        value={sortField}
                        onChange={(e) => setSortField(e.target.value as SortField)}
                        className="px-3 py-1.5 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark focus:ring-offset-2"
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
                    </div>

                    {/* Sort Order Toggle */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="flex items-center justify-center px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-light dark:focus:ring-accent-dark"
                        title={getTranslation(sortOrder === 'asc' ? 'ascending' : 'descending', language)}
                        aria-label={getTranslation(sortOrder === 'asc' ? 'ascending' : 'descending', language)}
                      >
                        <svg 
                          className={`w-5 h-5 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
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
