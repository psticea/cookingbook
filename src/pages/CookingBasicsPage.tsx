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

      <main className="flex-1 container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-4xl">
        {/* Cooking Basics Section */}
        <article className="prose dark:prose-invert max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-gray-100">
            {getTranslation('cookingBasicsTitle', language)}
          </h1>
          
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            {language === 'ro' ? (
              <>
                <p className="text-base leading-relaxed">
                  Din experiența mea scriu mai jos câteva reguli de bază pentru gătit:
                </p>

                <section>
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    📖 Citește rețeta complet înainte să începi să gătești
                  </h2>
                  <p className="leading-relaxed text-base">
                    Așa nu o să ai surprize pe parcurs.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    🥕 Pregătește toate ingredientele în avans pe masa de gătit
                  </h2>
                  <p className="leading-relaxed text-base">
                    Asta te ajută să gătești mai relaxat când ai totul la îndemână.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    🧂 Pe cât posibil nu exclude niciun condiment
                  </h2>
                  <p className="leading-relaxed text-base">
                    E un cost mic care face o diferență mare la final.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    🔪 Asigură-te că folosești un cuțit bine ascuțit
                  </h2>
                  <p className="leading-relaxed text-base">
                    Asta înseamnă că orice cuțit trebuie ascuțit o dată la câteva săptămâni.
                  </p>
                </section>

                <p className="text-base leading-relaxed italic">
                  Va urma….
                </p>

                <p className="text-base leading-relaxed font-medium">
                  Spor la gătit!
                </p>
              </>
            ) : (
              <>
                <p className="text-base leading-relaxed">
                  From my experience, I write below a few basic rules for cooking:
                </p>

                <section>
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    📖 Read the recipe completely before you start cooking
                  </h2>
                  <p className="leading-relaxed text-base">
                    This way you won't have surprises along the way.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    🥕 Prepare all ingredients in advance on the cooking table
                  </h2>
                  <p className="leading-relaxed text-base">
                    This helps you cook more relaxed when you have everything at hand.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    🧂 As much as possible, don't exclude any seasoning
                  </h2>
                  <p className="leading-relaxed text-base">
                    It's a small cost that makes a big difference in the end.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    🔪 Make sure you use a well-sharpened knife
                  </h2>
                  <p className="leading-relaxed text-base">
                    This means any knife should be sharpened once every few weeks.
                  </p>
                </section>

                <p className="text-base leading-relaxed italic">
                  To be continued….
                </p>

                <p className="text-base leading-relaxed font-medium">
                  Happy cooking!
                </p>
              </>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default CookingBasicsPage;
