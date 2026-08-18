import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { IngredientList } from '../components/IngredientList';
import { LanguageProvider } from '../hooks/useLanguage';
import type { IngredientItem } from '../types/recipe';

const items: IngredientItem[] = [
  {
    name: { ro: 'sare', en: 'salt' },
    quantity: 1,
    unit: { ro: 'după gust', en: 'to taste' },
    ingredientId: 100,
  },
  {
    name: { ro: 'orez', en: 'rice' },
    quantity: 2,
    unit: { ro: 'căni', en: 'cups' },
    ingredientId: 121,
  },
];

describe('qualitative unit rendering', () => {
  it('hides the placeholder quantity for "to taste" but keeps real amounts', () => {
    const { container } = render(
      <LanguageProvider>
        <IngredientList ingredients={items} servings={2} currentServings={2} />
      </LanguageProvider>
    );
    const text = container.textContent ?? '';
    // The qualitative unit is shown on its own, with no leading "1".
    expect(/to taste|după gust/.test(text)).toBe(true);
    expect(/1\s*(to taste|după gust)/.test(text)).toBe(false);
    // A real measurement still renders its quantity.
    expect(/2\s*(cups|căni)/.test(text)).toBe(true);
  });
});
