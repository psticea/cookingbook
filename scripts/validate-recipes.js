#!/usr/bin/env node

/**
 * Recipe Validation Script
 * 
 * Validates all recipe JSON files against the recipe schema.
 * Run with: node scripts/validate-recipes.js
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

// Initialize AJV validator
const ajv = new Ajv({ allErrors: true });

// Load schema
const schemaPath = path.join(__dirname, '../src/data/recipes/recipe.schema.json');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const validate = ajv.compile(schema);

// Recipe categories
const categories = [
  'breakfast',
  'pasta',
  'stir-fries',
  'soups-and-stews',
  'main-courses',
  'burgers-and-wraps',
  'salads-and-bites',
  'basics'
];

let totalRecipes = 0;
let validRecipes = 0;
let invalidRecipes = 0;
const errors = [];

console.log('🔍 Validating recipes...\n');

// Validate recipes in each category
categories.forEach(category => {
  const categoryPath = path.join(__dirname, '../src/data/recipes', category);
  
  if (!fs.existsSync(categoryPath)) {
    console.log(`⚠️  Category folder not found: ${category}`);
    return;
  }

  const files = fs.readdirSync(categoryPath).filter(file => file.endsWith('.json'));
  
  files.forEach(file => {
    totalRecipes++;
    const filePath = path.join(categoryPath, file);
    const recipeId = file.replace('.json', '');
    
    try {
      const recipeData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const valid = validate(recipeData);
      
      if (valid) {
        validRecipes++;
        console.log(`✅ ${category}/${file}`);
      } else {
        invalidRecipes++;
        console.log(`❌ ${category}/${file}`);
        errors.push({
          file: `${category}/${file}`,
          errors: validate.errors
        });
      }
    } catch (error) {
      invalidRecipes++;
      console.log(`❌ ${category}/${file} - Parse Error`);
      errors.push({
        file: `${category}/${file}`,
        errors: [{ message: error.message }]
      });
    }
  });
});

// Print summary
console.log('\n' + '='.repeat(50));
console.log('📊 Validation Summary');
console.log('='.repeat(50));
console.log(`Total recipes: ${totalRecipes}`);
console.log(`✅ Valid: ${validRecipes}`);
console.log(`❌ Invalid: ${invalidRecipes}`);

// Print detailed errors
if (errors.length > 0) {
  console.log('\n' + '='.repeat(50));
  console.log('❌ Validation Errors');
  console.log('='.repeat(50));
  
  errors.forEach(({ file, errors: errs }) => {
    console.log(`\n📄 ${file}:`);
    errs.forEach(err => {
      if (err.instancePath) {
        console.log(`  • ${err.instancePath}: ${err.message}`);
      } else {
        console.log(`  • ${err.message}`);
      }
    });
  });
  
  process.exit(1);
} else {
  console.log('\n✨ All recipes are valid!');
  process.exit(0);
}
