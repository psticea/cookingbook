# Homepage v2 — design proposal brief

Three independent, static homepage redesign proposals for **Paul's Cookbook**, a
personal bilingual (RO/EN) recipe site. Each proposal lives in its own folder and
is a self-contained static mock — no build step, no framework, no CDN.

These are design explorations. **No production app code is touched.**

## Why

The current homepage (`src/pages/HomePage.tsx`) works but looks dated: a generic
control bar of pill buttons, flat category headers, and square photo cards with
translucent black overlay chips. The owner wants something **modern, minimalist,
elegant, creative — a high-value UI** that still exposes every piece of
information the current page exposes.

## Hard constraints (non-negotiable)

1. **Two-column recipe grid.** Exactly 2 columns at ≤640px. Above 640px you may
   go to 2, 3 or 4 columns, but the card anatomy must stay identical and the
   two-up rhythm must remain the design's signature. The mock is judged first at
   **390 × 844** (mobile) and second at **1280 × 900** (desktop).
2. **Keep the type scale.** Do not shrink text to buy space. Minimums:
   body 16px, recipe card title 16px, metadata/pills 13px, section headings 20px,
   micro-labels 11px (uppercase, tracked). You may go *larger*, never smaller.
3. **Keep the side menu.** A right-hand slide-in drawer with a dimmed backdrop,
   Escape-to-close, focus trap, and body scroll lock. It is opened from a menu
   button in the header. All four drawer sections below must be present.
4. **Keep all the information.** Every item in the inventory below must be
   reachable from the homepage. You may re-compose, re-group, or progressively
   disclose it — you may not delete it.
5. **Bilingual + themeable.** RO and EN both render from real data with no
   clipped or overflowing labels. Light and dark themes both fully designed —
   dark is not an afterthought inversion.

## Information inventory — all of it must survive

**Header**
- Brand wordmark "Paul's Cookbook" (clicking it scrolls to top)
- Search field — filters by recipe title, active from 2+ characters
- Menu button that opens the side drawer

**Result controls**
- Live count of currently matching recipes
- "Group by categories" toggle (on = category sections, off = one flat grid)
- Sort by **name**, **prep time**, **price per serving**, each with an
  ascending/descending direction that is visible in the UI
- Active-filter feedback and a way to clear filters

**Recipe grid**
- Category sections (when grouping is on): category name + recipe count,
  and each section must be a scroll target from the drawer's category list
- Recipe card: photo, full title (never truncated to one line),
  prep time in minutes, price per serving in RON
- Price has three states: `complete` (confident estimate), `partial`
  (known subtotal only — must read as provisional), `unavailable` (show an
  em dash, never a fake 0.00)
- Cards link to `recipeBase + recipe.id`

**Side drawer**
- *Filters* — keyword chips grouped by `meatType`, `cookType`, `ingredient`
  (cap ingredients at the first 12), multi-select, AND semantics across all
  selected chips, plus a clear-all affordance
- *Categories* — all 8, clicking one closes the drawer and scrolls to that section
- *More* — Cooking Basics, Ingredient Prices, About
- *Preferences* — language (RO/EN), theme (light/dark), text size (normal/large).
  Text size must actually work: `large` scales the whole page up ~12.5%.

**States**
- Empty state when filters match nothing, with a clear-filters action
- Footer

## Data

`shared/catalogue.js` defines `window.COOKBOOK_DATA` from the real repo content.
Regenerate with `node mocks/homepage-v2/shared/prepare.mjs`.

```js
{
  brand: "Paul's Cookbook",
  recipeCount: 33,
  categories: [{ id, folder, name: { ro, en } }],          // 8, in display order
  filters:    [{ id, type, label: { ro, en } }],           // meatType | cookType | ingredient
  recipes: [{
    id, title: { ro, en }, category,
    minutes, servings, effort,                             // effort: easy | medium | hard
    keywords: [filterId],
    ingredientCount, stepCount,
    price,                                                 // number | null — RON per serving
    priceStatus,                                           // complete | partial | unavailable
    unpricedCount,
    image, imageFull,                                      // repo-root-relative paths
    dateAdded
  }],
  translations: { ro: {...}, en: {...} },                  // the app's real string table
  recipeBase: 'http://localhost:5173/cookingbook/recipe/',
  appBase:    'http://localhost:5173/cookingbook/'
}
```

**Images:** `recipe.image` is relative to the repo root. From a proposal page at
`mocks/homepage-v2/proposal-0N/index.html`, render it as `'../../../' + recipe.image`.
Every recipe has a real photo — always render it, never a placeholder block.

Use real Romanian and English strings. `translations` carries the app's own
wording (`searchPlaceholder`, `categories`, `filters`, `sortByName`,
`sortByPrepTime`, `sortByPrice`, `ascending`, `descending`, `perServing`,
`estimatedCost`, `partialEstimate`, `knownSubtotal`, `costUnavailable`,
`clearFilters`, `pantryEmpty`, `pantryEmptyMessage`, `cookingBasics`,
`ingredientPrices`, `about`, `preferences`, `language`, `theme`, `textSize`, …).
Add proposal-specific copy only where the app has no equivalent key.

## What reference the existing product gives you

- Type: **Fraunces** (serif/display), **Inter** (UI), **JetBrains Mono** (numerals).
  Use them, or justify a different pairing in `concept.json` — but load fonts
  locally-safe: `@font-face` from Google's CDN is not available offline, so
  degrade gracefully to `Georgia, serif` / `system-ui` / `ui-monospace`.
- Current palette lives in `src/design/tokens.ts`: cream `#f7f4ef`, near-black
  `#131317`, green `#4f772d`, terracotta `#c95a3c`, cream-yellow `#f3d77a`.
  **You are free to re-pigment.** Each proposal should own a distinct palette.

## Deliverables per proposal folder

```
proposal-0N/
  index.html      # semantic, accessible, with a design-contract comment at the top
  styles.css      # all styling; CSS custom properties for the palette
  app.js          # vanilla ES2020, no modules, reads window.COOKBOOK_DATA
  concept.json    # { id, name, tagline, thesis, palette, typography, moves[], tradeoffs[] }
```

## Quality bar

- Zero console errors. Zero layout shift on load. Zero horizontal scroll at 320px.
- Keyboard operable end to end; visible focus rings; correct ARIA on the drawer,
  toggles, and live count.
- Respect `prefers-reduced-motion`.
- Tap targets ≥44px.
- It must survive the long-title test: *"Supă de Vită și Năut în Stil Shawarma"*
  and *"Papricaș de pui cu găluște"* must sit in a 2-up card without clipping.
- Don't ship default-looking UI. No unstyled `<select>` dropped into a hero, no
  drop-shadow-everything, no emoji used as a substitute for design.
