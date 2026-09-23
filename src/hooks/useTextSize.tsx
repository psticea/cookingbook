import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { TextSize } from '../types';
import { useLocalStorage } from './useLocalStorage';

interface TextSizeContextType {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
}

const TextSizeContext = createContext<TextSizeContextType | undefined>(undefined);

interface TextSizeProviderProps {
  children: ReactNode;
}

/**
 * Provider component for text size preference
 * Default text size is 'normal'
 */
export const TextSizeProvider: React.FC<TextSizeProviderProps> = ({ children }) => {
  const [textSize, setTextSize] = useLocalStorage<TextSize>('userTextSize', 'normal');

  // Apply text size to the HTML element; CSS scales the root to 112.5% for 'large'.
  useEffect(() => {
    document.documentElement.dataset.text = textSize;
  }, [textSize]);

  return (
    <TextSizeContext.Provider value={{ textSize, setTextSize }}>
      {children}
    </TextSizeContext.Provider>
  );
};

/**
 * Hook to access text size context
 * @throws Error if used outside TextSizeProvider
 */
export const useTextSize = (): TextSizeContextType => {
  const context = useContext(TextSizeContext);
  if (!context) {
    throw new Error('useTextSize must be used within a TextSizeProvider');
  }
  return context;
};
