import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';

interface PersonalNotesProps {
  notes: {
    ro: string;
    en: string;
  };
}

/**
 * PersonalNotes component
 * Displays personal opinions, preferences, and backstory about the recipe
 * Supports both Romanian and English text
 */
export const PersonalNotes: React.FC<PersonalNotesProps> = ({ notes }) => {
  const { language } = useLanguage();

  // Don't render if notes are empty
  if (!notes[language] || notes[language].trim() === '') {
    return null;
  }

  return (
    <section className="mb-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">
        {getTranslation('personalNotes', language)}
      </h2>
      <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-3 sm:p-4 rounded-r-lg">
        <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
          {notes[language]}
        </p>
      </div>
    </section>
  );
};
