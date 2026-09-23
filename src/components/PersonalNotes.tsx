import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';

interface PersonalNotesProps {
  notes: {
    ro: string;
    en: string;
  };
  className?: string;
  /** Unique heading id; the page may render the note in two layout slots. */
  headingId?: string;
}

const sentenceCase = (text: string, locale: string) =>
  text.charAt(0) + text.slice(1).toLocaleLowerCase(locale);

/** PersonalNotes — the cook's own note, on a faint China Marker wash (DESIGN.md → Notes and callouts). */
export const PersonalNotes: React.FC<PersonalNotesProps> = ({ notes, className = '', headingId = 'personal-notes' }) => {
  const { language } = useLanguage();

  if (!notes[language] || notes[language].trim() === '') return null;

  return (
    <section aria-labelledby={headingId} className={`bg-mark/[.07] rounded-ctl p-4 sm:p-5 ${className}`}>
      <h2 id={headingId} className="type-section text-mark">
        {sentenceCase(getTranslation('personalNotes', language), language)}
      </h2>
      <p className="mt-2 max-w-[65ch] text-base leading-[1.6] text-ink whitespace-pre-line break-words text-pretty">
        {notes[language]}
      </p>
    </section>
  );
};
