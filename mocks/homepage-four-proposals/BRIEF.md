# Homepage redesign mock — shared brief (all four designers)

## The product
"Paul's Cookbook" — a personal, ad-free, bilingual (Romanian default, English) recipe website. 33 home-cooking recipes
(Romanian classics like ciorbă de varză, mămăligă, plăcintă, plus pasta, stir-fries, soups, salads). Every recipe has a
real 1200x800 food photo. A distinctive feature: each recipe shows an estimated **cost per serving in lei** computed from
ingredient prices. Visitors are home cooks, mostly on phones, often deciding "what do I cook tonight" — browsing by photo,
time, and cost. Hosted on GitHub Pages; React + Tailwind in production (your mock is plain HTML/CSS/JS).

## The user's request (verbatim intent)
"This homepage looks a bit boring and dated. Keep all this info accessible on the home page, but with a better
presentation. Modern, minimalist, elegant, creative. It should look like high-value UI. Mobile first, but desktop must
work well too. Keep the layout with two columns (on mobile; desktop may use 3–4 columns), keep the font size readable,
keep the side menu. You can change fonts as long as readability stays. Don't overcrowd with text — images must stay
central to the homepage. Don't get inspiration from other existing mocks."

## What the current homepage contains (ALL must remain reachable on the homepage)
Look at the baseline screenshots in `mocks/homepage-four-proposals/baseline/compare/` (m-light, d-light, m-menu, ...) to understand content — they are the "dated" look to move away from, not a style reference.
Relevant source for behaviour: `src/pages/HomePage.tsx`, `src/components/{Header,SideMenu,RecipeCard,RecipeGrid,FiltersSection,CategoriesSection,MenuLinks,SearchBar,Footer}.tsx`.

1. Header: brand "Paul's Cookbook" (tapping scrolls to top), search field (filters by title, 2+ chars), menu button opening the side menu.
2. Control bar: live recipe count; "Categories" grouping toggle (grouped by category ↔ one flat list); sort by Name / Time / Price, tapping the active sort flips asc/desc with a visible direction indicator.
3. Category sections (8 categories, in the order of the data) each with heading + recipe count; only non-empty ones render.
4. Recipe card: photo (dominant), title (up to 2 lines), prep time in minutes, cost per serving in lei (show "—" when null; partial estimates may get a subtle marker/tooltip + accessible label). Whole card links to the recipe.
5. Empty state when search/filters match nothing, with a "clear filters" action.
6. Side menu (drawer — keep it a drawer/sheet that opens from the menu button, close button, Escape closes, backdrop click closes, body scroll lock):
   - Filters: keyword chips grouped into Meat type, Cooking method, Ingredient (show first 12 ingredient chips). Multi-select AND logic; "clear all". Show active filter state somewhere on the homepage too (e.g. count/chips) so the user knows results are filtered.
   - Categories: list of the 8 categories; tapping one closes the menu and scrolls to that section.
   - More: links to Cooking Basics, Ingredient Prices, About.
   - Preferences: Language (RO/EN), Theme (light/dark), Text size (normal/large).
7. Footer (current one repeats About + preferences; you may simplify it, but About must stay reachable).

## Data you MUST use (no invented recipes, prices, or claims)
`mocks/homepage-four-proposals/shared/data.js` defines `window.COOKBOOK` with:
- `categories[]` {id, name:{ro,en}}; `recipes[]` {id, category, title:{ro,en}, prepTime, servings, effortLevel, keywords[], pricePerServing (number|null, lei), priceStatus ('complete'|'partial'|'unavailable'), image, thumb}
- `filterKeywords[]` {id, type:'difficulty'|'meatType'|'cookType'|'ingredient', label:{ro,en}} (the side menu uses meatType, cookType, ingredient)
- `ui.ro` / `ui.en` translated strings (menu, filters, categories, sortByName, sortByPrepTime, sortByPrice, searchPlaceholder, preferences, language, theme, textSize, light, dark, normal, large, cookingBasics, ingredientPrices, about, more, recipes, pantryEmpty, pantryEmptyMessage, clearFilters, clearAllFilters, meatType, cookType, ingredient, minutes, perServing, greetingTitle "Ce gătim azi?/What's cooking today?", greetingSubtitle, ...). Use these instead of hardcoding copy where a key exists.
- `imageBase` = "../../../public/" — image URL = `COOKBOOK.imageBase + recipe.thumb` (webp ~ small) or `+ recipe.image` (full jpg). Use `thumb` for grid cards and the full jpg only where an image is shown large (e.g. a hero). Fallback to jpg on thumb error.
- `recipeHref(id)` → link for a card. `menuLinks[]` → {id (ui key), href}.
Include it with `<script src="../shared/data.js"></script>`. Do NOT modify shared/data.js.

## Hard constraints
- Deliverable is a fully working, standalone mock: `mocks/homepage-four-proposals/<your-folder>/index.html` (+ optional `styles.css`, `app.js` in the same folder). Everything interactive must actually work: search, sort + direction, category toggle, filters, category jump, drawer, language, theme (light AND dark must both be designed and look great), text size (large must scale the UI sensibly, not just one element).
- Mobile first. Design at 390px wide first, then 768px and 1440px. **2-column recipe grid on mobile**; 3–4 columns on desktop. Nothing may overflow horizontally at 360px. Touch targets ≥ 44px.
- Readable type: body/UI text ≥ 15px on mobile, card titles ≥ 15–16px, metadata ≥ 13px. Good contrast (WCAG AA) in both themes, including text over photos.
- Images are the hero of the page. Chrome and text must be sparse. No filler marketing copy, no invented stats/testimonials. A short greeting (from ui strings) is fine.
- Fonts: you may choose new ones (Google Fonts via <link> is fine). Avoid these overused defaults: Fraunces (the current site's), Playfair Display, Cormorant, Lora, Crimson, Newsreader, Syne, Space Grotesk, Space Mono, IBM Plex, DM Sans/Serif, Outfit, Plus Jakarta Sans, Instrument Sans, Inter as display. Pick faces with a reason tied to your direction.
- Avoid the generic AI looks: warm-cream + serif + terracotta; near-black + one neon glow; broadsheet hairlines + italic serif + tiny tracked mono labels. Also avoid emoji as UI icons (the current site uses 💰 ⏱ — replace with a considered icon or typographic treatment). No glassmorphism-by-default, no gradient text, no generic card-with-shadow-everywhere.
- Accessibility: semantic HTML, visible focus states, aria-pressed/aria-checked on toggles, aria-labels for icon buttons, drawer is role="dialog" aria-modal, `prefers-reduced-motion` respected.
- Motion: tasteful and purposeful (drawer, sort/filter transitions, image hover/press). No gratuitous animation.
- The menu button MUST have the attribute `data-menu-toggle` (the screenshot script clicks it).
- Put a short HTML comment at the top of index.html: THESIS / OWN-WORLD / FIRST VIEWPORT / TYPE / COLOR (≤150 words).
- **Do not look at or take inspiration from** `mocks/homepage-2026`, `mocks/homepage-proposals`, `mocks/homepage-v2`, `.impeccable/`, `reviews/`, or the other three proposal folders. Do not edit anything outside your own folder. No git commands. Do not ask the user questions — decide.

## Tools
- A static server serves the repo root at http://127.0.0.1:5190 . Your page: http://127.0.0.1:5190/mocks/homepage-four-proposals/<your-folder>/index.html
  If it's not responding, start it (async, don't block): `node C:\Users\pstic\.copilot\session-state\4cf1b692-6c73-492b-8c62-7e042de80c10\files\serve.mjs C:\Users\pstic\.copilot\repos\cookingbook 5190`
- Screenshots (desktop 1440x900 + full page, mobile 390x844 + full page, mobile with menu open; also prints console errors):
  `node C:\Users\pstic\.copilot\session-state\4cf1b692-6c73-492b-8c62-7e042de80c10\files\shot\shots.mjs <url> <absolute out dir>`
  Run it from the directory `C:\Users\pstic\.copilot\session-state\4cf1b692-6c73-492b-8c62-7e042de80c10\files\shot` (that's where playwright is installed). Save final screenshots into `<your-folder>/screens/`. You may write your own small playwright scripts in that same directory (copy the executablePath from shots.mjs) to test dark mode, EN, large text, filters, etc. Do not use the Playwright MCP browser tools (the browser is locked).
- Design quality reference (read before building): `C:\Users\pstic\AppData\Roaming\com.github.githubapp\app-skills\impeccable\reference\craft-floor.md`. Optional: `reference\typeset.md`, `reference\layout.md`, `reference\colorize.md` in the same folder.
- Mechanical design detector, run once when done: `node C:\Users\pstic\AppData\Roaming\com.github.githubapp\app-skills\impeccable\scripts\detect.mjs --json <your index.html>` — fix real findings.

## Verification (bounded)
Build fully → one batched screenshot round (desktop + mobile + menu, plus dark and large-text checks) → fix everything in one batch → at most one more confirmation round → stop.

## Also deliver `<your-folder>/meta.json`
```json
{
  "name": "Proposal name (2–3 words)",
  "tagline": "One sentence on the idea",
  "thesis": "2–3 sentences: what makes it modern/elegant/creative and why it fits this cookbook",
  "fonts": ["Display face — role", "Text face — role"],
  "palette": [{"name":"...","hex":"#......","role":"..."}],
  "highlights": ["3–5 short bullet points on key UX/visual decisions"],
  "tradeoffs": ["1–3 honest risks or costs to implement"]
}
```

## Final report (your reply)
≤ 200 words: folder path, the idea, fonts/colors, how each required element was handled, anything not done.
