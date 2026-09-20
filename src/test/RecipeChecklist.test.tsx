import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Link } from 'react-router-dom';
import { LanguageProvider, useLanguage } from '../hooks/useLanguage';
import { ThemeProvider, useTheme } from '../hooks/useTheme';
import { TextSizeProvider, useTextSize } from '../hooks/useTextSize';
import RecipePage from '../pages/RecipePage';
import type { Recipe } from '../types/recipe';

const recipe: Recipe = {
  id: 'test-recipe',
  category: 'breakfast',
  title: { en: 'Test recipe', ro: 'Rețetă de test' },
  prepTime: 20,
  servings: 4,
  effortLevel: 'easy',
  image: '/test.jpg',
  ingredients: [
    { name: { en: 'yellow onions', ro: 'cepe galbene' }, quantity: 2, unit: { en: 'pcs', ro: 'buc' }, ingredientId: 108 },
    { name: { en: 'butter', ro: 'unt' }, quantity: 100, unit: { en: 'g', ro: 'g' }, ingredientId: 110 },
  ],
  instructions: { en: ['Cook the onions.'], ro: ['Gătește ceapa.'] },
  personalNotes: { en: '', ro: '' },
  keywords: [],
  dateAdded: '2026-09-20',
};
const secondRecipe: Recipe = { ...recipe, id: 'second-recipe', servings: 2 };
const largeRecipe: Recipe = { ...recipe, id: 'large-recipe', servings: 15 };

vi.mock('../hooks/useRecipeData', () => ({
  useRecipeData: () => ({ recipes: [recipe, secondRecipe, largeRecipe], loading: false, error: null }),
  getRecipeById: (recipes: Recipe[], id: string) => recipes.find(item => item.id === id),
}));

const PreferenceControls = () => {
  const { setLanguage } = useLanguage();
  const { setTheme } = useTheme();
  const { setTextSize } = useTextSize();
  return <>
    <button onClick={() => setLanguage('ro')}>Test Romanian</button>
    <button onClick={() => { setTheme('dark'); setTextSize('large'); }}>Test dark large</button>
    <Link to="/recipe/second-recipe">Next test recipe</Link>
    <Link to="/recipe/large-recipe">Large test recipe</Link>
  </>;
};

const renderPage = () => render(
  <LanguageProvider>
    <ThemeProvider>
      <TextSizeProvider>
        <MemoryRouter initialEntries={['/recipe/test-recipe']}>
          <PreferenceControls />
          <Routes><Route path="/recipe/:id" element={<RecipePage />} /></Routes>
        </MemoryRouter>
      </TextSizeProvider>
    </ThemeProvider>
  </LanguageProvider>
);

describe('Recipe checklist lifecycle', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('userLanguage', JSON.stringify('en'));
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  afterEach(() => vi.restoreAllMocks());

  it('keeps checks and the cost disclosure across tabs, servings and preferences', async () => {
    renderPage();
    const panel = await screen.findByRole('tabpanel', { name: /Ingredients/ });
    const summary = panel.querySelector('summary');
    if (!summary) throw new Error('Cost disclosure missing');
    fireEvent.click(within(panel).getByRole('checkbox', { name: '2 yellow onions' }));
    fireEvent.click(summary);
    fireEvent.click(screen.getByRole('tab', { name: /Instructions/ }));
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    expect(screen.getByText('Cook the onions.')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Increase servings' }));
    fireEvent.click(screen.getByRole('tab', { name: /Ingredients/ }));
    expect(within(panel).getByRole('checkbox', { name: '2.5 yellow onions' })).toBeChecked();
    expect(panel.querySelector('details')).toHaveAttribute('open');
    expect(summary).toHaveTextContent('4.50 RON');
    expect(summary).toHaveTextContent('For 5 servings');
    fireEvent.click(screen.getByRole('button', { name: 'Test Romanian' }));
    expect(within(panel).getByRole('checkbox', { name: '2,5 cepe galbene' })).toBeChecked();
    expect(summary).toHaveTextContent('Cost estimat');
    expect(summary).toHaveTextContent('4.50 RON');
    fireEvent.click(screen.getByRole('button', { name: 'Test dark large' }));
    expect(within(panel).getByRole('checkbox', { name: '2,5 cepe galbene' })).toBeChecked();
    expect(document.documentElement).toHaveClass('dark', 'text-xl');
    fireEvent.click(screen.getByRole('button', { name: 'Resetează lista' }));
    expect(within(panel).getByRole('checkbox', { name: '2,5 cepe galbene' })).not.toBeChecked();
    expect(panel.querySelector('details')).toHaveAttribute('open');
  });

  it('resets checklist, receipt and serving count when navigating to a different recipe', async () => {
    renderPage();
    const panel = await screen.findByRole('tabpanel', { name: /Ingredients/ });
    fireEvent.click(within(panel).getByRole('checkbox', { name: '2 yellow onions' }));
    const summary = panel.querySelector('summary');
    if (!summary) throw new Error('Cost disclosure missing');
    fireEvent.click(summary);
    fireEvent.click(screen.getByRole('button', { name: 'Increase servings' }));
    fireEvent.click(screen.getByRole('tab', { name: /Instructions/ }));
    fireEvent.click(screen.getByRole('link', { name: 'Next test recipe' }));
    const nextPanel = await screen.findByRole('tabpanel', { name: /Ingredients/ });
    expect(within(nextPanel).getByRole('checkbox', { name: '2 yellow onions' })).not.toBeChecked();
    expect(nextPanel.querySelector('details')).not.toHaveAttribute('open');
    expect(nextPanel.querySelector('summary')).toHaveTextContent('For 2 servings');
  });

  it('allows returning to an original yield above twelve servings', async () => {
    renderPage();
    fireEvent.click(screen.getByRole('link', { name: 'Large test recipe' }));
    const panel = await screen.findByRole('tabpanel', { name: /Ingredients/ });
    const increase = screen.getByRole('button', { name: 'Increase servings' });
    expect(increase).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Decrease servings' }));
    expect(increase).toBeEnabled();
    expect(panel.querySelector('summary')).toHaveTextContent('For 14 servings');
    fireEvent.click(increase);
    expect(panel.querySelector('summary')).toHaveTextContent('For 15 servings');
    expect(increase).toBeDisabled();
  });
});
