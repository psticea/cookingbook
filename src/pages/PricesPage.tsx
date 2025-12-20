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

const PricesPage: React.FC = () => {
  const { language } = useLanguage();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKeywords] = useState<Set<string>>(new Set());

  const prices = pricesData as PricesData;

  // Define category order
  const categoryOrder = [
    'Proteins',
    'Dairy',
    'Fruits and Vegetables',
    'Spices & Seasonings',
    'Pantry',
  ] as const;

  // Toggle side menu
  const handleMenuToggle = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  // Close side menu
  const handleMenuClose = () => {
    setIsSideMenuOpen(false);
  };

  // Handle category click
  const handleCategoryClick = () => {
    // Not used on this page, but required by component
  };

  // Handle keywords change
  const handleKeywordsChange = () => {
    // Not used on this page, but required by component
  };

  // Get all ingredients as array
  const ingredientsArray = Object.entries(prices.ingredients).map(([key, ingredient]) => ({
    key,
    ...ingredient,
  }));

  // Filter ingredients by search term
  const filteredIngredients = ingredientsArray
    .filter((ingredient) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        ingredient.name.toLowerCase().includes(searchLower) ||
        ingredient.key.toLowerCase().includes(searchLower)
      );
    });

  // Group ingredients by category
  const ingredientsByCategory = categoryOrder.reduce((acc, category) => {
    acc[category] = filteredIngredients
      .filter((ingredient) => ingredient.category === category)
      .sort((a, b) => a.name.localeCompare(b.name));
    return acc;
  }, {} as Record<typeof categoryOrder[number], typeof ingredientsArray>);

  // Format price based on unit type
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
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header onMenuToggle={handleMenuToggle} />

      {/* Side Menu */}
      <SideMenu isOpen={isSideMenuOpen} onClose={handleMenuClose}>
        <FiltersSection
          selectedKeywords={selectedKeywords}
          onKeywordsChange={handleKeywordsChange}
        />
        <CategoriesSection onCategoryClick={handleCategoryClick} />
        <MenuLinks onLinkClick={handleMenuClose} />
      </SideMenu>

      <main className="flex-1 max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 w-full">
        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 dark:text-gray-100 tracking-tight mb-6">
          {getTranslation('ingredientPrices', language)}
        </h1>

        {/* Search Box */}
        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={getTranslation('searchIngredients', language)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Ingredients Count */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {filteredIngredients.length} {getTranslation('ingredients', language).toLowerCase()}
        </p>

        {/* Ingredients by Category */}
        <div className="space-y-8">
          {categoryOrder.map((category) => {
            const categoryIngredients = ingredientsByCategory[category];
            if (categoryIngredients.length === 0) return null;

            return (
              <div key={category} className="bg-white dark:bg-gray-800 rounded-lg shadow">
                {/* Category Header */}
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-t-lg border-b border-gray-200 dark:border-gray-600">
                  {category}
                </h2>

                {/* Ingredients Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {getTranslation('ingredientName', language)}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {getTranslation('unitType', language)}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {getTranslation('price', language)}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {categoryIngredients.map((ingredient) => (
                        <tr
                          key={ingredient.key}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {ingredient.name}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 capitalize">
                            {ingredient.unit_type}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {formatPrice(ingredient)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredIngredients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {getTranslation('noRecipesFound', language)}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default PricesPage;
