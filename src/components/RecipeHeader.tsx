import React from 'react';
import { Recipe } from '../types/recipe';
import { useLanguage } from '../hooks/useLanguage';

interface RecipeHeaderProps {
  recipe: Recipe;
}

/**
 * RecipeHeader — Card Stack design.
 * Renders the recipe title only; metadata is shown elsewhere.
 */
export const RecipeHeader: React.FC<RecipeHeaderProps> = ({ recipe }) => {
  const { language } = useLanguage();

  return (
    <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink-light dark:text-ink-dark tracking-tight leading-tight">
      {recipe.title[language]}
    </h1>
  );
};
