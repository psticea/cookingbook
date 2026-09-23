import React from 'react';
import { Recipe } from '../types/recipe';
import { RecipeCard } from './RecipeCard';

interface RecipeGridProps {
  recipes: Recipe[];
}

/** RecipeGrid — the contact sheet: 2 columns on mobile, 3 on tablet, 4 on desktop. */
export const RecipeGrid: React.FC<RecipeGridProps> = ({ recipes }) => (
  <ul className="list-none m-0 p-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-7 md:gap-x-5 md:gap-y-10 lg:gap-x-6 lg:gap-y-12">
    {recipes.map((recipe) => (
      <li key={recipe.id} style={{ viewTransitionName: `print-${recipe.id}` } as React.CSSProperties}>
        <RecipeCard recipe={recipe} />
      </li>
    ))}
  </ul>
);
