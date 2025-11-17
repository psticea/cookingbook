import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecipeData, getRecipeById } from '../hooks/useRecipeData';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';
import { Header } from '../components/Header';
import { RecipeHeader } from '../components/RecipeHeader';
import { RecipeImage } from '../components/RecipeImage';
import { IngredientList } from '../components/IngredientList';
import { InstructionList } from '../components/InstructionList';
import { Footer } from '../components/Footer';

const RecipePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { recipes, loading } = useRecipeData();
  const [showError, setShowError] = useState(false);

  // Find the recipe by ID
  const recipe = id ? getRecipeById(recipes, id) : undefined;

  useEffect(() => {
    // If loading is complete and recipe is not found, show error and redirect
    if (!loading && !recipe && id) {
      setShowError(true);
      const timer = setTimeout(() => {
        navigate('/');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [loading, recipe, id, navigate]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {getTranslation('loading', language)}
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (showError || !recipe) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              {getTranslation('recipeNotFound', language)}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              {getTranslation('recipeNotFoundMessage', language)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {getTranslation('backToHome', language)}...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Render recipe page
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        {/* Recipe Header */}
        <RecipeHeader recipe={recipe} />

        {/* Recipe Image */}
        <RecipeImage
          recipeId={recipe.id}
          category={recipe.category}
          alt={recipe.title[language]}
        />

        {/* Ingredient List with Scaler */}
        <IngredientList ingredients={recipe.ingredients} />

        {/* Instruction List */}
        <InstructionList instructions={recipe.instructions} />
      </main>

      {/* Footer with preference selectors */}
      <Footer />
    </div>
  );
};

export default RecipePage;
