import React from 'react';
import { Recipe } from '../types/recipe';
import { RecipeCard } from './RecipeCard';

interface RecipeGridProps {
  recipes: Recipe[];
}

/**
 * RecipeGrid component
 * Displays a responsive grid of recipe cards
 * 1 column on mobile, 2-3 columns on tablet, 3-4 columns on desktop
 */
export const RecipeGrid: React.FC<RecipeGridProps> = ({ recipes }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
};
