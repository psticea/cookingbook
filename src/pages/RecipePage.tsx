import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecipeData, getRecipeById } from '../hooks/useRecipeData';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';
import { calculateRecipeCost } from '../utils/pricing';
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
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');
  const [currentServings, setCurrentServings] = useState<number | null>(null);

  // Find the recipe by ID
  const recipe = id ? getRecipeById(recipes, id) : undefined;

  // Initialize currentServings when recipe loads
  useEffect(() => {
    if (recipe) {
      setCurrentServings(recipe.servings);
    }
  }, [recipe?.id]);

  // Calculate recipe cost
  const recipeCost = recipe ? calculateRecipeCost(recipe, language) : null;

  const servings = currentServings ?? recipe?.servings ?? 1;
  const servingsRatio = recipe ? servings / recipe.servings : 1;
  const pricePerServing = recipeCost?.pricePerServing ?? 0;
  const totalCost = (recipeCost?.totalCostRecipe ?? 0) * servingsRatio;

  const handleDecrement = () => {
    if (servings > 1) setCurrentServings(servings - 1);
  };
  const handleIncrement = () => {
    if (servings < 8) setCurrentServings(servings + 1);
  };

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

  // Scroll to top and reset tab when recipe changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveTab('ingredients');
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
      <div className="min-h-screen flex flex-col bg-surface-light dark:bg-surface-dark">
        <Header onMenuToggle={handleMenuToggle} />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-xl text-text-main-light/60 dark:text-text-main-dark/60">
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
      <div className="min-h-screen flex flex-col bg-surface-light dark:bg-surface-dark">
        <Header onMenuToggle={handleMenuToggle} />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-text-main-light dark:text-text-main-dark">
              {getTranslation('recipeNotFound', language)}
            </h1>
            <p className="text-lg text-text-main-light/60 dark:text-text-main-dark/60 mb-4">
              {getTranslation('recipeNotFoundMessage', language)}
            </p>
            <p className="text-base text-text-main-light/50 dark:text-text-main-dark/50">
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
    <div className="min-h-screen flex flex-col bg-surface-light dark:bg-surface-dark">
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

      <main className="flex-1 w-full">
        {/* Full-width Hero Image */}
        <RecipeImage
          recipeId={recipe.id}
          category={recipe.category}
          alt={recipe.title[language]}
        />

        {/* Content Container */}
        <div className="w-full px-5 pt-6 pb-8 space-y-6">
          {/* Recipe Title */}
          <RecipeHeader recipe={recipe} />

          {/* Metadata Grid - 4 yellow cards */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-primary-light dark:bg-primary-dark rounded-2xl p-3 flex flex-col items-center justify-center text-center">
              <span className="text-2xl mb-1">⏱️</span>
              <span className="text-xs font-bold uppercase tracking-wider text-text-main-light dark:text-text-main-dark">
                {recipe.prepTime} {getTranslation('minutes', language).substring(0, 3)}
              </span>
            </div>
            <div className="bg-primary-light dark:bg-primary-dark rounded-2xl p-3 flex flex-col items-center justify-center text-center">
              <span className="text-2xl mb-1">👥</span>
              <span className="text-xs font-bold uppercase tracking-wider text-text-main-light dark:text-text-main-dark">
                {servings} {getTranslation('servings', language).substring(0, 4)}
              </span>
            </div>
            <div className="bg-primary-light dark:bg-primary-dark rounded-2xl p-3 flex flex-col items-center justify-center text-center">
              <span className="text-2xl mb-1">💰</span>
              <span className="text-xs font-bold uppercase tracking-wider text-text-main-light dark:text-text-main-dark">
                {pricePerServing.toFixed(2)}/p
              </span>
            </div>
            <div className="bg-primary-light dark:bg-primary-dark rounded-2xl p-3 flex flex-col items-center justify-center text-center">
              <span className="text-2xl mb-1">🧾</span>
              <span className="text-xs font-bold uppercase tracking-wider text-text-main-light dark:text-text-main-dark">
                {totalCost.toFixed(2)} tot
              </span>
            </div>
          </div>

          {/* Servings +/- Control */}
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center bg-gray-100 dark:bg-zinc-800 rounded-full p-1.5 shadow-sm">
              <button
                onClick={handleDecrement}
                disabled={servings <= 1}
                className="bg-accent-light dark:bg-accent-dark text-white rounded-full w-10 h-10 flex items-center justify-center active:scale-95 transition-transform disabled:opacity-50"
                aria-label="Decrease servings"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
              </button>
              <span className="px-6 font-medium text-lg text-text-main-light dark:text-text-main-dark">
                {servings} {getTranslation('servings', language)}
              </span>
              <button
                onClick={handleIncrement}
                disabled={servings >= 8}
                className="bg-accent-light dark:bg-accent-dark text-white rounded-full w-10 h-10 flex items-center justify-center active:scale-95 transition-transform disabled:opacity-50"
                aria-label="Increase servings"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </button>
            </div>
          </div>

          {/* Tabbed Card - Ingredients / Instructions */}
          <div className="border border-gray-200 dark:border-zinc-700 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
            {/* Tab Buttons */}
            <div className="flex">
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`flex-1 py-3.5 text-center font-bold transition-colors ${
                  activeTab === 'ingredients'
                    ? 'bg-accent-light dark:bg-accent-dark text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
                }`}
              >
                {getTranslation('ingredients', language)}
              </button>
              <button
                onClick={() => setActiveTab('instructions')}
                className={`flex-1 py-3.5 text-center font-bold transition-colors ${
                  activeTab === 'instructions'
                    ? 'bg-accent-light dark:bg-accent-dark text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
                }`}
              >
                {getTranslation('instructions', language)}
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'ingredients' ? (
              <IngredientList
                ingredients={recipe.ingredients}
                servings={recipe.servings}
                currentServings={servings}
              />
            ) : (
              <div className="p-4">
                <InstructionList instructions={recipe.instructions} />
              </div>
            )}
          </div>

          {/* Personal Notes */}
          <PersonalNotes notes={recipe.personalNotes} />
        </div>
      </main>

      {/* Footer with preference selectors */}
      <Footer />
    </div>
  );
};

export default RecipePage;
