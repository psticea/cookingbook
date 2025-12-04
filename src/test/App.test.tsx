import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from '../hooks/useLanguage';
import { TextSizeProvider } from '../hooks/useTextSize';
import { ThemeProvider } from '../hooks/useTheme';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import CookingBasicsPage from '../pages/CookingBasicsPage';
import RecipePage from '../pages/RecipePage';

// Wrapper component for tests
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <LanguageProvider>
    <TextSizeProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </TextSizeProvider>
  </LanguageProvider>
);

describe('App Routing', () => {
  it('renders home page at root path', async () => {
    render(
      <TestWrapper>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </MemoryRouter>
      </TestWrapper>
    );
    
    // Wait for lazy loaded component - now shows category headings instead of "All Recipes"
    // Check for one of the category headings (in Romanian since that's the default)
    // Categories appear in multiple places (side menu and main content), so we use findAllByText
    const categoryHeadings = await screen.findAllByText(/Mic Dejun|Paste|Stir-Fry/);
    expect(categoryHeadings.length).toBeGreaterThan(0);
  });

  it('renders about page at /about path', async () => {
    render(
      <TestWrapper>
        <MemoryRouter initialEntries={['/about']}>
          <Routes>
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </MemoryRouter>
      </TestWrapper>
    );
    
    // "Despre" appears in multiple places (menu links and page heading)
    const headings = await screen.findAllByText('Despre');
    expect(headings.length).toBeGreaterThan(0);
  });

  it('renders cooking basics page at /cooking-basics path', async () => {
    render(
      <TestWrapper>
        <MemoryRouter initialEntries={['/cooking-basics']}>
          <Routes>
            <Route path="/cooking-basics" element={<CookingBasicsPage />} />
          </Routes>
        </MemoryRouter>
      </TestWrapper>
    );
    
    // "Bazele Gătitului" appears in multiple places (menu links and page heading)
    const headings = await screen.findAllByText('Bazele Gătitului');
    expect(headings.length).toBeGreaterThan(0);
  });

  it('renders recipe page with valid recipe ID', async () => {
    render(
      <TestWrapper>
        <MemoryRouter initialEntries={['/recipe/boil-rice']}>
          <Routes>
            <Route path="/recipe/:id" element={<RecipePage />} />
          </Routes>
        </MemoryRouter>
      </TestWrapper>
    );
    
    // Test with one of our actual recipe IDs - should show ingredients section
    const ingredientsHeading = await screen.findByText('Ingrediente');
    expect(ingredientsHeading).toBeDefined();
  });
});
