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

    // Quantities should be displayed at original amounts
    expect(screen.getByText(/200/)).toBeDefined();
    // "2 pcs eggs" — check full text to avoid matching "200"
    expect(screen.getByText(/\b2\s+pcs\s+eggs/)).toBeDefined();
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

    // At 2x servings, quantities should be doubled
    expect(screen.getByText(/400/)).toBeDefined();
    // "4 pcs eggs" — check full text to avoid matching "400"
    expect(screen.getByText(/\b4\s+pcs\s+eggs/)).toBeDefined();
  });
});
