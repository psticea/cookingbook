import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { SideMenu } from './SideMenu';
import { FiltersSection } from './FiltersSection';
import { CategoriesSection } from './CategoriesSection';
import { MenuLinks } from './MenuLinks';

interface ContentPageProps {
  title: string;
  /** One quiet Pencil line under the title. */
  intro?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * ContentPage — shell for About, Cooking Basics and Prices (DESIGN.md → Layout →
 * Content pages): header + side menu, a single centred column opening with one
 * Display title, then the footer. Filters and categories in the menu lead home.
 */
export const ContentPage: React.FC<ContentPageProps> = ({ title, intro, children }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  const handleCategoryClick = (categoryId: string) => {
    navigate('/', { state: { scrollToCategory: categoryId } });
  };

  const handleKeywordsChange = (keywords: Set<string>) => {
    setSelectedKeywords(keywords);
    navigate('/', { state: { selectedKeywords: Array.from(keywords) } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-wall">
      <Header onMenuToggle={() => setIsMenuOpen((open) => !open)} isMenuOpen={isMenuOpen} />

      <SideMenu isOpen={isMenuOpen} onClose={closeMenu}>
        <FiltersSection selectedKeywords={selectedKeywords} onKeywordsChange={handleKeywordsChange} />
        <CategoriesSection onCategoryClick={handleCategoryClick} />
        <MenuLinks onLinkClick={closeMenu} />
      </SideMenu>

      <main className="flex-1 w-full gutter">
        <div className="mx-auto max-w-prose pt-9 md:pt-14 lg:pt-[72px]">
          <header>
            <h1 className="type-display text-ink">{title}</h1>
            {intro && (
              <p className="mt-4 md:mt-5 lg:mt-7 max-w-[46ch] text-md md:text-lg leading-[1.45] text-ink-2 text-pretty">
                {intro}
              </p>
            )}
          </header>
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
};
