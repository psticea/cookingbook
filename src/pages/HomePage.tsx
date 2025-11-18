import React, { useState, useMemo } from 'react';
import { Header } from '../components/Header';
import { RecipeGrid } from '../components/RecipeGrid';
import { Footer } from '../components/Footer';
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

  // Filter recipes based on search query
  // Only filter when 2+ characters are typed
  const filteredRecipes = useMemo(() => {
    if (searchQuery.length < 2) {
      return recipes;
    }

    const query = searchQuery.toLowerCase();
    return recipes.filter((recipe: Recipe) => {
      const title = recipe.title[language].toLowerCase();
      return title.includes(query);
    });
  }, [recipes, searchQuery, language]);

  // Count total filtered recipes
  const totalFilteredCount = filteredRecipes.length;

  // Toggle side menu
  const handleMenuToggle = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        showSearch={true}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onMenuToggle={handleMenuToggle}
      />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {loading && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {getTranslation('loading', language)}
            </p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
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
                <div className="mb-6">
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    {getTranslation('allRecipes', language)} ({totalFilteredCount})
                  </p>
                </div>

                {/* Recipe sections by category */}
                <div className="space-y-12">
                  {categories.map((category) => {
                    const categoryRecipes = getRecipesByCategory(filteredRecipes, category.id);
                    
                    // Only show category if it has recipes
                    if (categoryRecipes.length === 0) return null;
                    
                    return (
                      <section key={category.id} className="category-section">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                          {category.name[language]}
                        </h2>
                        <RecipeGrid recipes={categoryRecipes} />
                      </section>
                    );
                  })}
                </div>

                {/* No results message */}
                {filteredRecipes.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                      {getTranslation('noRecipesFound', language)}
                    </p>
                  </div>
                )}
              </>
            )}

            {recipes.length === 0 && (
              <div className="text-center py-12">
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
