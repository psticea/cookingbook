import React from 'react';
import { MultilingualText } from '../types/common';
import { useLanguage } from '../hooks/useLanguage';

interface InstructionListProps {
  instructions: MultilingualText<string[]>;
}

/**
 * InstructionList — numbered steps (DESIGN.md → Instructions): Headline-width
 * figures in China Marker beside Body text at 1.6, max 65ch.
 */
export const InstructionList: React.FC<InstructionListProps> = ({ instructions }) => {
  const { language } = useLanguage();

  return (
    <ol className="grid gap-6 max-w-[65ch] list-none m-0 p-0">
      {instructions[language].map((instruction, index) => (
        <li key={index} className="grid grid-cols-[2.25rem_minmax(0,1fr)] sm:grid-cols-[3rem_minmax(0,1fr)] items-baseline gap-x-2">
          <span className="type-figure font-normal text-2xl leading-none text-mark">
            {String(index + 1).padStart(2, '0')}
          </span>
          <p className="m-0 text-base leading-[1.6] text-ink text-pretty break-words">{instruction}</p>
        </li>
      ))}
    </ol>
  );
};
