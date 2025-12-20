# Task 001: Categorize Ingredients on Prices Page

## Overview
Organize ingredients on the prices page into logical categories to improve usability and make it easier for users to find and manage ingredient pricing information.

## Problem Statement
Currently, the prices page displays all ingredients in a flat list without any organizational structure. This makes it difficult for users to navigate and find specific ingredients, especially as the list grows. 

## Proposed Solution
Implement a categorization system that groups ingredients into five distinct categories, displaying them in organized sections on the prices page.

## Requirements

### 1. Data Model Changes
- Add a new `category` field to each ingredient object in the prices JSON data
- The `category` field must be one of the following five values:
  - `Proteins`
  - `Dairy`
  - `Fruits and Vegetables`
  - `Spices & Seasonings`
  - `Pantry`

### 2. JSON Structure
```json
{
  "id": "ingredient-001",
  "name": "Chicken Breast",
  "category": "Proteins",
  "price": 5.99,
  "unit": "lb"
}
```

### 3. UI/Page Layout Changes
- Display ingredients grouped by their category
- Show category headers for each of the five categories
- List all ingredients belonging to each category under its respective header
- Categories should be displayed in the following order:
  1. Proteins
  2. Dairy
  3. Fruits and Vegetables
  4. Spices & Seasonings
  5. Pantry

### 4. Display Rules
- **Hide the ingredient `id` field** from the user interface
  - The `id` field should remain in the JSON for internal use (recipe matching)
  - The `id` should NOT be displayed on the prices page as it's meaningless to end users
- Show only user-relevant information (name, price, unit, etc.)

## Acceptance Criteria

### Data Layer
- [ ] All existing ingredients in the prices JSON have been assigned a `category` value
- [ ] The `category` field is one of the five approved categories
- [ ] The JSON structure is valid and maintains backward compatibility with recipe matching
- [ ] The `id` field remains in the JSON for internal use

### UI Layer
- [ ] The prices page displays five distinct category sections
- [ ] Each category section has a clear, visible header
- [ ] Ingredients are correctly sorted under their assigned categories
- [ ] Categories appear in the specified order
- [ ] The ingredient `id` field is not visible anywhere on the page
- [ ] All other ingredient information (name, price, unit) displays correctly

### User Experience
- [ ] Users can easily locate ingredients by browsing their expected category
- [ ] The page layout is clean and organized
- [ ] Category headers are visually distinct from ingredient entries
- [ ] The page remains responsive and functional on mobile devices

## Technical Considerations
- Ensure the categorization doesn't break existing recipe-to-ingredient matching
- Consider future scalability if more categories need to be added
- Maintain consistency in category naming across all ingredients

## Out of Scope
- Allowing users to customize or create their own categories
- Search or filter functionality (may be addressed in a future task)
- Sorting ingredients alphabetically within categories (may be addressed in a future task)

## Notes
- The `id` field must be preserved in the JSON even though it's hidden from the UI
- Consider adding comments in the code to explain the purpose of the `id` field for future maintainers
