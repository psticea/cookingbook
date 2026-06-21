import React from 'react';
import { Recipe } from '../types/recipe';
import { RecipeCard } from './RecipeCard';

interface RecipeGridProps {
  recipes: Recipe[];
}

/**
 * RecipeGrid — Card Stack design.
 * 2-up on small/mobile, 3-up on large screens.
 */
export const RecipeGrid: React.FC<RecipeGridProps> = ({ recipes }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
};
