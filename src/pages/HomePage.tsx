import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">All Recipes</h1>
        {/* RecipeGrid will be added in a later task */}
        <p className="text-gray-600 dark:text-gray-400">Recipe grid coming soon...</p>
      </main>
    </div>
  );
};

export default HomePage;
