# Ingredient Subsections

## Overview

Recipes can now optionally include section headings mixed in with ingredients for better organization. This is useful for recipes that have distinct groups of ingredients like marinades, sauces, garnishes, or different components.

## Usage

### Simple Ingredient List (Default)

The traditional flat list structure is still fully supported:

```json
{
  "ingredients": [
    {
      "name": { "ro": "ceapă", "en": "onion" },
      "quantity": 1,
      "unit": { "ro": "buc", "en": "pcs" }
    },
    {
      "name": { "ro": "usturoi", "en": "garlic" },
      "quantity": 2,
      "unit": { "ro": "căței", "en": "cloves" }
    }
  ]
}
```

### With Section Headings (Optional)

For recipes with logical groupings, simply add section objects between ingredients:

```json
{
  "ingredients": [
    {
      "section": {
        "ro": "Marinadă",
        "en": "Marinade"
      }
    },
    {
      "name": { "ro": "ulei de măsline", "en": "olive oil" },
      "quantity": 3,
      "unit": { "ro": "linguri", "en": "tbsp" }
    },
    {
      "name": { "ro": "usturoi", "en": "garlic" },
      "quantity": 2,
      "unit": { "ro": "căței", "en": "cloves" }
    },
    {
      "section": {
        "ro": "Ingrediente principale",
        "en": "Main Ingredients"
      }
    },
    {
      "name": { "ro": "pui", "en": "chicken" },
      "quantity": 500,
      "unit": { "ro": "g", "en": "g" }
    }
  ]
}
```

## Common Section Names

Here are some common section names you might use:

| Romanian | English |
|----------|---------|
| Marinadă | Marinade |
| Sos | Sauce |
| Ingrediente principale | Main Ingredients |
| Pentru servit | For Serving |
| Garnitură | Garnish |
| Aluat | Dough |
| Umplutură | Filling |
| Topping | Topping |
| Dresing | Dressing |

## UI Behavior

- **Regular ingredients**: Displayed as bulleted list items with quantity, unit, and name
- **Section headings**: Displayed as bold subheadings to visually separate ingredient groups
- **Scaling**: The ingredient scaler works on all ingredients - section headings are not affected
- **Language support**: Both ingredient names and section headings are displayed in the user's selected language (Romanian or English)

## Example Recipe

See `src/data/recipes/main-courses/pui-marinat-la-cuptor.json` for a complete example of a recipe using ingredient subsections.

## When to Use Subsections

Use ingredient subsections when:
- The recipe has distinct components (e.g., marinade + main ingredients)
- Ingredients are used at different stages of preparation
- You want to separate garnishes or toppings from main ingredients
- The recipe would be clearer with logical groupings

Don't use subsections when:
- The recipe is simple with few ingredients
- All ingredients are used together
- Grouping doesn't add clarity

## Validation

The recipe schema (`src/schemas/recipe.schema.json`) validates both types of items:
- **Regular ingredients** must have `name`, `quantity`, and `unit` properties
- **Section headings** must have a `section` property
- All multilingual fields must include both `ro` and `en` translations

Run `npm run validate-recipes` to check your recipe files.

## Structure Details

Each item in the ingredients array can be either:

1. **An ingredient object**:
   ```json
   {
     "name": { "ro": "...", "en": "..." },
     "quantity": number,
     "unit": { "ro": "...", "en": "..." }
   }
   ```

2. **A section heading object**:
   ```json
   {
     "section": { "ro": "...", "en": "..." }
   }
   ```

The array can contain any mix of these two types in any order.
