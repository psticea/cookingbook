import React, { useState } from 'react';
import defaultImageUrl from '/default-image.jpg';

interface RecipeImageProps {
  recipeId: string;
  category: string;
  alt: string;
  className?: string;
}

/**
 * RecipeImage — the recipe's hero print (DESIGN.md → The Sharp Print Rule).
 * A 3:2 photograph on a Frame mount that "develops" once it has loaded.
 * Nothing is ever laid over it; the wall label sits below. Falls back to the
 * default image if the recipe has none.
 */
export const RecipeImage: React.FC<RecipeImageProps> = ({ recipeId, category, alt, className = '' }) => {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const imagePath = `${import.meta.env.BASE_URL}images/recipes/${category}/${recipeId}.jpg`;

  return (
    <figure className={`m-0 aspect-[3/2] overflow-hidden bg-frame ${className}`}>
      <img
        src={failed ? defaultImageUrl : imagePath}
        alt={alt}
        width={1200}
        height={800}
        decoding="async"
        {...{ fetchpriority: 'high' }}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setFailed(true);
          setLoaded(true);
        }}
        className={`photo block w-full h-full object-cover ${loaded ? 'develop' : 'opacity-0'}`}
      />
    </figure>
  );
};
