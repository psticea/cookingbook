import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecipeData, getRecipeById } from '../hooks/useRecipeData';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';
import { calculateRecipeCost } from '../utils/pricing';
import { Header } from '../components/Header';
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

  // Count actual ingredient items (skip section headers) for the tab badge
  const ingredientCount = recipe.ingredients.filter((i) => 'name' in i).length;
  const instructionCount = recipe.instructions[language].length;
  const categoryName = (() => {
    const cat = categories.find((c) => c.id === recipe.category);
    return cat ? cat.name[language] : recipe.category;
  })();

  // Render recipe page
  return (
    <div className="min-h-screen flex flex-col bg-bg-light dark:bg-bg-dark">
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

      <Header onMenuToggle={handleMenuToggle} />

      <main className="flex-1 w-full">
        {/* Hero with category + title overlay */}
        <section className="relative">
          {/* Hero image — 5:4 ratio */}
          <RecipeImage
            recipeId={recipe.id}
            category={recipe.category}
            alt={recipe.title[language]}
          />

          {/* Dark gradient at bottom of image for title legibility */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/80" />

          {/* Category + title sit on top of the hero */}
          <div className="absolute left-5 right-5 bottom-4 sm:bottom-5 z-[2]">
            <span className="inline-block text-[11px] font-bold tracking-[0.14em] uppercase text-brand-yellow bg-black/35 backdrop-blur-sm px-3 py-1 rounded-full">
              {categoryName}
            </span>
            <h1 className="font-serif font-semibold text-white text-2xl sm:text-3xl leading-tight mt-2.5 [text-shadow:_0_2px_14px_rgba(0,0,0,.45)]">
              {recipe.title[language]}
            </h1>
          </div>
        </section>

        {/* Stat strip — hairline-divided, three equal cells, sits below the image */}
        <section className="grid grid-cols-[1fr_1.4fr_1fr] bg-card-light dark:bg-card-dark border-b border-line-light dark:border-line-dark">
          <div className="text-center py-4 px-2">
            <div className="font-serif font-semibold text-2xl sm:text-3xl text-ink-light dark:text-ink-dark leading-none tabular-nums">
              {recipe.prepTime}
              <span className="text-base font-medium text-ink-muted-light dark:text-ink-muted-dark ml-1">
                {getTranslation('minutes', language).substring(0, 3)}
              </span>
            </div>
            <div className="mt-2 text-[10px] font-bold tracking-[0.14em] uppercase text-ink-soft-light dark:text-ink-soft-dark">
              {getTranslation('prepTime', language)}
            </div>
          </div>

          <div className="text-center py-4 px-2 border-x border-line-light dark:border-line-dark">
            <div className="flex items-center justify-center gap-2.5">
              <button
                onClick={handleDecrement}
                disabled={servings <= 1}
                className="w-7 h-7 rounded-full border border-line-light dark:border-line-dark bg-card-2-light dark:bg-card-2-dark text-ink-light dark:text-ink-dark text-sm font-bold grid place-items-center hover:bg-brand-accent hover:text-white hover:border-transparent disabled:opacity-40 transition-colors"
                aria-label="Decrease servings"
              >
                −
              </button>
              <span className="font-serif font-semibold text-2xl sm:text-3xl text-ink-light dark:text-ink-dark leading-none tabular-nums min-w-[1.5rem]">
                {servings}
              </span>
              <button
                onClick={handleIncrement}
                disabled={servings >= 12}
                className="w-7 h-7 rounded-full border border-line-light dark:border-line-dark bg-card-2-light dark:bg-card-2-dark text-ink-light dark:text-ink-dark text-sm font-bold grid place-items-center hover:bg-brand-accent hover:text-white hover:border-transparent disabled:opacity-40 transition-colors"
                aria-label="Increase servings"
              >
                +
              </button>
            </div>
            <div className="mt-2 text-[10px] font-bold tracking-[0.14em] uppercase text-ink-soft-light dark:text-ink-soft-dark">
              {getTranslation('servings', language)}
            </div>
          </div>

          <div className="text-center py-4 px-2">
            <div className="font-serif font-semibold text-2xl sm:text-3xl text-ink-light dark:text-ink-dark leading-none tabular-nums">
              {pricePerServing.toFixed(2)}
            </div>
            <div className="mt-2 text-[10px] font-bold tracking-[0.14em] uppercase text-ink-soft-light dark:text-ink-soft-dark">
              RON / {getTranslation('servings', language).toLowerCase().slice(0, 6)}
            </div>
          </div>
        </section>

        {/* Body — tight outer padding so list rows reach near the edges */}
        <div className="px-4 sm:px-5 pt-4 pb-8 space-y-4">
          {/* Underline tabs with counts */}
          <div className="flex gap-6 border-b border-line-light dark:border-line-dark">
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`relative flex-1 py-3 text-sm font-bold tracking-wide transition-colors ${
                activeTab === 'ingredients'
                  ? 'text-ink-light dark:text-ink-dark'
                  : 'text-ink-soft-light dark:text-ink-soft-dark hover:text-ink-muted-light dark:hover:text-ink-muted-dark'
              }`}
            >
              {getTranslation('ingredients', language)}
              <span className="ml-1.5 text-xs font-medium text-ink-soft-light dark:text-ink-soft-dark">
                {ingredientCount}
              </span>
              {activeTab === 'ingredients' && (
                <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-brand-warm rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('instructions')}
              className={`relative flex-1 py-3 text-sm font-bold tracking-wide transition-colors ${
                activeTab === 'instructions'
                  ? 'text-ink-light dark:text-ink-dark'
                  : 'text-ink-soft-light dark:text-ink-soft-dark hover:text-ink-muted-light dark:hover:text-ink-muted-dark'
              }`}
            >
              {getTranslation('instructions', language)}
              <span className="ml-1.5 text-xs font-medium text-ink-soft-light dark:text-ink-soft-dark">
                {instructionCount}
              </span>
              {activeTab === 'instructions' && (
                <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-brand-warm rounded-full" />
              )}
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
