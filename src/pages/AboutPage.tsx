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
    <div className="min-h-screen flex flex-col">
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
        {/* About Section */}
        <article className="prose dark:prose-invert max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-gray-100">
            {getTranslation('aboutTitle', language)}
          </h1>
          
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            {language === 'ro' ? (
              <>
                <p className="text-base leading-relaxed">
                  Salut!
                </p>
                <p className="text-base leading-relaxed">
                  Bine ai venit pe site-ul meu cu rețete.
                </p>
                <p className="text-base leading-relaxed">
                  Aici o să găsești rețetele mele preferate.
                </p>
                <p className="text-base leading-relaxed">
                  Multe sunt preluate de pe alte website-uri, dar cu ingrediente și instrucțiuni ajustate în funcție de preferințele mele. 
                  Pentru fiecare rețetă preluată vei găsi și link-ul în notele rețetei.
                </p>
                <p className="text-base leading-relaxed">
                  Spor la gătit!
                </p>
                <p className="text-base leading-relaxed font-medium">
                  Paul Sticea<br />
                  psticea@gmail.com
                </p>
              </>
            ) : (
              <>
                <p className="text-base leading-relaxed">
                  Hello!
                </p>
                <p className="text-base leading-relaxed">
                  Welcome to my recipe website.
                </p>
                <p className="text-base leading-relaxed">
                  Here you'll find my favorite recipes.
                </p>
                <p className="text-base leading-relaxed">
                  Many are adapted from other websites, but with ingredients and instructions adjusted according to my preferences. 
                  For each adapted recipe, you'll find the link in the recipe notes.
                </p>
                <p className="text-base leading-relaxed">
                  Happy cooking!
                </p>
                <p className="text-base leading-relaxed font-medium">
                  Paul Sticea<br />
                  psticea@gmail.com
                </p>
              </>
            )}
          </div>
        </article>

        {/* Giscus Comments Section */}
        <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
            {language === 'ro' ? 'Comentarii' : 'Comments'}
          </h2>
          <div ref={giscusRef} className="giscus-container" />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
