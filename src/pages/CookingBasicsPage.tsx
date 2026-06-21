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

interface Rule {
  emoji: string;
  title: string;
  body: string;
}

const RULES_RO: Rule[] = [
  { emoji: '📖', title: 'Citește rețeta complet înainte să începi să gătești', body: 'Așa nu o să ai surprize pe parcurs.' },
  { emoji: '🥕', title: 'Pregătește toate ingredientele în avans pe masa de gătit', body: 'Asta te ajută să gătești mai relaxat când ai totul la îndemână.' },
  { emoji: '🧂', title: 'Pe cât posibil nu exclude niciun condiment', body: 'E un cost mic care face o diferență mare la final.' },
  { emoji: '🔪', title: 'Asigură-te că folosești un cuțit bine ascuțit', body: 'Asta înseamnă că orice cuțit trebuie ascuțit o dată la câteva săptămâni.' },
];

const RULES_EN: Rule[] = [
  { emoji: '📖', title: 'Read the recipe completely before you start cooking', body: "This way you won't have surprises along the way." },
  { emoji: '🥕', title: 'Prepare all ingredients in advance on the cooking table', body: 'This helps you cook more relaxed when you have everything at hand.' },
  { emoji: '🧂', title: "As much as possible, don't exclude any seasoning", body: "It's a small cost that makes a big difference in the end." },
  { emoji: '🔪', title: 'Make sure you use a well-sharpened knife', body: 'This means any knife should be sharpened once every few weeks.' },
];

const CookingBasicsPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());

  const handleMenuToggle = () => setIsSideMenuOpen(!isSideMenuOpen);
  const handleMenuClose = () => setIsSideMenuOpen(false);
  const handleCategoryClick = (categoryId: string) =>
    navigate('/', { state: { scrollToCategory: categoryId } });
  const handleKeywordsChange = (keywords: Set<string>) => {
    setSelectedKeywords(keywords);
    navigate('/', { state: { selectedKeywords: Array.from(keywords) } });
  };

  const rules = language === 'ro' ? RULES_RO : RULES_EN;
  const intro = language === 'ro'
    ? 'Din experiența mea am scos câteva reguli care fac orice rețetă mai bună.'
    : 'From my experience, a handful of rules that make every recipe easier and tastier.';
  const outro = language === 'ro' ? 'Va urma…' : 'To be continued…';
  const closing = language === 'ro' ? 'Spor la gătit!' : 'Happy cooking!';

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

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-5 pt-5 pb-8 space-y-4">
        {/* Intro card */}
        <section className="bg-card-light dark:bg-card-dark rounded-3xl shadow-overlay dark:shadow-overlay-dark px-5 py-5 sm:px-6 sm:py-6">
          <span className="inline-block bg-brand-accent text-white text-[10px] font-bold tracking-[0.1em] uppercase px-3 py-1 rounded-full">
            {language === 'ro' ? 'Ghid' : 'Guide'}
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink-light dark:text-ink-dark mt-3 mb-1.5 tracking-tight">
            {getTranslation('cookingBasicsTitle', language)}
          </h1>
          <p className="text-sm text-ink-muted-light dark:text-ink-muted-dark">{intro}</p>
        </section>

        {/* Rule cards */}
        {rules.map((rule, i) => (
          <article
            key={i}
            className="bg-card-light dark:bg-card-dark rounded-2xl px-5 py-4 sm:px-6 sm:py-5 shadow-card border-l-4 border-brand-accent"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl bg-card-2-light dark:bg-card-2-dark text-2xl flex-none">
                {rule.emoji}
              </div>
              <h2 className="font-display text-base sm:text-lg font-bold text-ink-light dark:text-ink-dark leading-tight">
                {rule.title}
              </h2>
            </div>
            <p className="text-sm sm:text-base text-ink-muted-light dark:text-ink-muted-dark leading-relaxed">
              {rule.body}
            </p>
          </article>
        ))}

        {/* Outro card */}
        <section className="rounded-2xl p-5 border border-dashed border-brand-warm bg-[#fff5f5] dark:bg-[#3a2925]">
          <p className="italic text-sm text-ink-muted-light dark:text-ink-muted-dark mb-1">{outro}</p>
          <p className="font-display font-bold text-base text-brand-warm">{closing} 👨‍🍳</p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CookingBasicsPage;
