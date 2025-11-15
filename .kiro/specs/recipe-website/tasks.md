# Implementation Plan

- [x] 1. Initialize project with Vite, React, TypeScript, and Tailwind CSS




  - Create new Vite project with React and TypeScript template
  - Install and configure Tailwind CSS with PostCSS and Autoprefixer
  - Set up project folder structure (components, pages, data, hooks, utils, types)
  - Configure TypeScript with strict mode and path aliases
  - Create base Tailwind configuration with dark mode and custom colors
  - _Requirements: 11.1, 11.2_

- [x] 2. Define TypeScript interfaces and data models





  - Create type definitions for Recipe, Ingredient, Category, FilterKeyword, and Translations
  - Define user preference types (Language, TextSize, Theme)
  - Create utility types for multilingual content
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 6.2_

- [x] 3. Set up routing and basic app structure





  - Install and configure React Router v6
  - Create route definitions for all pages (Home, Recipe, Filter, About, Cooking Basics)
  - Implement App component with Router and Suspense for lazy loading
  - Create basic page components (HomePage, RecipePage, FilterPage, AboutPage, CookingBasicsPage)
  - _Requirements: 1.4, 9.1, 9.3_

- [ ] 4. Implement user preference management system
- [ ] 4.1 Create useLocalStorage custom hook
  - Write hook to read from and write to localStorage with TypeScript generics
  - Handle JSON serialization and deserialization
  - Provide default values for missing keys
  - _Requirements: 4.5, 5.4, 6.6_

- [ ] 4.2 Create preference context providers
  - Implement LanguageContext with useLanguage hook (default: Romanian)
  - Implement TextSizeContext with useTextSize hook (normal, large)
  - Implement ThemeContext with useTheme hook (dark, light)
  - Apply preferences to root HTML element via useEffect
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 4.3 Create translation utility function
  - Implement getTranslation function that accepts key and language
  - Load translations from JSON file
  - Provide fallback for missing translations
  - _Requirements: 4.3, 4.4_

- [ ] 5. Build Footer component with preference selectors
- [ ] 5.1 Create LanguageSelector component
  - Display Romanian and English options at bottom of page
  - Update language preference on selection
  - Highlight currently selected language
  - _Requirements: 4.2, 4.3, 4.4_

- [ ] 5.2 Create TextSizeSelector component
  - Display two text size options (normal, large) at bottom of page
  - Update text size preference on selection
  - Highlight currently selected size
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 5.3 Create ThemeSelector component
  - Display dark and light theme options at bottom of page
  - Update theme preference on selection
  - Highlight currently selected theme
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 5.4 Assemble Footer component
  - Combine all selector components in Footer layout
  - Position Footer at bottom of all pages
  - Style with Tailwind for responsive design
  - _Requirements: 2.7, 4.2, 5.1, 6.1_

- [ ] 6. Create sample recipe data structure
- [ ] 6.1 Create 5 sample recipe JSON files
  - Write JSON files with complete recipe data (title, category, prepTime, servings, effortLevel, ingredients, instructions, keywords)
  - Include both Romanian and English translations
  - Use placeholder image URLs
  - _Requirements: 1.1, 1.3, 2.1, 2.2, 2.3, 2.4, 2.5, 6.2_

- [ ] 6.2 Create categories and filter keywords JSON files
  - Define all recipe categories with Romanian and English names
  - Define filter keywords organized by type (meat, vegetable, sauce, cooking)
  - _Requirements: 1.3, 6.2, 6.3_

- [ ] 6.3 Create translations JSON file
  - Define all UI text strings in Romanian and English
  - Include labels for buttons, headings, and messages
  - _Requirements: 4.3, 4.4_

- [ ] 7. Implement recipe data loading and management
  - Create useRecipeData hook to load all recipe JSON files
  - Implement recipe lookup by ID function
  - Create utility to get recipes by category
  - Create utility to get recipes by filter keywords
  - _Requirements: 1.1, 1.2, 6.4, 6.5_

- [ ] 8. Build RecipePage component and related components
- [ ] 8.1 Create RecipeHeader component
  - Display recipe title and category badge at top
  - Display preparation time, servings, and effort level in a row
  - Style with Tailwind for clean, minimal design
  - Support both Romanian and English text
  - _Requirements: 1.4, 2.1, 2.2, 2.3_

- [ ] 8.2 Create RecipeImage component
  - Display 1200x1200 recipe image
  - Implement lazy loading
  - Handle image load errors with placeholder
  - Make responsive for mobile and desktop
  - _Requirements: 2.6_

- [ ] 8.3 Create IngredientScaler component
  - Display current multiplier (0.5x to 3x in 0.5x increments)
  - Implement increment and decrement buttons
  - Clamp values between 0.5x and 3x
  - Call onMultiplierChange callback when value changes
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 8.4 Create IngredientList component
  - Display list of ingredients with quantities and units
  - Integrate IngredientScaler component
  - Calculate and display scaled quantities based on multiplier
  - Support both Romanian and English ingredient names and units
  - _Requirements: 2.4, 3.1, 3.2, 3.3_

- [ ] 8.5 Create InstructionList component
  - Display numbered list of cooking instructions
  - Support both Romanian and English instructions
  - Style for readability with appropriate spacing
  - _Requirements: 2.5_

- [ ] 8.6 Assemble RecipePage component
  - Combine all recipe sub-components in correct order
  - Load recipe data by ID from URL parameter
  - Handle missing or invalid recipe IDs with error message and redirect
  - Ensure minimal distractions with clean layout
  - Position Footer at bottom
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

- [ ] 9. Build HomePage with recipe grid
- [ ] 9.1 Create RecipeCard component
  - Display recipe thumbnail image
  - Display recipe title and category
  - Display prep time, servings, and effort level
  - Link to recipe detail page
  - Style with Tailwind for responsive grid layout
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 9.2 Create RecipeGrid component
  - Display grid of RecipeCard components
  - Implement responsive grid (1 column mobile, 2-3 columns tablet, 3-4 columns desktop)
  - Accept filtered recipe list as prop
  - _Requirements: 1.1, 1.2_

- [ ] 9.3 Implement HomePage component
  - Display all 55 recipes (50 regular + 5 cooking basics) in RecipeGrid
  - Add Header with navigation links
  - Add Footer with preference selectors
  - _Requirements: 1.1, 1.2_

- [ ] 10. Build FilterPage with keyword filtering
- [ ] 10.1 Create FilterControls component
  - Display filter keyword options grouped by type (meat, vegetable, sauce, cooking)
  - Allow multiple keyword selection with checkboxes or toggle buttons
  - Track selected keywords in component state
  - Call onFilterChange callback when selections change
  - Style with Tailwind for responsive layout
  - _Requirements: 6.1, 6.2, 6.3_

- [ ] 10.2 Implement FilterPage component
  - Integrate FilterControls component
  - Implement filtering logic: show only recipes containing ALL selected keywords
  - Display filtered recipes in RecipeGrid component
  - Show all recipes when no keywords selected
  - Update recipe list in real-time as keywords change
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [ ] 11. Create AboutPage component
  - Write content about the recipe website
  - Support both Romanian and English text
  - Style with Tailwind for clean, readable layout
  - Add Footer with preference selectors
  - _Requirements: 9.1, 9.2_

- [ ] 12. Create CookingBasicsPage component
  - Write content about reading recipes thoroughly before cooking
  - Write content about preparing all ingredients before cooking (mise en place)
  - Write content about pantry staples to stock at home
  - Support both Romanian and English text
  - Style with Tailwind for clean, readable layout
  - Add Footer with preference selectors
  - _Requirements: 9.3, 9.4, 9.5, 9.6_

- [ ] 13. Implement responsive design for mobile and desktop
  - Apply Tailwind responsive classes throughout all components
  - Test layouts at mobile (320px-767px), tablet (768px-1023px), and desktop (1024px+) breakpoints
  - Ensure touch-friendly button sizes on mobile (minimum 44x44px)
  - Verify all interactive elements work on touch screens
  - Test navigation and Footer on all screen sizes
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 14. Set up Azure Application Insights for analytics
  - Install @microsoft/applicationinsights-web package
  - Create analytics utility module with initialization code
  - Implement trackPageView function
  - Add page view tracking to all route components
  - Create custom event tracking for recipe views, filter usage, language changes, and theme changes
  - Configure to fail silently on errors
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ] 15. Add remaining 50 recipe JSON files
  - Create 45 additional regular recipe JSON files (total 50 regular recipes)
  - Create 5 cooking basics recipe JSON files (boiling rice, mashed potatoes, polenta, cutting onions, plus one more)
  - Ensure all recipes have complete data with Romanian and English translations
  - Assign appropriate categories and filter keywords to each recipe
  - Use placeholder image URLs (to be replaced with actual images later)
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 16. Prepare for Azure Static Web Apps deployment
  - Create staticwebapp.config.json with route configuration and navigation fallback
  - Create .env.example file with VITE_APPINSIGHTS_CONNECTION_STRING placeholder
  - Update vite.config.ts with build optimizations
  - Create README.md with setup and deployment instructions
  - Test production build locally with `npm run build` and `npm run preview`
  - _Requirements: 11.1, 11.2, 11.3_

- [ ] 17. Create Azure Blob Storage structure for recipe images
  - Document the required folder structure (recipe-images/)
  - Document image specifications (1200x1200px, WebP format with JPEG fallback)
  - Create placeholder.webp for missing images
  - Update recipe JSON files with Azure Blob Storage URLs once container is created
  - _Requirements: 2.6_

- [ ]* 18. Write unit tests for core functionality
  - Test IngredientScaler: verify scaling calculations (0.5x, 1x, 1.5x, 2x, etc.)
  - Test filtering logic: verify recipes filtered correctly with multiple keywords
  - Test useLocalStorage hook: verify read/write to localStorage
  - Test translation utility: verify correct translations returned
  - _Requirements: 3.2, 6.4_

- [ ]* 19. Write integration tests for user workflows
  - Test language switching: change language and verify all text updates
  - Test theme switching: toggle theme and verify CSS classes applied
  - Test text size adjustment: change size and verify HTML attribute updated
  - Test ingredient scaling: adjust scaler and verify quantities update
  - Test filtering: select keywords and verify recipe list updates
  - _Requirements: 4.3, 4.4, 5.3, 6.4, 6.5, 3.3, 6.6_
