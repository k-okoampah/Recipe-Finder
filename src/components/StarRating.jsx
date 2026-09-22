import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useRatings } from '../hooks/useRatings.js';

/**
 * 5-Star Rating Component for Recipe Detail Views
 *
 * Requirements:
 * - 5-star rating system
 * - Neutral gray (#CBD5E1) for unselected stars
 * - Brand yellow (#FFC107) for active ratings
 * - Persisted locally or linked to user profiles when authenticated
 *
 * @param {Object} props
 * @param {string|number} props.recipeId - The meal ID being rated
 * @param {string} [props.recipeTitle='Recipe'] - Title of recipe for accessibility
 * @param {string} [props.className='']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 */
export default function StarRating({
  recipeId,
  recipeTitle = 'Recipe',
  className = '',
  size = 'md',
}) {
  const { getRecipeRating, setRecipeRating, removeRecipeRating, isLinkedToProfile } = useRatings();
  const currentRating = getRecipeRating(recipeId);
  const [hoverRating, setHoverRating] = useState(0);

  const starSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const handleStarClick = (starValue) => {
    if (currentRating === starValue) {
      // Toggle off / clear if clicking the current rating
      removeRecipeRating(recipeId);
    } else {
      setRecipeRating(recipeId, starValue);
    }
  };

  const activeStarCount = hoverRating > 0 ? hoverRating : currentRating;

  return (
    <div
      id={`star-rating-container-${recipeId}`}
      className={`flex flex-col sm:flex-row sm:items-center gap-2 ${className}`}
      role="group"
      aria-label={`Rating for ${recipeTitle}`}
    >
      {/* 5-Star Controls */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((starValue) => {
          const isActive = starValue <= activeStarCount;
          return (
            <button
              key={starValue}
              type="button"
              id={`star-btn-${recipeId}-${starValue}`}
              onClick={() => handleStarClick(starValue)}
              onMouseEnter={() => setHoverRating(starValue)}
              onMouseLeave={() => setHoverRating(0)}
              aria-label={`Rate ${starValue} of 5 stars`}
              aria-pressed={currentRating === starValue}
              title={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
              className="p-1 rounded-sm cursor-pointer transition-colors duration-150 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3]"
            >
              <Star
                size={starSizes[size] || 20}
                aria-hidden="true"
                className={`transition-colors duration-150 ${
                  isActive
                    ? 'fill-[#FFC107] text-[#FFC107]'
                    : 'text-[#CBD5E1] fill-none hover:text-[#FFC107]'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Rating Label & Profile Link Status */}
      <div className="flex items-center gap-2 text-xs">
        {currentRating > 0 ? (
          <>
            <span className="font-semibold text-[#0F172A]">
              {currentRating} of 5 stars
            </span>
            <span className="text-[#94A3B8]" aria-hidden="true">·</span>
            <span className="text-[#64748B]">
              {isLinkedToProfile ? 'Saved to profile' : 'Saved locally'}
            </span>
            <button
              type="button"
              onClick={() => removeRecipeRating(recipeId)}
              className="text-[#94A3B8] hover:text-[#0056B3] underline ml-1 cursor-pointer transition-colors"
              title="Remove your rating"
            >
              Clear
            </button>
          </>
        ) : (
          <span className="text-[#64748B]">
            {hoverRating > 0
              ? `Rate ${hoverRating} star${hoverRating > 1 ? 's' : ''}`
              : 'Tap to rate'}
          </span>
        )}
      </div>
    </div>
  );
}
