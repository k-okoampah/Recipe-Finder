import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Star } from 'lucide-react';
import FavoriteButton from './FavoriteButton.jsx';
import { useRatings } from '../hooks/useRatings.js';

const FALLBACK_RECIPE_IMAGE =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

/**
 * Reusable RecipeCard Component
 * 
 * Palette:
 * - White (#FFFFFF): card surface, category pill
 * - Dark Blue (#003B73): title, cuisine labels
 * - Primary Blue (#0056B3): link, icons, hover accents
 * - Dark Text (#212529): body text
 * - Yellow (#FFC107): favorite accent
 * - Light Gray (#F5F7FA): subtle backgrounds
 *
 * @param {Object} props
 * @param {Object} props.recipe - Normalized recipe data object
 * @param {boolean} [props.isFavorite=false]
 * @param {Function} [props.onToggleFavorite]
 * @param {Function} [props.onSelect]
 */
export default function RecipeCard({
  recipe,
  isFavorite = false,
  onToggleFavorite,
  onSelect,
}) {
  if (!recipe) return null;

  const {
    idMeal,
    strMeal,
    strMealThumb,
    strCategory,
    strArea,
    prepTime,
    difficulty,
  } = recipe;

  const displayTitle = strMeal && strMeal.trim() !== '' ? strMeal : 'Artisan Recipe';
  const displayPrepTime = prepTime || '25-30 min';
  const displayDifficulty = difficulty || 'Easy';

  const { getRecipeRating } = useRatings();
  const userRating = getRecipeRating(idMeal);

  const [imageSrc, setImageSrc] = useState(strMealThumb || FALLBACK_RECIPE_IMAGE);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageSrc(strMealThumb || FALLBACK_RECIPE_IMAGE);
    setImageError(false);
  }, [strMealThumb]);

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      setImageSrc(FALLBACK_RECIPE_IMAGE);
    }
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(recipe);
    }
  };

  const cuisine = strArea && strArea.toLowerCase() !== 'unknown' && strArea.trim() !== '' ? strArea : null;
  const category = strCategory && strCategory.toLowerCase() !== 'unknown' && strCategory.trim() !== '' ? strCategory : null;
  const originCategoryText = [cuisine, category].filter(Boolean).join(' · ');

  return (
    <article
      id={`recipe-card-${idMeal}`}
      aria-labelledby={`recipe-title-${idMeal}`}
      className="group relative bg-white rounded-xl border border-[#E2E8F0] overflow-hidden hover:border-[#94A3B8] transition-colors duration-150 flex flex-col h-full select-none"
    >
      {/* Recipe Image Container with strict 4:3 aspect ratio */}
      <div
        className="relative w-full aspect-[4/3] bg-[#F1F5F9] overflow-hidden shrink-0"
        style={{ aspectRatio: '4 / 3' }}
      >
        <img
          src={imageSrc}
          alt={displayTitle}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={handleImageError}
          className="w-full h-full object-cover block"
          style={{ objectFit: 'cover' }}
        />

        {/* Favorite Button */}
        <div
          className="absolute top-2.5 right-2.5 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <FavoriteButton
            id={`fav-btn-${idMeal}`}
            isFavorite={isFavorite}
            onToggle={() => onToggleFavorite && onToggleFavorite(recipe)}
            recipeName={displayTitle}
            size="sm"
          />
        </div>
      </div>

      {/* Culinary Details Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Cuisine metadata */}
          <div className="text-xs font-medium text-[#64748B] mb-1.5 truncate">
            {originCategoryText || 'Recipe'}
          </div>

          {/* Clean, simplified Recipe Name */}
          <h3
            id={`recipe-title-${idMeal}`}
            className="font-sans font-semibold text-base text-[#1E293B] group-hover:text-[#0056B3] transition-colors leading-snug line-clamp-2 break-words"
          >
            <button
              type="button"
              onClick={handleCardClick}
              className="text-left font-inherit text-inherit hover:underline focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] focus-visible:ring-offset-2 rounded-xs after:absolute after:inset-0 after:z-10 cursor-pointer"
            >
              {displayTitle}
            </button>
          </h3>
        </div>

        {/* Short Metadata & Action */}
        <div className="mt-3 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
          <div className="flex items-center gap-1.5">
            <span>{displayPrepTime}</span>
            {userRating > 0 && (
              <>
                <span className="text-[#CBD5E1]" aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 font-medium text-[#0F172A]" title={`You rated this ${userRating} out of 5 stars`}>
                  <Star size={11} className="fill-[#FFC107] text-[#FFC107]" aria-hidden="true" />
                  <span>{userRating}/5</span>
                </span>
              </>
            )}
          </div>
          <span className="text-[#0056B3] font-medium flex items-center gap-0.5" aria-hidden="true">
            <span>View</span>
            <ArrowUpRight size={13} />
          </span>
        </div>
      </div>
    </article>
  );
}
