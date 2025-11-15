import { Language, Translations } from '../types';
import translationsData from '../data/translations.json';

// Type assertion for the imported JSON
const translations = translationsData as Translations;

/**
 * Get translation for a given key and language
 * 
 * @param key - The translation key
 * @param language - The language ('ro' or 'en')
 * @returns The translated string, or the key itself if translation is missing
 */
export function getTranslation(key: string, language: Language): string {
  try {
    const translation = translations[language][key];
    
    if (translation) {
      return translation;
    }
    
    // Fallback: try the other language
    const fallbackLanguage: Language = language === 'ro' ? 'en' : 'ro';
    const fallbackTranslation = translations[fallbackLanguage][key];
    
    if (fallbackTranslation) {
      console.warn(`Translation missing for key "${key}" in language "${language}", using fallback`);
      return fallbackTranslation;
    }
    
    // If no translation found in either language, return the key
    console.warn(`Translation missing for key "${key}" in both languages`);
    return key;
  } catch (error) {
    console.error(`Error getting translation for key "${key}":`, error);
    return key;
  }
}
