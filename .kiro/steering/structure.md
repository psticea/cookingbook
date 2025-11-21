# Project Structure

## Directory Organization

```
src/
├── components/       # React components (presentational)
├── pages/           # Page-level components (HomePage, RecipePage, etc.)
├── hooks/           # Custom React hooks (useLanguage, useTheme, etc.)
├── data/            # Static data and recipes
│   └── recipes/     # Recipe JSON files organized by category
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── schemas/         # JSON schemas for validation
└── test/            # Test files

public/
└── images/
    └── recipes/     # Recipe images organized by category
```

## Key Conventions

### Components

- Use functional components with TypeScript
- Export named components (e.g., `export const RecipeCard: React.FC<Props>`)
- Components are barrel-exported through `index.ts` files
- Props interfaces defined inline or at top of file
- Use lazy loading for page components

### Data Management

- **Recipe files**: JSON files in `src/data/recipes/{category}/{recipe-id}.json`
- **Automatic discovery**: All `.json` files in category folders are auto-loaded
- **No manual imports**: Adding a recipe requires only creating the JSON file
- **Filename = Recipe ID**: The filename (without `.json`) becomes the recipe ID
- **Folder = Category**: The folder name sets the recipe category

### Recipe Data Structure

- All text fields use `MultilingualText` type with `ro` and `en` keys
- Ingredients can include section headers (for grouping)
- Images follow pattern: `/images/recipes/{category}/{id}.jpg`
- Date format: ISO 8601 (YYYY-MM-DD)
- Effort levels: `"easy"`, `"medium"`, `"hard"`

### Styling

- Tailwind CSS utility classes
- Dark mode: `dark:` prefix for dark theme styles
- Responsive: mobile-first approach with `sm:`, `md:`, `lg:` breakpoints
- Custom colors defined in `tailwind.config.ts` (primary, secondary, accent)

### State Management

- Context providers for global state (Language, Theme, TextSize)
- Custom hooks wrap context consumers
- localStorage for persistence
- No external state management library

### Routing

- Base path: `/cookingbook/`
- Routes: `/`, `/recipe/:id`, `/about`, `/cooking-basics`
- Lazy-loaded pages with Suspense fallback

### Validation

- JSON Schema: `src/schemas/recipe.schema.json`
- Validation script: `scripts/validate-recipes.js`
- Run before committing recipe changes

## File Naming

- Components: PascalCase (e.g., `RecipeCard.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useLanguage.tsx`)
- Types: camelCase (e.g., `recipe.ts`)
- Data files: kebab-case (e.g., `tomato-marinara-pasta.json`)
- Barrel exports: `index.ts`
