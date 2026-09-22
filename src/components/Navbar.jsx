import React, { useState, useEffect, useRef } from 'react';
import { ChefHat, Heart, Menu, X, Shuffle, User, LogOut, ChevronDown, Utensils, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { MEAL_TYPES, CUISINES } from './CategoryFilter.jsx';

/**
 * Navbar Component
 *
 * Logged out state:
 * - Home / Browse Recipes (Dropdown)
 * - Log In
 * - Sign Up
 *
 * Logged in state:
 * - Home / Browse Recipes (Dropdown)
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
 * @param {Function} [props.onSelectFilter]
 * @param {Object} [props.activeFilter]
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
  onSelectFilter,
  activeFilter,
}) {
  const { user, isAuthenticated, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBrowseOpen, setIsBrowseOpen] = useState(false);
  const [isMobileBrowseOpen, setIsMobileBrowseOpen] = useState(false);
  const browseDropdownRef = useRef(null);

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

  // Close desktop dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (browseDropdownRef.current && !browseDropdownRef.current.contains(e.target)) {
        setIsBrowseOpen(false);
      }
    };
    if (isBrowseOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isBrowseOpen]);

  // Close mobile menu and dropdown on Esc key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isBrowseOpen) setIsBrowseOpen(false);
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen, isBrowseOpen]);

  const handleNavHome = () => {
    setIsBrowseOpen(false);
    setIsMobileMenuOpen(false);
    if (onHomeClick) onHomeClick();
  };

  const handleSelectBrowseOption = (type, value) => {
    setIsBrowseOpen(false);
    setIsMobileMenuOpen(false);
    if (onSelectFilter) {
      onSelectFilter(type, value);
    } else if (onHomeClick) {
      onHomeClick();
    }
    setTimeout(() => {
      const targetElem = document.getElementById('category-filter-section') || document.getElementById('recipe-grid-section');
      if (targetElem) {
        targetElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
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
      className={`sticky top-0 z-40 w-full bg-white border-b border-[#E2E8F0] transition-shadow duration-150 ${
        isScrolled ? 'shadow-xs' : ''
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
            <div className="w-9 h-9 rounded-lg bg-[#0056B3] text-white flex items-center justify-center shadow-xs group-hover:bg-[#003B73] transition-colors shrink-0">
              <ChefHat size={19} className="text-white" />
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
            {/* Browse Recipes Dropdown Menu */}
            <div className="relative" ref={browseDropdownRef}>
              <div className="flex items-center">
                <button
                  type="button"
                  id="navbar-link-recipes"
                  onClick={handleNavHome}
                  aria-current={currentView === 'recipes' && !isBrowseOpen ? 'page' : undefined}
                  className={`px-3 py-1.5 rounded-l-md text-sm font-medium transition-colors duration-150 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] focus-visible:ring-offset-2 ${
                    currentView === 'recipes' && !isBrowseOpen
                      ? 'bg-[#EAF4FF] text-[#003B73] font-semibold'
                      : 'text-[#212529] hover:bg-[#F5F7FA] hover:text-[#003B73]'
                  }`}
                >
                  <span>Browse Recipes</span>
                </button>
                <button
                  type="button"
                  id="navbar-browse-dropdown-toggle"
                  aria-haspopup="true"
                  aria-expanded={isBrowseOpen}
                  aria-label="Toggle Browse Recipes Dropdown"
                  onClick={() => setIsBrowseOpen((prev) => !prev)}
                  className={`px-1.5 py-1.5 rounded-r-md text-sm transition-colors duration-150 cursor-pointer border-l border-[#E2E8F0] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] ${
                    isBrowseOpen
                      ? 'bg-[#0056B3] text-white'
                      : 'text-[#212529] hover:bg-[#F5F7FA] hover:text-[#003B73]'
                  }`}
                >
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${isBrowseOpen ? 'rotate-180' : ''}`}
                  />
                </button>
              </div>

              {/* Mega Dropdown Popover */}
              {isBrowseOpen && (
                <div
                  id="navbar-browse-dropdown-menu"
                  role="menu"
                  aria-label="Browse Recipes Dropdown"
                  className="absolute left-0 mt-1.5 w-[380px] bg-white rounded-xl border border-[#CBD5E1] shadow-xl z-50 p-3.5"
                >
                  <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#F1F5F9]">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#003B73]">
                      <Utensils size={13} className="text-[#0056B3]" />
                      <span>Browse Recipes</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectBrowseOption('mealType', 'All')}
                      className="text-xs font-medium text-[#0056B3] hover:underline cursor-pointer"
                    >
                      Show All Dishes
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Meal Types Column */}
                    <div>
                      <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                        Meal Types
                      </div>
                      <div className="space-y-0.5 max-h-52 overflow-y-auto pr-1">
                        {MEAL_TYPES.filter((m) => m.value !== 'All').map((meal) => (
                          <button
                            key={meal.id}
                            type="button"
                            onClick={() => handleSelectBrowseOption('mealType', meal.value)}
                            className="w-full text-left px-2 py-1 rounded text-xs text-[#334155] hover:bg-[#EAF4FF] hover:text-[#003B73] transition-colors cursor-pointer truncate font-medium"
                          >
                            {meal.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Cuisines Column */}
                    <div>
                      <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                        Cuisines
                      </div>
                      <div className="space-y-0.5 max-h-52 overflow-y-auto pr-1">
                        {CUISINES.filter((c) => c.value !== 'All').map((cuisine) => (
                          <button
                            key={cuisine.id}
                            type="button"
                            onClick={() => handleSelectBrowseOption('cuisine', cuisine.value)}
                            className="w-full text-left px-2 py-1 rounded text-xs text-[#334155] hover:bg-[#EAF4FF] hover:text-[#003B73] transition-colors cursor-pointer truncate font-medium"
                          >
                            {cuisine.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* If Authenticated: Show Favorites and Profile */}
            {isAuthenticated ? (
              <>
                {/* Favorites with Dynamic Badge */}
                <button
                  type="button"
                  id="navbar-link-favorites"
                  onClick={handleNavFavorites}
                  aria-current={currentView === 'favorites' ? 'page' : undefined}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] focus-visible:ring-offset-2 ${
                    currentView === 'favorites'
                      ? 'bg-[#EAF4FF] text-[#003B73] font-semibold'
                      : 'text-[#212529] hover:bg-[#F5F7FA] hover:text-[#003B73]'
                  }`}
                >
                  <Heart
                    size={14}
                    className={
                      currentView === 'favorites'
                        ? 'fill-[#FFC107] text-[#003B73]'
                        : 'text-[#6c757d]'
                    }
                  />
                  <span>Favorites</span>
                  {favoriteCount > 0 && (
                    <span
                      id="navbar-favorites-counter"
                      className="inline-flex items-center justify-center min-w-[18px] h-4.5 px-1 rounded-full text-[11px] font-bold bg-[#FFC107] text-[#003B73]"
                    >
                      {favoriteCount}
                    </span>
                  )}
                </button>

                {/* Profile */}
                <button
                  type="button"
                  id="navbar-link-profile"
                  onClick={handleNavProfile}
                  aria-current={currentView === 'profile' ? 'page' : undefined}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] focus-visible:ring-offset-2 ${
                    currentView === 'profile'
                      ? 'bg-[#EAF4FF] text-[#003B73] font-semibold'
                      : 'text-[#212529] hover:bg-[#F5F7FA] hover:text-[#003B73]'
                  }`}
                  title={user?.email || 'User Profile'}
                >
                  <User size={14} className="text-[#0056B3]" />
                  <span className="max-w-[120px] truncate text-xs font-medium">
                    {user?.email ? user.email.split('@')[0] : 'Profile'}
                  </span>
                </button>

                {/* Log Out */}
                <button
                  type="button"
                  id="navbar-link-logout"
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium text-[#6c757d] hover:text-[#003B73] hover:bg-[#F5F7FA] transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3]"
                  title="Sign out of account"
                >
                  <LogOut size={14} />
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
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-[#0056B3] hover:text-[#003B73] hover:bg-[#EAF4FF] transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3]"
                >
                  <span>Log In</span>
                </button>

                {/* Sign Up Primary CTA Button */}
                <button
                  type="button"
                  id="navbar-link-signup"
                  onClick={handleNavSignUp}
                  className="px-3.5 py-1.5 rounded-md text-sm font-medium bg-[#0056B3] hover:bg-[#003B73] text-white transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] focus-visible:ring-offset-2"
                >
                  <span>Sign Up</span>
                </button>
              </>
            )}

            {/* Random Recipe Action */}
            {onRandomClick && (
              <button
                type="button"
                id="navbar-action-random"
                onClick={handleRandom}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-[#003B73] hover:bg-[#EAF4FF] transition-colors cursor-pointer border border-[#E2E8F0] ml-1 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3]"
                title="Pick a random recipe"
              >
                <Shuffle size={13} className="text-[#0056B3]" />
                <span className="hidden xl:inline">Random Recipe</span>
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

          {/* Mobile Home / Browse Recipes with Collapsible Dropdown */}
          <div className="rounded-xl border border-[#E2E8F0] overflow-hidden bg-white">
            <div className="flex items-center justify-between">
              <button
                type="button"
                id="mobile-link-recipes"
                onClick={handleNavHome}
                className={`flex-1 flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium transition-colors cursor-pointer text-left ${
                  currentView === 'recipes' && !isMobileBrowseOpen
                    ? 'text-[#0056B3] font-semibold bg-[#EAF4FF]'
                    : 'text-[#212529] hover:bg-[#F5F7FA]'
                }`}
              >
                <Utensils size={17} className="text-[#0056B3]" />
                <span>Browse Recipes</span>
              </button>
              <button
                type="button"
                id="mobile-browse-dropdown-toggle"
                onClick={() => setIsMobileBrowseOpen((prev) => !prev)}
                aria-label="Toggle Browse Recipes categories"
                className="px-3.5 py-2.5 text-[#64748B] hover:text-[#003B73] transition-colors cursor-pointer"
              >
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${isMobileBrowseOpen ? 'rotate-180 text-[#0056B3]' : ''}`}
                />
              </button>
            </div>

            {/* Mobile Dropdown Sub-menu */}
            {isMobileBrowseOpen && (
              <div className="bg-[#F8FAFC] border-t border-[#E2E8F0] p-3 space-y-3">
                <button
                  type="button"
                  onClick={() => handleSelectBrowseOption('mealType', 'All')}
                  className="w-full py-1.5 px-2.5 text-xs font-semibold text-[#0056B3] bg-white rounded-md border border-[#E2E8F0] text-left hover:bg-[#EAF4FF] cursor-pointer"
                >
                  All Recipes (Show All Dishes)
                </button>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                    Meal Types
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {MEAL_TYPES.filter((m) => m.value !== 'All').map((meal) => (
                      <button
                        key={`mob-${meal.id}`}
                        type="button"
                        onClick={() => handleSelectBrowseOption('mealType', meal.value)}
                        className="py-1 px-2 text-xs bg-white rounded border border-[#E2E8F0] text-[#334155] text-left truncate hover:border-[#0056B3] cursor-pointer"
                      >
                        {meal.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                    Cuisines
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {CUISINES.filter((c) => c.value !== 'All').map((cuisine) => (
                      <button
                        key={`mob-${cuisine.id}`}
                        type="button"
                        onClick={() => handleSelectBrowseOption('cuisine', cuisine.value)}
                        className="py-1 px-2 text-xs bg-white rounded border border-[#E2E8F0] text-[#334155] text-left truncate hover:border-[#0056B3] cursor-pointer"
                      >
                        {cuisine.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

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
                className="w-full flex items-center justify-center px-3.5 py-2.5 rounded-lg text-sm font-semibold text-[#0056B3] bg-[#EAF4FF] hover:bg-[#d0e5ff] transition-colors cursor-pointer"
              >
                <span>Log In</span>
              </button>

              <button
                type="button"
                id="mobile-link-signup"
                onClick={handleNavSignUp}
                className="w-full flex items-center justify-center px-3.5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#0056B3] hover:bg-[#003B73] transition-colors cursor-pointer"
              >
                <span>Sign Up</span>
              </button>
            </div>
          )}

          {/* Mobile Random Recipe */}
          {onRandomClick && (
            <button
              type="button"
              id="mobile-link-random"
              onClick={handleRandom}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium text-[#003B73] hover:bg-[#EAF4FF] transition-colors cursor-pointer border border-[#E2E8F0] mt-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3]"
            >
              <Shuffle size={15} aria-hidden="true" className="text-[#0056B3]" />
              <span>Random Recipe</span>
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
