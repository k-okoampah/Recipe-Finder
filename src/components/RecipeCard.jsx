import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Star } from 'lucide-react';
import FavoriteButton from './FavoriteButton.jsx';
import { useRatings } from '../hooks/useRatings.js';
import { NEUTRAL_RECIPE_IMAGE } from '../utils/imageFallback.js';

/**
 * Reusable RecipeCard Component
 * 
 * Optimized for rapid image loading, strict aspect ratios,
 * and zero layout shifts (CLS).
 * 
 * Strict Image Relationship:
 * idMeal → strMeal → strMealThumb
 * Always renders the official image belonging to this recipe.
 * If missing or broken, uses a clean neutral placeholder.
 *
 * @param {Object} props
 * @param {Object} props.recipe - Normalized recipe data object
 * @param {boolean} [props.isFavorite=false]
 * @param {Function} [props.onToggleFavorite]
 * @param {Function} [props.onSelect]
 * @param {boolean} [props.priority=false] - When true, loads eagerly with high fetchPriority (above the fold)
 */
function RecipeCard({
  recipe,
  isFavorite = false,
  onToggleFavorite,
  onSelect,
  priority = false,
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

  const displayTitle = strMeal && strMeal.trim() !== '' ? strMeal : 'Recipe';
  const displayPrepTime = prepTime || '25-30 min';

  const { getRecipeRating } = useRatings();
  const userRating = getRecipeRating(idMeal);

  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);

  // Check if image is already cached or needs loading when recipe changes
  useEffect(() => {
    setHasError(false);
    if (imgRef.current && imgRef.current.complete) {
      if (imgRef.current.naturalWidth > 0) {
        setIsLoaded(true);
      } else {
        setHasError(true);
      }
    } else {
      setIsLoaded(false);
    }
  }, [idMeal, strMealThumb]);

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
      {/* Recipe Image Container with fixed 4:3 aspect ratio preventing layout shifts */}
      <div
        className="recipe-image-container relative w-full aspect-[4/3] bg-[#F1F5F9] overflow-hidden shrink-0"
        style={{ aspectRatio: '4 / 3' }}
      >
        {/* Lightweight loading skeleton while image decodes */}
        {!isLoaded && !hasError && (
          <div
            className="absolute inset-0 bg-[#E2E8F0] animate-pulse"
            aria-hidden="true"
          />
        )}

        <img
          ref={imgRef}
          key={idMeal}
          src={hasError || !strMealThumb ? NEUTRAL_RECIPE_IMAGE : strMealThumb}
          alt={displayTitle}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'low'}
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover block transition-opacity duration-200 ${
            isLoaded || hasError ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Cuisine metadata */}
          <div className="text-[13px] font-medium text-[#64748B] mb-1.5 truncate">
            {originCategoryText || 'Recipe'}
          </div>

          {/* Clean Recipe Name */}
          <h3
            id={`recipe-title-${idMeal}`}
            className="font-semibold text-[18px] sm:text-[19px] text-[#1E293B] group-hover:text-[#0056B3] transition-colors leading-snug line-clamp-2 break-words"
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

        {/* Metadata & Action */}
        <div className="mt-3.5 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-[13px] text-[#64748B]">
          <div className="flex items-center gap-1.5 font-medium">
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
          <span className="text-[#0056B3] font-semibold flex items-center gap-0.5" aria-hidden="true">
            <span>View</span>
            <ArrowUpRight size={13} />
          </span>
        </div>
      </div>
    </article>
  );
}

export default React.memo(RecipeCard);
