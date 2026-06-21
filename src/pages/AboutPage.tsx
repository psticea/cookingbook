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
        {/* Intro overlay card */}
        <section className="bg-card-light dark:bg-card-dark rounded-3xl shadow-overlay dark:shadow-overlay-dark px-5 py-5 sm:px-6 sm:py-6">
          <span className="inline-block bg-brand-warm text-white text-xs font-bold tracking-[0.1em] uppercase px-3 py-1 rounded-full">
            {getTranslation('about', language)}
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink-light dark:text-ink-dark mt-3 mb-1.5 tracking-tight">
            {getTranslation('aboutTitle', language)}
          </h1>
          <p className="text-base text-ink-muted-light dark:text-ink-muted-dark">
            {language === 'ro'
              ? 'Bun venit pe colecția mea de rețete — fără reclame, doar mâncare bună.'
              : "Welcome to my recipe collection — no ads, just food."}
          </p>
        </section>

        {/* Author content card */}
        <article className="bg-card-light dark:bg-card-dark rounded-2xl px-5 py-5 sm:px-6 sm:py-6 shadow-card space-y-2.5 text-base leading-relaxed text-ink-light dark:text-ink-dark">
          {language === 'ro' ? (
            <>
              <p>Salut!</p>
              <p>Bine ai venit pe site-ul meu cu rețete.</p>
              <p>Aici o să găsești rețetele mele preferate în română și engleză.</p>
              <p>Nu sunt reclame, pop-up-uri sau trackere, doar rețete grozave.</p>
              <p>Multe rețetele sunt preluate de pe alte website-uri, dar cu ingrediente și instrucțiuni ajustate în funcție de preferințele mele. Pentru fiecare rețetă preluată vei găsi și link-ul în notele rețetei.</p>
              <p>Spor la gătit!</p>
              <p className="pt-2 font-display font-bold">
                Paul Sticea
                <br />
                <span className="font-normal text-ink-muted-light dark:text-ink-muted-dark">psticea@gmail.com</span>
              </p>
            </>
          ) : (
            <>
              <p>Hello!</p>
              <p>Welcome to my recipe website.</p>
              <p>Here you'll find my favorite recipes in both English and Romanian.</p>
              <p>No ads, no pop-ups, no trackers, just great recipes.</p>
              <p>Many recipes are adapted from other websites, but with ingredients and instructions adjusted according to my preferences. For each adapted recipe, you'll find the link in the recipe notes.</p>
              <p>Happy cooking!</p>
              <p className="pt-2 font-display font-bold">
                Paul Sticea
                <br />
                <span className="font-normal text-ink-muted-light dark:text-ink-muted-dark">psticea@gmail.com</span>
              </p>
            </>
          )}
        </article>

        {/* Comments card */}
        <section className="bg-card-light dark:bg-card-dark rounded-2xl overflow-hidden shadow-card">
          <header className="bg-brand-accent text-white text-center py-3.5 font-display font-bold text-sm tracking-[0.04em]">
            💬 {language === 'ro' ? 'Comentarii' : 'Comments'}
          </header>
          <div className="p-5" ref={giscusRef} />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
