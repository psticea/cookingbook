import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

interface HeroSectionProps {
  totalRecipes: number;
}

/**
 * HeroSection component
 * Displays an attractive banner with tagline and recipe count
 */
export const HeroSection: React.FC<HeroSectionProps> = ({ totalRecipes }) => {
  const { language } = useLanguage();

  const taglines = {
    en: {
      title: 'Culinary Creations',
      subtitle: 'Discover delicious recipes crafted with care',
      description: 'Explore a collection of tested recipes designed for home cooks',
    },
    ro: {
      title: 'Creații Culinare',
      subtitle: 'Descoperiți rețete delicioase pregătite cu grijă',
      description: 'Explorați o colecție de rețete testate gândite pentru bucătarii acasă',
    },
  };

  const content = taglines[language as keyof typeof taglines] || taglines.en;

  return (
    <div className="relative mb-12 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950/20 dark:via-neutral-900 dark:to-purple-950/20"></div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]">
        <div className="absolute top-10 right-10 w-64 h-64 bg-indigo-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative px-6 sm:px-8 py-16 sm:py-20 flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white font-display mb-4 tracking-tight">
          {content.title}
        </h1>
        
        <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 font-medium mb-3 max-w-2xl">
          {content.subtitle}
        </p>

        <p className="text-base sm:text-lg text-neutral-500 dark:text-neutral-500 mb-10 max-w-2xl">
          {content.description}
        </p>

        {/* Stats */}
        <div className="flex gap-6 justify-center flex-wrap">
          <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl px-6 py-4 border border-neutral-200/50 dark:border-neutral-700/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400">{totalRecipes}</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-medium">{language === 'ro' ? 'Rețete' : 'Recipes'}</div>
          </div>
          
          <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl px-6 py-4 border border-neutral-200/50 dark:border-neutral-700/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400">✨</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-medium">{language === 'ro' ? 'Testate' : 'Tested'}</div>
          </div>
          
          <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl px-6 py-4 border border-neutral-200/50 dark:border-neutral-700/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400">🌍</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-medium">{language === 'ro' ? 'Bilingv' : 'Bilingual'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
