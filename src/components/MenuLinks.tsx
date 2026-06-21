import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';

interface MenuLinksProps {
  onLinkClick: () => void;
}

interface MenuLinkRowProps {
  to: string;
  emoji: string;
  label: string;
  onClick: () => void;
}

const MenuLinkRow: React.FC<MenuLinkRowProps> = ({ to, emoji, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-card-2-light dark:bg-card-2-dark text-ink-light dark:text-ink-dark text-sm font-semibold hover:bg-card-3-light dark:hover:bg-card-3-dark transition-colors"
  >
    <span className="text-lg leading-none">{emoji}</span>
    <span>{label}</span>
  </Link>
);

/**
 * MenuLinks — Card Stack design.
 * Card with row links to top-level pages (Cooking Basics, Prices, About).
 */
export const MenuLinks: React.FC<MenuLinksProps> = ({ onLinkClick }) => {
  const { language } = useLanguage();

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-2xl p-4 shadow-card">
      <h4 className="text-[11px] font-bold tracking-[0.12em] uppercase text-ink-muted-light dark:text-ink-muted-dark mb-3">
        {getTranslation('more', language)}
      </h4>

      <div className="space-y-1.5">
        <MenuLinkRow
          to="/cooking-basics"
          emoji="📖"
          label={getTranslation('cookingBasics', language)}
          onClick={onLinkClick}
        />
        <MenuLinkRow
          to="/prices"
          emoji="💰"
          label={getTranslation('ingredientPrices', language)}
          onClick={onLinkClick}
        />
        <MenuLinkRow
          to="/about"
          emoji="ℹ️"
          label={getTranslation('about', language)}
          onClick={onLinkClick}
        />
      </div>
    </div>
  );
};
