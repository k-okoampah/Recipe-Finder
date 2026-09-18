import React, { useState, useEffect } from 'react';
import { ChefHat, Heart, Utensils, Menu, X, Sparkles, User, LogIn, UserPlus, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Navbar Component
 *
 * Logged out state:
 * - Home / Recipes
 * - Log In
 * - Sign Up
 *
 * Logged in state:
 * - Home / Recipes
 * - Favorites with dynamic count badge
 * - Profile (or user avatar/email)
 * - Log Out
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
 * @param {number} [props.favoriteCount=0]
 * @param {Function} [props.onHomeClick]
 * @param {Function} [props.onFavoritesClick]
 * @param {Function} [props.onProfileClick]
 * @param {Function} [props.onLoginClick]
 * @param {Function} [props.onSignUpClick]
 * @param {'recipes'|'favorites'|'profile'} [props.currentView='recipes']
 * @param {Function} [props.onRandomClick]
 * @param {Function} [props.onAboutClick]
 */
export default function Navbar({
  favoriteCount = 0,
  onHomeClick,
  onFavoritesClick,
  onProfileClick,
  onLoginClick,
  onSignUpClick,
  currentView = 'recipes',
  onRandomClick,
  onAboutClick,
}) {
  const { user, isAuthenticated, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitor scroll position to apply dynamic subtle shadow and border when scrolling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu on Esc key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const handleNavHome = () => {
    setIsMobileMenuOpen(false);
    if (onHomeClick) onHomeClick();
  };

  const handleNavFavorites = () => {
    setIsMobileMenuOpen(false);
    if (onFavoritesClick) onFavoritesClick();
  };

  const handleNavProfile = () => {
    setIsMobileMenuOpen(false);
    if (onProfileClick) onProfileClick();
  };

  const handleNavLogin = () => {
    setIsMobileMenuOpen(false);
    if (onLoginClick) onLoginClick();
  };

  const handleNavSignUp = () => {
    setIsMobileMenuOpen(false);
    if (onSignUpClick) onSignUpClick();
  };

  const handleSignOut = async () => {
    setIsMobileMenuOpen(false);
    await signOut();
    if (onHomeClick) onHomeClick();
  };

  const handleRandom = () => {
    setIsMobileMenuOpen(false);
    if (onRandomClick) onRandomClick();
  };

  const handleNavAbout = () => {
    setIsMobileMenuOpen(false);
    if (onAboutClick) onAboutClick();
  };

  return (
    <header
      id="app-navbar"
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-md'
          : 'bg-white border-b border-[#E2E8F0]/80 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-3">
          {/* Left: RecipeFinder Logo */}
          <button
            type="button"
            id="navbar-brand-logo"
            onClick={handleNavHome}
            aria-label="RecipeFinder Home"
            className="flex items-center gap-2.5 group text-left cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] focus-visible:ring-offset-2 rounded-lg p-1 -ml-1 transition-colors shrink-0 min-h-[44px]"
          >
            <div className="w-9 h-9 rounded-xl bg-[#0056B3] text-white flex items-center justify-center shadow-xs group-hover:bg-[#003B73] transition-colors shrink-0">
              <ChefHat size={20} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg sm:text-xl text-[#003B73] tracking-tight leading-none group-hover:text-[#0056B3] transition-colors whitespace-nowrap">
                Recipe<span className="text-[#0056B3]">Finder</span>
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-1.5 lg:gap-2"
          >
            {/* Recipes / Home */}
            <button
              type="button"
              id="navbar-link-recipes"
              onClick={handleNavHome}
              aria-current={currentView === 'recipes' ? 'page' : undefined}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] focus-visible:ring-offset-2 border ${
                currentView === 'recipes'
                  ? 'bg-[#0056B3] text-white border-[#0056B3] shadow-xs'
                  : 'text-[#212529] border-transparent hover:border-[#E2E8F0] hover:bg-[#EAF4FF] hover:text-[#003B73]'
              }`}
            >
              <Utensils size={15} className={currentView === 'recipes' ? 'text-white' : 'text-[#0056B3]'} />
              <span>Recipes / Home</span>
            </button>

            {/* If Authenticated: Show Favorites and Profile */}
            {isAuthenticated ? (
              <>
                {/* Favorites with Dynamic Badge */}
                <button
                  type="button"
                  id="navbar-link-favorites"
                  onClick={handleNavFavorites}
                  aria-current={currentView === 'favorites' ? 'page' : undefined}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] focus-visible:ring-offset-2 border ${
                    currentView === 'favorites'
                      ? 'bg-[#003B73] text-white border-[#003B73] shadow-xs'
                      : 'text-[#212529] border-transparent hover:border-[#E2E8F0] hover:bg-[#EAF4FF] hover:text-[#003B73]'
                  }`}
                >
                  <Heart
                    size={15}
                    className={
                      currentView === 'favorites'
                        ? 'fill-[#FFC107] text-[#FFC107]'
                        : 'text-[#0056B3] fill-[#FFC107]'
                    }
                  />
                  <span>Favorites</span>
                  <span
                    id="navbar-favorites-counter"
                    className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold bg-[#FFC107] text-[#003B73] shadow-xs"
                  >
                    {favoriteCount}
                  </span>
                </button>

                {/* Profile */}
                <button
                  type="button"
                  id="navbar-link-profile"
                  onClick={handleNavProfile}
                  aria-current={currentView === 'profile' ? 'page' : undefined}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] focus-visible:ring-offset-2 border ${
                    currentView === 'profile'
                      ? 'bg-[#EAF4FF] text-[#003B73] border-[#0056B3] font-semibold'
                      : 'text-[#212529] border-transparent hover:border-[#E2E8F0] hover:bg-[#EAF4FF] hover:text-[#003B73]'
                  }`}
                  title={user?.email || 'User Profile'}
                >
                  <User size={15} className="text-[#0056B3]" />
                  <span className="max-w-[130px] truncate text-xs font-medium">
                    {user?.email ? user.email.split('@')[0] : 'Profile'}
                  </span>
                </button>

                {/* Log Out */}
                <button
                  type="button"
                  id="navbar-link-logout"
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[#6c757d] hover:text-[#003B73] hover:bg-[#F5F7FA] border border-transparent hover:border-[#E2E8F0] transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3]"
                  title="Sign out of account"
                >
                  <LogOut size={14} className="text-[#0056B3]" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              /* If Logged Out: Show Log In & Sign Up buttons */
              <>
                {/* Log In Button */}
                <button
                  type="button"
                  id="navbar-link-login"
                  onClick={handleNavLogin}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold text-[#0056B3] hover:text-[#003B73] hover:bg-[#EAF4FF] border border-transparent hover:border-[#d0e5ff] transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3]"
                >
                  <LogIn size={15} />
                  <span>Log In</span>
                </button>

                {/* Sign Up Primary CTA Button */}
                <button
                  type="button"
                  id="navbar-link-signup"
                  onClick={handleNavSignUp}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold bg-[#0056B3] hover:bg-[#003B73] text-white shadow-xs transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] focus-visible:ring-offset-2"
                >
                  <UserPlus size={15} />
                  <span>Sign Up</span>
                </button>
              </>
            )}

            {/* Surprise Me Quick Action */}
            {onRandomClick && (
              <button
                type="button"
                id="navbar-action-random"
                onClick={handleRandom}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[#003B73] hover:bg-[#EAF4FF] transition-colors cursor-pointer border border-[#E2E8F0] ml-1 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3]"
                title="Pick a random recipe"
              >
                <Sparkles size={14} className="text-[#FFC107]" />
                <span className="hidden xl:inline">Surprise Me</span>
              </button>
            )}

            {/* About Modal Link */}
            {onAboutClick && (
              <button
                type="button"
                id="navbar-link-about"
                onClick={handleNavAbout}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#6c757d] hover:text-[#003B73] hover:bg-[#F5F7FA] transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3]"
              >
                <span>About</span>
              </button>
            )}
          </nav>

          {/* Right Mobile Section: Quick Favorite Badge + Mobile Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Quick Mobile Favorite Shortcut if logged in, or login prompt */}
            <button
              type="button"
              id="mobile-quick-favorite-btn"
              onClick={handleNavFavorites}
              aria-label={`View ${favoriteCount} favorite recipes`}
              className={`relative w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl border transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] ${
                currentView === 'favorites'
                  ? 'bg-[#003B73] text-white border-[#003B73]'
                  : 'bg-white text-[#212529] border-[#E2E8F0] hover:bg-[#EAF4FF]'
              }`}
            >
              <Heart
                size={18}
                aria-hidden="true"
                className={currentView === 'favorites' ? 'fill-[#FFC107] text-[#FFC107]' : 'text-[#0056B3] fill-[#FFC107]/40'}
              />
              {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#FFC107] text-[#003B73] text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {favoriteCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-menu"
              className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-[#212529] border border-[#E2E8F0] bg-white hover:bg-[#F5F7FA] transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3]"
            >
              {isMobileMenuOpen ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Mobile Drawer */}
      {isMobileMenuOpen && (
        <nav
          id="mobile-nav-menu"
          aria-label="Mobile Navigation"
          className="md:hidden border-t border-[#E2E8F0] bg-white px-4 pt-3 pb-5 space-y-2 shadow-md animate-fade-in"
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#6c757d] px-3 py-1">
            Menu
          </div>

          {/* Mobile Home / Recipes */}
          <button
            type="button"
            id="mobile-link-recipes"
            onClick={handleNavHome}
            aria-current={currentView === 'recipes' ? 'page' : undefined}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] ${
              currentView === 'recipes'
                ? 'bg-[#0056B3] text-white font-semibold shadow-xs'
                : 'text-[#212529] hover:bg-[#EAF4FF]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Utensils size={17} aria-hidden="true" className={currentView === 'recipes' ? 'text-white' : 'text-[#0056B3]'} />
              <span>Recipes / Home</span>
            </div>
            {currentView === 'recipes' && (
              <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-md">
                Active
              </span>
            )}
          </button>

          {/* Authenticated Links for Mobile */}
          {isAuthenticated ? (
            <>
              {/* Mobile Favorites */}
              <button
                type="button"
                id="mobile-link-favorites"
                onClick={handleNavFavorites}
                aria-current={currentView === 'favorites' ? 'page' : undefined}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] ${
                  currentView === 'favorites'
                    ? 'bg-[#003B73] text-white font-semibold shadow-xs'
                    : 'text-[#212529] hover:bg-[#EAF4FF]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Heart
                    size={17}
                    aria-hidden="true"
                    className={currentView === 'favorites' ? 'fill-[#FFC107] text-[#FFC107]' : 'text-[#0056B3] fill-[#FFC107]'}
                  />
                  <span>Favorites</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#FFC107] text-[#003B73]">
                  {favoriteCount}
                </span>
              </button>

              {/* Mobile Profile */}
              <button
                type="button"
                id="mobile-link-profile"
                onClick={handleNavProfile}
                aria-current={currentView === 'profile' ? 'page' : undefined}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] ${
                  currentView === 'profile'
                    ? 'bg-[#EAF4FF] text-[#003B73] font-semibold border border-[#0056B3]'
                    : 'text-[#212529] hover:bg-[#EAF4FF]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <User size={17} className="text-[#0056B3]" />
                  <span>Profile ({user?.email ? user.email.split('@')[0] : 'User'})</span>
                </div>
              </button>

              {/* Mobile Log Out */}
              <button
                type="button"
                id="mobile-link-logout"
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#6c757d] hover:bg-[#F5F7FA] transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3]"
              >
                <LogOut size={17} className="text-[#0056B3]" />
                <span>Log Out</span>
              </button>
            </>
          ) : (
            /* Unauthenticated Links for Mobile */
            <div className="pt-2 border-t border-[#E2E8F0] space-y-2">
              <button
                type="button"
                id="mobile-link-login"
                onClick={handleNavLogin}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#0056B3] bg-[#EAF4FF] hover:bg-[#d0e5ff] transition-colors cursor-pointer"
              >
                <LogIn size={16} />
                <span>Log In</span>
              </button>

              <button
                type="button"
                id="mobile-link-signup"
                onClick={handleNavSignUp}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#0056B3] hover:bg-[#003B73] shadow-xs transition-colors cursor-pointer"
              >
                <UserPlus size={16} />
                <span>Sign Up</span>
              </button>
            </div>
          )}

          {/* Mobile Surprise Me */}
          {onRandomClick && (
            <button
              type="button"
              id="mobile-link-random"
              onClick={handleRandom}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#003B73] hover:bg-[#EAF4FF] transition-colors cursor-pointer border border-[#E2E8F0] mt-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3]"
            >
              <Sparkles size={16} aria-hidden="true" className="text-[#FFC107]" />
              <span>Surprise Me with a Dish</span>
            </button>
          )}

          {/* Mobile About */}
          {onAboutClick && (
            <button
              type="button"
              id="mobile-link-about"
              onClick={handleNavAbout}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#6c757d] hover:bg-[#F5F7FA] transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3]"
            >
              <span className="w-4 h-4 rounded-full border border-[#6c757d] flex items-center justify-center text-[10px] font-bold text-[#6c757d]" aria-hidden="true">
                i
              </span>
              <span>About RecipeFinder</span>
            </button>
          )}
        </nav>
      )}
    </header>
  );
}
