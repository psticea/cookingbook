import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';

interface RecipeImageProps {
  src: string;
  alt: string;
}

/**
 * RecipeImage component
 * Displays 1200x1200 recipe image with lazy loading
 * Handles image load errors with placeholder
 * Responsive for mobile and desktop
 */
export const RecipeImage: React.FC<RecipeImageProps> = ({ src, alt }) => {
  const { language } = useLanguage();
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="mb-6 w-full">
      {imageError ? (
        // Placeholder for failed image loads
        <div className="w-full aspect-square bg-gray-200 dark:bg-gray-700 flex flex-col items-center justify-center rounded-lg">
          <span className="text-6xl mb-4">🍽️</span>
          <p className="text-gray-600 dark:text-gray-400 text-center px-4">
            {getTranslation('imageLoadError', language)}
          </p>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={handleImageError}
          className="w-full aspect-square object-cover rounded-lg shadow-md"
        />
      )}
    </div>
  );
};
