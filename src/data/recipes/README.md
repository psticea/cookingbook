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
  "id": "recipe-name",
  "category": "pasta",
  "image": "/images/recipes/pasta/recipe-name.jpg",
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

**Important:**
- `id` must match the filename (without `.json`)
- `category` must match the folder name
- `image` path should follow the pattern `/images/recipes/{category}/{id}.jpg`

## Important Notes:

- **Filename = Recipe ID**: The filename (without `.json`) becomes the recipe ID
- **Folder = Category**: The folder name automatically sets the recipe category
- **Automatic Loading**: All `.json` files in category folders are automatically discovered and loaded
- **Date-Based Sorting**: Recipes are sorted by `dateAdded` in ascending order (oldest first)
- **No Manual Imports**: You don't need to edit any code files to add recipes
- **Date Format**: Use ISO 8601 format (YYYY-MM-DD) for the `dateAdded` field
- **Schema Validation**: Use `recipe.schema.json` to validate your recipes before adding them

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

## Validating Recipes

### Using JSON Schema

A JSON Schema file (`recipe.schema.json`) is provided to validate your recipes before adding them.

**Online Validation:**
1. Go to https://www.jsonschemavalidator.net/
2. Paste the contents of `recipe.schema.json` in the left panel
3. Paste your recipe JSON in the right panel
4. Check for validation errors

**VS Code Validation:**
1. Install the "JSON Schema Validator" extension
2. Add this to the top of your recipe JSON file:
```json
{
  "$schema": "../recipe.schema.json",
  "title": { ... }
}
```
3. VS Code will automatically validate as you type

**Command Line Validation (using ajv-cli):**
```bash
# Install ajv-cli globally
npm install -g ajv-cli

# Validate a recipe
ajv validate -s src/data/recipes/recipe.schema.json -d src/data/recipes/pasta/your-recipe.json
```

### Common Validation Errors:

- **Missing required fields**: Ensure all required fields are present
- **Wrong data types**: Check that numbers are numbers, strings are strings
- **Invalid effortLevel**: Must be "easy", "medium", or "hard"
- **Invalid dateAdded**: Must be in YYYY-MM-DD format
- **Empty arrays**: Instructions and ingredients must have at least one item
- **Missing translations**: Both "ro" and "en" must be provided for all text fields
