# Recipe Data and Images

This folder contains recipe data (JSON files) and images organized by category.

## Structure

Each category folder contains:
- **JSON files**: Recipe data with ingredients, instructions, etc.
- **JPG files**: Recipe images (1200x800 pixels, 3:2 aspect ratio)

## Image Specifications

- **Format**: JPEG (.jpg)
- **Dimensions**: 1200 x 800 pixels (3:2 aspect ratio)
- **Quality**: High quality, optimized for web
- **Naming**: Must match the recipe ID (e.g., `omleta-cu-branza.jpg` for `omleta-cu-branza.json`)

## Folder Structure

```
src/data/recipes/
├── default-image.jpg          # Default fallback image (1200x800)
├── breakfast/
│   ├── omleta-cu-branza.json
│   └── omleta-cu-branza.jpg
├── pasta/
│   ├── spaghetti-carbonara.json
│   └── spaghetti-carbonara.jpg
├── stir-fries/
├── soups-and-stews/
├── main-courses/
├── salads-and-bites/
├── burgers-and-wraps/
└── basics/
```

## Adding New Recipes

1. Create a JSON file with the recipe data in the appropriate category folder
2. Create a 1200x800 JPG image with the same name as the recipe ID
3. Place both files in the same category folder
4. The image will automatically be displayed for that recipe

## Default Image

Place a `default-image.jpg` file in the `src/data/recipes/` directory. This image will be used as a fallback when a specific recipe image is not found.
