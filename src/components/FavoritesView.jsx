import React from 'react';
import { Heart, Compass, ArrowLeft, Lock, LogIn, UserPlus } from 'lucide-react';
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
      <div id="favorites-protected-guest" className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-center">
        <button
          type="button"
          onClick={onDiscover}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#6c757d] hover:text-[#0056B3] transition-colors mb-6 cursor-pointer group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] rounded-md px-1 py-1"
        >
          <ArrowLeft size={14} aria-hidden="true" className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Browse Recipes</span>
        </button>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-8 sm:p-12 max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#EAF4FF] border border-[#d0e5ff] flex items-center justify-center text-[#0056B3] shadow-xs">
            <Lock size={30} className="text-[#0056B3]" />
          </div>

          <h2 className="font-serif text-2xl font-bold text-[#003B73] mb-2 leading-tight">
            Protected Favorites
          </h2>

          <p className="text-xs sm:text-sm text-[#6c757d] leading-relaxed mb-6">
            Log in or create a Recipe Finder account to access your saved recipes, synchronize across devices, and keep your personal cookbook ready.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              id="favorites-guest-login-btn"
              onClick={onOpenLogin}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-[#0056B3] hover:bg-[#003B73] text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] focus-visible:ring-offset-2"
            >
              <LogIn size={15} />
              <span>Log In</span>
            </button>

            <button
              type="button"
              id="favorites-guest-signup-btn"
              onClick={onOpenSignUp}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-white border-1.5 border-[#0056B3] text-[#0056B3] hover:bg-[#EAF4FF] font-semibold text-xs sm:text-sm transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3]"
            >
              <UserPlus size={15} />
              <span>Sign Up</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="favorites-view-page" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 border-b border-[#E2E8F0]">
        <div>
          <button
            type="button"
            id="favorites-back-to-browse-btn"
            onClick={onDiscover}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#6c757d] hover:text-[#0056B3] transition-colors mb-3 cursor-pointer group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] rounded-md px-1 -ml-1 py-1 min-h-[36px]"
          >
            <ArrowLeft size={14} aria-hidden="true" className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Browse</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EAF4FF] border border-[#d0e5ff] flex items-center justify-center text-[#0056B3] shrink-0" aria-hidden="true">
              <Heart size={20} className="fill-[#FFC107] text-[#0056B3]" />
            </div>
            <div>
              <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#003B73] tracking-tight">
                Favorite Recipes
              </h1>
              <p className="text-xs sm:text-sm text-[#6c757d] mt-0.5">
                {hasFavorites
                  ? `${favorites.length} saved ${favorites.length === 1 ? 'recipe' : 'recipes'} in your cloud cookbook`
                  : 'Your personal collection of culinary staples'}
              </p>
            </div>
          </div>
        </div>

        {hasFavorites && (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              id="favorites-discover-more-btn"
              onClick={onDiscover}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 min-h-[40px] rounded-xl bg-white border border-[#E2E8F0] text-[#003B73] hover:bg-[#EAF4FF] hover:border-[#0056B3] text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] w-full sm:w-auto"
            >
              <Compass size={15} aria-hidden="true" className="text-[#0056B3]" />
              <span>Discover Recipes</span>
            </button>
          </div>
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
