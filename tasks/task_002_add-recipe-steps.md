# Task: Add New Recipe to Website

Use this task when adding a new recipe to the cookingbook website. Follow these steps to ensure the recipe is added correctly and completely.

## Prerequisites

Before starting, ensure you have:
- Recipe details (title, ingredients, instructions, prep time, servings, effort level)
- Category for the recipe (see list below)
- Access to the repository

## Recipe Categories

Choose one of these valid categories:
- `breakfast`
- `pasta`
- `stir-fries`
- `soups-and-stews`
- `main-courses`
- `burgers-and-wraps`
- `salads-and-bites`
- `basics`

## Steps to Add a New Recipe

### 1. Create Recipe JSON File

**Location:** `src/data/recipes/{category}/{recipe-id}.json`

- Create the JSON file in the appropriate category folder
- Filename must be in **kebab-case** (e.g., `chocolate-chip-cookies.json`)
- The filename (without `.json`) becomes the recipe ID
- Use **`src/schemas/recipe.schema.json`** as reference for the correct structure

**Required fields:**
- `id` - Must match the filename (without .json)
- `category` - Must match the folder name
- `image` - Path to image: `images/{category}/{recipe-id}.jpg`
- `title` - Object with `ro` (Romanian) and `en` (English)
- `prepTime` - Integer (minutes)
- `servings` - Integer (number of servings)
- `effortLevel` - String: `"easy"`, `"medium"`, or `"hard"`
- `ingredients` - Array of ingredient objects
- `instructions` - Object with `ro` and `en` arrays
- `personalNotes` - Object with `ro` and `en` strings
- `keywords` - Array of strings
- `dateAdded` - String in YYYY-MM-DD format

**Example:**
```json
{
  "id": "chocolate-cookies",
  "category": "basics",
  "image": "images/basics/chocolate-cookies.jpg",
  "title": {
    "ro": "Biscuiți cu Ciocolată",
    "en": "Chocolate Cookies"
  },
  "prepTime": 45,
  "servings": 12,
  "effortLevel": "easy",
  "ingredients": [...],
  "instructions": {...},
  "personalNotes": {...},
  "keywords": ["easy", "vegetarian", "no-cook"],
  "dateAdded": "2025-12-21"
}
```

### 2. Format Ingredients with Price Database IDs

**Price Database:** `src/data/prices.json`

Each ingredient must include an `ingredientId` that references the prices database:

```json
{
  "name": {
    "ro": "ou mare",
    "en": "large egg"
  },
  "quantity": 2,
  "unit": {
    "ro": "buc",
    "en": "pcs"
  },
  "ingredientId": 122
}
```

**Important:**
- Check `src/data/prices.json` for existing ingredients
- Ingredient IDs are 3-digit numbers (100-999)
- If ingredient is missing, add new entry to `prices.json`:

```json
"ingredient_key": {
  "id": 127,
  "name": "Ingredient Name",
  "category": "Dairy",
  "unit_type": "mass",
  "price_per_1000": 10.50
}
```

**Unit types:**
- `"mass"` - Uses `price_per_1000` (RON per 1000g)
- `"volume"` - Uses `price_per_1000` (RON per 1000ml)
- `"piece"` - Uses `price_per_piece` (RON per piece)

**Ingredient categories:**
- Spices & Seasonings
- Pantry
- Fruits and Vegetables
- Dairy
- Meat & Poultry
- Seafood
- Grains & Pasta
- Baking

### 3. Add Romanian and English Translations

All text fields must have both languages:

- **`title`** - Recipe name in both languages
- **`ingredients[].name`** - Each ingredient name
- **`ingredients[].unit`** - Measurement units (e.g., `"g"`, `"ml"`, `"căni"`, `"cups"`)
- **`instructions.ro`** - Array of instruction steps in Romanian
- **`instructions.en`** - Array of instruction steps in English
- **`personalNotes.ro`** - Personal notes in Romanian
- **`personalNotes.en`** - Personal notes in English

**Reference:** See `src/data/translations.json` for common translation patterns

### 4. Generate Image Filename

**Image location:** `public/images/{category}/{recipe-id}.jpg`

**Naming convention:**
- Must match the recipe ID
- Use **kebab-case** (lowercase with hyphens)
- Format: `.jpg` or `.webp`
- Recommended size: 1200x800px

**Example:**
- Recipe ID: `chocolate-chip-cookies`
- Image path: `public/images/basics/chocolate-chip-cookies.jpg`
- In JSON: `"image": "images/basics/chocolate-chip-cookies.jpg"`

**Note for user:** Inform them of the image filename so they can add the actual image file later.

### 5. Add Filter Keywords

**Reference:** `src/data/filter-keywords.json`

Include relevant keywords from these categories:

**Difficulty:**
- `"easy"`, `"medium"`, `"hard"`

**Meat Type:**
- `"chicken"`, `"beef"`, `"fish"`, `"vegetarian"`

**Cooking Method:**
- `"oven-baked"`, `"pan-fry"`, `"boiling"`, `"no-cook"`

**Ingredients:**
- `"potatoes"`, `"pasta"`, `"rice"`, `"peppers"`, `"carrots"`, `"ginger"`, etc.

### 6. Validate Recipe JSON

**Validation script:** `scripts/validate-recipes.cjs`

**Run validation:**
```bash
npm run validate-recipes
```

This will check:
- JSON syntax is correct
- All required fields are present
- Data types are correct
- Multilingual fields have both languages
- Category matches folder name
- ID matches filename

**Expected output:**
```
✅ basics/chocolate-cookies.json

✨ All recipes are valid!
```

### 7. Verification Checklist

Before completing the task, verify:

- [ ] Recipe JSON file created in correct category folder
- [ ] Filename in kebab-case matching recipe ID
- [ ] All required fields present (see schema)
- [ ] All ingredients have `ingredientId` references
- [ ] Missing ingredients added to `src/data/prices.json`
- [ ] Romanian and English translations complete
- [ ] Keywords from filter list included
- [ ] Image filename generated and documented
- [ ] Date added in YYYY-MM-DD format
- [ ] JSON validation passes (`npm run validate-recipes`)
- [ ] No JSON syntax errors (trailing commas, quotes, brackets)

## Example Recipe References

See these complete examples:
- `src/data/recipes/basics/boil-rice.json`
- `src/data/recipes/breakfast/frittata.json`
- `src/data/recipes/stir-fries/egg-fried-rice.json`

## Important Files Reference

| File | Purpose |
|------|---------|
| `src/schemas/recipe.schema.json` | JSON schema defining recipe structure |
| `src/data/prices.json` | Ingredient price database |
| `src/data/categories.json` | Valid recipe categories |
| `src/data/filter-keywords.json` | Valid filter keywords |
| `src/data/translations.json` | Common UI translations |
| `scripts/validate-recipes.cjs` | Recipe validation script |
| `src/data/recipes/VALIDATION.md` | Detailed validation guide |

## Notes for Agents

- **Auto-discovery**: The system automatically discovers recipe files - no manual imports needed
- **ID consistency**: Recipe ID, filename, and image name must all match
- **Price integration**: Every ingredient should have an `ingredientId` for cost calculations
- **Bilingual requirement**: Both Romanian and English are mandatory for all text
- **Validation is critical**: Always run `npm run validate-recipes` before committing
- **Image notification**: Always inform the user about the required image filename and location

## Common Errors to Avoid

❌ **Don't:**
- Mix up recipe ID and filename
- Forget `ingredientId` in ingredients
- Use wrong category name
- Skip validation step
- Leave out Romanian or English translations
- Use incorrect date format
- Include trailing commas in JSON

✅ **Do:**
- Match ID, filename, and image name exactly
- Reference existing ingredients from prices.json
- Validate before committing
- Include both language versions
- Use kebab-case for IDs
- Check schema for all required fields
