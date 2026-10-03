import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Heart, Sparkles, Trash2 } from 'lucide-react';
import RecipeCard from './RecipeCard.jsx';
import EmptyState from './EmptyState.jsx';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * FavoritesView Component
 *
 * Requirements:
 * - Allows users to access their saved recipes locally anytime.
 * - Displays saved recipes using RecipeCard.
 * - Quick search/filter within saved recipes when collection grows.
 * - If no saved recipes:
 *   "You haven't saved any recipes yet."
 *   Button: "Discover Recipes" (takes user back to browsing page)
 * - Optional sync banner for guests encouraging Google sign-in without blocking them.
 *
 * @param {Object} props
 * @param {Array} props.favorites - Array of favorited recipe objects
 * @param {Function} props.onToggleFavorite - Callback when a favorite is toggled
 * @param {Function} props.onSelectRecipe - Callback when a recipe is clicked for details
 * @param {Function} props.onDiscover - Callback to return to the main recipe browsing experience
 * @param {Function} props.onOpenLogin - Callback to open login dialog
 * @param {Function} props.onOpenSignUp - Callback to open signup dialog
 */
export default function FavoritesView({
  favorites = [],
  onToggleFavorite,
  onSelectRecipe,
  onDiscover,
  onOpenLogin,
  onOpenSignUp,
}) {
  const { isAuthenticated } = useAuth();
  const [filterQuery, setFilterQuery] = useState('');

  const hasFavorites = Array.isArray(favorites) && favorites.length > 0;

  // Filter saved recipes by title or category
  const filteredFavorites = useMemo(() => {
    if (!filterQuery.trim()) return favorites;
    const q = filterQuery.toLowerCase().trim();
    return favorites.filter(
      (m) =>
        (m.strMeal && m.strMeal.toLowerCase().includes(q)) ||
        (m.strCategory && m.strCategory.toLowerCase().includes(q)) ||
        (m.strArea && m.strArea.toLowerCase().includes(q))
    );
  }, [favorites, filterQuery]);

  return (
    <div id="favorites-view-page" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 mb-6 border-b border-[#E2E8F0]">
        <div>
          <button
            type="button"
            id="favorites-back-to-browse-btn"
            onClick={onDiscover}
            className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-medium text-[#6c757d] hover:text-[#0056B3] transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            <span>Back to Browse</span>
          </button>

          <h1 className="text-2xl sm:text-3xl font-semibold text-[#003B73] tracking-tight">
            Favorite Recipes
          </h1>
          <p className="text-xs sm:text-sm text-[#6c757d] mt-1">
            {hasFavorites
              ? `${favorites.length} saved ${favorites.length === 1 ? 'dish' : 'dishes'} in your local collection`
              : 'Your personal collection of saved recipes'}
          </p>
        </div>

        {hasFavorites && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="favorites-discover-more-btn"
              onClick={onDiscover}
              className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-md bg-white border border-[#E2E8F0] text-[#003B73] hover:bg-[#EAF4FF] hover:border-[#cbd5e1] text-xs font-medium transition-colors cursor-pointer"
            >
              Discover More Recipes
            </button>
          </div>
        )}
      </div>

      {/* Guest Local Storage Notice Banner */}
      {!isAuthenticated && hasFavorites && (
        <div
          id="favorites-guest-local-banner"
          className="mb-6 p-4 rounded-xl bg-[#EAF4FF] border border-[#bcdbfc] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#003B73] shadow-xs"
        >
          <div className="flex items-start sm:items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#0056B3] shadow-2xs shrink-0">
              <Heart size={14} className="fill-[#FFC107] text-[#003B73]" />
            </div>
            <div>
              <p className="font-semibold text-[13px] text-[#003B73]">
                Saved locally on this device
              </p>
              <p className="text-[#475569] text-xs mt-0.5">
                Your recipes are securely saved in your browser's local storage. Sign in with Google to sync them to the cloud.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            {onOpenLogin && (
              <button
                type="button"
                id="favorites-sync-signin-btn"
                onClick={onOpenLogin}
                className="px-3 py-1.5 rounded-md bg-[#0056B3] hover:bg-[#003B73] text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Sign In to Sync
              </button>
            )}
          </div>
        </div>
      )}

      {/* Search Filter when multiple favorites exist */}
      {favorites.length > 3 && (
        <div className="mb-6 max-w-sm">
          <div className="relative flex items-center">
            <Search size={15} className="absolute left-3 text-[#94A3B8]" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search your saved recipes..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#1E293B] placeholder:text-[#94A3B8] focus:border-[#0056B3] focus:ring-1 focus:ring-[#0056B3] outline-hidden transition-colors"
            />
            {filterQuery && (
              <button
                type="button"
                onClick={() => setFilterQuery('')}
                className="absolute right-2.5 text-xs text-[#64748B] hover:text-[#0F172A] p-1 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Empty State when no favorites exist */}
      {!hasFavorites ? (
        <section id="favorites-empty-state" aria-label="No favorite recipes">
          <EmptyState
            type="no-favorites"
            title="You haven't saved any recipes yet."
            description="Explore dishes from around the world and tap the heart icon on any recipe card to save it locally for quick access anytime."
            onAction={onDiscover}
            actionText="Discover Recipes"
          />
        </section>
      ) : filteredFavorites.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-[#E2E8F0] p-6">
          <p className="text-sm font-medium text-[#64748B]">
            No saved recipes match "{filterQuery}".
          </p>
          <button
            type="button"
            onClick={() => setFilterQuery('')}
            className="mt-2 text-xs font-semibold text-[#0056B3] hover:underline cursor-pointer"
          >
            Show all {favorites.length} saved recipes
          </button>
        </div>
      ) : (
        /* Saved Recipes Grid using the exact same RecipeCard component */
        <section id="favorites-grid-section" aria-label="Your saved favorite recipes">
          <h2 className="sr-only">Saved Recipes Collection</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-7">
            {filteredFavorites.map((recipe, index) => (
              <RecipeCard
                key={recipe.idMeal}
                recipe={recipe}
                priority={index < 4}
                isFavorite={true}
                onToggleFavorite={onToggleFavorite}
                onSelect={onSelectRecipe}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
