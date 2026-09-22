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
  it('shows only a money symbol and per-serving number with the explanation in the tooltip', () => {
    renderCard([oil], language);
    const description = `${getTranslation('estimatedCost', language)}: 0.75 ${getTranslation('perServing', language)}`;
    const label = screen.getByRole('img', { name: description });
    expect(label).toBeVisible();
    expect(label).toHaveTextContent(/^💰0\.75$/);
    expect(label).toHaveAttribute('title', description);
    expect(label).toHaveClass('whitespace-nowrap');
    expect(screen.queryByText(getTranslation('estimatedCost', language), { exact: false })).not.toBeInTheDocument();
    expect(screen.queryByText(getTranslation('partialEstimate', language), { exact: false })).not.toBeInTheDocument();
  });

  it('uses the per-serving known cost for partial estimates, not the whole-recipe subtotal', () => {
    renderCard([oil, unknown], language);
    const description = `${getTranslation('partialEstimate', language)} · ${getTranslation('knownSubtotal', language)}: 0.75 ${getTranslation('perServing', language)}`;
    const label = screen.getByRole('img', { name: description });
    expect(label).toBeVisible();
    expect(label).toHaveTextContent(/^💰0\.75$/);
    expect(label).toHaveAttribute('title', description);
    expect(label).not.toHaveTextContent('1.50');
    expect(label).not.toHaveTextContent(getTranslation('partialEstimate', language));
    expect(label).not.toHaveTextContent('0.20');
  });

  it('uses a compact dash for unavailable costs rather than a fake number', () => {
    renderCard([unknown], language);
    const label = screen.getByRole('img', { name: getTranslation('costUnavailable', language) });
    expect(label).toBeVisible();
    expect(label).toHaveTextContent(/^💰—$/);
    expect(label).toHaveAttribute('title', getTranslation('costUnavailable', language));
    expect(label).not.toHaveTextContent(/0\.00|0\.20|RON/);
    expect(screen.queryByText(getTranslation('estimatedCost', language), { exact: false })).not.toBeInTheDocument();
  });

  it('retains an accessible unavailable label and the recipe link for unsupported quantities', () => {
    renderCard([{ ...oil, unit: { en: 'to taste', ro: 'ml' } }], language);
    expect(screen.getByRole('img', { name: getTranslation('costUnavailable', language) })).toHaveTextContent(/^💰—$/);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/recipe/price-card');
  });
});
