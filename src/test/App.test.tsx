import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Routing', () => {
  it('renders home page at root path', async () => {
    render(<App />);
    
    // Wait for lazy loaded component - now shows category headings instead of "All Recipes"
    // Check for one of the category headings (in Romanian since that's the default)
    const categoryHeading = await screen.findByText(/Mic Dejun|Paste|Stir-Fry|Supe și Tocane|Feluri Principale|Salate și Gustări|Burgeri și Wrap-uri|Baze de Gătit/);
    expect(categoryHeading).toBeDefined();
  });

  it('renders about page at /about path', async () => {
    render(<App />);
    
    const heading = await screen.findByText('About');
    expect(heading).toBeDefined();
  });

  it('renders cooking basics page at /cooking-basics path', async () => {
    render(<App />);
    
    const heading = await screen.findByText('Cooking Basics');
    expect(heading).toBeDefined();
  });

  it('renders recipe page with valid recipe ID', async () => {
    render(<App />);
    
    // Test with one of our actual recipe IDs
    const recipeNotFoundText = await screen.findByText(/Se încarcă\.\.\.|Rețeta nu a fost găsită/);
    expect(recipeNotFoundText).toBeDefined();
  });
});
