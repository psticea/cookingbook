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
    <section className="rounded-2xl p-5 border border-dashed border-brand-warm bg-[#fff5f5] dark:bg-[#3a2925]">
      <h3 className="font-display text-sm font-bold text-brand-warm mb-1.5 tracking-[0.08em] uppercase">
        {getTranslation('personalNotes', language)}
      </h3>
      <p className="text-base text-ink-muted-light dark:text-ink-muted-dark leading-relaxed whitespace-pre-line">
        {notes[language]}
      </p>
    </section>
  );
};
