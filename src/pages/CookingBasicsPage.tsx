import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SideMenu } from '../components/SideMenu';
import { FiltersSection } from '../components/FiltersSection';
import { CategoriesSection } from '../components/CategoriesSection';
import { MenuLinks } from '../components/MenuLinks';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';

const CookingBasicsPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());

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

      <main className="flex-1 w-full max-w-4xl mx-auto px-5 pt-6 pb-8 space-y-6">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-text-main-light dark:text-text-main-dark tracking-tight">
          {getTranslation('cookingBasicsTitle', language)}
        </h1>

        {/* Content Card */}
        <div className="border border-gray-200 dark:border-zinc-700 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
          <div className="p-5 space-y-5 text-base leading-relaxed text-text-main-light dark:text-text-main-dark">
            {language === 'ro' ? (
              <>
                <p>Din experiența mea scriu mai jos câteva reguli de bază pentru gătit:</p>

                <div className="border-l-4 border-accent-light dark:border-accent-dark pl-4">
                  <h2 className="text-lg font-bold mb-1">📖 Citește rețeta complet înainte să începi să gătești</h2>
                  <p>Așa nu o să ai surprize pe parcurs.</p>
                </div>

                <div className="border-l-4 border-accent-light dark:border-accent-dark pl-4">
                  <h2 className="text-lg font-bold mb-1">🥕 Pregătește toate ingredientele în avans pe masa de gătit</h2>
                  <p>Asta te ajută să gătești mai relaxat când ai totul la îndemână.</p>
                </div>

                <div className="border-l-4 border-accent-light dark:border-accent-dark pl-4">
                  <h2 className="text-lg font-bold mb-1">🧂 Pe cât posibil nu exclude niciun condiment</h2>
                  <p>E un cost mic care face o diferență mare la final.</p>
                </div>

                <div className="border-l-4 border-accent-light dark:border-accent-dark pl-4">
                  <h2 className="text-lg font-bold mb-1">🔪 Asigură-te că folosești un cuțit bine ascuțit</h2>
                  <p>Asta înseamnă că orice cuțit trebuie ascuțit o dată la câteva săptămâni.</p>
                </div>

                <p className="italic">Va urma….</p>
                <p className="font-semibold">Spor la gătit!</p>
              </>
            ) : (
              <>
                <p>From my experience, I write below a few basic rules for cooking:</p>

                <div className="border-l-4 border-accent-light dark:border-accent-dark pl-4">
                  <h2 className="text-lg font-bold mb-1">📖 Read the recipe completely before you start cooking</h2>
                  <p>This way you won't have surprises along the way.</p>
                </div>

                <div className="border-l-4 border-accent-light dark:border-accent-dark pl-4">
                  <h2 className="text-lg font-bold mb-1">🥕 Prepare all ingredients in advance on the cooking table</h2>
                  <p>This helps you cook more relaxed when you have everything at hand.</p>
                </div>

                <div className="border-l-4 border-accent-light dark:border-accent-dark pl-4">
                  <h2 className="text-lg font-bold mb-1">🧂 As much as possible, don't exclude any seasoning</h2>
                  <p>It's a small cost that makes a big difference in the end.</p>
                </div>

                <div className="border-l-4 border-accent-light dark:border-accent-dark pl-4">
                  <h2 className="text-lg font-bold mb-1">🔪 Make sure you use a well-sharpened knife</h2>
                  <p>This means any knife should be sharpened once every few weeks.</p>
                </div>

                <p className="italic">To be continued….</p>
                <p className="font-semibold">Happy cooking!</p>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CookingBasicsPage;
