import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { Theme } from '../types';
import { useLocalStorage } from './useLocalStorage';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Provider component for theme preference
 * Default theme is 'light'
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<Theme>('userTheme', 'light');

  // Apply theme to HTML element
  useEffect(() => {
    const root = document.documentElement;
    
    root.classList.remove('dark', 'retro');
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'retro') {
      root.classList.add('retro');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to access theme context
 * @throws Error if used outside ThemeProvider
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
