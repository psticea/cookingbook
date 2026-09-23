import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';
import { MenuSection } from './SideMenu';
import { ArrowRightIcon } from './icons';

interface MenuLinksProps {
  onLinkClick: () => void;
}

export const MENU_LINKS = [
  { to: '/cooking-basics', labelKey: 'cookingBasics' },
  { to: '/prices', labelKey: 'ingredientPrices' },
  { to: '/about', labelKey: 'about' },
] as const;

/** MenuLinks — "More" rows to top-level pages, each with a nudging arrow. */
export const MenuLinks: React.FC<MenuLinksProps> = ({ onLinkClick }) => {
  const { language } = useLanguage();

  return (
    <MenuSection title={getTranslation('more', language)}>
      <ul className="mt-1">
        {MENU_LINKS.map(({ to, labelKey }) => (
          <li key={to}>
            <Link
              to={to}
              onClick={onLinkClick}
              className="group flex items-center justify-between min-h-12 text-base text-ink no-underline"
            >
              <span>{getTranslation(labelKey, language)}</span>
              <ArrowRightIcon size={18} className="text-ink-3 transition-transform duration-300 ease-ease group-hover:translate-x-[3px] group-hover:text-ink" />
            </Link>
          </li>
        ))}
      </ul>
    </MenuSection>
  );
};
