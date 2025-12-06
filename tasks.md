# Tasks

## Task 1: Modernize Recipe Card Design with Overlay Title

**Objective**: Make the recipe cards more compact by overlaying the recipe name on the image instead of displaying it below.

**Requirements**:
- Recipe name should be overlayed on the image towards the bottom
- Use a filled background with solid color for readability
- Modern look and feel
- Should not cover too much of the image
- Keep metadata (time, servings, effort) visible

**Technical Changes**:
- Modify `RecipeCard.tsx` component to:
  - Position recipe title as an overlay on the image
  - Add a semi-transparent or solid background to the title
  - Adjust card layout to be more compact
  - Ensure responsive design is maintained

**Expected Outcome**:
- More compact recipe cards that show more recipes per screen
- Modern, visually appealing design
- Better use of vertical space on the home page
