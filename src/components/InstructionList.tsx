import React from 'react';
import { MultilingualText } from '../types/common';
import { useLanguage } from '../hooks/useLanguage';

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
    <div className="space-y-2">
      <ol className="space-y-2">
        {instructions[language].map((instruction, index) => (
          <li
            key={index}
            className="flex gap-2 sm:gap-3 text-base text-gray-800 dark:text-gray-200"
          >
            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-accent-light dark:bg-accent-dark text-white font-bold text-base">
              {index + 1}
            </span>
            <p className="flex-1 pt-0.5 sm:pt-1 leading-relaxed">
              {instruction}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
};
