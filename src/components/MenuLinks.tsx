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
    <div className="space-y-2 mt-4">
      <Link
        to="/cooking-basics"
        onClick={onLinkClick}
        className="block w-full text-left px-3 py-3 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors min-h-[44px] flex items-center"
      >
        {getTranslation('cookingBasics', language)}
      </Link>
      <Link
        to="/about"
        onClick={onLinkClick}
        className="block w-full text-left px-3 py-3 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors min-h-[44px] flex items-center"
      >
        {getTranslation('about', language)}
      </Link>
    </div>
  );
};
