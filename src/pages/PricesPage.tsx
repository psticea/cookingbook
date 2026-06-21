import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SideMenu } from '../components/SideMenu';
import { FiltersSection } from '../components/FiltersSection';
import { CategoriesSection } from '../components/CategoriesSection';
import { MenuLinks } from '../components/MenuLinks';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';
import pricesData from '../data/prices.json';
import type { PricesData } from '../utils/pricing';

const CATEGORY_META: Record<string, { emoji: string }> = {
  Proteins: { emoji: '🥩' },
  Dairy: { emoji: '🧀' },
  'Fruits and Vegetables': { emoji: '🥦' },
  'Spices & Seasonings': { emoji: '🧂' },
  Pantry: { emoji: '🫙' },
};

const PricesPage: React.FC = () => {
  const { language } = useLanguage();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKeywords] = useState<Set<string>>(new Set());

  const prices = pricesData as PricesData;

  const categoryOrder = [
    'Proteins',
    'Dairy',
    'Fruits and Vegetables',
    'Spices & Seasonings',
    'Pantry',
  ] as const;

  const handleMenuToggle = () => setIsSideMenuOpen(!isSideMenuOpen);
  const handleMenuClose = () => setIsSideMenuOpen(false);
  const handleCategoryClick = () => {};
  const handleKeywordsChange = () => {};

  const ingredientsArray = Object.entries(prices.ingredients).map(([key, ingredient]) => ({
    key,
    ...ingredient,
  }));

  const filteredIngredients = ingredientsArray.filter((ingredient) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      ingredient.name.toLowerCase().includes(searchLower) ||
      ingredient.key.toLowerCase().includes(searchLower)
    );
  });

  const ingredientsByCategory = categoryOrder.reduce((acc, category) => {
    acc[category] = filteredIngredients
      .filter((ingredient) => ingredient.category === category)
      .sort((a, b) => a.name.localeCompare(b.name));
    return acc;
  }, {} as Record<typeof categoryOrder[number], typeof ingredientsArray>);

  const formatPrice = (ingredient: typeof ingredientsArray[0]) => {
    if (ingredient.unit_type === 'mass') {
      return `${ingredient.price_per_1000?.toFixed(2)} RON ${getTranslation('perKilogram', language)}`;
    } else if (ingredient.unit_type === 'volume') {
      return `${ingredient.price_per_1000?.toFixed(2)} RON ${getTranslation('perLiter', language)}`;
    } else {
      return `${ingredient.price_per_piece?.toFixed(2)} RON ${getTranslation('perPiece', language)}`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-light dark:bg-bg-dark">
      <Header onMenuToggle={handleMenuToggle} />

      <SideMenu isOpen={isSideMenuOpen} onClose={handleMenuClose}>
        <FiltersSection
          selectedKeywords={selectedKeywords}
          onKeywordsChange={handleKeywordsChange}
        />
        <CategoriesSection onCategoryClick={handleCategoryClick} />
        <MenuLinks onLinkClick={handleMenuClose} />
      </SideMenu>

      <main className="flex-1 w-full max-w-4xl mx-auto px-3 sm:px-5 pt-5 pb-8 space-y-4">
        {/* Intro card */}
        <section className="bg-card-light dark:bg-card-dark rounded-3xl shadow-overlay dark:shadow-overlay-dark px-5 py-5 sm:px-6 sm:py-6">
          <span className="inline-block bg-brand-yellow text-ink-light text-xs font-bold tracking-[0.1em] uppercase px-3 py-1 rounded-full">
            {language === 'ro' ? 'Referință' : 'Reference'}
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink-light dark:text-ink-dark mt-3 mb-1.5 tracking-tight">
            {getTranslation('ingredientPrices', language)}
          </h1>
          <p className="text-base text-ink-muted-light dark:text-ink-muted-dark">
            {language === 'ro'
              ? 'Prețurile folosite pentru estimarea costului rețetelor.'
              : 'Prices used to estimate the cost of recipes.'}
          </p>
        </section>

        {/* Search */}
        <div className="bg-card-light dark:bg-card-dark border border-line-light dark:border-line-dark rounded-2xl px-4 py-3 flex items-center gap-3">
          <span className="text-ink-soft-light dark:text-ink-soft-dark">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={getTranslation('searchIngredients', language)}
            className="flex-1 bg-transparent border-none outline-none text-base text-ink-light dark:text-ink-dark placeholder:text-ink-soft-light dark:placeholder:text-ink-soft-dark"
          />
        </div>

        <p className="text-sm text-ink-muted-light dark:text-ink-muted-dark pl-1">
          {filteredIngredients.length} {getTranslation('ingredients', language).toLowerCase()}
        </p>

        {/* Grouped tables */}
        <div className="space-y-3">
          {categoryOrder.map((category) => {
            const categoryIngredients = ingredientsByCategory[category];
            if (categoryIngredients.length === 0) return null;
            const meta = CATEGORY_META[category];

            return (
              <section
                key={category}
                className="bg-card-light dark:bg-card-dark rounded-2xl shadow-card overflow-hidden"
              >
                <header className="bg-card-2-light dark:bg-card-2-dark px-4 py-2.5 border-b border-line-light dark:border-line-dark flex items-center gap-2">
                  <span className="text-base">{meta?.emoji ?? '•'}</span>
                  <h2 className="text-xs font-bold tracking-[0.08em] uppercase text-ink-muted-light dark:text-ink-muted-dark">
                    {category}
                  </h2>
                </header>
                <ul className="divide-y divide-line-2-light dark:divide-line-2-dark">
                  {categoryIngredients.map((ingredient) => (
                    <li
                      key={ingredient.key}
                      className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-card-2-light dark:hover:bg-card-2-dark transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="text-base font-semibold text-ink-light dark:text-ink-dark truncate">
                          {ingredient.name}
                        </div>
                        <div className="text-xs text-ink-soft-light dark:text-ink-soft-dark capitalize">
                          {ingredient.unit_type}
                        </div>
                      </div>
                      <div className="text-sm font-bold text-brand-accent tabular-nums whitespace-nowrap">
                        {formatPrice(ingredient)}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        {filteredIngredients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-ink-muted-light dark:text-ink-muted-dark">
              {getTranslation('noIngredientsFound', language)}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default PricesPage;
