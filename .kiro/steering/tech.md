# Tech Stack

## Core Technologies

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS with dark mode support
- **Testing**: Vitest with React Testing Library
- **Validation**: AJV for JSON schema validation
- **Analytics**: Microsoft Application Insights

## TypeScript Configuration

- Strict mode enabled
- Path aliases configured (`@/`, `@/components/`, `@/pages/`, etc.)
- Target: ES2020
- Module resolution: bundler mode

## Common Commands

```bash
# Development
npm run dev                    # Start dev server

# Build
npm run build                  # TypeScript compile + Vite build

# Testing
npm run test                   # Run tests once (no watch mode)

# Validation
npm run validate-recipes       # Validate all recipe JSON files

# Preview
npm run preview                # Preview production build
```

## Build Configuration

- Base path: `/cookingbook/`
- Output directory: `dist/`
- Code splitting: React vendor chunk separated
- Minification: esbuild
- Source maps: disabled in production

## Deployment

Deployed to Azure Static Web Apps. See `DEPLOYMENT.md` for details.
