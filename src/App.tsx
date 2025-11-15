import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './hooks/useLanguage';
import { TextSizeProvider } from './hooks/useTextSize';
import { ThemeProvider } from './hooks/useTheme';

// Lazy load page components
const HomePage = lazy(() => import('./pages/HomePage'));
const RecipePage = lazy(() => import('./pages/RecipePage'));
const FilterPage = lazy(() => import('./pages/FilterPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const CookingBasicsPage = lazy(() => import('./pages/CookingBasicsPage'));

// Loading fallback component
const LoadingFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-xl text-gray-600 dark:text-gray-400">Loading...</div>
  </div>
);

function App() {
  return (
    <LanguageProvider>
      <TextSizeProvider>
        <ThemeProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-primary-light dark:bg-primary-dark text-gray-900 dark:text-gray-100">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/recipe/:id" element={<RecipePage />} />
                  <Route path="/filter" element={<FilterPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/cooking-basics" element={<CookingBasicsPage />} />
                </Routes>
              </Suspense>
            </div>
          </BrowserRouter>
        </ThemeProvider>
      </TextSizeProvider>
    </LanguageProvider>
  );
}

export default App;
