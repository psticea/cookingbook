import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SideMenu } from '../components/SideMenu';
import { FiltersSection } from '../components/FiltersSection';
import { CategoriesSection } from '../components/CategoriesSection';
import { MenuLinks } from '../components/MenuLinks';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { getTranslation } from '../utils/translations';

const AboutPage: React.FC = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const giscusRef = useRef<HTMLDivElement>(null);
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

  // Load Giscus script dynamically
  useEffect(() => {
    if (!giscusRef.current) return;

    // Remove existing Giscus iframe if present
    const existingGiscus = giscusRef.current.querySelector('iframe.giscus-frame');
    if (existingGiscus) {
      existingGiscus.remove();
    }

    // Create and configure Giscus script
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'YOUR_USERNAME/YOUR_REPO'); // TODO: Replace with actual repo
    script.setAttribute('data-repo-id', 'YOUR_REPO_ID'); // TODO: Replace with actual repo ID
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID'); // TODO: Replace with actual category ID
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
    script.setAttribute('data-lang', language);
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    giscusRef.current.appendChild(script);

    // Cleanup function
    return () => {
      if (giscusRef.current) {
        const scriptElement = giscusRef.current.querySelector('script[src="https://giscus.app/client.js"]');
        if (scriptElement) {
          scriptElement.remove();
        }
      }
    };
  }, [language, theme]);

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
          {getTranslation('aboutTitle', language)}
        </h1>

        {/* Content Card */}
        <div className="border border-gray-200 dark:border-zinc-700 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
          <div className="p-5 space-y-3 text-base leading-relaxed text-text-main-light dark:text-text-main-dark">
            {language === 'ro' ? (
              <>
                <p>Salut!</p>
                <p>Bine ai venit pe site-ul meu cu rețete.</p>
                <p>Aici o să găsești rețetele mele preferate în română și engleză.</p>
                <p>Nu sunt reclame, pop-up-uri sau trackere, doar rețete grozave.</p>
                <p>Multe rețetele sunt preluate de pe alte website-uri, dar cu ingrediente și instrucțiuni ajustate în funcție de preferințele mele. Pentru fiecare rețetă preluată vei găsi și link-ul în notele rețetei.</p>
                <p>Spor la gătit!</p>
                <p className="font-semibold">Paul Sticea<br />psticea@gmail.com</p>
              </>
            ) : (
              <>
                <p>Hello!</p>
                <p>Welcome to my recipe website.</p>
                <p>Here you'll find my favorite recipes in both English and Romanian.</p>
                <p>No ads, no pop-ups, no trackers, just great recipes.</p>
                <p>Many recipes are adapted from other websites, but with ingredients and instructions adjusted according to my preferences. For each adapted recipe, you'll find the link in the recipe notes.</p>
                <p>Happy cooking!</p>
                <p className="font-semibold">Paul Sticea<br />psticea@gmail.com</p>
              </>
            )}
          </div>
        </div>

        {/* Comments Card */}
        <div className="border border-gray-200 dark:border-zinc-700 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
          <div className="bg-accent-light dark:bg-accent-dark px-5 py-3.5">
            <h2 className="text-center font-bold text-white">
              {language === 'ro' ? 'Comentarii' : 'Comments'}
            </h2>
          </div>
          <div className="p-5" ref={giscusRef} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
