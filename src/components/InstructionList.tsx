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
    <section className="mb-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">
        {getTranslation('instructions', language)}
      </h2>

      <ol className="space-y-3 sm:space-y-4">
        {instructions[language].map((instruction, index) => (
          <li
            key={index}
            className="flex gap-2 sm:gap-3 text-sm sm:text-base text-gray-800 dark:text-gray-200"
          >
            <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-accent-light dark:bg-accent-dark text-white font-bold text-sm sm:text-base">
              {index + 1}
            </span>
            <p className="flex-1 pt-0.5 sm:pt-1 leading-relaxed">
              {instruction}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
};
