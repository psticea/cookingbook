# Price per Recipe Feature

## Overview

Define a configuration-driven pricing system for ingredients (per 1000g, per 1000ml, or per piece) and dynamically compute:

- **Price per serving** (primary value).
- **Total cost per recipe**.
- **Cost per ingredient**.

This feature should:

- Centralize ingredient prices in a single **JSON** config file.
- Support prices defined:
  - Per **1000g** (weight),
  - Per **1000ml** (volume),
  - Per **piece** (unit).
- Use **RON** as the only currency.
- Match ingredients **fuzzily** (4 consecutive letters in common).
- Assume a default cost of **0.2 RON per serving** for ingredients without a configured price.
- Replace **difficulty symbols** in the UI with **price information**:
  - Home page: show **price per serving** instead of difficulty puzzle symbols.
  - Recipe page: show **price per serving** instead of difficulty symbol, and additionally:
    - **Total recipe cost**.
    - For each ingredient, its **calculated total price** (in lighter/secondary text).
- Be easy to extend and maintain for future agents or contributors.

---

## High-Level Design

### 1. Ingredient Prices File (JSON, RON Only)

Create a new JSON prices file (e.g. `config/prices.json`), containing:

- A unique ingredient identifier (slug-like string).
- Display name (optional but recommended).
- Unit type:
  - `"mass"` → price is per 1000g.
  - `"volume"` → price is per 1000ml.
  - `"piece"` → price is per 1 piece.
- Base price in **RON**:
  - `price_per_1000` – for `"mass"` or `"volume"` (RON per 1000g or 1000ml).
  - `price_per_piece` – for `"piece"` (RON per 1 unit).
- Currency is **implicitly RON** and does not need to be configurable.

**Example (`prices.json`):**

```json
{
  "ingredients": {
    "olive_oil": {
      "id": 100,
      "name": "Olive oil",
      "unit_type": "volume",
      "price_per_1000": 6.5
    },
    "flour_white": {
      "id": 101,
      "name": "White flour",
      "unit_type": "mass",
      "price_per_1000": 1.2
    },
    "egg": {
      "id": 102,
      "name": "Egg",
      "unit_type": "piece",
      "price_per_piece": 0.8
    }
  }
}
```

> If the project already has a `config` or `data` folder, the agent should place `prices.json` there for consistency.

---

### 2. Recipe Representation

Each recipe should:

- List ingredients with:
  - Ingredient **name string** (as currently written in recipes).
  - Quantity.
  - Unit:
    - Weight: `g`, `kg`
    - Volume: `ml`, `l`
    - Pieces: `pcs`, `piece`, `pieces` (agent should normalize to “piece-count”).
- Define number of servings.

**Example (pseudo-structure):**

```jsonc
{
  "name": "Pancakes",
  "servings": 4,
  "ingredients": [
    { "name": "white flour",   "quantity": 250, "unit": "g" },
    { "name": "milk 3.5%",     "quantity": 300, "unit": "ml" },
    { "name": "egg",           "quantity": 2,   "unit": "pcs" },
    { "name": "sunflower oil", "quantity": 10,  "unit": "ml" }
  ]
}
```

Recipes may already exist in another format (YAML, Markdown frontmatter, etc.). The agent must adapt to the existing format but follow the same conceptual structure.

---

## Ingredient Matching (ID-Based)

Ingredients in recipes are matched to prices using a **3-digit ingredient ID**:

- Each ingredient in a recipe has an `ingredientId` field (3-digit number: 100-999)
- Each ingredient in `prices.json` has a corresponding `id` field (3-digit number)
- Matching is done by exact ID match: `recipe.ingredient.ingredientId === prices.ingredients[key].id`

**Example:**

Recipe ingredient:
```json
{
  "name": "white flour",
  "quantity": 250,
  "unit": "g",
  "ingredientId": 101
}
```

Prices entry:
```json
{
  "ingredients": {
    "flour_white": {
      "id": 101,
      "name": "White flour",
      "unit_type": "mass",
      "price_per_1000": 1.2
    }
  }
}
```

If **no ingredient** from `prices.json` has a matching ID:

- That ingredient is considered **missing-priced** and will use the fallback rule below.

**Legacy Support (Deprecated):**

For backward compatibility, if an ingredient does not have an `ingredientId` field, the system falls back to fuzzy name matching (4 consecutive letters). This is deprecated and will be removed in future versions.

---

## Default Cost for Missing-Priced Ingredients

If a recipe ingredient does not match any priced ingredient entry (using the fuzzy rule):

- Assume a **fixed cost of 0.2 RON per serving** for that ingredient.

So, for a recipe with `S` servings:

- Ingredient **cost per serving**:
  - `ingredient_cost_per_serving = 0.2` RON
- Ingredient **total cost for the recipe**:
  - `ingredient_cost_recipe = 0.2 * S` RON

This value:

- Is **per serving** and **per recipe**, derived only from the number of servings.
- Is **independent** of quantity or unit for that ingredient when using the fallback.

---

## Price Calculation Logic

For each ingredient in a recipe:

1. **Attempt fuzzy match** to a priced ingredient.
   - If match is found → use configured price logic (depending on unit type).
   - If no match → use the fixed `0.2 RON per serving` rule.

2. **If ingredient has configured price**:

   Let `Q` be the recipe quantity for this ingredient, and `S` the number of servings.

   1. Determine `unit_type` from `prices.json`:
      - `"mass"` → price is per 1000g.
      - `"volume"` → price is per 1000ml.
      - `"piece"` → price is per 1 piece.

   2. Normalize the recipe quantity based on the ingredient’s **unit type**:

      - **Mass (`unit_type = "mass"`)**:
        - Supported recipe units:
          - `g`  → grams (no change).
          - `kg` → grams (`kg * 1000`).
        - Normalized quantity in grams: `Q_grams`.
      - **Volume (`unit_type = "volume"`)**:
        - Supported recipe units:
          - `ml` → milliliters (no change).
          - `l`  → milliliters (`l * 1000`).
        - Normalized quantity in milliliters: `Q_ml`.
      - **Piece (`unit_type = "piece"`)**:
        - Supported recipe units:
          - `pcs`, `piece`, `pieces` → number of pieces.
        - Normalized quantity in pieces: `Q_pieces`.

      If an unsupported unit is encountered for a given `unit_type`, the agent should:

      - Convert if a clear mapping exists, or
      - Log/throw a clear error.

   3. Compute ingredient **total cost for the recipe**:

      - **Mass**:
        - `ingredient_cost_recipe = (Q_grams / 1000) * price_per_1000`
      - **Volume**:
        - `ingredient_cost_recipe = (Q_ml / 1000) * price_per_1000`
      - **Piece**:
        - `ingredient_cost_recipe = Q_pieces * price_per_piece`

   4. Derive ingredient **cost per serving**:

      - `ingredient_cost_per_serving = ingredient_cost_recipe / S`

3. **If ingredient has no configured price**:

   - Use:
     - `ingredient_cost_per_serving = 0.2` (RON per serving)
     - `ingredient_cost_recipe = 0.2 * S` (RON per recipe)

4. **Recipe totals**:

   - **Total recipe cost**:
     - `total_cost_recipe = sum(ingredient_cost_recipe for all ingredients)`
   - **Price per serving**:
     - `price_per_serving = sum(ingredient_cost_per_serving for all ingredients)`
     - (Equivalent to `total_cost_recipe / S` if calculations are consistent.)

---

## Rounding and Formatting

- Internal computations:
  - Use a numeric type with sufficient precision.
- Display:
  - Currency: always **RON**.
  - Round final values to **2 decimal places**:
    - `price_per_serving` (RON/serving),
    - `total_cost_recipe` (RON),
    - `ingredient_cost_recipe` (RON).
  - Examples:
    - `2.35 RON / serving`
    - `9.40 RON total`
    - `1.10 RON` for an ingredient line.

---

## UI / UX Requirements

### Home Page (Recipes List)

- **Current behavior**: Shows difficulty puzzle symbols for each recipe.
- **New behavior**:
  - Replace difficulty puzzle symbols with **price per serving**.
  - For each recipe card / list item:
    - Show text like: `2.35 RON / serving`.
  - If price cannot be computed:
    - Show a clear placeholder, e.g. `— RON / serving` or `price N/A`.

### Recipe Page (Single Recipe View)

- **Current behavior**: Shows a difficulty symbol for the recipe.
- **New behavior**:
  - Replace the difficulty symbol area with:
    1. **Price per serving**:
       - e.g. `2.35 RON / serving`
    2. **Total recipe cost**:
       - e.g. `9.40 RON total`

  Layout example (conceptual only):

  ```text
  2.35 RON / serving
  9.40 RON total
  ```

#### Ingredient List Display

- For each ingredient shown on the recipe page:
  - Keep the current display of ingredient name + quantity + unit.
  - Additionally show, in **lighter / secondary text**, the **total cost for that ingredient** for the whole recipe:
    - e.g. `1.10 RON` in a muted or smaller style next to or below the ingredient.

Example (pseudo-display):

```text
- 250 g white flour       (1.05 RON)
- 300 ml milk 3.5%        (0.85 RON)
- 2 pcs egg               (1.60 RON)
```

Styling details (color, font size, parentheses, tooltips) are left to the implementation, but the requirement is:
- Each ingredient should clearly show its **total cost for the recipe**,
- This cost should be visually lighter / secondary compared to the main text.

---

## Requirements (for the agent)

1. **Prices file**
   - Use a **JSON** file, e.g. `config/prices.json`.
   - Schema:
     - Top-level `"ingredients"` object.
     - Each key is an ingredient ID (string).
     - Each value is an object:
       - `"id"`: number (3-digit ingredient ID: 100-999)
       - `"name"`: string (human-friendly name)
       - `"unit_type"`: `"mass"`, `"volume"`, or `"piece"`
       - For `"mass"` / `"volume"`:
         - `"price_per_1000"`: number (RON per 1000g or 1000ml)
       - For `"piece"`:
         - `"price_per_piece"`: number (RON per piece)

2. **ID-based ingredient matching**
   - Implement exact ID matching:
     - Match recipe `ingredientId` with prices `id` field
     - Each ingredient ID is a 3-digit number (100-999)
   - For backward compatibility, fall back to fuzzy name matching if `ingredientId` is not present
   - Legacy fuzzy matching (deprecated):
     - Match if there is a substring of at least **4 consecutive letters** shared between:
       - Recipe ingredient name
       - And either:
         - Ingredient key, or
         - Ingredient `"name"` in JSON.
   - Implement a deterministic tie-breaker for multiple matches.
   - Log or expose information when:
     - No match is found (fallback used),
     - Fuzzy matching is used (deprecated path).

3. **Cost calculations**
   - Implement:
     - `ingredient_cost_recipe` (RON per ingredient, per recipe),
     - `ingredient_cost_per_serving` (RON per ingredient, per serving),
     - `total_cost_recipe` (RON per recipe),
     - `price_per_serving` (RON per serving).
   - Apply:
     - Mass calculations for `"mass"` ingredients,
     - Volume calculations for `"volume"` ingredients,
     - Piece-based calculations for `"piece"` ingredients,
     - Fallback `0.2 RON per serving` for missing-priced ingredients.

4. **UI integration**
   - **Home page**:
     - Replace difficulty puzzle symbols with `price_per_serving` (RON).
   - **Recipe page**:
     - Replace difficulty symbol with:
       - `price_per_serving` (RON/serving),
       - `total_cost_recipe` (RON).
     - For each ingredient in the ingredient list:
       - Show `ingredient_cost_recipe` (RON) in a lighter / secondary style.

5. **Dynamic calculation**
   - All costs must be computed from:
     - `prices.json` + recipe data + fallback rules.
   - Do not hard-code static price values in recipe files or templates.

6. **Tests**
   - Unit tests for:
     - Fuzzy matching behavior (positive/negative/ambiguous cases).
     - Cost calculations for:
       - Mass ingredients (`g`, `kg`),
       - Volume ingredients (`ml`, `l`),
       - Piece ingredients (`pcs`, `piece`, `pieces`).
     - Fallback costs for missing-priced ingredients.
     - Rounding behavior for:
       - `price_per_serving`,
       - `total_cost_recipe`,
       - `ingredient_cost_recipe`.
   - If UI is testable (e.g. React/Vue components), add tests ensuring:
     - Home page shows price per serving instead of difficulty.
     - Recipe page shows price per serving, total cost, and ingredient-level cost.

---

## Open Questions

- Exact path for `prices.json`:
  - e.g. `config/prices.json` vs `data/prices.json`.
- How recipe files are currently structured (JSON, YAML, Markdown, etc.).
- How difficulty is currently stored and rendered, to ensure clean removal / replacement.
- How to expose warnings or logs for:
  - Ambiguous fuzzy matches.
  - Ingredients where the fallback cost is used.

---

## Additional Features

### Ingredient Prices Page

Create a new page (`/prices`) that displays all ingredients from `prices.json`:

- Accessible from the side menu
- Shows a table or list of all ingredients with their prices
- Display columns:
  - Ingredient ID (3-digit number)
  - Ingredient name
  - Unit type (mass/volume/piece)
  - Price (formatted appropriately based on unit type)
- Support both Romanian and English translations
- Searchable/filterable by name or ID

**UI Requirements:**
- Clean, readable table layout
- Responsive design for mobile
- Sorted alphabetically by name (default)
- Optional: Group by unit type
- Add translation keys for "Ingredient Prices", "Price List", etc.

---

## Agent Task Checklist

- [ ] Confirm where recipes live and how they are represented.
- [ ] Create `config/prices.json` (or another agreed path) with the defined schema including `"mass"`, `"volume"`, and `"piece"`.
- [ ] Implement fuzzy ingredient matching (4 consecutive letters, case-insensitive).
- [ ] Implement unit conversion and full price calculations:
  - Mass, volume, piece.
  - Per ingredient (recipe and serving),
  - Total recipe cost,
  - Price per serving.
- [ ] Implement fallback `0.2 RON per serving` for ingredients without a match.
- [ ] Integrate into the **home page**:
  - Show price per serving instead of difficulty puzzle symbols.
- [ ] Integrate into the **recipe page**:
  - Show price per serving and total recipe cost.
  - Show per-ingredient total cost in lighter/secondary text.
- [ ] Add unit tests for matching, calculations, defaults, rounding, and (if possible) UI.
- [ ] Document how to add/update ingredient prices and interpret the displayed costs.
