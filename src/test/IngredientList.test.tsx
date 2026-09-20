import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { IngredientList } from '../components/IngredientList';
import { LanguageProvider } from '../hooks/useLanguage';
import { IngredientItem } from '../types/recipe';

const ingredients: IngredientItem[] = [
  { section: { en: 'For the pan', ro: 'Pentru tigaie' } },
  { name: { en: 'yellow onions', ro: 'cepe galbene' }, quantity: 2, unit: { en: 'pcs', ro: 'buc' }, ingredientId: 108 },
  { name: { en: 'butter', ro: 'unt' }, quantity: 100, unit: { en: 'g', ro: 'g' }, ingredientId: 110 },
];

const renderList = (currentServings = 4, items = ingredients) => (
  <MemoryRouter>
    <LanguageProvider>
      <IngredientList ingredients={items} servings={4} currentServings={currentServings} />
    </LanguageProvider>
  </MemoryRouter>
);

describe('Ingredient checklist and cost receipt', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('userLanguage', JSON.stringify('en'));
  });

  it('reads amount and name together without piece codes or prices in checkbox labels', () => {
    render(renderList());
    expect(screen.getByRole('checkbox', { name: '2 yellow onions' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: '100 g butter' })).not.toBeChecked();
    expect(screen.getByRole('heading', { name: 'For the pan' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('0 of 2 checked');
    expect(screen.getByRole('button', { name: 'Reset checklist' })).toBeDisabled();
    expect(screen.getByRole('checkbox', { name: '2 yellow onions' }).closest('label')).not.toHaveTextContent('RON');
  });

  it('preserves checks when scaling and clears them only on reset', () => {
    const { rerender } = render(renderList());
    fireEvent.click(screen.getByRole('checkbox', { name: '2 yellow onions' }));
    rerender(renderList(8));
    expect(screen.getByRole('checkbox', { name: '4 yellow onions' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: '200 g butter' })).not.toBeChecked();
    expect(screen.getByRole('status')).toHaveTextContent('1 of 2 checked');
    fireEvent.click(screen.getByRole('button', { name: 'Reset checklist' }));
    expect(screen.getByRole('checkbox', { name: '4 yellow onions' })).not.toBeChecked();
  });

  it('starts collapsed and shows a complete receipt that scales with the selected yield', () => {
    const { container, rerender } = render(renderList());
    const details = container.querySelector('details');
    const summary = container.querySelector('summary');
    expect(details).not.toHaveAttribute('open');
    expect(summary).toHaveTextContent('Estimated cost');
    expect(summary).toHaveTextContent('3.60 RON');
    expect(summary).toHaveTextContent('For 4 servings');
    expect(summary).toHaveTextContent('Approximately 0.90 RON / serving');
    expect(screen.getByRole('link', { name: 'View ingredient prices and calculation assumptions' })).not.toBeVisible();
    if (!summary || !details) throw new Error('Cost disclosure missing');
    fireEvent.click(summary);
    expect(details).toHaveAttribute('open');
    expect(within(details).getByText('1.60 RON')).toBeVisible();
    expect(within(details).getByText('2.00 RON')).toBeVisible();
    expect(within(details).getByText('Recipe total')).toBeVisible();
    expect(screen.getByRole('link', { name: 'View ingredient prices and calculation assumptions' })).toHaveAttribute('href', '/prices');
    rerender(renderList(8));
    expect(details).toHaveAttribute('open');
    expect(summary).toHaveTextContent('7.20 RON');
    expect(summary).toHaveTextContent('Approximately 0.90 RON / serving');
    expect(within(details).getByText('3.20 RON')).toBeVisible();
    expect(within(details).getByText('4.00 RON')).toBeVisible();
    fireEvent.click(summary);
    expect(details).not.toHaveAttribute('open');
  });

  it('identifies missing costs, excludes them from the known subtotal and explains why', () => {
    const unknown: IngredientItem = {
      name: { en: 'fresh spinach', ro: 'spanac proaspăt' },
      quantity: 2,
      unit: { en: 'cups', ro: 'căni' },
      ingredientId: 110,
    };
    const { container } = render(renderList(4, [...ingredients, unknown]));
    const summary = container.querySelector('summary');
    expect(summary).toHaveTextContent('Known subtotal');
    expect(summary).toHaveTextContent('3.60 RON');
    expect(summary).toHaveTextContent('1 ingredient not included.');
    expect(summary).toHaveTextContent('Known subtotal per serving: 0.90 RON');
    if (!summary) throw new Error('Cost disclosure missing');
    fireEvent.click(summary);
    expect(screen.getByText('Unavailable')).toBeVisible();
    expect(screen.getByText('This quantity cannot be converted to the reference price unit.')).toBeVisible();
    expect(screen.queryByText('Recipe total')).not.toBeInTheDocument();
  });

  it('does not show a zero or placeholder total when every ingredient price is unknown', () => {
    const unknown: IngredientItem[] = [{
      name: { en: 'special seasoning', ro: 'condiment special' },
      quantity: 1,
      unit: { en: 'g', ro: 'g' },
      ingredientId: 999,
    }];
    const { container } = render(renderList(4, unknown));
    const summary = container.querySelector('summary');
    expect(summary).toHaveTextContent('Cost unavailable');
    expect(summary).toHaveTextContent('No ingredient costs are available.');
    expect(summary).not.toHaveTextContent('0.00 RON');
    expect(summary).not.toHaveTextContent('0.20 RON');
  });

  it('localizes quantities, labels and singular servings in Romanian', () => {
    localStorage.setItem('userLanguage', JSON.stringify('ro'));
    const { container } = render(renderList(1));
    expect(screen.getByRole('checkbox', { name: '0,5 cepe galbene' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Resetează lista' })).toBeInTheDocument();
    const summary = container.querySelector('summary');
    expect(summary).toHaveTextContent('Cost estimat');
    expect(summary).toHaveTextContent('Pentru 1 porție');
    expect(summary).toHaveTextContent('0.90 RON');
  });

  it('keeps qualitative units without their numeric placeholder', () => {
    const qualitative: IngredientItem[] = [{
      name: { en: 'salt', ro: 'sare' },
      quantity: 1,
      unit: { en: 'to taste', ro: 'după gust' },
      ingredientId: 100,
    }];
    render(renderList(8, qualitative));
    expect(screen.getByRole('checkbox', { name: 'salt — to taste' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toHaveAccessibleName(/2/);
  });
});
