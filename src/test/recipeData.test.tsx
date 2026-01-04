import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useRecipeData, getRecipeById, getRecipesByCategory, getRecipesByKeywords } from '../hooks/useRecipeData';
import { Recipe } from '../types/recipe';

describe('useRecipeData', () => {
  it('loads all recipes successfully', async () => {
    const { result } = renderHook(() => useRecipeData());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.recipes).toHaveLength(19);
    expect(result.current.error).toBeNull();
  });

  it('loads recipes with correct structure', async () => {
    const { result } = renderHook(() => useRecipeData());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    const firstRecipe = result.current.recipes[0];
    expect(firstRecipe).toHaveProperty('id');
    expect(firstRecipe).toHaveProperty('category');
    expect(firstRecipe).toHaveProperty('title');
    expect(firstRecipe).toHaveProperty('ingredients');
    expect(firstRecipe).toHaveProperty('instructions');
    expect(firstRecipe).toHaveProperty('personalNotes');
    expect(firstRecipe).toHaveProperty('keywords');
    expect(firstRecipe).toHaveProperty('dateAdded');
  });
});

describe('getRecipeById', () => {
  const mockRecipes: Recipe[] = [
    {
      id: 'recipe-001',
      category: 'main-courses',
      title: { ro: 'Test Recipe', en: 'Test Recipe' },
      prepTime: 30,
      servings: 4,
      effortLevel: 'easy',
      image: '/images/recipes/main-courses/recipe-001.jpg',
      ingredients: [],
      instructions: { ro: [], en: [] },
      personalNotes: { ro: 'Test notes', en: 'Test notes' },
      keywords: ['test'],
      dateAdded: '2025-11-01',
    },
  ];

  it('returns recipe when ID exists', () => {
    const recipe = getRecipeById(mockRecipes, 'recipe-001');
    expect(recipe).toBeDefined();
    expect(recipe?.id).toBe('recipe-001');
  });

  it('returns undefined when ID does not exist', () => {
    const recipe = getRecipeById(mockRecipes, 'nonexistent');
    expect(recipe).toBeUndefined();
  });
});

describe('getRecipesByCategory', () => {
  const mockRecipes: Recipe[] = [
    {
      id: 'recipe-001',
      category: 'main-courses',
      title: { ro: 'Main 1', en: 'Main 1' },
      prepTime: 30,
      servings: 4,
      effortLevel: 'easy',
      image: '/images/recipes/main-courses/recipe-001.jpg',
      ingredients: [],
      instructions: { ro: [], en: [] },
      personalNotes: { ro: '', en: '' },
      keywords: [],
      dateAdded: '2025-11-01',
    },
    {
      id: 'recipe-002',
      category: 'breakfast',
      title: { ro: 'Dessert 1', en: 'Dessert 1' },
      prepTime: 20,
      servings: 2,
      effortLevel: 'easy',
      image: '/images/recipes/breakfast/recipe-002.jpg',
      ingredients: [],
      instructions: { ro: [], en: [] },
      personalNotes: { ro: '', en: '' },
      keywords: [],
      dateAdded: '2025-11-02',
    },
    {
      id: 'recipe-003',
      category: 'main-courses',
      title: { ro: 'Main 2', en: 'Main 2' },
      prepTime: 45,
      servings: 6,
      effortLevel: 'medium',
      image: '/images/recipes/main-courses/recipe-003.jpg',
      ingredients: [],
      instructions: { ro: [], en: [] },
      personalNotes: { ro: '', en: '' },
      keywords: [],
      dateAdded: '2025-11-03',
    },
  ];

  it('returns all recipes in specified category', () => {
    const mainCourses = getRecipesByCategory(mockRecipes, 'main-courses');
    expect(mainCourses).toHaveLength(2);
    expect(mainCourses.every(r => r.category === 'main-courses')).toBe(true);
  });

  it('returns empty array when category has no recipes', () => {
    const soups = getRecipesByCategory(mockRecipes, 'soup');
    expect(soups).toHaveLength(0);
  });
});

describe('getRecipesByKeywords', () => {
  const mockRecipes: Recipe[] = [
    {
      id: 'recipe-001',
      category: 'main-courses',
      title: { ro: 'Pork Dish', en: 'Pork Dish' },
      prepTime: 30,
      servings: 4,
      effortLevel: 'easy',
      image: '/images/recipes/main-courses/recipe-001.jpg',
      ingredients: [],
      instructions: { ro: [], en: [] },
      personalNotes: { ro: '', en: '' },
      keywords: ['pork', 'cabbage', 'tomato-based', 'boiling'],
      dateAdded: '2025-11-01',
    },
    {
      id: 'recipe-002',
      category: 'main-courses',
      title: { ro: 'Chicken Dish', en: 'Chicken Dish' },
      prepTime: 20,
      servings: 2,
      effortLevel: 'easy',
      image: '/images/recipes/main-courses/recipe-002.jpg',
      ingredients: [],
      instructions: { ro: [], en: [] },
      personalNotes: { ro: '', en: '' },
      keywords: ['chicken', 'tomato-based', 'baking'],
      dateAdded: '2025-11-02',
    },
    {
      id: 'recipe-003',
      category: 'main-courses',
      title: { ro: 'Vegetarian Dish', en: 'Vegetarian Dish' },
      prepTime: 45,
      servings: 6,
      effortLevel: 'medium',
      image: '/images/recipes/main-courses/recipe-003.jpg',
      ingredients: [],
      instructions: { ro: [], en: [] },
      personalNotes: { ro: '', en: '' },
      keywords: ['vegetarian', 'tomato-based', 'baking'],
      dateAdded: '2025-11-03',
    },
  ];

  it('returns all recipes when no keywords provided', () => {
    const filtered = getRecipesByKeywords(mockRecipes, []);
    expect(filtered).toHaveLength(3);
  });

  it('returns recipes matching single keyword', () => {
    const filtered = getRecipesByKeywords(mockRecipes, ['pork']);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('recipe-001');
  });

  it('returns recipes matching ALL keywords', () => {
    const filtered = getRecipesByKeywords(mockRecipes, ['tomato-based', 'baking']);
    expect(filtered).toHaveLength(2);
    expect(filtered.every(r => r.keywords.includes('tomato-based'))).toBe(true);
    expect(filtered.every(r => r.keywords.includes('baking'))).toBe(true);
  });

  it('returns empty array when no recipes match all keywords', () => {
    const filtered = getRecipesByKeywords(mockRecipes, ['pork', 'baking']);
    expect(filtered).toHaveLength(0);
  });
});
