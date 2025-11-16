# Design Document

## Overview

The Recipe Website is a static, client-side web application that provides access to 55 recipes with multilingual support (Romanian/English), theme switching (dark/light), text size adjustment, ingredient scaling, and filtering capabilities. The application can be hosted on any static hosting platform (GitHub Pages, Netlify, Vercel, etc.) and uses Google Analytics 4 for analytics tracking.

### Key Design Principles

- **Static-first architecture**: All recipe data is embedded in the application at build time, eliminating the need for a backend API
- **Client-side rendering**: All functionality runs in the browser using vanilla JavaScript or a lightweight framework
- **Responsive design**: Mobile-first approach ensuring optimal experience across all devices
- **Minimal distractions**: Clean, focused UI with controls positioned at the bottom of pages
- **Performance**: Fast load times with optimized images and minimal dependencies

## Architecture

### High-Level Architecture

```mermaid
graph TB
    User[User Browser]
    StaticHost[Static Hosting Platform]
    GA4[Google Analytics 4]
    CDN[Image CDN/Storage]
    
    User -->|HTTPS| StaticHost
    StaticHost -->|Serves| HTML[HTML/CSS/JS]
    StaticHost -->|Serves| Images[Recipe Images]
    User -->|Analytics Events| GA4
    CDN -->|Hosts| Images
```

### Technology Stack

**Development Environment:**
- **Runtime**: Node.js 18+ (development tooling only, not used in production)
- **Package Manager**: npm or yarn

**Frontend Stack:**
- **Language**: TypeScript 5+ (type safety for recipe data structures and components)
- **Framework**: React 18+ (component reusability, hooks, and state management)
- **Build Tool**: Vite 5+ (fast builds, HMR, optimized production bundles)
- **Styling**: Tailwind CSS 3+ (utility-first CSS with built-in responsive and dark mode)
- **Routing**: React Router 6+ (client-side routing)

**Hosting Options:**
- **GitHub Pages**: Free static hosting with custom domains
- **Netlify**: Free tier with automatic deployments
- **Vercel**: Free tier with edge network
- **Cloudflare Pages**: Free tier with global CDN
- Any static hosting platform

**Analytics:**
- **Google Analytics 4**: Free web analytics with event tracking

**Image Storage:**
- **GitHub Repository**: Images stored in repo (simple, version controlled)
- **CDN Options**: Cloudinary, imgix, or any CDN service (optional optimization)

**Key Dependencies:**
- `react` & `react-dom`: UI framework
- `react-router-dom`: Client-side routing
- `react-ga4`: Google Analytics 4 integration
- `tailwindcss`: Utility-first CSS framework
- `typescript`: Type checking and compilation
- `vite`: Build tool and dev server

**Development Dependencies:**
- `vitest`: Unit testing (Vite-native test runner)
- `@testing-library/react`: Component testing utilities
- `@types/*`: TypeScript type definitions

**Production Output:**
- Static HTML, CSS, and JavaScript files
- No Node.js runtime required in production
- Can be deployed to any static hosting platform

### Data Architecture

All recipe data will be stored as JSON files in the project structure:

```
/src
  /data
    /recipes
      recipe-001.json
      recipe-002.json
      ...
    /cooking-basics
      boiling-rice.json
      mashed-potatoes.json
      ...
    categories.json
    filter-keywords.json
    translations.json
```

## Components and Interfaces

### Component Hierarchy

```
App
├── Header
│   └── Navigation
├── Router
│   ├── HomePage
│   │   ├── FilterMenu (side panel)
│   │   │   └── FilterControls
│   │   └── RecipeGrid
│   │       └── RecipeCard
│   ├── RecipePage
│   │   ├── RecipeHeader (prep time, servings, effort)
│   │   ├── RecipeImage
│   │   ├── IngredientList
│   │   │   └── IngredientScaler
│   │   └── InstructionList
│   ├── AboutPage
│   └── CookingBasicsPage
└── Footer
    ├── LanguageSelector
    ├── TextSizeSelector
    └── ThemeSelector
```

### Core Components

#### 1. RecipePage Component

Displays a single recipe with all details.

**Props:**
- `recipeId: string` - Unique identifier for the recipe

**State:**
- `servingMultiplier: number` - Current scaling factor for ingredients (default: 1)

**Layout:**
```
┌─────────────────────────────────┐
│ Recipe Title                     │
│ Category Badge                   │
├─────────────────────────────────┤
│ ⏱️ Prep Time | 🍽️ Servings | 💪 Effort │
├─────────────────────────────────┤
│                                  │
│     [Recipe Image 1200x1200]    │
│                                  │
├─────────────────────────────────┤
│ Ingredients                      │
│ [Scaler: - 1x +]                │
│ • Ingredient 1 (scaled qty)     │
│ • Ingredient 2 (scaled qty)     │
├─────────────────────────────────┤
│ Instructions                     │
│ 1. Step one...                  │
│ 2. Step two...                  │
├─────────────────────────────────┤
│ [Footer with selectors]         │
└─────────────────────────────────┘
```

#### 2. IngredientScaler Component

Allows users to adjust ingredient quantities.

**Props:**
- `currentMultiplier: number`
- `onMultiplierChange: (multiplier: number) => void`

**Behavior:**
- Provides buttons to increment/decrement by 0.5x
- Displays current multiplier (e.g., "0.5x", "1x", "1.5x", "2x", "2.5x", "3x")
- Minimum: 0.5x, Maximum: 3x
- Increment step: 0.5x

#### 3. FilterMenu Component

A side panel that slides in from the left or right to display filtering options.

**Props:**
- `isOpen: boolean` - Controls visibility of the side panel
- `onClose: () => void` - Callback when menu should close
- `selectedKeywords: Set<string>` - Currently selected filter keywords
- `onKeywordsChange: (keywords: Set<string>) => void` - Callback when keywords change

**Filter Categories:**
- Meat Type (e.g., chicken, beef, pork, fish, vegetarian)
- Vegetables (e.g., tomatoes, onions, peppers, potatoes)
- Sauce (e.g., tomato-based, cream-based, oil-based)
- Cooking Type (e.g., baking, frying, boiling, grilling)

**Behavior:**
- Slides in from the side when opened
- Displays filter keyword checkboxes grouped by category
- Updates parent component state when keywords are selected/deselected
- Can be closed by clicking outside, pressing Escape, or clicking a close button
- Maintains selected filters when closed

**Layout:**
```
┌─────────────────────────────────┐
│ [X] Filters                      │
├─────────────────────────────────┤
│ Meat Type                        │
│ ☐ Chicken                       │
│ ☐ Beef                          │
│ ☐ Pork                          │
│                                  │
│ Vegetables                       │
│ ☐ Tomatoes                      │
│ ☐ Onions                        │
│                                  │
│ [Clear All Filters]             │
└─────────────────────────────────┘
```

#### 4. HomePage Component

Displays all recipes with integrated filtering.

**State:**
- `selectedKeywords: Set<string>` - Currently selected filter keywords
- `isFilterMenuOpen: boolean` - Controls FilterMenu visibility

**Filtering Logic:**
```typescript
const filteredRecipes = recipes.filter((recipe: Recipe) => {
  if (selectedKeywords.size === 0) return true;
  return [...selectedKeywords].every(keyword => 
    recipe.keywords.includes(keyword)
  );
});
```

**Layout:**
```
┌─────────────────────────────────┐
│ Header with Navigation           │
├─────────────────────────────────┤
│ [🔍 Filter] All Recipes (X)     │
├─────────────────────────────────┤
│ [Recipe Grid]                    │
│                                  │
└─────────────────────────────────┘

When filter menu is open:
┌──────────┬──────────────────────┐
│ Filter   │ Header               │
│ Menu     ├──────────────────────┤
│          │ All Recipes (X)      │
│ [Filters]│ [Recipe Grid]        │
│          │                      │
└──────────┴──────────────────────┘
```

#### 5. Footer Component

Contains all user preference controls.

**Layout:**
```
┌─────────────────────────────────┐
│ 🌐 RO | EN                      │
│ 📏 A | A                        │
│ 🌙 Dark | Light                 │
└─────────────────────────────────┘
```

**Persistence:**
All preferences stored in `localStorage`:
- `userLanguage`: "ro" | "en"
- `userTextSize`: "normal" | "large"
- `userTheme`: "dark" | "light"

### Navigation Structure

```
Home (/)
├── Recipe Detail (/recipe/:id)
├── About (/about)
└── Cooking Basics (/cooking-basics)
```

Note: Filtering is now integrated into the HomePage via a side menu, not a separate route.

## Data Models

### Recipe Model

```typescript
interface Recipe {
  id: string;
  category: string;
  title: {
    ro: string;
    en: string;
  };
  prepTime: number; // minutes
  servings: number;
  effortLevel: "easy" | "medium" | "hard";
  image: string; // URL to 1200x1200 image
  ingredients: Ingredient[];
  instructions: {
    ro: string[];
    en: string[];
  };
  keywords: string[]; // Filter keywords
}

interface Ingredient {
  name: {
    ro: string;
    en: string;
  };
  quantity: number;
  unit: {
    ro: string;
    en: string;
  };
}
```

### Category Model

```typescript
interface Category {
  id: string;
  name: {
    ro: string;
    en: string;
  };
}
```

### Filter Keyword Model

```typescript
interface FilterKeyword {
  id: string;
  type: "meat" | "vegetable" | "sauce" | "cooking";
  label: {
    ro: string;
    en: string;
  };
}
```

### Translation Model

```typescript
interface Translations {
  ro: {
    [key: string]: string;
  };
  en: {
    [key: string]: string;
  };
}
```

## Styling and Theming

### Tailwind Configuration

**File**: `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#ffffff',
          dark: '#1a1a1a',
        },
        secondary: {
          light: '#f5f5f5',
          dark: '#2d2d2d',
        },
        accent: {
          light: '#e74c3c',
          dark: '#ff6b6b',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
```

### Theme Implementation

Apply theme class to root element:

```typescript
// Light theme (default)
<html lang="ro">

// Dark theme
<html lang="ro" class="dark">
```

### Text Size Implementation

Apply text size class to root element:

```typescript
// Normal text (default)
<html lang="ro" class="text-base">

// Large text
<html lang="ro" class="text-lg">
```

### Responsive Design with Tailwind

Tailwind's built-in breakpoints:
- `sm`: 640px (mobile landscape)
- `md`: 768px (tablet)
- `lg`: 1024px (desktop)
- `xl`: 1280px (large desktop)

Example usage:
```jsx
<div className="p-4 md:p-8 lg:max-w-4xl lg:mx-auto">
  {/* Mobile: 1rem padding, Desktop: 2rem padding, centered with max-width */}
</div>
```

## Error Handling

### Client-Side Error Scenarios

1. **Missing Recipe Data**
   - Display: "Recipe not found" message
   - Action: Redirect to home page after 3 seconds

2. **Invalid Recipe ID**
   - Display: "Invalid recipe" message
   - Action: Redirect to home page

3. **Image Load Failure**
   - Display: Placeholder image with recipe icon
   - Log error to console

4. **Analytics Failure**
   - Fail silently (don't block user experience)
   - Log error to console

### User Input Validation

1. **Ingredient Scaler**
   - Clamp values between 0.5x and 3x
   - Increment/decrement in steps of 0.5x
   - Round to nearest 0.5x

2. **Filter Selection**
   - No validation needed (predefined options)

## Testing Strategy

### Unit Testing

**Framework**: Vitest (Vite's native test runner) + React Testing Library

**Test Coverage:**

1. **Component Tests**
   - RecipePage: Renders all recipe data correctly
   - IngredientScaler: Calculates scaled quantities correctly
   - FilterPage: Filters recipes based on selected keywords
   - Footer: Persists preferences to localStorage

2. **Utility Function Tests**
   - `scaleIngredient(ingredient, multiplier)`: Returns correct scaled values
   - `filterRecipes(recipes, keywords)`: Returns correct filtered results
   - `getTranslation(key, language)`: Returns correct translation

3. **Hook Tests**
   - `useLocalStorage`: Reads and writes to localStorage correctly
   - `useRecipeData`: Loads recipe data correctly

### Integration Testing

**Test Scenarios:**

1. **Language Switching**
   - Change language → All text updates
   - Navigate to different page → Language persists

2. **Theme Switching**
   - Toggle theme → CSS variables update
   - Refresh page → Theme persists

3. **Ingredient Scaling**
   - Adjust scaler → All ingredient quantities update
   - Navigate away and back → Scaler resets to 1x

4. **Filtering**
   - Select keywords → Recipe list updates
   - Clear all keywords → All recipes shown

### Manual Testing Checklist

- [ ] Test on Chrome (desktop and mobile)
- [ ] Test on Firefox (desktop and mobile)
- [ ] Test on Safari (desktop and mobile)
- [ ] Test on Edge (desktop)
- [ ] Verify all 55 recipes display correctly
- [ ] Verify all images load (1200x1200)
- [ ] Test responsive layouts at various screen sizes
- [ ] Verify analytics events fire correctly
- [ ] Test all filter combinations
- [ ] Verify Romanian translations are accurate
- [ ] Verify English translations are accurate

## Deployment Architecture

### Static Hosting Configuration

For platforms that support configuration files (like Netlify, Vercel), create appropriate config:

**Netlify** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Vercel** (`vercel.json`):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**GitHub Pages**: No configuration needed, just deploy the `dist` folder.

### Google Analytics 4 Integration

**Installation:**
```bash
npm install react-ga4
```

**Configuration:**

```typescript
// src/utils/analytics.ts
import ReactGA from 'react-ga4';

// Initialize GA4
export const initGA = (): void => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (measurementId) {
    ReactGA.initialize(measurementId);
  }
};

// Track page views
export const trackPageView = (path: string): void => {
  ReactGA.send({ hitType: 'pageview', page: path });
};

// Track custom events
export const trackEvent = (category: string, action: string, label?: string): void => {
  ReactGA.event({
    category,
    action,
    label,
  });
};
```

**Usage in App:**
```typescript
// In App.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initGA, trackPageView } from './utils/analytics';

function App() {
  const location = useLocation();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  // ... rest of app
}
```

**Tracked Events:**
- Page views (automatic on route change)
- Recipe views (custom event)
- Filter usage (custom event)
- Language changes (custom event)
- Theme changes (custom event)

**Environment Variable:**
Create `.env` file:
```
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Image Storage Options

**Option 1: GitHub Repository (Simplest)**
```
/public
  /images
    /recipes
      recipe-001.webp
      recipe-002.webp
      ...
      placeholder.webp
```
- Images served directly from your repo
- No external dependencies
- Version controlled with code

**Option 2: CDN Service (Optimized)**
- Cloudinary (free tier available)
- imgix (free tier available)
- Any CDN service

**Image Specifications:**
- Format: WebP (with JPEG fallback)
- Dimensions: 1200x1200px
- Optimized for web delivery

### Build and Deployment Pipeline

**GitHub Actions for GitHub Pages:**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
        env:
          VITE_GA_MEASUREMENT_ID: ${{ secrets.GA_MEASUREMENT_ID }}
      - uses: actions/upload-pages-artifact@v2
        with:
          path: ./dist
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v2
        id: deployment
```

**Netlify/Vercel**: Connect your GitHub repo and they auto-deploy on push.

## Performance Considerations

### Image Optimization

- Use WebP format with JPEG fallback
- Implement lazy loading for recipe images
- Serve images from Azure CDN
- Generate responsive image sizes (600px, 1200px)

### Code Splitting

```typescript
import { lazy } from 'react';

// Lazy load pages
const RecipePage = lazy(() => import('./pages/RecipePage'));
const FilterPage = lazy(() => import('./pages/FilterPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const CookingBasicsPage = lazy(() => import('./pages/CookingBasicsPage'));
```

### Bundle Size Optimization

- Tree-shake unused code
- Minimize dependencies
- Use production builds
- Enable gzip/brotli compression (automatic on most platforms)

### Caching Strategy

```
Cache-Control headers:
- HTML: no-cache
- CSS/JS: max-age=31536000 (1 year, with hash in filename)
- Images: max-age=31536000 (1 year)
- JSON data: max-age=3600 (1 hour)
```

## Accessibility

### WCAG 2.1 AA Compliance

1. **Color Contrast**
   - Ensure 4.5:1 contrast ratio for normal text
   - Ensure 3:1 contrast ratio for large text

2. **Keyboard Navigation**
   - All interactive elements accessible via Tab
   - Focus indicators visible
   - Skip to main content link

3. **Screen Reader Support**
   - Semantic HTML elements
   - ARIA labels where needed
   - Alt text for all images

4. **Text Scaling**
   - Support browser zoom up to 200%
   - Text size adjuster provides additional control

### Semantic HTML Structure

```html
<main>
  <article>
    <header>
      <h1>Recipe Title</h1>
      <div role="contentinfo">Prep time, servings, effort</div>
    </header>
    <img alt="Description of recipe dish" />
    <section aria-label="Ingredients">
      <h2>Ingredients</h2>
      <ul>...</ul>
    </section>
    <section aria-label="Instructions">
      <h2>Instructions</h2>
      <ol>...</ol>
    </section>
  </article>
</main>
<footer>
  <nav aria-label="User preferences">...</nav>
</footer>
```

## Security Considerations

### Content Security Policy

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               img-src 'self' https://*.googletagmanager.com; 
               script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com;
               connect-src 'self' https://www.google-analytics.com https://analytics.google.com;
               style-src 'self' 'unsafe-inline';">
```

### Data Privacy

- No user authentication required
- No personal data collected
- Analytics data anonymized
- Preferences stored locally only

## Future Enhancements (Out of Scope)

- PDF export functionality
- User recipe submissions
- Recipe ratings and reviews
- Shopping list generation
- Meal planning features
- Recipe search functionality
- Social sharing
