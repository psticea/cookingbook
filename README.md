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

