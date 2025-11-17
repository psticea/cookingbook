import React, { useState } from 'react';

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
  
  // Construct image path from src/data/recipes folder
  const imagePath = `/src/data/recipes/${category}/${recipeId}.jpg`;
  const defaultImage = '/src/data/recipes/default-image.jpg';

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
