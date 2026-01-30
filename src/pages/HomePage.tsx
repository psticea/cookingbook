import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { RecipeGrid } from '../components/RecipeGrid';
import { Footer } from '../components/Footer';
import { SideMenu } from '../components/SideMenu';
import { FiltersSection } from '../components/FiltersSection';
import { SortSection, SortField, SortOrder } from '../components/SortSection';
import { CategoryFilter } from '../components/CategoryFilter';
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('dateAdded');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

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

    // Apply category filtering
    if (selectedCategory) {
      filtered = filtered.filter((recipe: Recipe) => recipe.category === selectedCategory);
    }

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

    // Apply sorting
    let sorted: Recipe[];
    
    if (sortField === 'pricePerServing') {
      // For price sorting, pre-calculate prices to avoid redundant calculations
      const recipesWithPrices = filtered.map(recipe => ({
        recipe,
        price: calculateRecipeCost(recipe, language).pricePerServing
      }));
      
      recipesWithPrices.sort((a, b) => {
        const comparison = a.price - b.price;
        return sortOrder === 'asc' ? comparison : -comparison;
      });
      
      sorted = recipesWithPrices.map(item => item.recipe);
    } else {
      // For other sorting fields, sort directly
      sorted = [...filtered].sort((a, b) => {
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

    return sorted;
  }, [recipes, searchQuery, selectedKeywords, selectedCategory, language, sortField, sortOrder]);

  // Count total filtered recipes
  const totalFilteredCount = filteredRecipes.length;

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

                {/* Sorting Controls */}
                <SortSection
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSortFieldChange={setSortField}
                  onSortOrderChange={setSortOrder}
                />

                {/* Category Filter */}
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />

                {/* Recipe sections by category */}
                <div className="space-y-8">
                  {categories.map((category) => {
                    const categoryRecipes = getRecipesByCategory(filteredRecipes, category.id);
                    
                    // Only show category if it has recipes
                    if (categoryRecipes.length === 0) return null;
                    
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
                        <RecipeGrid recipes={categoryRecipes} />
                      </section>
                    );
                  })}
                </div>

                {/* No results message */}
                {filteredRecipes.length === 0 && (
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
