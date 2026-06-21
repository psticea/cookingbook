import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './hooks/useLanguage';
import { TextSizeProvider } from './hooks/useTextSize';
import { ThemeProvider } from './hooks/useTheme';

// Lazy load page components
const HomePage = lazy(() => import('./pages/HomePage'));
const RecipePage = lazy(() => import('./pages/RecipePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const CookingBasicsPage = lazy(() => import('./pages/CookingBasicsPage'));
const PricesPage = lazy(() => import('./pages/PricesPage'));

// Loading fallback component
const LoadingFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-bg-dark">
    <div className="text-xl text-ink-muted-light dark:text-ink-muted-dark">Loading...</div>
  </div>
);

function App() {
  return (
    <LanguageProvider>
      <TextSizeProvider>
        <ThemeProvider>
          <BrowserRouter basename="/cookingbook">
            <div className="min-h-screen bg-bg-light dark:bg-bg-dark text-ink-light dark:text-ink-dark lg:max-w-[40vw] mx-auto">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/recipe/:id" element={<RecipePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/cooking-basics" element={<CookingBasicsPage />} />
                  <Route path="/prices" element={<PricesPage />} />
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
