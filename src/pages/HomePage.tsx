import React from 'react';
import { Header } from '../components/Header';
import { RecipeGrid } from '../components/RecipeGrid';
import { Footer } from '../components/Footer';
import { useRecipeData } from '../hooks/useRecipeData';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';

/**
 * HomePage component
 * Displays all recipes (50 regular + 5 cooking basics) in a grid layout
 * Includes Header with navigation and Footer with preference selectors
 */
const HomePage: React.FC = () => {
  const { recipes, loading, error } = useRecipeData();
  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
          {getTranslation('allRecipes', language)}
        </h1>

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
          <RecipeGrid recipes={recipes} />
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
