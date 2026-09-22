import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

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

  const popularSearches = ['Ghanaian', 'Jollof', 'Chicken', 'Seafood', 'Pasta'];

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
    strMeal: 'Ghana Jollof Rice with Spiced Chicken',
    strMealThumb: '/images/ghana/jollof.jpg',
    strCategory: 'Ghanaian',
    strArea: 'Ghanaian',
    prepTime: '45 min',
    difficulty: 'Moderate',
    description: 'Jasmine rice simmered in a spiced tomato, onion, and scotch bonnet sauce, paired with seasoned grilled chicken.',
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
          <h1 className="font-sans text-2xl sm:text-3xl lg:text-[2.25rem] font-bold text-[#0F172A] tracking-tight leading-tight mb-2">
            Find a recipe.{' '}
            <span className="text-[#0056B3] block sm:inline">
              Make something delicious.
            </span>
          </h1>

          {/* Practical subtext */}
          <p className="text-sm sm:text-base text-[#64748B] max-w-xl mb-5 leading-relaxed">
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
                    className={`w-full pl-9 pr-9 py-2.5 bg-white rounded-md border text-sm text-[#0F172A] placeholder:text-[#94A3B8] transition-colors focus:outline-hidden focus:ring-1 focus:ring-[#0056B3] focus:border-[#0056B3] ${
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
                  className="px-5 py-2.5 rounded-md bg-[#0056B3] hover:bg-[#003B73] text-white font-medium text-sm transition-colors cursor-pointer inline-flex items-center justify-center shrink-0 disabled:opacity-60 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] focus-visible:ring-offset-2"
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
                  className="flex items-center gap-1.5 text-xs text-[#0056B3] mt-2 font-medium px-1"
                >
                  <AlertCircle size={14} aria-hidden="true" className="shrink-0" />
                  <span>Please enter a recipe name or ingredient (e.g. Chicken, Pasta, Curry) to search.</span>
                </div>
              )}
            </form>
          </div>

          {/* Simple, Interactive Popular Searches */}
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-[#64748B]">
            <span className="font-semibold text-[#003B73]">Popular:</span>
            {popularSearches.map((term, index) => {
              const isActive = query.toLowerCase() === term.toLowerCase();
              return (
                <React.Fragment key={term}>
                  <button
                    type="button"
                    id={`popular-search-${term.toLowerCase()}`}
                    onClick={() => handlePopularClick(term)}
                    disabled={isLoading}
                    className={`font-medium transition-colors cursor-pointer hover:text-[#0056B3] hover:underline underline-offset-2 ${
                      isActive ? 'text-[#0056B3] font-bold underline' : 'text-[#334155]'
                    }`}
                  >
                    {term}
                  </button>
                  {index < popularSearches.length - 1 && (
                    <span className="text-[#CBD5E1]" aria-hidden="true">·</span>
                  )}
                </React.Fragment>
              );
            })}
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
              {/* Mobile-only Close Button (X) */}
              <button
                type="button"
                id="close-mobile-featured-btn"
                aria-label="Close featured recipe"
                onClick={handleCloseMobileFeatured}
                className="md:hidden absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/95 hover:bg-white active:bg-[#F5F7FA] text-[#212529] hover:text-[#003B73] border border-[#E2E8F0] shadow-xs flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3]"
              >
                <X size={16} aria-hidden="true" />
              </button>

              <div
                className="relative aspect-[16/10] w-full bg-[#F1F5F9] overflow-hidden shrink-0"
                style={{ aspectRatio: '16 / 10' }}
              >
                <img
                  src={featuredMeal.strMealThumb}
                  alt={featuredMeal.strMeal}
                  loading="eager"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover block"
                  style={{ objectFit: 'cover' }}
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-[#003B73] text-white text-[11px] font-semibold">
                  Featured
                </span>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between text-xs text-[#64748B] mb-1.5">
                  <span className="font-medium text-[#0056B3]">{featuredMeal.strArea} Cuisine</span>
                  <span>{featuredMeal.prepTime}</span>
                </div>

                <h2 className="font-sans font-semibold text-base text-[#0F172A] group-hover:text-[#0056B3] transition-colors leading-snug mb-1">
                  {featuredMeal.strMeal}
                </h2>

                <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2 mb-3">
                  {featuredMeal.description}
                </p>

                <div className="pt-2.5 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
                  <span className="text-[#0056B3] font-medium flex items-center gap-1">
                    <span>View recipe</span>
                    <ArrowRight size={13} aria-hidden="true" />
                  </span>
                  <span className="text-[#64748B] font-medium text-[11px]">
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
