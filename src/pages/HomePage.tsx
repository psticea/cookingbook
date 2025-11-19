import React, { useState, useMemo } from 'react';
import { Header } from '../components/Header';
import { RecipeGrid } from '../components/RecipeGrid';
import { Footer } from '../components/Footer';
import { SideMenu } from '../components/SideMenu';
import { FiltersSection } from '../components/FiltersSection';
import { CategoriesSection } from '../components/CategoriesSection';
import { MenuLinks } from '../components/MenuLinks';
import { useRecipeData, getRecipesByCategory } from '../hooks/useRecipeData';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());

  // Filter recipes based on search query and selected keywords
  // Search: Only filter when 2+ characters are typed
  // Keywords: Show only recipes containing ALL selected keywords
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
      
      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 w-full">
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
                <div className="mb-4 sm:mb-6">
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    {getTranslation('allRecipes', language)} ({totalFilteredCount})
                  </p>
                </div>

                {/* Recipe sections by category */}
                <div className="space-y-6 sm:space-y-8">
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
                        <h2 className="text-2xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">
                          {category.name[language]}
                        </h2>
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
