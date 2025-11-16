import React from 'react';
import { Header } from '../components/Header';
import { RecipeGrid } from '../components/RecipeGrid';
import { Footer } from '../components/Footer';
import { useRecipeData, getRecipesByCategory } from '../hooks/useRecipeData';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';
import { categories } from '../data';

/**
 * HomePage component
 * Displays recipes organized by 8 categories
 * Each category is shown as a section with its recipes
 * Includes Header with navigation and Footer with preference selectors
 */
const HomePage: React.FC = () => {
  const { recipes, loading, error } = useRecipeData();
  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
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

        {!loading && !error && recipes.length > 0 && (
          <div className="space-y-12">
            {categories.map((category) => {
              const categoryRecipes = getRecipesByCategory(recipes, category.id);
              
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
        )}

        {!loading && !error && recipes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {getTranslation('noRecipesFound', language)}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
