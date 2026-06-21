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
 * PersonalNotes — Card Stack design.
 * Dashed-border warm-tinted card with title + body.
 */
export const PersonalNotes: React.FC<PersonalNotesProps> = ({ notes }) => {
  const { language } = useLanguage();

  if (!notes[language] || notes[language].trim() === '') return null;

  return (
    <section className="mt-6 bg-card-light dark:bg-card-dark rounded-r-2xl border-l-4 border-brand-warm py-4 pl-5 pr-5">
      <h3 className="font-sans text-[11px] font-bold tracking-[0.14em] uppercase text-brand-warm mb-2">
        {getTranslation('personalNotes', language)}
      </h3>
      <p className="font-serif italic text-base leading-relaxed text-ink-muted-light dark:text-ink-muted-dark whitespace-pre-line">
        {notes[language]}
      </p>
    </section>
  );
};
