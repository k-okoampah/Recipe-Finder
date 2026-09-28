import React from 'react';
import { ChefHat, ExternalLink } from 'lucide-react';

/**
 * Footer Component
 *
 * Palette:
 * - Dark Blue (#003B73): headings, navbar accents, footer
 * - Primary Blue (#0056B3): primary links, logo, hover states
 * - Yellow (#FFC107): favorite accents, highlights
 * - White (#FFFFFF): surface
 * - Dark Text (#212529): body text
 * - Light Gray (#F5F7FA): background
 *
 * @param {Object} props
 * @param {Function} props.onNavigateRecipes
 * @param {Function} props.onNavigateFavorites
 * @param {number} [props.favoriteCount=0]
 */
export default function Footer({
  onNavigateRecipes,
  onNavigateFavorites,
  favoriteCount = 0,
}) {
  return (
    <footer
      id="site-footer"
      role="contentinfo"
      className="border-t border-[#E2E8F0] bg-white text-[#212529] mt-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 items-start">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0056B3] flex items-center justify-center text-white shadow-xs" aria-hidden="true">
                <ChefHat size={18} className="text-white" />
              </div>
              <span className="font-bold text-lg sm:text-xl text-[#003B73] tracking-tight">
                Recipe<span className="text-[#0056B3]">Finder</span>
              </span>
            </div>

            <p className="text-xs sm:text-[14px] text-[#6c757d] leading-relaxed max-w-sm font-normal">
              Discover delicious recipes, explore authentic international cuisines, and save your favorites with cloud synchronization.
            </p>
          </div>

          {/* Navigation Links Column */}
          <div className="md:col-span-2 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#003B73]">
              Navigation
            </h2>
            <nav aria-label="Footer navigation">
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li>
                  <button
                    type="button"
                    id="footer-nav-recipes"
                    onClick={onNavigateRecipes}
                    className="text-[#6c757d] hover:text-[#0056B3] font-medium transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] rounded-md py-1"
                  >
                    Recipes
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    id="footer-nav-favorites"
                    onClick={onNavigateFavorites}
                    className="text-[#6c757d] hover:text-[#0056B3] font-medium transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] rounded-md py-1 inline-flex items-center gap-1.5"
                  >
                    <span>Favorites</span>
                    {favoriteCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#EAF4FF] text-[#003B73]">
                        {favoriteCount}
                      </span>
                    )}
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Connect with me / My Links Column */}
          <div className="md:col-span-3 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#003B73]">
              Connect with me
            </h2>
            <nav aria-label="Social and personal links">
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li>
                  <a
                    href="https://linktr.ee/k_okoampah"
                    target="_blank"
                    rel="noopener noreferrer"
                    id="footer-linktree-link"
                    aria-label="My Linktree (opens in a new tab)"
                    className="text-[#6c757d] hover:text-[#0056B3] font-medium transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] rounded-md py-1 inline-flex items-center gap-1.5"
                  >
                    <span>My Linktree</span>
                    <ExternalLink size={13} aria-hidden="true" className="inline text-[#0056B3]" />
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Attribution Column */}
          <div className="md:col-span-3 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#003B73]">
              Data Attribution
            </h2>
            <p className="text-xs text-[#6c757d] leading-relaxed">
              Culinary recipes, ingredients, and photography are provided by{' '}
              <a
                href="https://www.themealdb.com"
                target="_blank"
                rel="noopener noreferrer"
                id="footer-attribution-link"
                aria-label="TheMealDB API open community database (opens in new tab)"
                className="inline-flex items-center gap-1 font-semibold text-[#0056B3] hover:text-[#003B73] underline transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] rounded-xs"
              >
                <span>TheMealDB API</span>
                <ExternalLink size={12} aria-hidden="true" className="inline" />
              </a>
              , an open community database for authentic food recipes worldwide.
            </p>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="border-t border-[#E2E8F0] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6c757d] text-center sm:text-left">
          <p>© {new Date().getFullYear()} Recipe Finder. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-1">
            <span>
              Built by{' '}
              <a
                href="https://linktr.ee/k_okoampah"
                target="_blank"
                rel="noopener noreferrer"
                id="footer-developer-credit"
                aria-label="Built by Kofi Okoampah (opens in a new tab)"
                className="font-semibold text-[#0056B3] hover:text-[#003B73] underline hover:no-underline transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] rounded-xs"
              >
                Kofi Okoampah
              </a>
            </span>
            <span className="hidden sm:inline text-[#CBD5E1]" aria-hidden="true">·</span>
            <span>Powered by Supabase Auth &amp; Cloud Database</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
