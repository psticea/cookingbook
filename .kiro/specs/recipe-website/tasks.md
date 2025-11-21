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
  - Create route definitions for all pages (Home, Recipe, About, Cooking Basics)
  - Implement App component with Router and Suspense for lazy loading
  - Create basic page components (HomePage, RecipePage, AboutPage, CookingBasicsPage)
  - Create Header component with Home link, Search bar placeholder, and Menu button
  - _Requirements: 1.4, 7.1, 7.2, 7.3, 7.4, 9.1, 9.3_

- [x] 4. Implement user preference management system





- [x] 4.1 Create useLocalStorage custom hook


  - Write hook to read from and write to localStorage with TypeScript generics
  - Handle JSON serialization and deserialization
  - Provide default values for missing keys
  - _Requirements: 4.5, 5.4, 6.6_

- [x] 4.2 Create preference context providers


  - Implement LanguageContext with useLanguage hook (default: Romanian)
  - Implement TextSizeContext with useTextSize hook (normal, large)
  - Implement ThemeContext with useTheme hook (dark, light)
  - Apply preferences to root HTML element via useEffect
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 4.3 Create translation utility function


  - Implement getTranslation function that accepts key and language
  - Load translations from JSON file
  - Provide fallback for missing translations
  - _Requirements: 4.3, 4.4_

- [x] 5. Build Footer component with preference selectors




- [x] 5.1 Create LanguageSelector component


  - Display Romanian and English options at bottom of page
  - Update language preference on selection
  - Highlight currently selected language
  - _Requirements: 4.2, 4.3, 4.4_

- [x] 5.2 Create TextSizeSelector component


  - Display two text size options (normal, large) at bottom of page
  - Update text size preference on selection
  - Highlight currently selected size
  - _Requirements: 5.1, 5.2, 5.3_

- [x] 5.3 Create ThemeSelector component


  - Display dark and light theme options at bottom of page
  - Update theme preference on selection
  - Highlight currently selected theme
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_


- [x] 5.4 Assemble Footer component

  - Combine all selector components in Footer layout
  - Position Footer at bottom of all pages
  - Style with Tailwind for responsive design
  - _Requirements: 2.7, 4.2, 5.1, 6.1_

- [x] 6. Create recipe data structure with 8 category folders

- [x] 6.1 Create 8 category folders and sample recipes


  - Create folder structure: /src/data/recipes/ with 8 subfolders (breakfast, pasta, stir-fries, soups-and-stews, main-courses, burgers-and-wraps, salads-and-bites, basics)
  - Create 1-2 sample recipe JSON files in each category folder for testing
  - Write JSON files with complete recipe data (title, prepTime, servings, effortLevel, ingredients, instructions, personalNotes, keywords, dateAdded)
  - Include both Romanian and English translations
  - Use descriptive filenames (e.g., carbonara.json, chicken-soup.json)
  - Use placeholder image paths
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 6.2 Create categories and filter keywords JSON files

  - Define all 8 recipe categories with folder names, Romanian and English names
  - Categories: breakfast, pasta, stir-fries, soups-and-stews, main-courses, burgers-and-wraps, salads-and-bites, basics
  - Define filter keywords organized by type (difficulty, meat, cook, ingredient)
  - _Requirements: 1.1, 1.2, 1.3, 7.9_

- [x] 6.3 Create translations JSON file

  - Define all UI text strings in Romanian and English
  - Include labels for buttons, headings, and messages
  - Include category names for all 8 categories
  - _Requirements: 4.3, 4.4_

- [x] 7. Implement recipe data loading and management



  - Create useRecipeData hook to dynamically load all recipe JSON files from all 8 category folders
  - Automatically assign category to each recipe based on its folder location
  - Generate recipe ID from filename (e.g., carbonara.json → id: carbonara)
  - Sort recipes by dateAdded field in ascending order (oldest first)
  - Implement recipe lookup by ID function
  - Create utility to get recipes by category
  - Create utility to get recipes by filter keywords
  - _Requirements: 1.1, 1.2, 1.3, 1.5, 1.6, 7.4, 7.5_

- [x] 8. Build RecipePage component and related components





- [x] 8.1 Create RecipeHeader component


  - Display recipe title and category badge at top
  - Display preparation time, servings, and effort level in a row
  - Style with Tailwind for clean, minimal design
  - Support both Romanian and English text
  - _Requirements: 1.4, 2.1, 2.2, 2.3_

- [x] 8.2 Create RecipeImage component


  - Display 1200x1200 recipe image
  - Implement lazy loading
  - Handle image load errors with placeholder
  - Make responsive for mobile and desktop
  - _Requirements: 2.6_

- [x] 8.3 Create IngredientScaler component


  - Display current multiplier (0.5x to 3x in 0.5x increments)
  - Implement increment and decrement buttons
  - Clamp values between 0.5x and 3x
  - Call onMultiplierChange callback when value changes
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 8.4 Create IngredientList component


  - Display list of ingredients with quantities and units
  - Support both flat ingredient lists and grouped ingredient sections
  - When ingredients are grouped, display section headings (e.g., "Marinade", "Sauce", "Main Ingredients")
  - When ingredients are not grouped, display as a single list without headings
  - Integrate IngredientScaler component
  - Calculate and display scaled quantities based on multiplier for all ingredients regardless of grouping
  - Support both Romanian and English ingredient names, units, and section headings
  - _Requirements: 2.4, 2.5, 2.6, 3.1, 3.2, 3.3_

- [x] 8.4A Add checkbox functionality to IngredientList component





  - Add component state to track checked ingredients using Set<number> for ingredient indices
  - Render each ingredient as a clickable checkbox (section headings remain non-clickable)
  - Implement toggle functionality: clicking an ingredient toggles its checked state
  - Apply visual styling to checked ingredients (strikethrough with line-through and reduced opacity with opacity-50)
  - Use compact spacing to maintain clean, minimal layout
  - Maintain checked state while user remains on the page
  - State resets when component unmounts (user navigates away)
  - _Requirements: 3A.1, 3A.2, 3A.3, 3A.4, 3A.5, 3A.6_

- [ ]* 8.4B Write unit tests for ingredient checkboxes
  - **Property 1: Checkbox rendering for ingredients**
  - Test that checkboxes are rendered for each ingredient (excluding section headings)
  - **Validates: Requirements 3A.1**

- [ ]* 8.4C Write unit tests for checkbox toggle behavior
  - **Property 2: Checkbox toggle behavior**
  - Test that clicking an ingredient toggles its state from unchecked to checked and back
  - **Validates: Requirements 3A.2**

- [ ]* 8.4D Write unit tests for checked ingredient styling
  - **Property 3: Visual styling for checked ingredients**
  - Test that checked ingredients have appropriate CSS classes (line-through, opacity-50)
  - **Validates: Requirements 3A.3**

- [ ]* 8.4E Write unit tests for state persistence
  - **Property 4: State persistence within session**
  - Test that checked states are maintained while on the page
  - Test that checked states reset when component unmounts and remounts
  - **Validates: Requirements 3A.5**

- [x] 8.5 Create InstructionList component


  - Display numbered list of cooking instructions
  - Support both Romanian and English instructions
  - Style for readability with appropriate spacing
  - _Requirements: 2.5_

- [x] 8.6 Create PersonalNotes component


  - Display personal notes section after instructions
  - Support both Romanian and English text
  - Style with distinct visual separation from instructions
  - _Requirements: 2.6_

- [x] 8.7 Assemble RecipePage component


  - Combine all recipe sub-components in correct order (header, image, ingredients, instructions, personal notes)
  - Load recipe data by ID from URL parameter
  - Handle missing or invalid recipe IDs with error message and redirect
  - Ensure minimal distractions with clean layout
  - Position Footer at bottom
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9_

- [x] 9. Build HomePage with recipe grid




- [x] 9.1 Create RecipeCard component


  - Display recipe thumbnail image
  - Display recipe title and category
  - Display prep time, servings, and effort level
  - Link to recipe detail page
  - Style with Tailwind for responsive grid layout
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 9.2 Create RecipeGrid component


  - Display grid of RecipeCard components
  - Implement responsive grid (1 column mobile, 2-3 columns tablet, 3-4 columns desktop)
  - Accept filtered recipe list as prop
  - _Requirements: 1.1, 1.2_

- [x] 9.3 Implement HomePage component
  - Display all recipes from all 8 category folders in RecipeGrid
  - Add Header with navigation links
  - Add Footer with preference selectors
  - _Requirements: 1.1, 1.5_

- [x] 10. Implement search bar in Header






- [x] 10.1 Create SearchBar component


  - Create text input field with search icon
  - Accept searchQuery, onSearchChange, and language props
  - Display clear button (X symbol) when text is entered
  - Implement clear functionality to reset search text
  - Style with Tailwind for responsive layout in Header center position
  - Add appropriate placeholder text in Romanian and English
  - _Requirements: 7.3, 7A.1, 7A.6, 7A.7_

- [x] 10.2 Update Header component with SearchBar




  - Integrate SearchBar component in the center of Header
  - Only display SearchBar when on the homepage
  - Pass search state and handlers from HomePage to Header
  - Style Header with Home link on left, SearchBar in center, Menu button on right
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7A.1_

- [x] 10.3 Update HomePage component with search functionality




  - Add state for searchQuery
  - Pass search state and handlers to Header component
  - Implement search filtering logic: filter by title in selected language when 2+ characters typed
  - Combine search filtering with keyword filtering (both must match)
  - Update recipe list in real-time as user types
  - Display all recipes when search query is less than 2 characters
  - Update filtered recipe count to reflect both search and keyword filters
  - _Requirements: 7A.2, 7A.3, 7A.4, 7A.5, 7A.8_

- [x] 11. Implement side menu with filters, categories, and navigation





- [x] 11.1 Create SideMenu component


  - Create side panel that slides in from the right, occupying 1/3 of screen width
  - Implement four main sections: Filters, Categories, Cooking Basics, About
  - Add close button and implement close functionality (close button, click outside, Escape key)
  - Style with Tailwind for responsive layout with smooth slide animation
  - Accept isOpen, onClose, selectedKeywords, and onKeywordsChange props
  - _Requirements: 7.4, 7.5, 7.6, 7.16, 7.17_

- [x] 11.2 Create FiltersSection component (expandable)


  - Create expandable/collapsible Filters section within SideMenu
  - Display four filter subsections: Difficulty, Meat Type, Cook Type, Ingredient
  - Each subsection should be expandable/collapsible
  - Display filter keyword options grouped by type (difficulty, meat, cook, ingredient)
  - Allow multiple keyword selection with checkboxes
  - Add "Clear All Filters" button
  - Update parent component state when keywords are selected/deselected
  - _Requirements: 7.7, 7.8, 7.9, 7.10, 7.11, 7.12_

- [x] 11.3 Create CategoriesSection component (expandable)


  - Create expandable/collapsible Categories section within SideMenu
  - Display all 8 food categories as clickable links
  - Implement smooth scroll to category section on homepage when clicked
  - Each category section on homepage should have an ID for scrolling (e.g., #breakfast, #pasta)
  - Close side menu after category is clicked
  - _Requirements: 7.13, 7.14, 7.15_

- [x] 11.4 Add Cooking Basics and About links to SideMenu


  - Add Cooking Basics link that navigates to /cooking-basics page
  - Add About link that navigates to /about page
  - Close side menu after link is clicked
  - Style links consistently with other menu items
  - _Requirements: 7.16, 7.17_

- [x] 11.5 Update HomePage component with side menu integration


  - Add state for selectedKeywords and isSideMenuOpen
  - Integrate SideMenu component
  - Pass menu toggle handler to Header component for Menu button
  - Implement filtering logic: show only recipes containing ALL selected keywords
  - Display filtered recipe count
  - Update recipe list in real-time as keywords change
  - Show all recipes when no keywords selected
  - Maintain filter state when menu is closed
  - Ensure search and filter work together correctly
  - Organize recipe grid by categories with section IDs for scrolling
  - _Requirements: 7.5, 7.10, 7.11, 7.12, 7.15, 7.18, 7A.8_

- [x] 12. Create AboutPage component





  - Write content about the recipe website
  - Support both Romanian and English text
  - Style with Tailwind for clean, readable layout
  - Add Giscus comment section at the bottom (before Footer)
  - Configure Giscus with GitHub Discussions integration
  - Enable GitHub Discussions on repository
  - Install Giscus app on GitHub repo
  - Get Giscus configuration from https://giscus.app
  - Add Giscus script tag with proper data attributes
  - Configure theme to match site (light/dark auto-switching)
  - Add Footer with preference selectors
  - _Requirements: 9.1, 9.2, 9.3_

- [x] 13. Create CookingBasicsPage component





  - Write content about reading recipes thoroughly before cooking
  - Write content about preparing all ingredients before cooking (mise en place)
  - Write content about pantry staples to stock at home
  - Support both Romanian and English text
  - Style with Tailwind for clean, readable layout
  - Add Footer with preference selectors
  - _Requirements: 9.3, 9.4, 9.5, 9.6_

- [x] 14. Implement responsive design for mobile and desktop





  - Apply Tailwind responsive classes throughout all components
  - Test layouts at mobile (320px-767px), tablet (768px-1023px), and desktop (1024px+) breakpoints
  - Ensure touch-friendly button sizes on mobile (minimum 44x44px)
  - Verify all interactive elements work on touch screens
  - Test navigation and Footer on all screen sizes
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 15. Set up Cloudflare Web Analytics for privacy-friendly analytics
  - Sign up for free Cloudflare account and add site to Web Analytics
  - Get analytics token from Cloudflare dashboard
  - Add Cloudflare Web Analytics script tag to index.html before closing body tag
  - Add token to script's data-cf-beacon attribute
  - Create .env.example with VITE_CF_ANALYTICS_TOKEN placeholder for documentation
  - Verify analytics are working in Cloudflare dashboard
  - No npm packages or JavaScript code required - works automatically
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ] 16. Add recipes to category folders
  - Add recipe JSON files to each of the 8 category folders as needed
  - Distribute recipes across categories: breakfast, pasta, stir-fries, soups-and-stews, main-courses, burgers-and-wraps, salads-and-bites, basics
  - Use descriptive filenames (e.g., pancakes.json, beef-stew.json, caesar-salad.json)
  - Ensure all recipes have complete data with Romanian and English translations
  - Assign appropriate filter keywords to each recipe from the four types: difficulty, meat type, cook type, ingredient
  - Include dateAdded field with ISO 8601 date format (YYYY-MM-DD) for each recipe
  - Use placeholder image paths (to be replaced with actual images later)
  - No need for sequential numbering - just add files to appropriate folders
  - Optionally use ingredient subsections for recipes where logical grouping is beneficial (e.g., marinade, sauce, garnish)
  - _Requirements: 1.1, 1.2, 1.3, 1.5, 1.6, 7.9_

- [ ] 16A. Implement ingredient subsections support
- [ ] 16A.1 Update TypeScript interfaces for ingredient subsections
  - Update Recipe interface to support both flat ingredient lists and grouped sections
  - Add IngredientSection interface with sectionName and items properties
  - Ensure backward compatibility with existing flat ingredient lists
  - _Requirements: 2.5, 2.6_

- [ ] 16A.2 Update IngredientList component to support subsections
  - Add logic to detect whether ingredients are flat list or grouped sections
  - When grouped, render section headings with appropriate styling
  - When flat, render ingredients without section headings (existing behavior)
  - Ensure ingredient scaling works correctly for both flat and grouped structures
  - Apply consistent styling for section headings in both Romanian and English
  - _Requirements: 2.5, 2.6, 3.1, 3.2, 3.3_

- [ ]* 16A.3 Add unit tests for ingredient subsections
  - Test detection of flat vs grouped ingredient structures
  - Test rendering of section headings when ingredients are grouped
  - Test rendering without section headings when ingredients are flat
  - Test ingredient scaling with grouped sections
  - _Requirements: 2.5, 2.6, 3.2_

- [ ] 16B. Update difficulty display to use puzzle piece icons
- [ ] 16B.1 Update RecipeHeader component to display puzzle piece icons
  - Replace text-based effort level display with puzzle piece icons (🧩)
  - Display 1 icon for easy, 2 icons for medium, 3 icons for hard
  - Maintain responsive layout with prep time and servings
  - _Requirements: 2.3, 2.4, 2.5, 2.6_

- [ ] 16B.2 Update RecipeCard component to display puzzle piece icons
  - Replace text-based effort level display with puzzle piece icons (🧩)
  - Display 1 icon for easy, 2 icons for medium, 3 icons for hard
  - Ensure icons are visible and properly sized in card layout
  - _Requirements: 2.7_

- [ ] 17. Prepare for static hosting deployment
  - Create deployment configuration files (netlify.toml, vercel.json) for various platforms
  - Create GitHub Actions workflow for GitHub Pages deployment
  - Update .env.example file with VITE_GA_MEASUREMENT_ID
  - Update vite.config.ts with build optimizations and base path configuration
  - Create comprehensive README.md with setup, development, and deployment instructions for multiple platforms
  - Test production build locally with `npm run build` and `npm run preview`
  - _Requirements: 11.1, 11.2, 11.3_

- [ ] 18. Set up recipe images storage
  - Create /public/images/recipes folder structure
  - Document image specifications (1200x1200px, WebP format with JPEG fallback)
  - Create placeholder.webp for missing images
  - Update recipe JSON files with relative image paths (/images/recipes/recipe-XXX.webp)
  - Optionally document CDN integration steps for future optimization
  - _Requirements: 2.6_

- [ ]* 19. Write unit tests for core functionality
  - Test IngredientScaler: verify scaling calculations (0.5x, 1x, 1.5x, 2x, etc.)
  - Test filtering logic: verify recipes filtered correctly with multiple keywords from four filter types
  - Test search logic: verify recipes filtered correctly by title with 2+ characters
  - Test combined search and filter: verify both filters work together
  - Test category scrolling: verify smooth scroll to category sections
  - Test useLocalStorage hook: verify read/write to localStorage
  - Test translation utility: verify correct translations returned
  - _Requirements: 3.2, 6.4, 7.12, 7.15, 7A.3, 7A.8_

- [ ]* 20. Write integration tests for user workflows
  - Test language switching: change language and verify all text updates
  - Test theme switching: toggle theme and verify CSS classes applied
  - Test text size adjustment: change size and verify HTML attribute updated
  - Test ingredient scaling: adjust scaler and verify quantities update
  - Test ingredient checkboxes: click ingredients, verify checked state and styling, navigate away and back, verify reset
  - Test side menu: open/close menu and verify visibility
  - Test filtering: expand filters section, select keywords from four types, and verify recipe list updates
  - Test categories: expand categories section, click category, and verify scroll to section
  - Test search: type in search bar and verify recipe list updates
  - Test search clear: click X button and verify search is cleared
  - Test combined search and filter: use both and verify correct results
  - Test navigation: click Cooking Basics and About links in side menu
  - _Requirements: 4.3, 4.4, 5.3, 6.4, 6.5, 3.3, 3A.2, 3A.3, 3A.4, 6.6, 7.5, 7.12, 7.15, 7.16, 7.17, 7A.5, 7A.7, 7A.8_
