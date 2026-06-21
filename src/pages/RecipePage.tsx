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
import { categories } from '../data';

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
  const pricePerServing = recipeCost?.pricePerServing ?? 0;

  const handleDecrement = () => {
    if (servings > 1) setCurrentServings(servings - 1);
  };
  const handleIncrement = () => {
    if (servings < 12) setCurrentServings(servings + 1);
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
      <div className="min-h-screen flex flex-col bg-bg-light dark:bg-bg-dark">
        <Header onMenuToggle={handleMenuToggle} />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-base text-ink-muted-light dark:text-ink-muted-dark">
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
      <div className="min-h-screen flex flex-col bg-bg-light dark:bg-bg-dark">
        <Header onMenuToggle={handleMenuToggle} />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-sm bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-card">
            <h1 className="font-display text-2xl font-bold mb-3 text-ink-light dark:text-ink-dark">
              {getTranslation('recipeNotFound', language)}
            </h1>
            <p className="text-sm text-ink-muted-light dark:text-ink-muted-dark mb-3">
              {getTranslation('recipeNotFoundMessage', language)}
            </p>
            <p className="text-xs text-ink-soft-light dark:text-ink-soft-dark">
              {getTranslation('backToHome', language)}…
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Render recipe page
  return (
    <div className="min-h-screen flex flex-col bg-bg-light dark:bg-bg-dark">
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
        {/* Hero image, edge-to-edge */}
        <div className="relative">
          <RecipeImage
            recipeId={recipe.id}
            category={recipe.category}
            alt={recipe.title[language]}
          />
        </div>

        {/* Overlay card — title + category */}
        <div className="relative -mt-12 px-3 sm:px-5 z-10">
          <div className="bg-card-light dark:bg-card-dark rounded-3xl shadow-overlay dark:shadow-overlay-dark px-5 pt-5 pb-4 sm:px-6 sm:pt-6 sm:pb-5">
            <span className="inline-block bg-brand-warm text-white text-xs font-bold tracking-[0.1em] uppercase px-3 py-1 rounded-full">
              {(() => {
                const cat = categories.find((c) => c.id === recipe.category);
                return cat ? cat.name[language] : recipe.category;
              })()}
            </span>
            <div className="mt-3">
              <RecipeHeader recipe={recipe} />
            </div>

            {/* Integrated stat strip — time | servings (with stepper) | price/serving */}
            <div className="mt-5 grid grid-cols-3 rounded-2xl overflow-hidden border border-line-light dark:border-line-dark">
              {/* Time */}
              <div className="flex flex-col items-center justify-center py-3 px-2 bg-card-2-light dark:bg-card-2-dark">
                <span className="text-xl leading-none mb-1">⏱️</span>
                <span className="font-display text-xl font-bold text-ink-light dark:text-ink-dark leading-none">
                  {recipe.prepTime}
                </span>
                <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-ink-muted-light dark:text-ink-muted-dark mt-1">
                  {getTranslation('minutes', language).substring(0, 3)}
                </span>
              </div>

              {/* Servings with inline stepper */}
              <div
                className="flex flex-col items-center justify-center py-3 px-2 border-x border-line-light dark:border-line-dark"
                style={{ background: 'linear-gradient(180deg, #f5cb5c 0%, #fde68a 100%)' }}
              >
                <div className="flex items-center gap-2.5 text-ink-light">
                  <button
                    onClick={handleDecrement}
                    disabled={servings <= 1}
                    className="w-7 h-7 flex items-center justify-center rounded-md bg-white/90 text-ink-light font-bold text-base shadow-card active:scale-95 transition-transform disabled:opacity-40"
                    aria-label="Decrease servings"
                  >
                    −
                  </button>
                  <span className="font-display text-xl font-bold leading-none tabular-nums min-w-[1.25rem] text-center">
                    {servings}
                  </span>
                  <button
                    onClick={handleIncrement}
                    disabled={servings >= 12}
                    className="w-7 h-7 flex items-center justify-center rounded-md bg-white/90 text-ink-light font-bold text-base shadow-card active:scale-95 transition-transform disabled:opacity-40"
                    aria-label="Increase servings"
                  >
                    +
                  </button>
                </div>
                <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-ink-light/75 mt-1.5">
                  {getTranslation('servings', language)}
                </span>
              </div>

              {/* Price per serving */}
              <div className="flex flex-col items-center justify-center py-3 px-2 bg-card-2-light dark:bg-card-2-dark">
                <span className="text-xl leading-none mb-1">💰</span>
                <span className="font-display text-xl font-bold text-ink-light dark:text-ink-dark leading-none tabular-nums">
                  {pricePerServing.toFixed(2)}
                </span>
                <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-ink-muted-light dark:text-ink-muted-dark mt-1">
                  RON / p
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Body sections — tight mobile padding so lists span near-full-width */}
        <div className="px-3 sm:px-5 pt-5 pb-8 space-y-4">
          {/* Tabs */}
          <div className="flex gap-1 bg-card-3-light dark:bg-card-3-dark rounded-2xl p-1">
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`flex-1 py-2.5 text-base font-semibold rounded-xl transition-colors ${
                activeTab === 'ingredients'
                  ? 'bg-card-light dark:bg-card-dark text-ink-light dark:text-ink-dark shadow-card'
                  : 'text-ink-muted-light dark:text-ink-muted-dark hover:text-ink-light dark:hover:text-ink-dark'
              }`}
            >
              {getTranslation('ingredients', language)}
            </button>
            <button
              onClick={() => setActiveTab('instructions')}
              className={`flex-1 py-2.5 text-base font-semibold rounded-xl transition-colors ${
                activeTab === 'instructions'
                  ? 'bg-card-light dark:bg-card-dark text-ink-light dark:text-ink-dark shadow-card'
                  : 'text-ink-muted-light dark:text-ink-muted-dark hover:text-ink-light dark:hover:text-ink-dark'
              }`}
            >
              {getTranslation('instructions', language)}
            </button>
          </div>

          {/* Tab content */}
          {activeTab === 'ingredients' ? (
            <IngredientList
              ingredients={recipe.ingredients}
              servings={recipe.servings}
              currentServings={servings}
            />
          ) : (
            <InstructionList instructions={recipe.instructions} />
          )}

          {/* Personal notes */}
          <PersonalNotes notes={recipe.personalNotes} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RecipePage;
