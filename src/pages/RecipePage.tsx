import React from 'react';
import { useParams } from 'react-router-dom';

const RecipePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Recipe Details</h1>
        {/* Recipe details will be added in a later task */}
        <p className="text-gray-600 dark:text-gray-400">
          Recipe ID: {id}
        </p>
        <p className="text-gray-600 dark:text-gray-400">Recipe content coming soon...</p>
      </main>
    </div>
  );
};

export default RecipePage;
