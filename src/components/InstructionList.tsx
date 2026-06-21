import React from 'react';
import { MultilingualText } from '../types/common';
import { useLanguage } from '../hooks/useLanguage';

interface InstructionListProps {
  instructions: MultilingualText<string[]>;
}

/**
 * InstructionList — editorial design.
 * Numbered steps with serif "01 / 02 / 03" markers and ample reading width.
 */
export const InstructionList: React.FC<InstructionListProps> = ({ instructions }) => {
  const { language } = useLanguage();

  return (
    <ol className="grid gap-5 px-1 py-1 list-none">
      {instructions[language].map((instruction, index) => (
        <li
          key={index}
          className="grid grid-cols-[2.25rem_1fr] gap-x-4 items-start"
        >
          <span className="font-serif font-semibold text-2xl text-brand-warm leading-none tabular-nums pt-0.5">
            {String(index + 1).padStart(2, '0')}
          </span>
          <p className="text-base leading-relaxed text-ink-light dark:text-ink-dark">
            {instruction}
          </p>
        </li>
      ))}
    </ol>
  );
};
