import React, { useState } from 'react';
import defaultImageUrl from '/default-image.jpg';

interface RecipeImageProps {
  recipeId: string;
  category: string;
  alt: string;
}

/**
 * RecipeImage component
 * Displays 1200x800 recipe image with lazy loading
 * Loads images from recipe folder as .jpg files
 * Falls back to default image if specific image doesn't exist
 * Responsive for mobile and desktop
 */
export const RecipeImage: React.FC<RecipeImageProps> = ({ recipeId, category, alt }) => {
  const [imageError, setImageError] = useState(false);
  
  // Construct image path from public/images/recipes folder
  const imagePath = `/images/recipes/${category}/${recipeId}.jpg`;
  const defaultImage = defaultImageUrl;

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="mb-6 w-full">
      <img
        src={imageError ? defaultImage : imagePath}
        alt={alt}
        loading="lazy"
        onError={handleImageError}
        className="w-full aspect-[3/2] object-cover rounded-lg shadow-md"
      />
    </div>
  );
};
