import React, { useState, useEffect } from 'react';
import { Clock, ChefHat, ArrowUpRight, Utensils } from 'lucide-react';
import FavoriteButton from './FavoriteButton.jsx';

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
      className="group relative bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs hover:shadow-md hover:border-[#0056B3] hover:-translate-y-1 transition-all duration-200 ease-out flex flex-col h-full select-none"
    >
      {/* Photography Container */}
      <div className="relative aspect-4/3 w-full bg-[#EAF4FF] overflow-hidden rounded-t-2xl">
        <img
          src={imageSrc}
          alt={`Freshly prepared ${displayTitle} dish`}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300 ease-out"
        />

        {/* Category Badge Pill */}
        {category && (
          <div className="absolute bottom-2.5 left-2.5 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-xs border border-[#E2E8F0] text-[#003B73] text-xs font-semibold shadow-xs">
              <Utensils size={11} aria-hidden="true" className="text-[#0056B3]" />
              <span>{category}</span>
            </span>
          </div>
        )}

        {/* Favorite Heart Button over top-right */}
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
          {/* Recipe Name */}
          <h3
            id={`recipe-title-${idMeal}`}
            className="font-serif font-bold text-base sm:text-lg text-[#003B73] group-hover:text-[#0056B3] transition-colors leading-snug line-clamp-2 mb-1.5 break-words"
          >
            <button
              type="button"
              onClick={handleCardClick}
              className="text-left font-inherit text-inherit hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0056B3] focus-visible:ring-offset-2 rounded-sm after:absolute after:inset-0 after:z-10 cursor-pointer"
            >
              {displayTitle}
            </button>
          </h3>

          {/* Cuisine / Category Subtitle */}
          <p className="text-xs sm:text-sm font-medium text-[#6c757d] truncate">
            {originCategoryText ? (
              <span>
                {cuisine && <span className="text-[#212529] font-semibold">{cuisine}</span>}
                {cuisine && category && <span className="mx-1.5 text-[#6c757d]" aria-hidden="true">·</span>}
                {category && <span className="text-[#0056B3] font-semibold">{category}</span>}
              </span>
            ) : (
              <span className="text-[#6c757d]">Culinary Dish</span>
            )}
          </p>
        </div>

        {/* Short Metadata & Footer Action */}
        <div className="mt-3.5 pt-3 border-t border-[#E2E8F0]">
          <div className="flex items-center justify-between text-xs text-[#6c757d] flex-wrap gap-y-1 gap-x-2">
            <div className="flex items-center gap-2 font-medium shrink-0">
              <span className="inline-flex items-center gap-1.5">
                <Clock size={12} aria-hidden="true" className="text-[#0056B3]" />
                <span className="text-[#212529]">{displayPrepTime}</span>
              </span>
              <span className="w-1 h-1 rounded-full bg-[#cbd5e1]" aria-hidden="true" />
              <span className="inline-flex items-center gap-1.5">
                <ChefHat size={12} aria-hidden="true" className="text-[#6c757d]" />
                <span>{displayDifficulty}</span>
              </span>
            </div>

            {/* View Recipe Action */}
            <span className="inline-flex items-center gap-1 text-[#0056B3] font-semibold group-hover:translate-x-0.5 transition-transform shrink-0" aria-hidden="true">
              <span>View Recipe</span>
              <ArrowUpRight size={13} />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
