import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">About</h1>
        {/* About content will be added in a later task */}
        <p className="text-gray-600 dark:text-gray-400">About content coming soon...</p>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
