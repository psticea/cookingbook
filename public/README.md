# Public Assets

This folder contains static assets that are served directly without processing.

## Default Image

The `default-image.svg` is a placeholder that shows when recipe images are not found.

**To use a custom default image:**
1. Create a 1200x800 pixel JPG image
2. Name it `default-image.jpg`
3. Place it in this `public` folder
4. Update the code to use `.jpg` instead of `.svg`

## Recipe Images

**Important:** Recipe images should NOT be placed in `src/data/recipes/` for production.

Instead, you have two options:

### Option 1: Use Public Folder (Recommended for now)
1. Create folder structure: `public/images/recipes/{category}/`
2. Place your JPG images there (e.g., `public/images/recipes/breakfast/omleta-cu-branza.jpg`)
3. Update the code to use `/images/recipes/` instead of `/src/data/recipes/`

### Option 2: Import as Modules
Import images in your components using ES6 imports, which allows Vite to process and optimize them.

## Current Setup

- Default image: `/default-image.svg` (placeholder)
- Recipe images: Currently trying to load from `/src/data/recipes/` which won't work in production

**Action needed:** Move recipe images to `public/images/recipes/` and update the image paths in the components.
