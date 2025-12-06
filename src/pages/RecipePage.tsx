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
import { PersonalNotes } from '../components/PersonalNotes';
import { Footer } from '../components/Footer';
import { SideMenu } from '../components/SideMenu';
import { FiltersSection } from '../components/FiltersSection';
import { CategoriesSection } from '../components/CategoriesSection';
import { MenuLinks } from '../components/MenuLinks';

const RecipePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { recipes, loading } = useRecipeData();
  const [showError, setShowError] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());

  // Find the recipe by ID
  const recipe = id ? getRecipeById(recipes, id) : undefined;

  // Toggle side menu
  const handleMenuToggle = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  // Close side menu
  const handleMenuClose = () => {
    setIsSideMenuOpen(false);
  };

  // Handle category click - navigate to home page and scroll to category
  const handleCategoryClick = (categoryId: string) => {
    navigate('/', { state: { scrollToCategory: categoryId } });
  };

  // Handle keyword change - navigate to home page with filters
  const handleKeywordsChange = (keywords: Set<string>) => {
    setSelectedKeywords(keywords);
    navigate('/', { state: { selectedKeywords: Array.from(keywords) } });
  };

  // Scroll to top when recipe changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

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
        <Header onMenuToggle={handleMenuToggle} />
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
        <Header onMenuToggle={handleMenuToggle} />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              {getTranslation('recipeNotFound', language)}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              {getTranslation('recipeNotFoundMessage', language)}
            </p>
            <p className="text-base text-gray-500 dark:text-gray-500">
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
      <Header onMenuToggle={handleMenuToggle} />

      {/* Side Menu */}
      <SideMenu
        isOpen={isSideMenuOpen}
        onClose={handleMenuClose}
      >
        <FiltersSection
          selectedKeywords={selectedKeywords}
          onKeywordsChange={handleKeywordsChange}
        />
        <CategoriesSection onCategoryClick={handleCategoryClick} />
        <MenuLinks onLinkClick={handleMenuClose} />
      </SideMenu>

      <main className="flex-1 max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 w-full">
        {/* Recipe Header */}
        <RecipeHeader recipe={recipe} />

        {/* Recipe Image */}
        <RecipeImage
          recipeId={recipe.id}
          category={recipe.category}
          alt={recipe.title[language]}
        />

        {/* Ingredient List with Scaler and Metadata */}
        <IngredientList 
          ingredients={recipe.ingredients}
          prepTime={recipe.prepTime}
          servings={recipe.servings}
          effortLevel={recipe.effortLevel}
        />

        {/* Instruction List */}
        <InstructionList instructions={recipe.instructions} />

        {/* Personal Notes */}
        <PersonalNotes notes={recipe.personalNotes} />
      </main>

      {/* Footer with preference selectors */}
      <Footer />
    </div>
  );
};

export default RecipePage;
