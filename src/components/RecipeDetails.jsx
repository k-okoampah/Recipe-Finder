import React, { useEffect, useState, useRef } from 'react';
import { X, MapPin, Tag, Youtube, ExternalLink, ChefHat, Check, Clock, Utensils, Heart, Sparkles } from 'lucide-react';
import FavoriteButton from './FavoriteButton.jsx';
import { extractIngredients } from '../services/recipeApi.js';

const FALLBACK_RECIPE_IMAGE =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

/**
 * Recipe Details Modal Component
 *
 * Palette:
 * - Primary Blue: #0056B3
 * - Dark Blue: #003B73
 * - Light Blue: #EAF4FF
 * - Yellow: #FFC107
 * - White: #FFFFFF
 * - Dark Text: #212529
 * - Light Gray: #F5F7FA
 *
 * @param {Object} props
 * @param {Object} props.recipe
 * @param {Function} props.onClose
 * @param {boolean} [props.isFavorite]
 * @param {Function} [props.onToggleFavorite]
 */
export default function RecipeDetails({
  recipe,
  onClose,
  isFavorite = false,
  onToggleFavorite,
}) {
  if (!recipe) return null;

  const [imageSrc, setImageSrc] = useState(recipe.strMealThumb || FALLBACK_RECIPE_IMAGE);
  const [imageError, setImageError] = useState(false);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (closeBtnRef.current) {
      closeBtnRef.current.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    setImageSrc(recipe.strMealThumb || FALLBACK_RECIPE_IMAGE);
    setImageError(false);
  }, [recipe.strMealThumb]);

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      setImageSrc(FALLBACK_RECIPE_IMAGE);
    }
  };

  const ingredients = extractIngredients(recipe);

  const title = recipe.strMeal || 'Culinary Recipe';
  const category = recipe.strCategory || 'Chef’s Special';
  const area = recipe.strArea || 'International';

  return (
    <div
      id="recipe-details-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipe-details-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-[#003B73]/40 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-3xl max-h-[92vh] sm:max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-[#E2E8F0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[#E2E8F0] bg-[#F5F7FA] shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#0056B3] text-white flex items-center justify-center shrink-0" aria-hidden="true">
              <ChefHat size={17} />
            </div>
            <span className="font-serif font-bold text-[#003B73] text-sm sm:text-base truncate">
              Recipe Details
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <FavoriteButton
              id="recipe-details-fav-btn"
              isFavorite={isFavorite}
              onToggle={() => onToggleFavorite && onToggleFavorite(recipe)}
              recipeName={title}
              size="sm"
            />
            <button
              ref={closeBtnRef}
              type="button"
              id="close-recipe-details-btn"
              onClick={onClose}
              className="w-8 h-8 min-w-[32px] min-h-[32px] flex items-center justify-center text-[#6c757d] hover:text-[#003B73] rounded-lg hover:bg-[#EAF4FF] transition-colors cursor-pointer border border-[#E2E8F0] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3]"
              aria-label={`Close recipe details for ${title}`}
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6 sm:space-y-7 overscroll-contain">
          {/* Top Overview Section */}
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
            <div className="w-full sm:w-1/2 aspect-4/3 rounded-xl overflow-hidden bg-[#EAF4FF] border border-[#E2E8F0] shadow-xs shrink-0 relative">
              <img
                src={imageSrc}
                alt={`Freshly prepared ${title} dish`}
                referrerPolicy="no-referrer"
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3 flex-1 min-w-0 w-full">
              <div className="flex flex-wrap gap-1.5 text-xs">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EAF4FF] text-[#0056B3] border border-[#d0e5ff] font-semibold">
                  <Tag size={11} aria-hidden="true" />
                  {category}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F5F7FA] text-[#003B73] border border-[#E2E8F0] font-semibold">
                  <MapPin size={11} aria-hidden="true" className="text-[#0056B3]" />
                  {area} Cuisine
                </span>
              </div>

              <h2 id="recipe-details-title" className="font-serif text-xl sm:text-2xl font-bold text-[#003B73] leading-tight break-words">
                {title}
              </h2>

              <p className="text-xs sm:text-sm text-[#212529]/80 leading-relaxed">
                {recipe.description || 'A classic, flavourful dish crafted with wholesome ingredients and traditional culinary techniques.'}
              </p>

              {/* Quick Info Badges */}
              <div className="flex items-center gap-3.5 py-2 border-y border-[#E2E8F0] text-xs text-[#6c757d]">
                <div className="flex items-center gap-1.5 font-medium">
                  <Clock size={14} aria-hidden="true" className="text-[#0056B3]" />
                  <span className="text-[#212529]">{recipe.prepTime || '35 mins'}</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-[#cbd5e1]" aria-hidden="true" />
                <div className="flex items-center gap-1.5 font-medium">
                  <Utensils size={14} aria-hidden="true" className="text-[#0056B3]" />
                  <span className="text-[#212529]">{recipe.servings || '4 Servings'}</span>
                </div>
              </div>

              {/* Actions & External Links */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  id="recipe-details-action-favorite"
                  onClick={() => onToggleFavorite && onToggleFavorite(recipe)}
                  aria-label={isFavorite ? `Remove ${title} from favorites` : `Add ${title} to favorites`}
                  aria-pressed={isFavorite}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-xl text-xs font-semibold transition-colors cursor-pointer border shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] focus-visible:ring-offset-1 ${
                    isFavorite
                      ? 'bg-[#FFF9E6] text-[#003B73] border-[#FFC107] hover:bg-[#fff3cc]'
                      : 'bg-white text-[#212529] border-[#E2E8F0] hover:bg-[#EAF4FF] hover:border-[#0056B3] hover:text-[#0056B3]'
                  }`}
                >
                  <Heart
                    size={14}
                    aria-hidden="true"
                    className={`transition-transform ${
                      isFavorite ? 'fill-[#FFC107] text-[#FFC107]' : 'text-[#0056B3]'
                    }`}
                  />
                  <span>{isFavorite ? 'Saved' : 'Save to Favorites'}</span>
                </button>

                {recipe.strYoutube && (
                  <a
                    href={recipe.strYoutube}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Watch ${title} cooking video on YouTube (opens in new tab)`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-xl bg-[#0056B3] hover:bg-[#003B73] text-white text-xs font-semibold transition-colors shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] focus-visible:ring-offset-1"
                  >
                    <Youtube size={14} aria-hidden="true" className="text-[#FFC107]" />
                    <span>Watch Video</span>
                  </a>
                )}

                {recipe.strSource && (
                  <a
                    href={recipe.strSource}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View original recipe source for ${title} (opens in new tab)`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-xl bg-white border border-[#E2E8F0] text-[#003B73] hover:text-[#0056B3] text-xs font-semibold hover:bg-[#EAF4FF] hover:border-[#0056B3] transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3]"
                  >
                    <ExternalLink size={13} aria-hidden="true" />
                    <span>Source</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Ingredients Grid */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#003B73]">
                Ingredients
              </h3>
              <span className="text-xs font-medium text-[#6c757d]">
                {ingredients.length > 0 ? `${ingredients.length} items required` : 'Chef preparation'}
              </span>
            </div>

            {ingredients.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ingredients.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] text-xs sm:text-sm gap-2"
                  >
                    <div className="flex items-center gap-2 text-[#212529] font-medium min-w-0">
                      <div className="w-4 h-4 rounded-full bg-[#EAF4FF] text-[#0056B3] flex items-center justify-center shrink-0" aria-hidden="true">
                        <Check size={11} className="text-[#0056B3]" />
                      </div>
                      <span className="break-words min-w-0">{item.ingredient}</span>
                    </div>
                    {item.measure && (
                      <span className="font-bold text-[#003B73] bg-white px-2 py-0.5 rounded-md border border-[#E2E8F0] text-xs shrink-0 whitespace-nowrap">
                        {item.measure}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] text-xs sm:text-sm text-[#6c757d] flex items-center gap-3">
                <Utensils size={16} aria-hidden="true" className="text-[#0056B3] shrink-0" />
                <span>
                  Individual ingredient measurements for this traditional dish are demonstrated in the linked preparation video and original culinary guide.
                </span>
              </div>
            )}
          </div>

          {/* Step-by-Step Cooking Instructions */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#003B73] pb-2 border-b border-[#E2E8F0]">
              Instructions
            </h3>
            {recipe.strInstructions && recipe.strInstructions.trim() !== '' ? (
              <div className="text-xs sm:text-sm text-[#212529] leading-relaxed whitespace-pre-line bg-[#F5F7FA] p-4 sm:p-5 rounded-xl border border-[#E2E8F0]">
                {recipe.strInstructions}
              </div>
            ) : (
              <div className="p-4 sm:p-5 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] text-xs sm:text-sm text-[#6c757d] leading-relaxed flex items-start gap-3">
                <Sparkles size={16} aria-hidden="true" className="text-[#FFC107] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#003B73] mb-1">Instructions in Preparation</p>
                  <p>
                    Please watch the preparation video above or visit the original culinary source to view the complete step-by-step technique.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
