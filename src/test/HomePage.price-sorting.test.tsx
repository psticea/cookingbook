import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import { getTranslation } from '../utils/translations';
import type { Ingredient, Recipe } from '../types/recipe';
import type { Language } from '../types';

const fixture = vi.hoisted(() => ({ recipes: [] as Recipe[], language: 'en' as Language }));
vi.mock('../hooks/useRecipeData', () => ({
  useRecipeData: () => ({ recipes: fixture.recipes, loading: false, error: null }),
  getRecipesByCategory: (recipes: Recipe[], category: string) => recipes.filter(recipe => recipe.category === category),
}));
vi.mock('../hooks/useLanguage', () => ({ useLanguage: () => ({ language: fixture.language }) }));
// Keep the real grid/cards and sort controls, isolate unrelated chrome/providers.
vi.mock('../components/Header', () => ({ Header: () => null }));
vi.mock('../components/Footer', () => ({ Footer: () => null }));
vi.mock('../components/SideMenu', () => ({ SideMenu: () => null }));

const oil: Ingredient = {
  name: { en: 'Oil', ro: 'Ulei' }, quantity: 100, unit: { en: 'ml', ro: 'ml' }, ingredientId: 101,
};
const unknown: Ingredient = { ...oil, ingredientId: undefined };
function makeRecipe(id: string, ingredients: Ingredient[]): Recipe {
  return {
    id, title: { en: id, ro: id }, ingredients, category: 'breakfast', servings: 2,
    prepTime: 10, effortLevel: 'easy', image: '/test.jpg', instructions: { en: [], ro: [] },
    personalNotes: { en: '', ro: '' }, keywords: [], dateAdded: '2026-01-01',
  };
}

beforeEach(() => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  sessionStorage.clear();
  fixture.recipes = [
    makeRecipe('partial-high', [{ ...oil, quantity: 10000 }, unknown]),
    makeRecipe('unavailable', [unknown]),
    makeRecipe('expensive', [{ ...oil, quantity: 1000 }]),
    makeRecipe('partial-low', [{ ...oil, quantity: 1 }, unknown]),
    makeRecipe('cheap', [oil]),
  ];
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

function cardOrder(): string[] {
  return screen.getAllByRole('heading', { level: 3 }).map(heading => heading.textContent ?? '');
}

describe.each(['en', 'ro'] as const)('HomePage price sorting in %s', language => {
  it.each(['grouped', 'flat'] as const)('keeps complete prices first in both directions in the %s view', view => {
    fixture.language = language;
    render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><HomePage /></MemoryRouter>);
    if (view === 'flat') fireEvent.click(screen.getByRole('switch', { name: getTranslation('groupByCategories', language) }));
    const sortButton = screen.getByRole('button', { name: getTranslation('sortByPrice', language) });
    fireEvent.click(sortButton);
    expect(cardOrder()).toEqual(['cheap', 'expensive', 'partial-high', 'unavailable', 'partial-low']);
    fireEvent.click(sortButton);
    expect(cardOrder()).toEqual(['expensive', 'cheap', 'partial-high', 'unavailable', 'partial-low']);
    fireEvent.click(sortButton);
    expect(cardOrder()).toEqual(['cheap', 'expensive', 'partial-high', 'unavailable', 'partial-low']);
  });
});
