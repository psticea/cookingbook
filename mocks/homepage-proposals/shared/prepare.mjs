import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const shared = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(shared, '../../..');
const readJson = relative => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const bundled = await build({
  entryPoints: [path.join(root, 'src/utils/pricing.ts')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  write: false,
});
const { calculateRecipeCost } = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`);
const categories = readJson('src/data/categories.json');
const filters = readJson('src/data/filter-keywords.json').filter(filter => filter.type !== 'difficulty');
const recipes = [];
fs.mkdirSync(path.join(shared, 'images'), { recursive: true });

for (const category of categories) {
  const directory = path.join(root, 'src/data/recipes', category.id);
  for (const file of fs.readdirSync(directory).filter(name => name.endsWith('.json'))) {
    const recipe = JSON.parse(fs.readFileSync(path.join(directory, file), 'utf8'));
    const id = path.basename(file, '.json');
    const cost = calculateRecipeCost(recipe, 'en');
    const image = `${id}.webp`;
    fs.copyFileSync(
      path.join(root, 'public/images/recipes', category.id, `${id}.thumb.webp`),
      path.join(shared, 'images', image)
    );
    recipes.push({
      id,
      title: recipe.title,
      category: category.id,
      minutes: recipe.prepTime,
      servings: recipe.servings,
      effort: recipe.effortLevel,
      keywords: recipe.keywords,
      ingredients: recipe.ingredients.filter(item => 'name' in item).map(item => item.name),
      price: cost.pricePerServing,
      priceStatus: cost.status,
      unpricedCount: cost.unpricedIngredientCount,
      image,
      dateAdded: recipe.dateAdded,
    });
  }
}
const payload = {
  brand: "Paul's Cookbook",
  recipeCount: recipes.length,
  categories,
  filters,
  recipes,
  recipeBase: 'http://127.0.0.1:5173/cookingbook/recipe/',
  appBase: 'http://127.0.0.1:5173/cookingbook/',
};
fs.writeFileSync(path.join(shared, 'catalogue.js'), `window.COOKBOOK_DATA = ${JSON.stringify(payload, null, 2)};\n`, 'utf8');
console.log(`Prepared ${recipes.length} real recipes, ${categories.length} categories and matching local images.`);
