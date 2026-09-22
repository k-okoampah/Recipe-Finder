import React, { useMemo } from 'react';
import RecipeCard from './RecipeCard.jsx';
import LoadingState from './LoadingState.jsx';
import EmptyState from './EmptyState.jsx';
import ErrorState from './ErrorState.jsx';

/**
 * Reusable RecipeGrid Component
 *
 * Responsibilities:
 * - Maps recipe data directly into RecipeCard components (no duplicated card markup)
 * - Strict responsive layout:
 *   - Desktop (xl+): 4 cards per row
 *   - Tablet (sm - lg): 2 to 3 cards per row
 *   - Mobile (< sm): 1 card per row
 * - Handles all data volume and lifecycle states:
 *   - Many recipes (fluidly arranged in balanced responsive columns)
 *   - Few recipes (cleanly aligned without distorted stretching)
 *   - Zero recipes (contextual empty state with optional reset/suggestions)
 *   - Loading state (skeleton cards matching the responsive grid)
 *   - API error state (graceful error message with retry capability)
 *
 * @param {Object} props
 * @param {Array} [props.recipes=[]] - Array of recipe objects to display
 * @param {Array} [props.favorites=[]] - Array of favorited recipes or favorite IDs
 * @param {Function} [props.onToggleFavorite] - Callback when favorite heart is clicked
 * @param {Function} [props.onSelectRecipe] - Callback when a recipe card is selected
 * @param {Function} [props.onSelect] - Alias for onSelectRecipe
 * @param {boolean} [props.isLoading=false] - Whether data is currently loading
 * @param {boolean} [props.loading] - Alias for isLoading
 * @param {string|null} [props.errorMessage=null] - Error message if API call failed
 * @param {string|null} [props.error] - Alias for errorMessage
 * @param {Function} [props.onRetry] - Action to retry fetching after an error
 * @param {Function} [props.onReset] - Action to reset query/filters to default
 * @param {Function} [props.onSelectSuggestion] - Callback when an empty state suggestion is clicked
 * @param {string} [props.title] - Optional section title
 * @param {string} [props.searchQuery=''] - Current search term for contextual empty/loading messages
 * @param {string} [props.emptyTitle] - Optional custom title for zero-recipe state
 * @param {string} [props.emptyDescription] - Optional custom description for zero-recipe state
 */
export default function RecipeGrid({
  recipes = [],
  favorites = [],
  onToggleFavorite,
  onSelectRecipe,
  onSelect,
  isLoading = false,
  loading = false,
  errorMessage = null,
  error = null,
  onRetry,
  onReset,
  onSelectSuggestion,
  title,
  searchQuery = '',
  emptyTitle,
  emptyDescription,
}) {
  // Normalize prop aliases
  const isCurrentlyLoading = isLoading || loading;
  const currentError = errorMessage || error;
  const handleSelect = onSelectRecipe || onSelect;

  // Memoize favorite IDs for quick O(1) lookups across both ID arrays and object arrays
  const favoriteIds = useMemo(() => {
    if (!favorites || !Array.isArray(favorites)) return new Set();
    return new Set(
      favorites.map((fav) => (typeof fav === 'object' && fav !== null ? fav.idMeal : fav))
    );
  }, [favorites]);

  // 1. Loading State: Skeleton cards matching the responsive grid
  if (isCurrentlyLoading) {
    const loadingMessage = searchQuery
      ? `Searching for "${searchQuery}" in our culinary library...`
      : 'Curating seasonal culinary inspiration...';
    return <LoadingState message={loadingMessage} count={6} />;
  }

  // 2. API Error State: User-friendly error message with retry action
  if (currentError) {
    return (
      <section
        id="recipe-grid-error"
        aria-label="Recipe loading error"
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      >
        <ErrorState
          title="Something went wrong while loading recipes."
          message={currentError}
          onRetry={onRetry}
          retryText="Try again"
          onReset={onReset}
          resetText="Reset to Showcase"
        />
      </section>
    );
  }

  // 3. Zero Recipes (Empty State)
  if (!recipes || !Array.isArray(recipes) || recipes.length === 0) {
    if (searchQuery) {
      return (
        <section
          id="recipe-grid-empty-search"
          aria-label="No recipes found"
          className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
        >
          <EmptyState
            type="no-results"
            title={emptyTitle || "We couldn't find that recipe. Try another ingredient or meal."}
            description={emptyDescription}
            searchQuery={searchQuery}
            onReset={onReset}
            actionText="Reset Search & Explore All"
            onSelectSuggestion={onSelectSuggestion}
          />
        </section>
      );
    }

    return (
      <section
        id="recipe-grid-empty"
        aria-label="Empty recipe collection"
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      >
        <EmptyState
          type="generic"
          title={emptyTitle || 'No recipes found in collection'}
          description={
            emptyDescription ||
            "We couldn't find any recipes matching your current filter. Try searching for other culinary staples or reset your filters."
          }
          onReset={onReset}
          actionText="Reset Search & Explore All"
          onSelectSuggestion={onSelectSuggestion}
        />
      </section>
    );
  }

  // 4. Recipes Display (Handles many or few recipes seamlessly)
  // Appropriate container width: w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
  // Responsive layout:
  // - Mobile (< 640px): 1 card per row (grid-cols-1)
  // - Tablet (640px - 1024px): 2–3 cards per row (sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3)
  // - Desktop (>= 1280px / xl): 4 cards per row (xl:grid-cols-4)
  // Appropriate gaps: gap-6 sm:gap-7 lg:gap-8
  return (
    <section
      id="recipe-grid-container"
      aria-label={title || 'Recipe Grid'}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20"
    >
      {/* Grid Header / Title & Count */}
      {title && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 pb-3 border-b border-[#E2E8F0]">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#003B73] tracking-tight">
              {title}
            </h2>
          </div>
          <span className="text-xs sm:text-sm text-[#6c757d] font-medium">
            Showing <strong className="text-[#212529] font-semibold">{recipes.length}</strong>{' '}
            {recipes.length === 1 ? 'recipe' : 'recipes'}
          </span>
        </div>
      )}

      {/* 
        Responsive CSS Grid:
        - Mobile: 1 card per row (grid-cols-1)
        - Tablet: 2 cards per row on small tablets (sm:grid-cols-2), 3 cards on medium/large tablets (lg:grid-cols-3)
        - Desktop: 4 cards per row on desktop screens (xl:grid-cols-4)
      */}
      <div
        id="recipes-grid-list"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-7"
      >
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.idMeal || recipe.id || recipe.title || Math.random()}
            recipe={recipe}
            isFavorite={favoriteIds.has(recipe.idMeal)}
            onToggleFavorite={onToggleFavorite}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </section>
  );
}

