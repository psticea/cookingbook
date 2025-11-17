# Recipe Validation Guide

This guide explains how to validate recipe JSON files to ensure they work correctly with the website.

## JSON Schema

A JSON Schema file (`recipe.schema.json`) defines the structure and validation rules for recipes.

### Schema Location

```
src/data/recipes/recipe.schema.json
```

## Validation Methods

### Method 1: Automated Script (Recommended)

Run the validation script to check all recipes at once:

```bash
npm run validate-recipes
```

This will:
- ✅ Check all recipe files in all category folders
- ✅ Report which recipes are valid/invalid
- ✅ Show detailed error messages for invalid recipes
- ✅ Exit with error code if any recipe is invalid (useful for CI/CD)

**Example Output:**
```
🔍 Validating recipes...

✅ breakfast/omleta-cu-branza.json
✅ pasta/spaghetti-carbonara.json
❌ main-courses/invalid-recipe.json

==================================================
📊 Validation Summary
==================================================
Total recipes: 8
✅ Valid: 7
❌ Invalid: 1

==================================================
❌ Validation Errors
==================================================

📄 main-courses/invalid-recipe.json:
  • /prepTime: must be integer
  • /dateAdded: must match pattern "^\d{4}-\d{2}-\d{2}$"
```

### Method 2: Online Validator

Use an online JSON Schema validator:

1. Go to https://www.jsonschemavalidator.net/
2. **Left panel**: Paste contents of `recipe.schema.json`
3. **Right panel**: Paste your recipe JSON
4. Check for validation errors in real-time

### Method 3: VS Code Integration

Get automatic validation while editing:

1. **Install Extension**: "JSON Schema Validator" or use built-in JSON validation
2. **Add schema reference** to your recipe file:

```json
{
  "$schema": "../recipe.schema.json",
  "title": {
    "ro": "Titlu Rețetă",
    "en": "Recipe Title"
  },
  ...
}
```

3. VS Code will show errors as you type with red squiggly lines

### Method 4: Command Line (ajv-cli)

For advanced users:

```bash
# Install ajv-cli globally
npm install -g ajv-cli

# Validate a single recipe
ajv validate -s src/data/recipes/recipe.schema.json \
             -d src/data/recipes/pasta/your-recipe.json

# Validate all recipes in a category
ajv validate -s src/data/recipes/recipe.schema.json \
             -d "src/data/recipes/pasta/*.json"
```

## Validation Rules

### Required Fields

All recipes MUST have these fields:

- ✅ `id` (string, kebab-case, matches filename)
- ✅ `category` (string, must match folder name)
- ✅ `title` (object with `ro` and `en`)
- ✅ `prepTime` (integer, minimum 1)
- ✅ `servings` (integer, minimum 1)
- ✅ `effortLevel` (string: "easy", "medium", or "hard")
- ✅ `image` (string, path to recipe image)
- ✅ `ingredients` (array, minimum 1 item)
- ✅ `instructions` (object with `ro` and `en` arrays)
- ✅ `personalNotes` (object with `ro` and `en` strings)
- ✅ `keywords` (array of strings)
- ✅ `dateAdded` (string in YYYY-MM-DD format)

### Field Constraints

#### title
```json
"title": {
  "ro": "Titlu în Română",  // Required, non-empty string
  "en": "Title in English"   // Required, non-empty string
}
```

#### prepTime
```json
"prepTime": 30  // Integer, minimum 1 minute
```

#### servings
```json
"servings": 4  // Integer, minimum 1 serving
```

#### effortLevel
```json
"effortLevel": "easy"  // Must be: "easy", "medium", or "hard"
```

#### ingredients
```json
"ingredients": [
  {
    "name": {
      "ro": "ingredient",  // Required, non-empty
      "en": "ingredient"   // Required, non-empty
    },
    "quantity": 100,       // Number, minimum 0
    "unit": {
      "ro": "g",          // Required, non-empty
      "en": "g"           // Required, non-empty
    }
  }
]
// Must have at least 1 ingredient
```

#### instructions
```json
"instructions": {
  "ro": [
    "Pas 1",  // At least 1 instruction required
    "Pas 2"
  ],
  "en": [
    "Step 1",  // At least 1 instruction required
    "Step 2"
  ]
}
```

#### personalNotes
```json
"personalNotes": {
  "ro": "Notițe personale",  // Can be empty string
  "en": "Personal notes"     // Can be empty string
}
```

#### keywords
```json
"keywords": ["chicken", "grilling"]  // Array of unique strings
```

#### dateAdded
```json
"dateAdded": "2025-11-17"  // Must be YYYY-MM-DD format
```

#### id
```json
"id": "my-recipe"  // Must match filename (without .json), kebab-case only
```
**Rules:**
- Must match the filename (e.g., `my-recipe.json` → `"id": "my-recipe"`)
- Only lowercase letters, numbers, and hyphens allowed
- Pattern: `^[a-z0-9-]+$`

#### category
```json
"category": "pasta"  // Must match folder name
```
**Rules:**
- Must match the folder the recipe is in
- Must be one of: "breakfast", "pasta", "stir-fries", "soups-and-stews", "main-courses", "burgers-and-wraps", "salads-and-bites", "basics"

#### image
```json
"image": "/images/recipes/pasta/my-recipe.jpg"
```
**Rules:**
- Relative path to recipe image
- Recommended format: `/images/recipes/{category}/{id}.jpg`
- Must be non-empty string

## Common Validation Errors

### Error: Missing required property

**Problem:**
```json
{
  "title": { "ro": "Test", "en": "Test" },
  "prepTime": 30
  // Missing other required fields
}
```

**Solution:** Add all required fields listed above.

### Error: Must be integer

**Problem:**
```json
"prepTime": "30"  // String instead of number
```

**Solution:**
```json
"prepTime": 30  // Use number without quotes
```

### Error: Must be >= 1

**Problem:**
```json
"servings": 0  // Too low
```

**Solution:**
```json
"servings": 1  // Minimum 1
```

### Error: Must be equal to one of the allowed values

**Problem:**
```json
"effortLevel": "simple"  // Invalid value
```

**Solution:**
```json
"effortLevel": "easy"  // Use: "easy", "medium", or "hard"
```

### Error: Must match pattern

**Problem:**
```json
"dateAdded": "17-11-2025"  // Wrong format
```

**Solution:**
```json
"dateAdded": "2025-11-17"  // Use YYYY-MM-DD
```

### Error: Must have required property

**Problem:**
```json
"title": {
  "ro": "Titlu"
  // Missing "en"
}
```

**Solution:**
```json
"title": {
  "ro": "Titlu",
  "en": "Title"  // Add missing language
}
```

### Error: Must NOT have fewer than 1 items

**Problem:**
```json
"ingredients": []  // Empty array
```

**Solution:**
```json
"ingredients": [
  {
    "name": { "ro": "ingredient", "en": "ingredient" },
    "quantity": 100,
    "unit": { "ro": "g", "en": "g" }
  }
]
```

## Best Practices

### 1. Validate Before Committing

Always run validation before committing new recipes:

```bash
npm run validate-recipes
```

### 2. Use VS Code Schema

Add schema reference to get real-time validation:

```json
{
  "$schema": "../recipe.schema.json",
  ...
}
```

### 3. Copy Existing Recipe

Start with a valid recipe and modify it:

```bash
cp src/data/recipes/pasta/spaghetti-carbonara.json \
   src/data/recipes/pasta/my-new-recipe.json
```

### 4. Check Date Format

Use ISO 8601 format (YYYY-MM-DD):
- ✅ `"2025-11-17"`
- ❌ `"17/11/2025"`
- ❌ `"Nov 17, 2025"`

### 5. Provide Both Languages

Always include both Romanian and English:
- All `title`, `name`, `unit` fields
- Both `instructions.ro` and `instructions.en`
- Both `personalNotes.ro` and `personalNotes.en`

### 6. Use Unique Keywords

Keywords should be unique (no duplicates):
- ✅ `["chicken", "grilling"]`
- ❌ `["chicken", "chicken"]`

## CI/CD Integration

Add validation to your CI/CD pipeline:

### GitHub Actions

```yaml
- name: Validate Recipes
  run: npm run validate-recipes
```

This ensures all recipes are valid before deployment.

## Troubleshooting

### Schema Not Found

If VS Code can't find the schema:

1. Check the path in `$schema` is correct
2. Use relative path from recipe file to schema
3. Example: `"$schema": "../recipe.schema.json"`

### Validation Script Fails

If the script doesn't run:

1. Install dependencies: `npm install`
2. Check Node.js is installed: `node --version`
3. Make script executable: `chmod +x scripts/validate-recipes.js`

### False Positives

If validation fails but recipe looks correct:

1. Check for hidden characters (copy-paste issues)
2. Verify JSON syntax (use JSON formatter)
3. Check date format exactly matches YYYY-MM-DD
4. Ensure no extra commas or missing quotes

## Summary

- ✅ Use `npm run validate-recipes` before committing
- ✅ Add `$schema` reference for VS Code validation
- ✅ Follow the required field structure
- ✅ Use correct data types (numbers, strings, arrays)
- ✅ Provide both Romanian and English translations
- ✅ Use YYYY-MM-DD date format

Valid recipes = working website! 🎉
