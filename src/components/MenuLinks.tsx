import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';

interface MenuLinksProps {
  onLinkClick: () => void;
}

/**
 * MenuLinks component
 * Displays Cooking Basics and About links in the side menu
 * Closes the menu after a link is clicked
 */
export const MenuLinks: React.FC<MenuLinksProps> = ({ onLinkClick }) => {
  const { language } = useLanguage();

  return (
    <>
      {/* Cooking Basics - top-level section */}
      <div className="border-b border-neutral-200 dark:border-neutral-700 pb-2">
        <Link
          to="/cooking-basics"
          onClick={onLinkClick}
          className="w-full flex items-center justify-between py-2 text-left min-h-[44px] hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors px-2"
        >
          <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {getTranslation('cookingBasics', language)}
          </h3>
        </Link>
      </div>

      {/* About - top-level section */}
      <div className="border-b border-neutral-200 dark:border-neutral-700 pb-2">
        <Link
          to="/about"
          onClick={onLinkClick}
          className="w-full flex items-center justify-between py-2 text-left min-h-[44px] hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors px-2"
        >
          <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {getTranslation('about', language)}
          </h3>
        </Link>
      </div>
    </>
  );
};
