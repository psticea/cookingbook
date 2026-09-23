import React, { useMemo, useRef, useState } from 'react';
import { ContentPage } from '../components/ContentPage';
import { CloseIcon, SearchIcon } from '../components/icons';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';
import pricesData from '../data/prices.json';
import type { PriceConfig, PricesData } from '../utils/pricing';

type Row = Omit<PriceConfig, 'category'> & { key: string; category: string };

/** Display order of the price groups; unknown categories follow alphabetically. */
const CATEGORY_ORDER = [
  'Proteins',
  'Meat & Poultry',
  'Seafood',
  'Dairy',
  'Fruits and Vegetables',
  'Grains & Pasta',
  'Spices & Seasonings',
  'Pantry',
  'Baking',
];

const CATEGORY_LABELS: Record<string, { ro: string; en: string }> = {
  Proteins: { ro: 'Proteine', en: 'Proteins' },
  'Meat & Poultry': { ro: 'Carne și pasăre', en: 'Meat & poultry' },
  Seafood: { ro: 'Pește și fructe de mare', en: 'Seafood' },
  Dairy: { ro: 'Lactate', en: 'Dairy' },
  'Fruits and Vegetables': { ro: 'Fructe și legume', en: 'Fruits and vegetables' },
  'Grains & Pasta': { ro: 'Cereale și paste', en: 'Grains & pasta' },
  'Spices & Seasonings': { ro: 'Condimente', en: 'Spices & seasonings' },
  Pantry: { ro: 'Cămară', en: 'Pantry' },
  Baking: { ro: 'Patiserie', en: 'Baking' },
};

const UNITS: Record<PriceConfig['unit_type'], { ro: string; en: string; key: string }> = {
  mass: { ro: 'kg', en: 'kg', key: 'perKilogram' },
  volume: { ro: 'L', en: 'L', key: 'perLiter' },
  piece: { ro: 'buc.', en: 'pc', key: 'perPiece' },
};

const rankOf = (category: string) => {
  const i = CATEGORY_ORDER.indexOf(category);
  return i === -1 ? CATEGORY_ORDER.length : i;
};

/**
 * PricesPage — the reference prices behind recipe costs, as one hairline table
 * grouped by category, with an underlined search field (DESIGN.md → Receipt and tables).
 */
const PricesPage: React.FC = () => {
  const { language } = useLanguage();
  const ro = language === 'ro';
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const rows = useMemo<Row[]>(
    () => Object.entries((pricesData as PricesData).ingredients).map(([key, ingredient]) => ({ key, ...ingredient })),
    []
  );

  const filtered = useMemo(() => {
    const searchLower = searchTerm.trim().toLowerCase();
    return rows.filter(
      (ingredient) =>
        ingredient.name.toLowerCase().includes(searchLower) || ingredient.key.toLowerCase().includes(searchLower)
    );
  }, [rows, searchTerm]);

  const groups = useMemo(() => {
    const byCategory = new Map<string, Row[]>();
    filtered.forEach((row) => byCategory.set(row.category, [...(byCategory.get(row.category) ?? []), row]));
    return Array.from(byCategory.entries())
      .sort(([a], [b]) => rankOf(a) - rankOf(b) || a.localeCompare(b))
      .map(([category, items]) => ({ category, items: items.sort((a, b) => a.name.localeCompare(b.name)) }));
  }, [filtered]);

  const categoryLabel = (category: string) => CATEGORY_LABELS[category]?.[language] ?? category;
  const priceOf = (row: Row) => (row.unit_type === 'piece' ? row.price_per_piece : row.price_per_1000)?.toFixed(2) ?? '—';

  const placeholder = getTranslation('searchIngredients', language).replace(/\.\.\.$/, '…');
  const count = filtered.length;
  const countWord = (count === 1 ? getTranslation('ingredient', language) : getTranslation('ingredients', language)).toLowerCase();

  const clearSearch = () => {
    setSearchTerm('');
    inputRef.current?.focus();
  };

  const headCell = 'sticky top-[var(--bar-h)] z-10 bg-wall pt-3 pb-2 border-b border-line text-sm font-normal text-ink-2 align-bottom';

  return (
    <ContentPage
      title={getTranslation('ingredientPrices', language)}
      intro={ro ? 'Prețurile folosite pentru estimarea costului rețetelor.' : 'Prices used to estimate the cost of recipes.'}
    >
      <div className="mt-10 md:mt-14 flex items-end justify-between gap-x-4 sm:gap-x-6">
        <form
          role="search"
          onSubmit={(e) => e.preventDefault()}
          className="relative flex items-center flex-1 sm:flex-none sm:w-[360px] min-w-0 h-11 border-b border-line-strong focus-within:border-ink transition-colors duration-200 ease-ease"
        >
          <SearchIcon size={20} className="ml-0.5 mr-2 text-ink-2" />
          <input
            ref={inputRef}
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape' && searchTerm) setSearchTerm('');
            }}
            placeholder={placeholder}
            aria-label={placeholder}
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="search"
            className="flex-1 min-w-0 h-full bg-transparent border-0 outline-none text-base text-ink placeholder:text-ink-3 appearance-none [&::-webkit-search-cancel-button]:hidden focus-visible:outline-none"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="grid place-items-center w-11 h-11 -mr-1.5 rounded-full text-ink hover:bg-ink/[.06] transition-colors"
              aria-label={getTranslation('clearSearch', language)}
            >
              <CloseIcon size={18} />
            </button>
          )}
        </form>

        <p className="shrink-0 min-h-target grid content-center leading-[1.1] sm:flex sm:items-center sm:gap-1.5 whitespace-nowrap text-right" aria-live="polite" aria-atomic="true">
          <span className="text-md sm:text-base font-[650] tabular-nums text-ink">{count}</span>
          <span className="text-xs sm:text-ui text-ink-2">{countWord}</span>
        </p>
      </div>

      {count === 0 ? (
        <div role="status" className="mt-6 pt-8 border-t border-line">
          <p className="type-title text-ink">{getTranslation('noIngredientsFound', language)}</p>
          <button
            type="button"
            onClick={clearSearch}
            className="mt-2 min-h-target px-0.5 text-ui font-medium text-ink underline decoration-line-strong decoration-1 underline-offset-4 hover:decoration-current"
          >
            {getTranslation('clearSearch', language)}
          </button>
        </div>
      ) : (
        <table className="mt-4 md:mt-6 w-full table-fixed border-separate border-spacing-0 text-left">
          <caption className="sr-only">{getTranslation('ingredientPrices', language)}</caption>
          <colgroup>
            <col />
            <col className="w-[6.25rem] md:w-[8.5rem]" />
            <col className="w-[4.5rem] md:w-[6.5rem]" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className={`${headCell} pr-3`}>{getTranslation('ingredient', language)}</th>
              <th scope="col" className={`${headCell} pl-3 text-right`}>{ro ? 'Preț (lei)' : 'Price (lei)'}</th>
              <th scope="col" className={`${headCell} pl-3`}>{ro ? 'Unitate' : 'Unit'}</th>
            </tr>
          </thead>
          {groups.map(({ category, items }, groupIndex) => (
            <tbody key={category}>
              <tr>
                <th
                  scope="colgroup"
                  colSpan={3}
                  className={`${groupIndex === 0 ? 'pt-7' : 'pt-10 md:pt-12'} pb-2.5 border-b border-line text-left font-normal`}
                >
                  <span className="type-section text-ink">{categoryLabel(category)}</span>
                  <span className="ml-2.5 text-sm font-medium text-ink-3 tabular-nums">{items.length}</span>
                </th>
              </tr>
              {items.map((row) => (
                <tr key={row.key}>
                  <th
                    scope="row"
                    className="py-3 pr-3 border-b border-line align-baseline text-base font-normal leading-[1.4] text-ink [overflow-wrap:anywhere] [hyphens:auto]"
                  >
                    {row.name}
                  </th>
                  <td className="py-3 pl-3 border-b border-line align-baseline text-right text-base font-[480] tabular-nums text-ink whitespace-nowrap">
                    {priceOf(row)}
                  </td>
                  <td className="py-3 pl-3 border-b border-line align-baseline text-sm text-ink-3 whitespace-nowrap">
                    <span aria-hidden="true">{UNITS[row.unit_type][language]}</span>
                    <span className="sr-only">{getTranslation(UNITS[row.unit_type].key, language)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      )}

      <aside className="mt-12 md:mt-16 bg-paper rounded-ctl p-4 xs:p-5 md:px-6 md:py-[22px]">
        <h2 className="type-section text-ink">{ro ? 'Cum se calculează costul' : 'How costs are calculated'}</h2>
        <p className="mt-2 max-w-[65ch] text-ui leading-[1.55] text-ink-2">
          {getTranslation('costQuantityNote', language)} {getTranslation('costConversionNote', language)}
        </p>
      </aside>
    </ContentPage>
  );
};

export default PricesPage;
