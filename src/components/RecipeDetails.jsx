import React, { useEffect, useState, useRef } from 'react';
import { X, Youtube, ExternalLink, Check, Heart, Clock, Printer } from 'lucide-react';
import { extractIngredients } from '../services/recipeApi.js';
import StarRating from './StarRating.jsx';

const FALLBACK_RECIPE_IMAGE =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

function getYouTubeEmbedId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

function parseInstructions(text) {
  if (!text) return [];
  return text
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Recipe Details Modal Component
 *
 * Structure:
 * 1. Recipe Image
 * 2. Recipe Title
 * 3. Category / Cuisine
 * 4. Favorite Action & Print Recipe
 * 5. Ingredients (scannable checklist / print list)
 * 6. Instructions (scannable steps / print steps)
 * 7. YouTube Video
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
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const closeBtnRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

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
    setCheckedIngredients({});
  }, [recipe.idMeal, recipe.strMealThumb]);

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      setImageSrc(FALLBACK_RECIPE_IMAGE);
    }
  };

  const toggleIngredient = (idx) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const ingredients = extractIngredients(recipe);
  const instructions = parseInstructions(recipe.strInstructions);
  const youtubeEmbedId = getYouTubeEmbedId(recipe.strYoutube);

  const title = recipe.strMeal || 'Recipe';
  const category = recipe.strCategory || 'General';
  const area = recipe.strArea && recipe.strArea.toLowerCase() !== 'unknown' ? recipe.strArea : null;

  return (
    <div
      id="recipe-details-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipe-details-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/50 print:static print:inset-auto print:p-0 print:bg-transparent print:z-auto print:block"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl max-h-[90vh] rounded-xl overflow-hidden shadow-xl flex flex-col border border-[#E2E8F0] print:max-w-none print:max-h-none print:w-full print:shadow-none print:border-none print:rounded-none print:overflow-visible print:block print:bg-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar (Screen Only) */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#E2E8F0] bg-white shrink-0 print:hidden">
          <span className="text-xs font-semibold text-[#6c757d] uppercase tracking-wider">
            Recipe Details
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              id="recipe-details-header-print"
              onClick={handlePrint}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#0056B3] hover:text-[#003B73] hover:bg-[#EAF4FF] rounded-md transition-colors cursor-pointer border border-transparent hover:border-[#0056B3]/20"
              aria-label={`Print recipe for ${title}`}
              title="Print Recipe"
            >
              <Printer size={15} aria-hidden="true" />
              <span className="hidden sm:inline">Print Recipe</span>
            </button>
            <button
              ref={closeBtnRef}
              type="button"
              id="close-recipe-details-btn"
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-[#6c757d] hover:text-[#003B73] rounded-md hover:bg-[#F5F7FA] transition-colors cursor-pointer"
              aria-label={`Close details for ${title}`}
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Scrollable Recipe Content on Screen / Full Document Flow on Print */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6 print:overflow-visible print:p-0 print:space-y-4 print:block">
          {/* Print-Only Header: Clean Branding & Date */}
          <div className="hidden print:block pb-3 mb-4 border-b-2 border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-serif text-xl font-bold text-black tracking-tight">
                  CareerGhana Recipes
                </span>
                <p className="text-xs text-gray-600">Fresh Flavors & Authentic Culinary Showcase</p>
              </div>
              <div className="text-right text-xs text-gray-500">
                <span>{new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* 1. Recipe Image */}
          <div className="w-full aspect-16/9 rounded-lg overflow-hidden bg-[#EAF4FF] border border-[#E2E8F0] print:max-h-56 print:w-auto print:aspect-auto print:border-gray-300 print:mb-3 print:mx-auto">
            <img
              src={imageSrc}
              alt={title}
              referrerPolicy="no-referrer"
              onError={handleImageError}
              className="w-full h-full object-cover print:object-cover print:max-h-56"
            />
          </div>

          {/* 2. Recipe Title & 3. Category / Cuisine */}
          <div>
            <div className="text-xs font-semibold text-[#0056B3] print:text-gray-700 mb-1">
              {[category, area ? `${area} Cuisine` : null].filter(Boolean).join(' · ')}
            </div>
            <h1
              id="recipe-details-title"
              className="font-serif text-2xl sm:text-3xl font-bold text-[#003B73] print:text-black leading-tight mb-3 print:mb-1.5"
            >
              {title}
            </h1>

            {/* Print-Only Clean Metadata Banner */}
            <div className="hidden print:flex flex-wrap items-center gap-6 py-2 my-2.5 border-y border-gray-300 text-xs text-gray-800">
              {recipe.prepTime && (
                <span><strong>Prep / Cook Time:</strong> {recipe.prepTime}</span>
              )}
              {recipe.difficulty && (
                <span><strong>Difficulty:</strong> {recipe.difficulty}</span>
              )}
              {category && (
                <span><strong>Category:</strong> {category}</span>
              )}
              {area && (
                <span><strong>Cuisine:</strong> {area}</span>
              )}
              <span><strong>Servings:</strong> 4 – 6 servings</span>
            </div>

            {/* 4. Favorite Action, Print Action & Meta (Screen Only) */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 pb-4 border-b border-[#E2E8F0] print:hidden">
              <div className="flex items-center gap-3 text-xs text-[#6c757d]">
                {recipe.prepTime && (
                  <span className="flex items-center gap-1">
                    <Clock size={13} className="text-[#0056B3]" />
                    <span>{recipe.prepTime}</span>
                  </span>
                )}
                {recipe.strSource && (
                  <a
                    href={recipe.strSource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#0056B3] hover:underline"
                  >
                    <span>Original Source</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Print Recipe Button */}
                <button
                  type="button"
                  id="recipe-details-action-print"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer border bg-white text-[#212529] border-[#E2E8F0] hover:bg-[#EAF4FF] hover:border-[#0056B3] hover:text-[#0056B3]"
                  aria-label={`Print recipe for ${title}`}
                  title="Print this recipe (opens print dialog)"
                >
                  <Printer size={14} className="text-[#0056B3]" aria-hidden="true" />
                  <span>Print Recipe</span>
                </button>

                {/* Save to Favorites Button */}
                <button
                  type="button"
                  id="recipe-details-action-favorite"
                  onClick={() => onToggleFavorite && onToggleFavorite(recipe)}
                  aria-pressed={isFavorite}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer border ${
                    isFavorite
                      ? 'bg-[#FFF9E6] text-[#003B73] border-[#FFC107]'
                      : 'bg-white text-[#212529] border-[#E2E8F0] hover:bg-[#EAF4FF] hover:border-[#0056B3] hover:text-[#0056B3]'
                  }`}
                >
                  <Heart
                    size={14}
                    className={isFavorite ? 'fill-[#FFC107] text-[#FFC107]' : 'text-[#6c757d]'}
                  />
                  <span>{isFavorite ? 'Saved to Favorites' : 'Save to Favorites'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 5-Star Recipe Rating Section (Screen Only) */}
          <div
            id="recipe-details-rating-box"
            className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] print:hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-[#0F172A]">
                  Recipe Rating
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Share your personal rating for this dish
                </p>
              </div>
              <StarRating
                recipeId={recipe.idMeal}
                recipeTitle={title}
                size="md"
              />
            </div>
          </div>

          {/* 5. Ingredients Section */}
          <div className="print-avoid-break">
            <div className="flex items-center justify-between mb-3 print:mb-2 border-b print:border-b-2 print:border-gray-800 pb-1.5">
              <h2 className="font-serif font-bold text-lg text-[#003B73] print:text-black">
                Ingredients
              </h2>
              <span className="text-xs text-[#6c757d] print:text-gray-700 font-medium">
                {ingredients.length} items
              </span>
            </div>

            {ingredients.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-2 print:gap-x-8 print:gap-y-1.5 text-sm">
                {ingredients.map((item, idx) => {
                  const isChecked = !!checkedIngredients[idx];
                  return (
                    <li
                      key={idx}
                      onClick={() => toggleIngredient(idx)}
                      className={`flex items-center justify-between p-2.5 print:p-1 rounded-md border print:border-b print:border-gray-200 print:rounded-none cursor-pointer select-none transition-colors ${
                        isChecked
                          ? 'bg-[#F5F7FA] border-[#E2E8F0] text-[#6c757d] line-through print:line-through-none print:text-black'
                          : 'bg-white border-[#E2E8F0] text-[#212529] hover:bg-[#F5F7FA]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        {/* Interactive Checkbox on Screen */}
                        <div
                          className={`w-4 h-4 rounded-xs border flex items-center justify-center shrink-0 print:hidden ${
                            isChecked
                              ? 'bg-[#0056B3] border-[#0056B3] text-white'
                              : 'border-[#cbd5e1] bg-white'
                          }`}
                        >
                          {isChecked && <Check size={11} />}
                        </div>
                        {/* Clean Bullet for Print View */}
                        <span className="hidden print:inline-block w-1.5 h-1.5 rounded-full bg-black shrink-0" aria-hidden="true" />
                        <span className="text-xs sm:text-sm print:text-xs truncate print:text-wrap font-medium print:text-black">
                          {item.ingredient}
                        </span>
                      </div>
                      {item.measure && (
                        <span className="text-xs font-semibold text-[#003B73] print:text-black shrink-0 bg-[#EAF4FF] print:bg-transparent px-2 py-0.5 rounded-xs">
                          {item.measure}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-xs text-[#6c757d] italic">
                Ingredient measurements are detailed in the video instructions.
              </p>
            )}
          </div>

          {/* 6. Instructions Section */}
          <div className="print-avoid-break">
            <h2 className="font-serif font-bold text-lg text-[#003B73] print:text-black mb-3 print:mb-2 border-b print:border-b-2 print:border-gray-800 pb-1.5">
              Instructions
            </h2>
            {instructions.length > 0 ? (
              <div className="space-y-3 print:space-y-2.5">
                {instructions.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 text-sm text-[#212529] leading-relaxed p-3 print:p-1.5 rounded-md bg-[#F5F7FA] print:bg-transparent border border-[#E2E8F0] print:border-none print-avoid-break"
                  >
                    <span className="font-bold text-[#0056B3] print:text-black shrink-0 text-xs mt-0.5 print:text-xs">
                      {idx + 1}.
                    </span>
                    <p className="flex-1 whitespace-pre-line text-xs sm:text-sm print:text-xs print:text-black print:leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#6c757d] italic">
                Follow the recipe preparation video below for step-by-step guidance.
              </p>
            )}
          </div>

          {/* 7. YouTube Video Section (Screen Only) */}
          {recipe.strYoutube && (
            <div className="print:hidden">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-serif font-bold text-lg text-[#003B73] flex items-center gap-1.5">
                  <Youtube size={18} className="text-[#0056B3]" />
                  <span>Video Tutorial</span>
                </h2>
                <a
                  href={recipe.strYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-[#0056B3] hover:underline inline-flex items-center gap-1"
                >
                  <span>Open on YouTube</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              {youtubeEmbedId ? (
                <div className="relative aspect-16/9 rounded-lg overflow-hidden border border-[#E2E8F0] bg-black">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${youtubeEmbedId}`}
                    title={`How to cook ${title}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              ) : (
                <a
                  href={recipe.strYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-md bg-[#F5F7FA] border border-[#E2E8F0] text-xs font-semibold text-[#003B73] hover:text-[#0056B3]"
                >
                  <Youtube size={16} />
                  <span>Watch cooking video on YouTube</span>
                </a>
              )}
            </div>
          )}

          {/* Print-Only Footer Note */}
          <div className="hidden print:block pt-4 mt-6 border-t border-gray-300 text-center text-[10px] text-gray-500">
            <span>CareerGhana Recipes • Delicious Culinary Showcase • Enjoy your meal!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
