# cookingbook

A bilingual recipe website featuring personal cooking recipes with responsive design and user customization options.

## Overview

This is a React-based recipe website built with TypeScript and Vite, offering a clean interface for browsing and managing personal recipes. The site supports both Romanian (default) and English, with recipes organized into categories like breakfast, pasta, stir-fries, soups-and-stews, main-courses, and more.

## Key Features

- **Bilingual Support**: Toggle between Romanian and English with persistent language preference
- **Recipe Organization**: 8 categories (breakfast, pasta, stir-fries, soups-and-stews, main-courses, burgers-and-wraps, salads-and-bites, basics)
- **Smart Filtering**: Keyword-based filtering system to find recipes by ingredients, cooking methods, or dietary preferences
- **User Preferences**: Adjustable text size (3 levels), dark/light theme, all settings persist in localStorage
- **Recipe Scaling**: Dynamically adjust ingredient quantities based on desired servings
- **Cooking Checklist**: Read quantities and ingredient names together in a roomy, full-row checklist. Checks and the expanded cost breakdown stay intact while changing tabs, servings, language, or text size; use the reset action to clear checks. Progress is local to the open recipe and resets on navigation to another recipe or a reload.
- **Ingredient Cost Breakdown**: Expand the receipt below the checklist for costs at the selected serving count, a total, and a per-serving estimate. Unsupported units, missing prices, and invalid rates are marked unavailable rather than assigned a placeholder price. Incomplete estimates show a known subtotal and excluded ingredient count. Homepage cards keep a compact money-symbol-and-number pill showing the known cost per serving; partial-estimate details remain in its tooltip and accessible label, and unavailable costs show a dash. Price sorting puts complete estimates first. Amounts represent ingredients used, not full shopping packages. Calculations use the English source unit in both display languages and retain the site's approximate spoon conversions; ingredient-specific density conversions are not inferred.
- **Personal Notes**: Add and save custom notes to any recipe for your own modifications
- **Responsive Design**: Mobile-first approach optimized for all devices
- **Cooking Basics**: Dedicated page with fundamental cooking techniques and tips
- **Recipe Images**: All recipes include 1200x800px images
- **About Page**: Dedicated page with information about the site and Giscus-powered comments
- **Hosted on GitHub Pages**

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS with custom theme
- **Routing**: React Router v6
- **Testing**: Vitest + React Testing Library
- **Validation**: AJV for JSON schema validation
- **Analytics**: Microsoft Application Insights

## Project Structure

Recipes are stored as JSON files in `src/data/recipes/{category}/` with automatic discovery. Adding a new recipe only requires creating a JSON file in the appropriate category folder - no manual imports needed.

## Homepage Design Proposals

The [comparison gallery](mocks/homepage-proposals/index.html) preserves three standalone homepage mockups for future reference: **Counterspace**, **The Kitchen Index**, and **Open Index**. No proposal has been selected or integrated into the application.

Open the gallery HTML directly in a browser, or visit `http://127.0.0.1:5173/cookingbook/mocks/homepage-proposals/index.html` while the development server is running. Each proposal includes desktop/mobile screenshots, interactive browsing controls, and a snapshot of the 33-recipe catalogue with local photos. Recipe and reference links target the existing app on port 5173.

These files are reference artifacts under `mocks/`; they are not included in the production Vite build. The earlier [website review](reviews/2026-09-20/index.html) is also retained.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Validate recipe JSON files
npm run validate-recipes

# Build for production
npm run build
```
