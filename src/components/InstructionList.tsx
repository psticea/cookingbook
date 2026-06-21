import React from 'react';
import { MultilingualText } from '../types/common';
import { useLanguage } from '../hooks/useLanguage';

interface InstructionListProps {
  instructions: MultilingualText<string[]>;
}

/**
 * InstructionList — Card Stack design.
 * Compact numbered steps inside a single rounded card with hairline separators.
 */
export const InstructionList: React.FC<InstructionListProps> = ({ instructions }) => {
  const { language } = useLanguage();

  return (
    <ol className="bg-card-2-light dark:bg-card-2-dark rounded-2xl px-4 divide-y divide-line-2-light dark:divide-line-2-dark list-none">
      {instructions[language].map((instruction, index) => (
        <li
          key={index}
          className="flex gap-3 py-3 text-sm sm:text-base text-ink-light dark:text-ink-dark"
        >
          <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg bg-brand-warm text-white font-bold text-xs sm:text-sm">
            {index + 1}
          </span>
          <p className="flex-1 pt-0.5 leading-relaxed">{instruction}</p>
        </li>
      ))}
    </ol>
  );
};
