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

  // Apply text size to HTML element
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing text size classes
    root.classList.remove('text-base', 'text-lg');
    
    // Add appropriate class based on text size
    if (textSize === 'large') {
      root.classList.add('text-lg');
    } else {
      root.classList.add('text-base');
    }
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
