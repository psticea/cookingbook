/**
 * Common utility types for multilingual content
 */

export type Language = 'ro' | 'en';

export type TextSize = 'small' | 'medium' | 'large';

export type Theme = 'dark' | 'light';

/**
 * Generic type for multilingual content
 * Supports both simple strings and complex types (arrays, objects, etc.)
 */
export type MultilingualText<T = string> = {
  ro: T;
  en: T;
};

/**
 * User preference types
 */
export interface UserPreferences {
  language: Language;
  textSize: TextSize;
  theme: Theme;
}
