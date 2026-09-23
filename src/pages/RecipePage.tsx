import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useRecipeData, getRecipeById } from '../hooks/useRecipeData';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';
import { calculateRecipeCost } from '../utils/pricing';
import { Header } from '../components/Header';
import { RecipeImage } from '../components/RecipeImage';
import { RecipeStats } from '../components/RecipeStats';
import { IngredientList } from '../components/IngredientList';
import { InstructionList } from '../components/InstructionList';
import { NutritionPanel } from '../components/NutritionPanel';
import { PersonalNotes } from '../components/PersonalNotes';
import { Footer } from '../components/Footer';
import { SideMenu } from '../components/SideMenu';
import { FiltersSection } from '../components/FiltersSection';
import { CategoriesSection } from '../components/CategoriesSection';
import { MenuLinks } from '../components/MenuLinks';
import { PencilMark } from '../components/icons';

type TabId = 'ingredients' | 'instructions' | 'nutrition';

/** The print column and the label column, shared by the hero and the loading mount. */
const HERO_GRID = 'max-w-page mx-auto md:gutter md:pt-6 lg:pt-10 lg:grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-x-12 xl:gap-x-16';

/**
 * RecipePage — "The Light Table" (DESIGN.md → Layout → Recipe page): a sharp
 * 3:2 print with a wall label below (beside it ≥1100px), the stat strip, then
 * tabs for ingredients, instructions and nutrition in a reading column.
 */
const RecipePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { recipes, loading } = useRecipeData();
  const [showError, setShowError] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<TabId>('ingredients');
  const [currentServings, setCurrentServings] = useState<number | null>(null);

  const recipe = id ? getRecipeById(recipes, id) : undefined;

  // Initialize currentServings when recipe loads
  useEffect(() => {
    if (recipe) {
      setCurrentServings(recipe.servings);
    }
  }, [recipe?.id]);

  const servings = currentServings ?? recipe?.servings ?? 1;
  const maxServings = Math.max(12, recipe?.servings ?? 1);
  const recipeCost = useMemo(
    () => recipe ? calculateRecipeCost(recipe, language, undefined, servings) : null,
    [recipe, language, servings]
  );

  const handleDecrement = () => {
    if (servings > 1) setCurrentServings(servings - 1);
  };
  const handleIncrement = () => {
    if (servings < maxServings) setCurrentServings(servings + 1);
  };

  const handleMenuToggle = () => setIsSideMenuOpen(!isSideMenuOpen);
  const handleMenuClose = () => setIsSideMenuOpen(false);

  // Navigate to the home page and scroll to the category
  const handleCategoryClick = (categoryId: string) => {
    navigate('/', { state: { scrollToCategory: categoryId } });
  };

  // Navigate to the home page with the chosen filters applied
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

  const shell = (content: React.ReactNode) => (
    <div className="min-h-screen flex flex-col bg-wall">
      <SideMenu isOpen={isSideMenuOpen} onClose={handleMenuClose}>
        <FiltersSection selectedKeywords={selectedKeywords} onKeywordsChange={handleKeywordsChange} />
        <CategoriesSection onCategoryClick={handleCategoryClick} />
        <MenuLinks onLinkClick={handleMenuClose} />
      </SideMenu>
      <Header onMenuToggle={handleMenuToggle} isMenuOpen={isSideMenuOpen} />
      {content}
      <Footer />
    </div>
  );

  // Loading: an empty print mount waiting for its photograph
  if (loading) {
    return shell(
      <main className="flex-1 w-full" aria-busy="true">
        <div className={HERO_GRID}>
          <div className="aspect-[3/2] bg-frame md:rounded-print" />
          <div className="gutter md:px-0 pt-4 md:pt-6 lg:pt-1">
            <p role="status" className="m-0 text-ui text-ink-2">{getTranslation('loading', language)}</p>
          </div>
        </div>
      </main>
    );
  }

  // Not found: an empty slot on the table, then back home
  if (showError || !recipe) {
    return shell(
      <main className="flex-1 w-full">
        <div role="status" className="max-w-page mx-auto gutter pt-14 md:pt-20 grid justify-items-center text-center">
          <div aria-hidden="true" className="relative w-[120px] aspect-square mb-6 border-[1.5px] border-dashed border-line-strong rounded-print">
            {(['-top-[9px] -left-[9px] border-t-[1.5px] border-l-[1.5px]', '-top-[9px] -right-[9px] border-t-[1.5px] border-r-[1.5px]', '-bottom-[9px] -left-[9px] border-b-[1.5px] border-l-[1.5px]', '-bottom-[9px] -right-[9px] border-b-[1.5px] border-r-[1.5px]']).map((pos) => (
              <span key={pos} className={`absolute w-3 h-3 border-ink-3 ${pos}`} />
            ))}
          </div>
          <h1 className="type-headline !text-xl text-ink">{getTranslation('recipeNotFound', language)}</h1>
          <p className="m-0 mt-2 max-w-[34ch] text-ui text-ink-2">{getTranslation('recipeNotFoundMessage', language)}</p>
          <Link
            to="/"
            className="mt-[22px] inline-flex items-center min-h-[46px] px-5 rounded-ctl bg-ink text-wall text-ui font-semibold no-underline transition-transform duration-200 ease-ease active:scale-[.97]"
          >
            {getTranslation('backToHome', language)}
          </Link>
        </div>
      </main>
    );
  }

  const ingredientCount = recipe.ingredients.filter((i) => 'name' in i).length;
  const instructionCount = recipe.instructions[language].length;

  const tabs: { id: TabId; label: string; count?: number }[] = [
    { id: 'ingredients', label: getTranslation('ingredients', language), count: ingredientCount },
    { id: 'instructions', label: getTranslation('instructions', language), count: instructionCount },
    ...(recipe.nutrition ? [{ id: 'nutrition' as const, label: getTranslation('nutrition', language) }] : []),
  ];

  // Arrow keys, Home and End move between tabs (WAI-ARIA tabs pattern).
  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = tabs.length - 1;
    const next = event.key === 'ArrowRight' ? (index === last ? 0 : index + 1)
      : event.key === 'ArrowLeft' ? (index === 0 ? last : index - 1)
        : event.key === 'Home' ? 0
          : event.key === 'End' ? last
            : -1;
    if (next < 0) return;
    event.preventDefault();
    setActiveTab(tabs[next].id);
    document.getElementById(`${tabs[next].id}-tab`)?.focus();
  };

  return shell(
    <main className="flex-1 w-full">
      <article aria-labelledby="recipe-title">
        <header className={HERO_GRID}>
          <RecipeImage
            key={recipe.id}
            recipeId={recipe.id}
            category={recipe.category}
            alt={recipe.title[language]}
            className="md:rounded-print"
          />

          {/* Wall label: title, then the fact line with the servings stepper */}
          <div className="gutter md:px-0 pt-3 md:pt-5 lg:pt-0 lg:flex lg:flex-col">
            <h1
              id="recipe-title"
              className="type-headline lg:type-display lg:text-[clamp(2.75rem,0.75rem+2.8vw,4rem)] lg:leading-[1.04] text-ink text-pretty break-words"
            >
              {recipe.title[language]}
            </h1>
            <div className="mt-3 md:mt-4 lg:mt-7">
              <RecipeStats
                prepTime={recipe.prepTime}
                servings={servings}
                canDecrease={servings > 1}
                canIncrease={servings < maxServings}
                onDecrease={handleDecrement}
                onIncrease={handleIncrement}
                cost={recipeCost}
                language={language}
              />
            </div>
            <PersonalNotes notes={recipe.personalNotes} headingId="personal-notes-aside" className="hidden lg:block mt-8" />
          </div>
        </header>

        <div className="max-w-page mx-auto gutter mt-2 md:mt-6 lg:mt-8 lg:grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-x-12 xl:gap-x-16 lg:items-start">
          <div className="min-w-0 max-w-prose">
            <div className="border-b border-line">
              <div
                role="tablist"
                aria-label={getTranslation('recipe', language)}
                className="-ml-[7px] flex flex-wrap"
              >
                {tabs.map((tab, index) => {
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      id={`${tab.id}-tab`}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-controls={`${tab.id}-panel`}
                      tabIndex={active ? 0 : -1}
                      onClick={() => setActiveTab(tab.id)}
                      onKeyDown={(event) => handleTabKeyDown(event, index)}
                      className={`relative inline-flex items-baseline gap-1.5 min-h-12 px-[7px] pt-3 pb-3.5 text-ui whitespace-nowrap transition-colors duration-200 ease-ease ${
                        active ? 'text-ink font-[620]' : 'text-ink-2 font-[520] hover:text-ink'
                      }`}
                    >
                      {tab.label}
                      {tab.count !== undefined && (
                        <span className="text-sm font-normal text-ink-3 tabular-nums">{tab.count}</span>
                      )}
                      <PencilMark />
                    </button>
                  );
                })}
              </div>
            </div>

            <div id="ingredients-panel" role="tabpanel" aria-labelledby="ingredients-tab" hidden={activeTab !== 'ingredients'} className="pt-1">
              <IngredientList
                key={recipe.id}
                ingredients={recipe.ingredients}
                servings={recipe.servings}
                currentServings={servings}
              />
            </div>
            <div
              id="instructions-panel"
              role="tabpanel"
              aria-labelledby="instructions-tab"
              hidden={activeTab !== 'instructions'}
              tabIndex={0}
              className="pt-5 rounded-ctl focus-visible:outline-offset-4"
            >
              <InstructionList instructions={recipe.instructions} />
            </div>
            {recipe.nutrition && (
              <div id="nutrition-panel" role="tabpanel" aria-labelledby="nutrition-tab" hidden={activeTab !== 'nutrition'} className="pt-5">
                <NutritionPanel key={recipe.id} nutrition={recipe.nutrition} />
              </div>
            )}
          </div>

          <PersonalNotes notes={recipe.personalNotes} headingId="personal-notes" className="mt-10 max-w-prose lg:hidden" />
        </div>
      </article>
    </main>
  );
};

export default RecipePage;
