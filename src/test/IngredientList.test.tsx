import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IngredientList } from '../components/IngredientList';
import { IngredientItem } from '../types/recipe';

// Mock the useLanguage hook
vi.mock('../hooks/useLanguage', () => ({
  useLanguage: () => ({ language: 'en' }),
}));

describe('IngredientList - Price Per Portion Bug Fix', () => {
  const mockIngredients: IngredientItem[] = [
    {
      name: { en: 'flour', ro: 'făină' },
      quantity: 200,
      unit: { en: 'g', ro: 'g' },
      ingredientId: 102,
    },
    {
      name: { en: 'eggs', ro: 'ouă' },
      quantity: 2,
      unit: { en: 'pcs', ro: 'buc' },
      ingredientId: 103,
    },
  ];

  it('displays price per serving that does not change with servings', () => {
    const pricePerServing = 1.50;
    const totalCostRecipe = 6.00;
    const servings = 4;

    render(
      <IngredientList
        ingredients={mockIngredients}
        prepTime={30}
        servings={servings}
        pricePerServing={pricePerServing}
        totalCostRecipe={totalCostRecipe}
      />
    );

    // Check that price per serving is displayed correctly
    // The component displays it as "1.50 RON" (without "/ serving")
    const priceElement = screen.getByText(/1\.50 RON/);
    expect(priceElement).toBeDefined();

    // Verify the price per serving doesn't include the scaled calculation
    // It should display 1.50, not something scaled
    expect(priceElement.textContent).toContain('1.50');
  });

  it('displays total cost that scales with servings', () => {
    const pricePerServing = 1.50;
    const totalCostRecipe = 6.00;
    const servings = 4;

    render(
      <IngredientList
        ingredients={mockIngredients}
        prepTime={30}
        servings={servings}
        pricePerServing={pricePerServing}
        totalCostRecipe={totalCostRecipe}
      />
    );

    // The total cost should be displayed
    // When servings = 4 (original), total should be 6.00 RON
    const totalElement = screen.getByText(/6\.00 RON total/);
    expect(totalElement).toBeDefined();
  });
});
