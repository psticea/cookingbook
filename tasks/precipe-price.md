# Price per Recipe Feature

## Overview
Define a configuration-driven pricing system for ingredients (per 1000g or per 1000ml) and dynamically compute the price per serving for each recipe based on its ingredients and quantities.

## Goals
- Centralize ingredient prices in a dedicated configuration file.
- Support prices defined per 1000g or per 1000ml.
- Automatically calculate total recipe cost and price per serving.
- Make the feature easy to extend and maintain by an agent or future contributor.

## Requirements (Draft)
- A new prices file where each ingredient has:
  - A unique identifier or name.
  - A unit type: `mass` (per 1000g) or `volume` (per 1000ml).
  - A base price for 1000g or 1000ml (e.g. in EUR).
- Recipes must be able to reference these ingredient entries and their quantities.
- For each recipe, compute:
  - Total ingredient cost.
  - Cost per serving (total cost / number of servings).
- The price per serving should be dynamically calculated (i.e., updated automatically when ingredient prices or quantities change).

## Open Questions
- What is the format of the new prices file? (e.g. JSON, YAML, TOML, etc.)
- Where should the prices file live in the repository structure?
- How are recipes currently represented (data format, location), and how do they reference ingredients?
- Do we need support for multiple currencies or just one?
- How should rounding be handled for per-serving prices?

## Next Steps for the Agent
- [ ] Inspect existing recipe data structures and files.
- [ ] Propose a schema for the prices configuration file.
- [ ] Implement the price lookup and calculation logic.
- [ ] Integrate price per serving into recipe output (CLI, UI, or exported files).
- [ ] Add tests to validate price calculations and edge cases.