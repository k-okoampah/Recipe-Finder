import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Loader2, AlertCircle, Shuffle, RotateCcw } from 'lucide-react';
import { MOCK_RECIPES } from '../data/mockRecipes.js';
import { NEUTRAL_RECIPE_IMAGE } from '../utils/imageFallback.js';

/**
 * Calculates a stable daily index based on current calendar date (local day)
 * so the featured dish deterministically changes every 24 hours.
 */
function getDailyFeaturedIndex(totalItems) {
  if (!totalItems || totalItems <= 0) return 0;
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();
  const epochDays = Math.floor(
    (Date.UTC(year, month, date) - Date.UTC(2025, 0, 1)) / (1000 * 60 * 60 * 24)
  );
  return ((epochDays % totalItems) + totalItems) % totalItems;
}

/**
 * Hero Component
 * 
 * Palette:
 * - Primary Blue: #0056B3 (Search button, active tags, primary CTAs)
 * - Dark Blue: #003B73 (Headings, hover states)
 * - Light Blue: #EAF4FF (Selected states, subtle backgrounds)
 * - Yellow: #FFC107 (Highlights, star rating badges, accents)
 * - White: #FFFFFF (Cards, search surface)
 * - Dark Text: #212529 (Body text)
 * - Light Gray: #F5F7FA (Background)
 *
 * @param {Object} props
 * @param {Function} props.onSearch
 * @param {string} [props.searchQuery]
 * @param {boolean} [props.isLoading=false]
 * @param {Function} [props.onSelectRecipe]
 * @param {boolean} [props.isMobileFeaturedClosed]
 * @param {Function} [props.onCloseMobileFeatured]
 * @param {React.ReactNode} [props.children]
 */
export default function Hero({
  onSearch,
  searchQuery = '',
  isLoading = false,
  onSelectRecipe,
  isMobileFeaturedClosed: controlledMobileClosed,
  onCloseMobileFeatured,
  children,
}) {
  const [internalMobileClosed, setInternalMobileClosed] = useState(false);
  const isMobileFeaturedClosed =
    controlledMobileClosed !== undefined ? controlledMobileClosed : internalMobileClosed;

  const handleCloseMobileFeatured = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onCloseMobileFeatured) {
      onCloseMobileFeatured();
    } else {
      setInternalMobileClosed(true);
    }
  };

  const [query, setQuery] = useState(searchQuery);
  const [emptyWarning, setEmptyWarning] = useState(false);

  useEffect(() => {
    setQuery(searchQuery);
    if (searchQuery.trim()) {
      setEmptyWarning(false);
    }
  }, [searchQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();

    if (!trimmed) {
      setEmptyWarning(true);
      return;
    }

    setEmptyWarning(false);
    if (onSearch) {
      onSearch(trimmed);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (emptyWarning && val.trim()) {
      setEmptyWarning(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setEmptyWarning(false);
    if (onSearch && searchQuery) {
      onSearch('');
    }
  };

  // Pool of rich featured recipes that rotate daily or can be shuffled on-demand
  const featuredPool = MOCK_RECIPES && MOCK_RECIPES.length > 0 ? MOCK_RECIPES : [];
  const dailyIndex = getDailyFeaturedIndex(featuredPool.length);
  const [currentIndex, setCurrentIndex] = useState(dailyIndex);
  const [isShuffled, setIsShuffled] = useState(false);

  // Sync index if not manually shuffled in current session
  useEffect(() => {
    if (!isShuffled) {
      setCurrentIndex(dailyIndex);
    }
  }, [dailyIndex, isShuffled]);

  const featuredMeal = featuredPool[currentIndex] || featuredPool[0];

  const [featuredLoaded, setFeaturedLoaded] = useState(false);
  const featuredImgRef = useRef(null);

  useEffect(() => {
    if (featuredImgRef.current && featuredImgRef.current.complete) {
      setFeaturedLoaded(true);
    } else {
      setFeaturedLoaded(false);
    }
  }, [featuredMeal?.idMeal, featuredMeal?.strMealThumb]);

  // Shuffle handler to pick another dish from the pool
  const handleShuffle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsShuffled(true);
    setCurrentIndex((prev) => {
      if (featuredPool.length <= 1) return prev;
      let next;
      do {
        next = Math.floor(Math.random() * featuredPool.length);
      } while (next === prev);
      return next;
    });
  };

  // Reset back to today's daily dish
  const handleResetToDaily = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsShuffled(false);
    setCurrentIndex(dailyIndex);
  };

  return (
    <section
      id="hero-section"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8 sm:pt-10 sm:pb-12 border-b border-[#E2E8F0]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Search & Core Action */}
        <div className="lg:col-span-7 flex flex-col text-left">
          {/* Natural Page Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-bold text-[#0F172A] tracking-tight leading-[1.18] mb-3">
            Find a recipe.{' '}
            <span className="text-[#0056B3] block sm:inline">
              Make something delicious.
            </span>
          </h1>

          {/* Practical subtext */}
          <p className="text-[15px] sm:text-base text-[#64748B] font-normal max-w-xl mb-6 leading-relaxed">
            Search ingredients, explore regional recipes, or discover something new to cook tonight.
          </p>

          {/* Primary Search Bar - Clean, text-based input with simple primary button */}
          <div className="w-full max-w-xl mb-4">
            <form id="hero-search-form" role="search" onSubmit={handleSubmit} className="w-full" noValidate>
              <label htmlFor="hero-recipe-search-input" className="sr-only">
                Search recipes by name or ingredient
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]" aria-hidden="true">
                    <Search size={16} />
                  </div>

                  <input
                    id="hero-recipe-search-input"
                    type="search"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Search chicken, jollof, curry, pasta..."
                    aria-invalid={emptyWarning}
                    disabled={isLoading}
                    className={`w-full pl-9 pr-9 py-2.5 bg-white rounded-md border text-sm sm:text-[15px] text-[#0F172A] placeholder:text-[#94A3B8] transition-colors focus:outline-hidden focus:ring-1 focus:ring-[#0056B3] focus:border-[#0056B3] ${
                      emptyWarning
                        ? 'border-[#0056B3]'
                        : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
                    }`}
                  />

                  {query && !isLoading && (
                    <button
                      type="button"
                      id="hero-clear-search-btn"
                      onClick={handleClear}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94A3B8] hover:text-[#0F172A] transition-colors cursor-pointer"
                      aria-label="Clear search input"
                    >
                      <X size={15} aria-hidden="true" />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  id="hero-submit-search-btn"
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-md bg-[#0056B3] hover:bg-[#003B73] text-white font-semibold text-sm sm:text-[15px] transition-colors cursor-pointer inline-flex items-center justify-center shrink-0 disabled:opacity-60 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] focus-visible:ring-offset-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={15} aria-hidden="true" className="animate-spin mr-1.5 shrink-0" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <span>Search</span>
                  )}
                </button>
              </div>

              {emptyWarning && (
                <div
                  id="hero-empty-search-alert"
                  role="alert"
                  aria-live="polite"
                  className="flex items-center gap-1.5 text-xs sm:text-[13px] text-[#0056B3] mt-2 font-medium px-1"
                >
                  <AlertCircle size={14} aria-hidden="true" className="shrink-0" />
                  <span>Please enter a recipe name or ingredient (e.g. Chicken, Pasta, Curry) to search.</span>
                </div>
              )}
            </form>
          </div>

          {children && <div className="mt-4">{children}</div>}
        </div>

        {/* Right Column: Featured Recipe Card (Clean & Realistic) */}
        <div
          className={`lg:col-span-5 ${
            isMobileFeaturedClosed ? 'hidden md:flex' : 'flex'
          } justify-center lg:justify-end`}
        >
          <div className="w-full max-w-sm lg:max-w-md">
            <article
              id="hero-featured-card"
              role="button"
              tabIndex={0}
              aria-label={`View recipe for ${featuredMeal.strMeal}`}
              onClick={() => onSelectRecipe && onSelectRecipe(featuredMeal)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (onSelectRecipe) onSelectRecipe(featuredMeal);
                }
              }}
              className="relative bg-white rounded-xl border border-[#E2E8F0] overflow-hidden hover:border-[#94A3B8] transition-colors duration-150 group cursor-pointer"
            >
              <div
                className="relative aspect-[16/10] w-full bg-[#F1F5F9] overflow-hidden shrink-0"
                style={{ aspectRatio: '16 / 10' }}
              >
                {!featuredLoaded && (
                  <div
                    className="absolute inset-0 bg-[#E2E8F0] animate-pulse"
                    aria-hidden="true"
                  />
                )}
                {featuredMeal && (
                  <img
                    ref={featuredImgRef}
                    key={featuredMeal.idMeal}
                    src={featuredMeal.strMealThumb || NEUTRAL_RECIPE_IMAGE}
                    alt={featuredMeal.strMeal}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onLoad={() => setFeaturedLoaded(true)}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = NEUTRAL_RECIPE_IMAGE;
                      setFeaturedLoaded(true);
                    }}
                    className={`w-full h-full object-cover block transition-opacity duration-200 ${
                      featuredLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}

                {/* Badge: Daily Feature / Dish of the Day or Shuffled Selection */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                  <span className="px-2 py-0.5 rounded bg-[#003B73] text-white text-[11px] font-semibold shadow-xs">
                    {isShuffled ? 'Featured' : 'Dish of the Day'}
                  </span>
                </div>

                {/* Controls: Shuffle, Today Reset, and Mobile Close */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
                  {isShuffled && (
                    <button
                      type="button"
                      id="hero-reset-daily-btn"
                      title="Return to today's daily dish"
                      aria-label="Return to today's daily dish"
                      onClick={handleResetToDaily}
                      className="px-2 py-1 rounded-md bg-white/95 hover:bg-white active:bg-[#F5F7FA] text-[#003B73] hover:text-[#0056B3] text-[11px] font-medium border border-[#CBD5E1] shadow-xs inline-flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <RotateCcw size={11} aria-hidden="true" />
                      <span className="hidden sm:inline">Today</span>
                    </button>
                  )}

                  <button
                    type="button"
                    id="hero-shuffle-featured-btn"
                    title="Shuffle to another featured dish"
                    aria-label="Shuffle to another featured dish"
                    onClick={handleShuffle}
                    className="px-2.5 py-1 rounded-md bg-white/95 hover:bg-white active:bg-[#F5F7FA] text-[#003B73] hover:text-[#0056B3] text-xs font-semibold border border-[#CBD5E1] shadow-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Shuffle size={12} aria-hidden="true" />
                    <span>Shuffle</span>
                  </button>

                  {/* Mobile-only Close Button (X) */}
                  <button
                    type="button"
                    id="close-mobile-featured-btn"
                    aria-label="Close featured recipe"
                    onClick={handleCloseMobileFeatured}
                    className="md:hidden w-7 h-7 rounded-md bg-white/95 hover:bg-white active:bg-[#F5F7FA] text-[#212529] hover:text-[#003B73] border border-[#CBD5E1] shadow-xs flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X size={15} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between text-[13px] text-[#64748B] mb-1.5">
                  <span className="font-medium text-[#0056B3]">{featuredMeal.strArea} Cuisine</span>
                  <span className="font-medium">{featuredMeal.prepTime}</span>
                </div>

                <h2 className="font-semibold text-lg sm:text-[19px] text-[#0F172A] group-hover:text-[#0056B3] transition-colors leading-snug mb-1.5">
                  {featuredMeal.strMeal}
                </h2>

                <p className="text-[14px] text-[#64748B] font-normal leading-relaxed line-clamp-2 mb-3.5">
                  {featuredMeal.description}
                </p>

                <div className="pt-2.5 border-t border-[#F1F5F9] flex items-center justify-between text-[13px]">
                  <span className="text-[#0056B3] font-semibold flex items-center gap-1">
                    <span>View recipe</span>
                    <ArrowRight size={13} aria-hidden="true" />
                  </span>
                  <span className="text-[#64748B] font-medium text-[12px] sm:text-[13px]">
                    {featuredMeal.difficulty}
                  </span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
