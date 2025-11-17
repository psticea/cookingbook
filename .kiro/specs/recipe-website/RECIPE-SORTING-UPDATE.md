# Recipe Sorting Update

**Date:** November 17, 2025

## Summary

Updated the recipe system to include a `dateAdded` field and changed sorting from alphabetical to date-based (ascending order, oldest first).

## Changes Made

### 1. Type Definition Update

**File:** `src/types/recipe.ts`

Added `dateAdded` field to the Recipe interface:
```typescript
export interface Recipe {
  // ... existing fields
  dateAdded: string; // ISO 8601 date string (YYYY-MM-DD)
}
```

### 2. Recipe Data Updates

Added `dateAdded` field to all 8 existing recipes:

| Recipe | Category | Date Added |
|--------|----------|------------|
| Omletă cu Brânză | breakfast | 2025-11-01 |
| Spaghetti Carbonara | pasta | 2025-11-02 |
| Pui cu Legume | stir-fries | 2025-11-03 |
| Ciorbă de Burtă | soups-and-stews | 2025-11-04 |
| Sarmale cu Mămăligă | main-courses | 2025-11-05 |
| Burger Clasic | burgers-and-wraps | 2025-11-06 |
| Salată Caesar | salads-and-bites | 2025-11-07 |
| Orez Fiert | basics | 2025-11-08 |

### 3. Sorting Logic Update

**File:** `src/hooks/useRecipeData.ts`

**Before:**
```typescript
// Sort recipes alphabetically by title (using English title for consistent sorting)
allRecipes.sort((a, b) => a.title.en.localeCompare(b.title.en));
```

**After:**
```typescript
// Sort recipes by dateAdded in ascending order (oldest first)
allRecipes.sort((a, b) => {
  const dateA = new Date(a.dateAdded).getTime();
  const dateB = new Date(b.dateAdded).getTime();
  return dateA - dateB;
});
```

### 4. Documentation Updates

**File:** `src/data/recipes/README.md`

- Added `dateAdded` field to the recipe template
- Updated sorting description from "alphabetical" to "date-based"
- Added note about ISO 8601 date format (YYYY-MM-DD)

### 5. Test Updates

**File:** `src/test/recipeData.test.tsx`

- Added `dateAdded` field to all mock recipes
- Added test assertion to verify `dateAdded` property exists

## Display Order

Recipes within each category are now displayed in the order they were added (oldest first):

**Example for Breakfast category:**
1. Omletă cu Brânză (2025-11-01) - appears first
2. [Future recipes with later dates] - appear after

## Adding New Recipes

When adding a new recipe, include the `dateAdded` field with today's date:

```json
{
  "title": { "ro": "...", "en": "..." },
  // ... other fields
  "dateAdded": "2025-11-17"
}
```

The recipe will automatically appear at the end of its category (since it has the most recent date).

## Benefits

1. **Chronological Order**: Recipes appear in the order they were added
2. **Predictable**: New recipes always appear at the end
3. **Historical Context**: Can see when recipes were added to the site
4. **Flexible**: Can backdate recipes if needed by adjusting the date

## Migration Notes

- All existing recipes have been assigned dates from 2025-11-01 to 2025-11-08
- These dates are arbitrary and represent the initial migration
- Future recipes should use their actual addition date
