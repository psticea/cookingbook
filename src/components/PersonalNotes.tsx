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
      <div className="bg-secondary-light dark:bg-secondary-dark rounded-2xl p-5 shadow-sm">
        <h3 className="font-bold text-lg mb-2 text-text-main-light dark:text-text-main-dark">
          {getTranslation('personalNotes', language)}
        </h3>
        <p className="text-text-main-light dark:text-text-main-dark opacity-80 leading-relaxed whitespace-pre-line">
          {notes[language]}
        </p>
      </div>
    </section>
  );
};
