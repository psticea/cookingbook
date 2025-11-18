# Requirements Document

## Introduction

This document specifies the requirements for a multilingual recipe website. The website will provide users with access to recipes organized in 8 categories (Breakfast, Pasta, Stir-Fries, Soups & Stews, Main Courses, Burgers & Wraps, Salads & Bites, and Basics) with features including ingredient scaling, filtering, language switching, text size adjustment, theme switching, and analytics tracking. The website must be responsive and work seamlessly on both mobile and desktop browsers.

## Glossary

- **Recipe Website**: The web application system that displays and manages cooking recipes
- **User**: A person accessing the Recipe Website through a web browser
- **Recipe Page**: A web page displaying a single recipe with ingredients, instructions, and metadata
- **Header**: A UI component at the top of each page containing navigation elements
- **Side Menu**: A panel UI component that slides in from the side, occupying one-third of the screen width, containing navigation and filtering options
- **Filter Menu**: A side panel UI component that allows Users to filter recipes based on keywords
- **Ingredient Scaler**: A UI component that adjusts ingredient quantities based on serving size
- **Language Selector**: A UI component positioned at the bottom of each page that switches the website language between Romanian and English
- **Text Size Adjuster**: A UI component positioned at the bottom of each page that changes the text size across three predefined levels
- **Theme Selector**: A UI component positioned at the bottom of each page that switches between dark and light visual themes
- **Analytics System**: Cloudflare Web Analytics that tracks and records page access metrics without using cookies
- **About Page**: A static page providing information about the website
- **Cooking Basics Page**: A page containing fundamental cooking advice and pantry recommendations
- **Category**: A classification grouping for recipes
- **Filter Keyword**: A searchable term associated with recipes (e.g., difficulty, meat type, cook type, ingredient)
- **Search Bar**: A text input UI component in the center of the Header that filters recipes by title in real-time

## Requirements

### Requirement 1

**User Story:** As a User, I want to view recipes organized by categories, so that I can easily find the type of recipe I'm looking for

#### Acceptance Criteria

1. THE Recipe Website SHALL organize recipes into exactly 8 categories: Breakfast, Pasta, Stir-Fries, Soups & Stews, Main Courses, Burgers & Wraps, Salads & Bites, and Basics
2. THE Recipe Website SHALL load all recipes from category-specific folders in the data structure
3. THE Recipe Website SHALL assign each recipe to exactly one specific category based on its folder location
4. WHEN a User accesses a Recipe Page, THE Recipe Website SHALL display the recipe's assigned category
5. THE Recipe Website SHALL display all recipes from all 8 categories on the home page
6. THE Recipe Website SHALL sort recipes by their date added in ascending order within each category

### Requirement 2

**User Story:** As a User, I want to see complete recipe information in a clean layout, so that I can follow the recipe without distractions

#### Acceptance Criteria

1. WHEN a User views a Recipe Page, THE Recipe Website SHALL display the preparation time at the top of the page
2. WHEN a User views a Recipe Page, THE Recipe Website SHALL display the number of servings at the top of the page
3. WHEN a User views a Recipe Page, THE Recipe Website SHALL display the effort level at the top of the page
4. WHEN a User views a Recipe Page, THE Recipe Website SHALL display a list of ingredients
5. WHEN a User views a Recipe Page, THE Recipe Website SHALL display a list of instructions
6. WHEN a User views a Recipe Page, THE Recipe Website SHALL display a Personal Notes section after the instructions
7. WHEN a User views a Recipe Page, THE Recipe Website SHALL display a square recipe image with dimensions of 1200 by 1200 pixels
8. THE Recipe Website SHALL position all interactive options at the bottom of the Recipe Page
9. THE Recipe Website SHALL minimize visual distractions in the Recipe Page layout

### Requirement 3

**User Story:** As a User, I want to scale ingredient quantities, so that I can adjust recipes for different serving sizes

#### Acceptance Criteria

1. WHEN a User views a Recipe Page, THE Recipe Website SHALL display an Ingredient Scaler component
2. WHEN a User adjusts the Ingredient Scaler, THE Recipe Website SHALL recalculate all ingredient quantities proportionally
3. WHEN a User adjusts the Ingredient Scaler, THE Recipe Website SHALL update the displayed ingredient quantities in real-time

### Requirement 4

**User Story:** As a User, I want to switch between Romanian and English languages, so that I can read recipes in my preferred language

#### Acceptance Criteria

1. THE Recipe Website SHALL display content in Romanian language by default
2. WHEN a User views any page, THE Recipe Website SHALL display a Language Selector component at the bottom of the page
3. WHEN a User selects Romanian in the Language Selector, THE Recipe Website SHALL display all content in Romanian
4. WHEN a User selects English in the Language Selector, THE Recipe Website SHALL display all content in English
5. WHEN a User changes the language, THE Recipe Website SHALL persist the language preference across page navigation

### Requirement 5

**User Story:** As a User, I want to adjust text size, so that I can read recipes comfortably

#### Acceptance Criteria

1. WHEN a User views any page, THE Recipe Website SHALL display a Text Size Adjuster component at the bottom of the page
2. THE Recipe Website SHALL provide exactly two text size options: normal and large
3. WHEN a User selects a text size option, THE Recipe Website SHALL apply the selected text size to all text content
4. WHEN a User changes the text size, THE Recipe Website SHALL persist the text size preference across page navigation

### Requirement 6

**User Story:** As a User, I want to switch between dark and light themes, so that I can view the website in my preferred visual style

#### Acceptance Criteria

1. WHEN a User views any page, THE Recipe Website SHALL display a Theme Selector component at the bottom of the page
2. THE Recipe Website SHALL provide a dark theme option
3. THE Recipe Website SHALL provide a light theme option
4. WHEN a User selects the dark theme, THE Recipe Website SHALL apply dark theme styling to all pages
5. WHEN a User selects the light theme, THE Recipe Website SHALL apply light theme styling to all pages
6. WHEN a User changes the theme, THE Recipe Website SHALL persist the theme preference across page navigation

### Requirement 7

**User Story:** As a User, I want to navigate the website and access filtering options through a side menu, so that I can easily find recipes and access different sections

#### Acceptance Criteria

1. WHEN a User views any page, THE Recipe Website SHALL display a Header component at the top
2. THE Header SHALL display a Home link on the left side
3. THE Header SHALL display a Search Bar in the center
4. THE Header SHALL display a menu icon button on the right side
5. WHEN a User clicks the menu icon, THE Recipe Website SHALL open a Side Menu that occupies one-third of the screen width
6. THE Side Menu SHALL contain four sections: Filters, Categories, Cooking Basics, and About
7. THE Filters section SHALL be expandable and collapsible
8. WHEN the Filters section is expanded, THE Recipe Website SHALL display four filter subsections with keywords for filtering recipes
9. THE Recipe Website SHALL associate each recipe with Filter Keywords from the following types: difficulty, meat type, cook type, and ingredient
10. WHEN a User selects multiple Filter Keywords, THE Recipe Website SHALL display only recipes that contain all selected Filter Keywords on the home page
11. WHEN a User selects zero Filter Keywords, THE Recipe Website SHALL display all available recipes on the home page
12. THE Recipe Website SHALL update the displayed recipe list in real-time as Filter Keywords are selected or deselected
13. THE Categories section SHALL be expandable and collapsible
14. WHEN the Categories section is expanded, THE Recipe Website SHALL display all eight food categories available on the site
15. WHEN a User clicks a category in the Side Menu, THE Recipe Website SHALL scroll to the selected category section on the homepage
16. WHEN a User clicks Cooking Basics in the Side Menu, THE Recipe Website SHALL navigate to the Cooking Basics page
17. WHEN a User clicks About in the Side Menu, THE Recipe Website SHALL navigate to the About page
18. WHEN a User closes the Side Menu, THE Recipe Website SHALL maintain the selected filters and continue displaying the filtered recipe list

### Requirement 7A

**User Story:** As a User, I want to search recipes by title from the header, so that I can quickly find a specific recipe I'm looking for

#### Acceptance Criteria

1. WHEN a User views the home page, THE Recipe Website SHALL display a Search Bar component in the center of the Header
2. THE Search Bar SHALL filter recipes based on the title in the currently selected language
3. WHEN a User types at least 2 characters in the Search Bar, THE Recipe Website SHALL display only recipes whose titles contain the typed text
4. WHEN a User types fewer than 2 characters in the Search Bar, THE Recipe Website SHALL display all recipes matching the current Filter Keywords
5. THE Recipe Website SHALL update the displayed recipe list in real-time as the User types in the Search Bar
6. THE Search Bar SHALL display a clear button with an X symbol
7. WHEN a User clicks the clear button in the Search Bar, THE Recipe Website SHALL clear the search text and display all recipes matching the current Filter Keywords
8. THE Recipe Website SHALL apply both Search Bar filtering and Filter Keyword filtering simultaneously when both are active

### Requirement 8

**User Story:** As a User, I want the website to work on both mobile and desktop devices, so that I can access recipes from any device

#### Acceptance Criteria

1. THE Recipe Website SHALL implement responsive web design for all pages
2. WHEN a User accesses the Recipe Website on a mobile browser, THE Recipe Website SHALL display a mobile-optimized layout
3. WHEN a User accesses the Recipe Website on a desktop browser, THE Recipe Website SHALL display a desktop-optimized layout
4. THE Recipe Website SHALL maintain full functionality across mobile and desktop browsers
5. THE Recipe Website SHALL ensure all interactive components are usable on touch-screen devices

### Requirement 9

**User Story:** As a User, I want to learn about the website and cooking basics, so that I can understand the website's purpose and improve my cooking knowledge

#### Acceptance Criteria

1. THE Recipe Website SHALL provide an About Page
2. WHEN a User accesses the About Page, THE Recipe Website SHALL display information about the website
3. WHEN a User accesses the About Page, THE Recipe Website SHALL display a comment section at the bottom where users can leave comments without requiring login
4. THE Recipe Website SHALL provide a Cooking Basics Page
4. WHEN a User accesses the Cooking Basics Page, THE Recipe Website SHALL display advice about reading recipes thoroughly before cooking
5. WHEN a User accesses the Cooking Basics Page, THE Recipe Website SHALL display advice about preparing all ingredients before cooking
6. WHEN a User accesses the Cooking Basics Page, THE Recipe Website SHALL display recommendations for pantry staples to stock at home

### Requirement 10

**User Story:** As a website administrator, I want to track page access metrics, so that I can understand how users interact with the website

#### Acceptance Criteria

1. WHEN a User accesses any page on the Recipe Website, THE Recipe Website SHALL record a page access event in the Analytics System
2. THE Recipe Website SHALL track page access metrics for each individual page
3. THE Recipe Website SHALL store page access metrics in a persistent data store
4. THE Recipe Website SHALL provide access to page access metrics data

### Requirement 11

**User Story:** As a website administrator, I want to host the website on a static hosting platform, so that it is reliably available to users

#### Acceptance Criteria

1. THE Recipe Website SHALL be deployed as a static website
2. THE Recipe Website SHALL be accessible via a public URL
3. THE Recipe Website SHALL serve static HTML, CSS, and JavaScript files without requiring a backend server
