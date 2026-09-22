import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import CategoryFilter from './components/CategoryFilter.jsx';
import RecipeGrid from './components/RecipeGrid.jsx';
import RecipeDetails from './components/RecipeDetails.jsx';
import FavoritesView from './components/FavoritesView.jsx';
import ProfileView from './components/ProfileView.jsx';
import AuthModal from './components/AuthModal.jsx';
import Footer from './components/Footer.jsx';
import AboutModal from './components/AboutModal.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { useFavorites } from './hooks/useFavorites.js';
import {
  searchMealsByName,
  getMealDetailsById,
  getMealsByCategory,
  getMealsByArea,
  getRandomMeal,
} from './services/recipeApi.js';
import { MOCK_RECIPES } from './data/mockRecipes.js';

export default function App() {
  const { isAuthenticated } = useAuth();

  // Store results in React state
  const [recipes, setRecipes] = useState(MOCK_RECIPES);
  const [activeFilter, setActiveFilter] = useState({ type: 'mealType', value: 'All' });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Active view: 'recipes' | 'favorites' | 'profile'
  const [currentView, setCurrentView] = useState('recipes');

  // Auth modal state: { isOpen: boolean, mode: 'login' | 'signup' | 'forgot-password' | 'prompt' }
  const [authModalState, setAuthModalState] = useState({ isOpen: false, mode: 'login' });

  // Loading state & error state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Mobile-only Featured Recipe dismissal (React state only, reset on page reload)
  const [isMobileFeaturedClosed, setIsMobileFeaturedClosed] = useState(false);

  // Reusable favorites management hook
  const {
    favorites,
    favoriteCount,
    isFavorite,
    toggleFavorite,
  } = useFavorites();

  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Intercept favorite toggle when guest is logged out
  const handleToggleFavorite = useCallback((recipe) => {
    if (!isAuthenticated) {
      setAuthModalState({ isOpen: true, mode: 'prompt' });
      return;
    }
    toggleFavorite(recipe);
  }, [isAuthenticated, toggleFavorite]);

  // Auto-scroll to top when navigating between pages/views (Requirement 3)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  // Load initial discovery recipes from TheMealDB and handle shared recipe deep links
  useEffect(() => {
    let isMounted = true;

    async function initializeData() {
      try {
        const initialMeals = await searchMealsByName('');
        if (isMounted && initialMeals && initialMeals.length > 0) {
          setRecipes(initialMeals);
        }

        // Check for deep-linked recipe from shared URL
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const sharedRecipeId = params.get('recipe');
          if (sharedRecipeId) {
            const detailedMeal = await getMealDetailsById(sharedRecipeId);
            if (isMounted && detailedMeal) {
              setSelectedRecipe(detailedMeal);
            }
          }
        }
      } catch (err) {
        console.warn('Initial data load used fallback:', err);
      }
    }

    initializeData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Synchronize browser URL query param with selected recipe for shareable deep links
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        if (selectedRecipe?.idMeal) {
          url.searchParams.set('recipe', selectedRecipe.idMeal);
        } else {
          url.searchParams.delete('recipe');
        }
        window.history.replaceState({}, '', url.toString());
      }
    } catch {
      // Safe fallback if history API is restricted
    }
  }, [selectedRecipe]);

  // Main Search Handler
  const handleSearch = useCallback(async (query) => {
    const trimmed = (query || '').trim();

    // Prevent empty searches
    if (!trimmed) {
      return;
    }

    setSearchQuery(trimmed);
    setCurrentView('recipes');
    setActiveFilter({ type: 'mealType', value: 'All' });
    setSelectedCategory('All');
    setErrorMessage(null);
    setLoading(true);

    try {
      const results = await searchMealsByName(trimmed);
      setRecipes(results);
    } catch (err) {
      console.warn('Search request encountered an error:', err);
      setErrorMessage('Something went wrong while loading recipes. Please try again.');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle Category / Cuisine Filter Selection
  const handleFilterSelect = useCallback(async (type, value) => {
    setActiveFilter({ type, value });
    setSelectedCategory(value);
    setCurrentView('recipes');
    setSearchQuery('');
    setErrorMessage(null);
    setLoading(true);

    try {
      if (value === 'All') {
        const defaultMeals = await searchMealsByName('');
        setRecipes(defaultMeals.length > 0 ? defaultMeals : MOCK_RECIPES);
      } else if (type === 'cuisine') {
        const cuisineMeals = await getMealsByArea(value);
        setRecipes(cuisineMeals || []);
      } else {
        const categoryMeals = await getMealsByCategory(value);
        setRecipes(categoryMeals || []);
      }
    } catch (err) {
      console.warn('Filter fetch error:', err);
      setErrorMessage('Something went wrong while loading recipes. Please try again.');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Backward compatible handler
  const handleCategorySelect = useCallback((catName) => {
    handleFilterSelect('mealType', catName);
  }, [handleFilterSelect]);

  // Selecting a recipe: ensure full details (ingredients + instructions) are loaded
  const handleSelectRecipe = useCallback(async (recipe) => {
    if (!recipe) return;

    // Show initial preview immediately
    setSelectedRecipe(recipe);

    // If recipe lacks full instructions or ingredients, fetch by ID
    if (!recipe.strInstructions || recipe.strInstructions.trim() === '') {
      try {
        const fullDetails = await getMealDetailsById(recipe.idMeal);
        if (fullDetails) {
          setSelectedRecipe((current) =>
            current && current.idMeal === recipe.idMeal ? fullDetails : current
          );
        }
      } catch (err) {
        console.warn('Failed to load complete recipe details:', err);
      }
    }
  }, []);

  // Surprise Me: Fetch a fresh random meal from TheMealDB
  const handleRandomMeal = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const randomMeal = await getRandomMeal();
      if (randomMeal) {
        setSelectedRecipe(randomMeal);
      } else {
        const randomIndex = Math.floor(Math.random() * recipes.length);
        setSelectedRecipe(recipes[randomIndex]);
      }
    } catch (err) {
      console.warn('Random meal fetch error:', err);
      const randomIndex = Math.floor(Math.random() * recipes.length);
      setSelectedRecipe(recipes[randomIndex]);
    } finally {
      setLoading(false);
    }
  }, [recipes]);

  // Reset to default
  const handleReset = useCallback(async () => {
    setSearchQuery('');
    setActiveFilter({ type: 'mealType', value: 'All' });
    setSelectedCategory('All');
    setCurrentView('recipes');
    setErrorMessage(null);
    setLoading(true);

    try {
      const defaultMeals = await searchMealsByName('');
      setRecipes(defaultMeals.length > 0 ? defaultMeals : MOCK_RECIPES);
    } catch {
      setRecipes(MOCK_RECIPES);
    } finally {
      setLoading(false);
    }
  }, []);

  // Retry action for failed requests
  const handleRetry = useCallback(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    } else if (activeFilter.value !== 'All') {
      handleFilterSelect(activeFilter.type, activeFilter.value);
    } else {
      handleReset();
    }
  }, [searchQuery, activeFilter, handleSearch, handleFilterSelect, handleReset]);

  const gridTitle = searchQuery
    ? `Dishes Matching "${searchQuery}"`
    : activeFilter.value !== 'All'
    ? activeFilter.type === 'cuisine'
      ? `${activeFilter.value} Cuisine (${recipes.length})`
      : `${activeFilter.value} Dishes (${recipes.length})`
    : 'Chef’s Seasonal Showcase & Ghanaian Classics';

  return (
    <div
      id="recipe-finder-app"
      className="min-h-screen flex flex-col font-sans bg-[#F5F7FA] text-[#212529] antialiased w-full max-w-full overflow-x-clip print:bg-white print:overflow-visible"
    >
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#0056B3] focus:text-white focus:font-semibold focus:rounded-xl focus:shadow-xl focus:outline-hidden focus:ring-2 focus:ring-[#FFC107] print:hidden"
      >
        Skip to main content
      </a>

      {/* Visual Design System Top Navigation */}
      <div className="print:hidden">
        <Navbar
          currentView={currentView}
          favoriteCount={favoriteCount}
          activeFilter={activeFilter}
          onSelectFilter={handleFilterSelect}
          onHomeClick={() => {
            setCurrentView('recipes');
            handleReset();
          }}
          onFavoritesClick={() => {
            setCurrentView((prev) => (prev === 'favorites' ? 'recipes' : 'favorites'));
          }}
          onProfileClick={() => setCurrentView('profile')}
          onLoginClick={() => setAuthModalState({ isOpen: true, mode: 'login' })}
          onSignUpClick={() => setAuthModalState({ isOpen: true, mode: 'signup' })}
          onRandomClick={handleRandomMeal}
          onAboutClick={() => setIsAboutOpen(true)}
        />
      </div>

      <main
        id="main-content"
        tabIndex={-1}
        className={`flex-1 focus:outline-hidden ${selectedRecipe ? 'print:hidden' : ''}`}
      >
        {currentView === 'profile' ? (
          /* User Profile View */
          <ProfileView
            favoriteCount={favoriteCount}
            onBackToBrowse={() => setCurrentView('recipes')}
            onViewFavorites={() => setCurrentView('favorites')}
          />
        ) : currentView === 'favorites' ? (
          /* Dedicated Favorites View / Page */
          <FavoritesView
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectRecipe={handleSelectRecipe}
            onDiscover={() => setCurrentView('recipes')}
            onOpenLogin={() => setAuthModalState({ isOpen: true, mode: 'login' })}
            onOpenSignUp={() => setAuthModalState({ isOpen: true, mode: 'signup' })}
          />
        ) : (
          /* Main Recipe Browsing Experience */
          <>
            {/* Editorial Discovery Hero with Search Interface */}
            <Hero
              onSearch={handleSearch}
              searchQuery={searchQuery}
              isLoading={loading}
              onSelectRecipe={handleSelectRecipe}
              isMobileFeaturedClosed={isMobileFeaturedClosed}
              onCloseMobileFeatured={() => setIsMobileFeaturedClosed(true)}
            />

            {/* Category & Cuisine Filter Section */}
            <CategoryFilter
              activeFilter={activeFilter}
              onSelectFilter={handleFilterSelect}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
              isLoading={loading}
            />

            {/* Responsive Recipe Cards Grid */}
            <RecipeGrid
              recipes={recipes}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onSelectRecipe={handleSelectRecipe}
              isLoading={loading}
              errorMessage={errorMessage}
              onRetry={handleRetry}
              onReset={handleReset}
              onSelectSuggestion={handleSearch}
              searchQuery={searchQuery}
              title={gridTitle}
            />
          </>
        )}
      </main>

      {/* Recipe Details Drawer / Modal */}
      {selectedRecipe && (
        <RecipeDetails
          recipe={selectedRecipe}
          isFavorite={isFavorite(selectedRecipe.idMeal)}
          onToggleFavorite={handleToggleFavorite}
          onClose={() => setSelectedRecipe(null)}
        />
      )}

      {/* Authentication Dialog Modal (Login, Signup, Reset Password, Prompt) */}
      <div className="print:hidden">
        <AuthModal
          isOpen={authModalState.isOpen}
          initialMode={authModalState.mode}
          onClose={() => setAuthModalState((prev) => ({ ...prev, isOpen: false }))}
          onSuccess={() => setAuthModalState((prev) => ({ ...prev, isOpen: false }))}
        />

        {/* Professional Responsive Footer */}
        <Footer
          onNavigateRecipes={() => {
            setCurrentView('recipes');
            handleReset();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateFavorites={() => {
            setCurrentView('favorites');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenAbout={() => setIsAboutOpen(true)}
          favoriteCount={favoriteCount}
        />

        {/* About Dialog Modal */}
        <AboutModal
          isOpen={isAboutOpen}
          onClose={() => setIsAboutOpen(false)}
        />

        {/* Floating Scroll to Top Arrow Button */}
        <ScrollToTop />
      </div>
    </div>
  );
}

