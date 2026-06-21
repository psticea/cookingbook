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
    const servings = 4;

    render(
      <IngredientList
        ingredients={mockIngredients}
        servings={servings}
        currentServings={servings}
      />
    );

    // Check that ingredient names are displayed
    expect(screen.getByText(/flour/)).toBeDefined();
    expect(screen.getByText(/eggs/)).toBeDefined();

    // Quantities should be displayed at original amounts (quantity badge "200 g")
    expect(screen.getByText(/200\s*g/)).toBeDefined();
    // Quantity badge "2 pcs" for the eggs row
    expect(screen.getByText(/^\s*2\s+pcs\s*$/)).toBeDefined();
  });

  it('displays total cost that scales with servings', () => {
    const servings = 4;
    const scaledServings = 8;

    render(
      <IngredientList
        ingredients={mockIngredients}
        servings={servings}
        currentServings={scaledServings}
      />
    );

    // At 2x servings, quantities should be doubled (badge shows "400 g")
    expect(screen.getByText(/400\s*g/)).toBeDefined();
    // Badge "4 pcs" for the eggs row
    expect(screen.getByText(/^\s*4\s+pcs\s*$/)).toBeDefined();
  });
});
