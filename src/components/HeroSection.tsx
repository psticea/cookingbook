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
    <div className="relative mb-8 overflow-hidden rounded-2xl">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 dark:from-amber-600 dark:via-orange-600 dark:to-red-600"></div>
      
      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}></div>
      </div>

      {/* Content */}
      <div className="relative px-6 sm:px-8 py-12 sm:py-16 flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white font-display mb-3 drop-shadow-lg">
          {content.title}
        </h1>
        
        <p className="text-lg sm:text-xl text-white/95 font-medium mb-6 drop-shadow-md max-w-2xl">
          {content.subtitle}
        </p>

        <p className="text-base sm:text-lg text-white/85 mb-8 drop-shadow-md max-w-2xl">
          {content.description}
        </p>

        {/* Stats */}
        <div className="flex gap-8 justify-center flex-wrap">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/30">
            <div className="text-3xl sm:text-4xl font-bold text-white drop-shadow">{totalRecipes}</div>
            <div className="text-sm text-white/90 mt-1">{language === 'ro' ? 'Rețete' : 'Recipes'}</div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/30">
            <div className="text-3xl sm:text-4xl font-bold text-white drop-shadow">✨</div>
            <div className="text-sm text-white/90 mt-1">{language === 'ro' ? 'Testate' : 'Tested'}</div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/30">
            <div className="text-3xl sm:text-4xl font-bold text-white drop-shadow">🌍</div>
            <div className="text-sm text-white/90 mt-1">{language === 'ro' ? 'Bilingv' : 'Bilingual'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
