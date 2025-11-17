import React from 'react';
import { MultilingualText } from '../types/common';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';

interface InstructionListProps {
  instructions: MultilingualText<string[]>;
}

/**
 * InstructionList component
 * Displays numbered list of cooking instructions
 * Supports both Romanian and English instructions
 * Styled for readability with appropriate spacing
 */
export const InstructionList: React.FC<InstructionListProps> = ({ instructions }) => {
  const { language } = useLanguage();

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        {getTranslation('instructions', language)}
      </h2>

      <ol className="space-y-3">
        {instructions[language].map((instruction, index) => (
          <li
            key={index}
            className="flex gap-4 text-gray-800 dark:text-gray-200"
          >
            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-accent-light dark:bg-accent-dark text-white font-bold text-sm">
              {index + 1}
            </span>
            <p className="flex-1 pt-1 leading-relaxed">
              {instruction}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
};
