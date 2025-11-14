import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

describe('App Routing', () => {
  it('renders home page at root path', async () => {
    render(<App />);
    
    // Wait for lazy loaded component
    const heading = await screen.findByText('All Recipes');
    expect(heading).toBeDefined();
  });

  it('renders about page at /about path', async () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <App />
      </MemoryRouter>
    );
    
    const heading = await screen.findByText('About');
    expect(heading).toBeDefined();
  });

  it('renders filter page at /filter path', async () => {
    render(
      <MemoryRouter initialEntries={['/filter']}>
        <App />
      </MemoryRouter>
    );
    
    const heading = await screen.findByText('Filter Recipes');
    expect(heading).toBeDefined();
  });

  it('renders cooking basics page at /cooking-basics path', async () => {
    render(
      <MemoryRouter initialEntries={['/cooking-basics']}>
        <App />
      </MemoryRouter>
    );
    
    const heading = await screen.findByText('Cooking Basics');
    expect(heading).toBeDefined();
  });

  it('renders recipe page at /recipe/:id path', async () => {
    render(
      <MemoryRouter initialEntries={['/recipe/test-recipe-123']}>
        <App />
      </MemoryRouter>
    );
    
    const heading = await screen.findByText('Recipe Details');
    expect(heading).toBeDefined();
    
    const recipeId = await screen.findByText(/Recipe ID: test-recipe-123/);
    expect(recipeId).toBeDefined();
  });
});
