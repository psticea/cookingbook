import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RecipeCard } from '../components/RecipeCard';
import { getTranslation } from '../utils/translations';
import type { Ingredient, Recipe } from '../types/recipe';
import type { Language } from '../types';

const locale = vi.hoisted(() => ({ language: 'en' as Language }));
vi.mock('../hooks/useLanguage', () => ({ useLanguage: () => locale }));
afterEach(cleanup);

const oil: Ingredient = {
  name: { en: 'Oil', ro: 'Ulei' }, quantity: 100, unit: { en: 'ml', ro: 'ml' }, ingredientId: 101,
};
const unknown: Ingredient = { ...oil, ingredientId: undefined };
const recipe: Recipe = {
  id: 'price-card', category: 'breakfast', title: { en: 'Price card', ro: 'Card de preț' },
  prepTime: 10, servings: 2, effortLevel: 'easy', image: '/test.jpg', ingredients: [oil],
  instructions: { en: [], ro: [] }, personalNotes: { en: '', ro: '' }, keywords: [], dateAdded: '2026-01-01',
};

function renderCard(ingredients: Ingredient[], language: Language) {
  locale.language = language;
  render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><RecipeCard recipe={{ ...recipe, ingredients }} /></MemoryRouter>);
}

describe.each(['en', 'ro'] as const)('RecipeCard pricing in %s', language => {
  it('visibly labels a complete per-serving estimate with its currency', () => {
    renderCard([oil], language);
    const label = screen.getByText(getTranslation('estimatedCost', language), { exact: false });
    expect(label).toBeVisible();
    expect(label).toHaveTextContent('0.75');
    expect(label).toHaveTextContent(getTranslation('perServing', language));
    expect(label.textContent?.match(/RON/g)).toHaveLength(1);
    expect(screen.queryByText(getTranslation('partialEstimate', language), { exact: false })).not.toBeInTheDocument();
  });

  it('labels a partial estimate as a known recipe subtotal, not a cheap serving price', () => {
    renderCard([oil, unknown], language);
    const label = screen.getByText(getTranslation('partialEstimate', language), { exact: false });
    expect(label).toBeVisible();
    expect(label).toHaveTextContent(getTranslation('knownSubtotal', language));
    expect(label).toHaveTextContent('1.50 RON');
    expect(label).not.toHaveTextContent('0.75');
    expect(label).not.toHaveTextContent('0.20');
  });

  it('visibly marks unavailable costs without showing a placeholder or zero price', () => {
    renderCard([unknown], language);
    const label = screen.getByText(getTranslation('costUnavailable', language));
    expect(label).toBeVisible();
    expect(label).not.toHaveTextContent(/0\.00|0\.20|RON/);
    expect(screen.queryByText(getTranslation('estimatedCost', language), { exact: false })).not.toBeInTheDocument();
  });

  it('does not hide an unavailable estimate inside a title tooltip', () => {
    renderCard([{ ...oil, unit: { en: 'to taste', ro: 'ml' } }], language);
    expect(screen.getByRole('link')).toHaveTextContent(getTranslation('costUnavailable', language));
    expect(screen.getByRole('link')).toHaveAttribute('href', '/recipe/price-card');
  });
});
