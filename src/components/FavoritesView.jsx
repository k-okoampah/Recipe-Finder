import React from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import RecipeCard from './RecipeCard.jsx';
import EmptyState from './EmptyState.jsx';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * FavoritesView Component
 *
 * Requirements:
 * - Protected view:
 *   If user is logged out:
 *     - Do not show saved recipes.
 *     - Show a message encouraging user to log in.
 *     - Provide Log In & Sign Up buttons.
 *   If user is logged in:
 *     - Display saved recipes using RecipeCard.
 *     - If no saved recipes:
 *       "You haven't saved any recipes yet."
 *       Button: "Discover Recipes" (takes user back to browsing page)
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
  const hasFavorites = Array.isArray(favorites) && favorites.length > 0;

  // Protected view state if logged out
  if (!isAuthenticated) {
    return (
      <div id="favorites-protected-guest" className="w-full max-w-lg mx-auto px-4 py-12 sm:py-16 text-center">
        <button
          type="button"
          onClick={onDiscover}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6c757d] hover:text-[#0056B3] transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          <span>Back to Browse</span>
        </button>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-8 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-[#EAF4FF] border border-[#d0e5ff] flex items-center justify-center text-[#0056B3]">
            <Lock size={22} className="text-[#0056B3]" />
          </div>

          <h2 className="font-serif text-xl font-bold text-[#003B73] mb-2">
            Protected Favorites
          </h2>

          <p className="text-xs sm:text-sm text-[#6c757d] leading-relaxed mb-6">
            Log in or create an account to view and manage your saved recipes across sessions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <button
              type="button"
              id="favorites-guest-login-btn"
              onClick={onOpenLogin}
              className="w-full sm:w-auto px-4 py-2 rounded-md bg-[#0056B3] hover:bg-[#003B73] text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Log In
            </button>

            <button
              type="button"
              id="favorites-guest-signup-btn"
              onClick={onOpenSignUp}
              className="w-full sm:w-auto px-4 py-2 rounded-md bg-white border border-[#E2E8F0] text-[#0056B3] hover:bg-[#EAF4FF] font-medium text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="favorites-view-page" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 mb-8 border-b border-[#E2E8F0]">
        <div>
          <button
            type="button"
            id="favorites-back-to-browse-btn"
            onClick={onDiscover}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6c757d] hover:text-[#0056B3] transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            <span>Back to Browse</span>
          </button>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#003B73] tracking-tight">
            Favorite Recipes
          </h1>
          <p className="text-xs sm:text-sm text-[#6c757d] mt-1">
            {hasFavorites
              ? `${favorites.length} saved ${favorites.length === 1 ? 'recipe' : 'recipes'} in your collection`
              : 'Your personal collection of saved recipes'}
          </p>
        </div>

        {hasFavorites && (
          <button
            type="button"
            id="favorites-discover-more-btn"
            onClick={onDiscover}
            className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-md bg-white border border-[#E2E8F0] text-[#003B73] hover:bg-[#EAF4FF] hover:border-[#cbd5e1] text-xs font-medium transition-colors cursor-pointer"
          >
            Discover Recipes
          </button>
        )}
      </div>

      {/* Empty State when no favorites exist */}
      {!hasFavorites ? (
        <section id="favorites-empty-state" aria-label="No favorite recipes">
          <EmptyState
            type="no-favorites"
            title="You haven't saved any recipes yet."
            description="Explore dishes from around the world and tap the heart icon on any recipe to save it here for quick access."
            onAction={onDiscover}
            actionText="Discover Recipes"
          />
        </section>
      ) : (
        /* Saved Recipes Grid using the exact same RecipeCard component */
        <section id="favorites-grid-section" aria-label="Your saved favorite recipes">
          <h2 className="sr-only">Saved Recipes Collection</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-7">
            {favorites.map((recipe) => (
              <RecipeCard
                key={recipe.idMeal}
                recipe={recipe}
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
