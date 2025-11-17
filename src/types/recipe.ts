/**
 * Recipe-related type definitions
 */

import { MultilingualText } from './common';

export type EffortLevel = 'easy' | 'medium' | 'hard';

export interface Ingredient {
  name: MultilingualText;
  quantity: number;
  unit: MultilingualText;
}

export interface Recipe {
  id: string;
  category: string;
  title: MultilingualText;
  prepTime: number; // minutes
  servings: number;
  effortLevel: EffortLevel;
  image: string; // URL to 1200x1200 image
  ingredients: Ingredient[];
  instructions: MultilingualText<string[]>;
  personalNotes: MultilingualText; // Personal opinions, preferences, backstory
  keywords: string[]; // Filter keywords
  dateAdded: string; // ISO 8601 date string (YYYY-MM-DD)
}
