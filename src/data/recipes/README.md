# Recipe Data Structure

## How to Add a New Recipe

Simply create a new JSON file in the appropriate category folder. The recipe will automatically appear on the website - no code changes needed!

### Steps:

1. **Choose the category folder:**
   - `breakfast/` - Breakfast recipes
   - `pasta/` - Pasta dishes
   - `stir-fries/` - Stir-fry recipes
   - `soups-and-stews/` - Soups and stews
   - `main-courses/` - Main course dishes
   - `burgers-and-wraps/` - Burgers and wraps
   - `salads-and-bites/` - Salads and appetizers
   - `basics/` - Basic cooking techniques

2. **Create a JSON file** with a descriptive filename (e.g., `chicken-soup.json`, `chocolate-cake.json`)

3. **Use this template:**

```json
{
  "title": {
    "ro": "Titlu în Română",
    "en": "Title in English"
  },
  "prepTime": 30,
  "servings": 4,
  "effortLevel": "easy",
  "ingredients": [
    {
      "name": {
        "ro": "ingredient în română",
        "en": "ingredient in english"
      },
      "quantity": 100,
      "unit": {
        "ro": "g",
        "en": "g"
      }
    }
  ],
  "instructions": {
    "ro": [
      "Primul pas în română",
      "Al doilea pas în română"
    ],
    "en": [
      "First step in English",
      "Second step in English"
    ]
  },
  "personalNotes": {
    "ro": "Notițe personale, opinii, preferințe sau povestea rețetei în română",
    "en": "Personal notes, opinions, preferences or recipe backstory in English"
  },
  "keywords": ["keyword1", "keyword2"],
  "dateAdded": "2025-11-17"
}
```

## Important Notes:

- **Filename = Recipe ID**: The filename (without `.json`) becomes the recipe ID
- **Folder = Category**: The folder name automatically sets the recipe category
- **Automatic Loading**: All `.json` files in category folders are automatically discovered and loaded
- **Date-Based Sorting**: Recipes are sorted by `dateAdded` in ascending order (oldest first)
- **No Manual Imports**: You don't need to edit any code files to add recipes
- **Date Format**: Use ISO 8601 format (YYYY-MM-DD) for the `dateAdded` field

## Effort Levels:
- `"easy"` - Simple recipes
- `"medium"` - Moderate difficulty
- `"hard"` - Complex recipes

## Common Keywords:
- Meat types: `"chicken"`, `"beef"`, `"pork"`, `"fish"`
- Cooking methods: `"baking"`, `"frying"`, `"boiling"`, `"grilling"`
- Dietary: `"vegetarian"`, `"vegan"`, `"gluten-free"`
- Meal types: `"quick"`, `"comfort-food"`, `"healthy"`

## Example:

File: `src/data/recipes/pasta/spaghetti-carbonara.json`
- Recipe ID: `spaghetti-carbonara`
- Category: `pasta`
- Will appear under "Pasta" section on homepage
