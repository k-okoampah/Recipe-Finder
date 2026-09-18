import React, { useState, useEffect } from 'react';
import { Search, X, Sparkles, ChefHat, Clock, MapPin, ArrowRight, Flame, Loader2, AlertCircle } from 'lucide-react';

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
 * @param {React.ReactNode} [props.children]
 */
export default function Hero({
  onSearch,
  searchQuery = '',
  isLoading = false,
  onSelectRecipe,
  children,
}) {
  const [query, setQuery] = useState(searchQuery);
  const [emptyWarning, setEmptyWarning] = useState(false);

  useEffect(() => {
    setQuery(searchQuery);
    if (searchQuery.trim()) {
      setEmptyWarning(false);
    }
  }, [searchQuery]);

  const popularSearches = ['Ghanaian', 'Jollof', 'Waakye', 'Chicken', 'Seafood'];

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

  const handlePopularClick = (term) => {
    setQuery(term);
    setEmptyWarning(false);
    if (onSearch) {
      onSearch(term);
    }
  };

  const handleClear = () => {
    setQuery('');
    setEmptyWarning(false);
    if (onSearch && searchQuery) {
      onSearch('');
    }
  };

  const featuredMeal = {
    idMeal: 'gh-01',
    strMeal: 'Authentic Ghana Jollof Rice with Spiced Grilled Chicken',
    strMealThumb: '/images/ghana/jollof.jpg',
    strCategory: 'Ghanaian',
    strArea: 'Ghanaian',
    prepTime: '45 min',
    difficulty: 'Moderate',
    rating: '5.0',
    reviewsCount: '890+ cooks',
    description: 'Fragrant jasmine rice slow-cooked in a caramelized tomato, onion, ginger, and scotch bonnet stew, served with spiced grilled chicken and fried plantains.',
  };

  return (
    <section
      id="hero-section"
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 sm:pt-10 sm:pb-12 lg:pt-12 lg:pb-16"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column */}
        <div className="lg:col-span-7 flex flex-col text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF4FF] text-[#0056B3] border border-[#d0e5ff] text-xs font-semibold w-fit mb-3 sm:mb-4">
            <ChefHat size={14} className="text-[#0056B3]" />
            <span>Culinary Directory</span>
          </div>

          {/* Primary Headline */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-[#003B73] tracking-tight leading-[1.2] mb-3 sm:mb-4">
            Find a recipe.{' '}
            <span className="text-[#0056B3] block sm:inline">
              Make something delicious.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="font-sans text-sm sm:text-base lg:text-lg text-[#212529]/80 max-w-xl mb-6 sm:mb-8 leading-relaxed">
            Discover delicious meal ideas, explore new flavours and find something worth cooking tonight.
          </p>

          {/* Prominent Search Interface */}
          <div className="w-full max-w-xl mb-4">
            <form id="hero-search-form" role="search" onSubmit={handleSubmit} className="w-full" noValidate>
              <label htmlFor="hero-recipe-search-input" className="sr-only">
                Search recipes by name or ingredient
              </label>
              <div
                className={`relative flex items-center bg-white rounded-xl border transition-all p-1.5 sm:p-2 ${
                  emptyWarning
                    ? 'border-[#0056B3] ring-2 ring-[#0056B3]/20 shadow-xs'
                    : 'border-[#E2E8F0] shadow-xs hover:border-[#cbd5e1] focus-within:border-[#0056B3] focus-within:ring-2 focus-within:ring-[#0056B3]/15'
                }`}
              >
                {/* Search Icon in Primary Blue */}
                <div className="pl-3 pr-1.5 text-[#0056B3] shrink-0" aria-hidden="true">
                  <Search size={19} className="text-[#0056B3]" />
                </div>

                {/* Input */}
                <input
                  id="hero-recipe-search-input"
                  type="search"
                  value={query}
                  onChange={handleInputChange}
                  placeholder="Search for chicken, pasta, curry..."
                  aria-invalid={emptyWarning}
                  disabled={isLoading}
                  className="w-full min-w-0 flex-1 py-2 sm:py-2.5 pr-2 text-[#212529] placeholder:text-[#6c757d]/70 text-sm sm:text-base font-sans bg-transparent border-none outline-hidden disabled:opacity-60"
                />

                {/* Clear Button */}
                {query && !isLoading && (
                  <button
                    type="button"
                    id="hero-clear-search-btn"
                    onClick={handleClear}
                    className="w-8 h-8 min-w-[32px] min-h-[32px] flex items-center justify-center mr-1 text-[#6c757d] hover:text-[#003B73] rounded-full hover:bg-[#EAF4FF] transition-colors cursor-pointer shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3]"
                    aria-label="Clear search input"
                  >
                    <X size={15} aria-hidden="true" />
                  </button>
                )}

                {/* Search Button in Primary Blue #0056B3 */}
                <button
                  type="submit"
                  id="hero-submit-search-btn"
                  disabled={isLoading}
                  className="shrink-0 px-5 sm:px-6 py-2.5 min-h-[44px] rounded-xl bg-[#0056B3] hover:bg-[#003B73] active:scale-[0.99] text-white font-semibold text-sm transition-colors duration-150 cursor-pointer shadow-xs flex items-center justify-center gap-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] focus-visible:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} aria-hidden="true" className="animate-spin shrink-0" />
                      <span className="hidden sm:inline">Searching...</span>
                      <span className="sm:hidden text-xs">...</span>
                    </>
                  ) : (
                    <>
                      <span>Search</span>
                      <ArrowRight size={15} aria-hidden="true" className="hidden sm:inline" />
                    </>
                  )}
                </button>
              </div>

              {/* Inline Friendly Warning */}
              {emptyWarning && (
                <div
                  id="hero-empty-search-alert"
                  role="alert"
                  aria-live="polite"
                  className="flex items-center gap-1.5 text-xs text-[#0056B3] mt-2 font-semibold px-1"
                >
                  <AlertCircle size={14} aria-hidden="true" className="shrink-0 text-[#0056B3]" />
                  <span>Please enter a recipe name or ingredient (e.g. Chicken, Pasta, Curry) to search.</span>
                </div>
              )}
            </form>
          </div>

          {/* Popular Searches */}
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-xs">
            <span className="font-bold text-[#003B73] flex items-center gap-1.5 mr-1">
              <Flame size={14} aria-hidden="true" className="text-[#FFC107] fill-[#FFC107]" />
              <span>Popular:</span>
            </span>
            {popularSearches.map((term) => {
              const isActive = query.toLowerCase() === term.toLowerCase();
              return (
                <button
                  key={term}
                  type="button"
                  id={`popular-search-${term.toLowerCase()}`}
                  onClick={() => handlePopularClick(term)}
                  disabled={isLoading}
                  aria-pressed={isActive}
                  className={`px-3.5 py-1.5 min-h-[34px] sm:min-h-0 inline-flex items-center rounded-full text-xs font-semibold transition-colors duration-150 cursor-pointer border focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] focus-visible:ring-offset-1 disabled:opacity-60 ${
                    isActive
                      ? 'bg-[#0056B3] text-white border-[#0056B3] shadow-xs'
                      : 'bg-white text-[#212529] border-[#E2E8F0] hover:border-[#0056B3] hover:text-[#0056B3] hover:bg-[#EAF4FF]'
                  }`}
                >
                  {term}
                </button>
              );
            })}
          </div>

          {children && <div className="mt-4">{children}</div>}
        </div>

        {/* Right Column: Featured Recipe Showcase */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-md lg:max-w-none">
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
              className="relative bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-md hover:border-[#0056B3] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] focus-visible:ring-offset-2 transition-all duration-200 group cursor-pointer"
            >
              {/* Image Frame */}
              <div className="relative aspect-16/10 w-full bg-[#EAF4FF] overflow-hidden">
                <img
                  src={featuredMeal.strMealThumb}
                  alt={`Freshly prepared ${featuredMeal.strMeal}`}
                  loading="eager"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300 ease-out"
                />

                {/* Top Badge: Featured in Dark Blue #003B73 */}
                <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#003B73]/90 backdrop-blur-xs text-white text-xs font-semibold shadow-xs">
                  <ChefHat size={13} aria-hidden="true" className="text-[#FFC107]" />
                  <span>Featured Dish</span>
                </div>

                {/* Category Pill */}
                <div className="absolute top-3.5 right-3.5 z-10 px-2.5 py-0.5 rounded-full bg-white/95 border border-[#E2E8F0] text-[#003B73] text-xs font-semibold shadow-xs">
                  {featuredMeal.strCategory}
                </div>
              </div>

              {/* Card Meta & Details */}
              <div className="p-5">
                <div className="flex items-center justify-between gap-2 mb-2 text-xs text-[#6c757d]">
                  <div className="flex items-center gap-1 font-semibold text-[#0056B3]">
                    <MapPin size={13} aria-hidden="true" className="text-[#0056B3]" />
                    <span>{featuredMeal.strArea} Cuisine</span>
                  </div>
                  <div className="flex items-center gap-1 font-medium text-[#212529]">
                    <Clock size={13} aria-hidden="true" className="text-[#0056B3]" />
                    <span>{featuredMeal.prepTime}</span>
                  </div>
                </div>

                <h2 className="font-serif font-bold text-lg sm:text-xl text-[#003B73] group-hover:text-[#0056B3] transition-colors leading-snug mb-1.5">
                  {featuredMeal.strMeal}
                </h2>

                <p className="text-xs sm:text-sm text-[#212529]/80 leading-relaxed line-clamp-2 mb-3.5">
                  {featuredMeal.description}
                </p>

                {/* Footer Callout */}
                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                  <span className="text-[#0056B3] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>View Recipe Details</span>
                    <ArrowRight size={13} aria-hidden="true" />
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#FFF9E6] border border-[#FFC107] text-[#003B73] font-bold text-[11px] flex items-center gap-1">
                    <span className="text-[#FFC107]">★</span> {featuredMeal.rating}
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
