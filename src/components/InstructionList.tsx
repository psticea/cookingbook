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
            className="flex gap-2 text-base text-text-main-light dark:text-text-main-dark"
          >
            <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-accent-light dark:bg-accent-dark text-white font-bold text-xs">
              {index + 1}
            </span>
            <p className="flex-1 pt-0.5 leading-relaxed">
              {instruction}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
};
