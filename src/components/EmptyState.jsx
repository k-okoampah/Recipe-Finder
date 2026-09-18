import React from 'react';
import { Compass, Heart, Search, RotateCcw, Sparkles } from 'lucide-react';

/**
 * Reusable EmptyState Component
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
 * @param {'no-results'|'no-favorites'|'empty-search'|'generic'} [props.type='generic']
 * @param {string} [props.title]
 * @param {string} [props.description]
 * @param {string} [props.searchQuery]
 * @param {Function} [props.onAction]
 * @param {Function} [props.onReset]
 * @param {string} [props.actionText]
 * @param {Array<string>} [props.suggestions]
 * @param {Function} [props.onSelectSuggestion]
 * @param {React.ReactNode} [props.icon]
 */
export default function EmptyState({
  type = 'generic',
  title,
  description,
  searchQuery = '',
  onAction,
  onReset,
  actionText,
  suggestions = ['Chicken', 'Pasta', 'Curry', 'Beef', 'Seafood'],
  onSelectSuggestion,
  icon,
}) {
  const handleAction = onAction || onReset;

  const presets = {
    'no-results': {
      icon: <Search size={28} className="text-[#0056B3]" />,
      defaultTitle: searchQuery
        ? `We couldn't find recipes matching "${searchQuery}"`
        : "We couldn't find that recipe. Try another ingredient or meal.",
      defaultDescription:
        "Check your spelling, try a more common ingredient (like chicken or pasta), or explore our popular culinary staples below:",
      defaultActionText: 'Discover Recipes',
      showSuggestions: true,
    },
    'no-favorites': {
      icon: <Heart size={28} className="fill-[#FFC107] text-[#0056B3]" />,
      defaultTitle: "You haven't saved any recipes yet.",
      defaultDescription:
        'Explore dishes from around the world and tap the heart icon on any recipe to save it here for quick access.',
      defaultActionText: 'Discover Recipes',
      showSuggestions: false,
    },
    'empty-search': {
      icon: <Sparkles size={28} className="text-[#FFC107]" />,
      defaultTitle: 'Looking for something delicious?',
      defaultDescription:
        'Type an ingredient, culinary technique, or dish name above to begin discovering recipes.',
      defaultActionText: 'Browse Recipes',
      showSuggestions: true,
    },
    generic: {
      icon: <Compass size={28} className="text-[#0056B3]" />,
      defaultTitle: 'No recipes found in collection',
      defaultDescription:
        'Try browsing by category, searching with broader keywords, or reset your filters.',
      defaultActionText: 'Reset & Discover Recipes',
      showSuggestions: false,
    },
  };

  const activePreset = presets[type] || presets.generic;

  const displayTitle = title || activePreset.defaultTitle;
  const displayDescription = description || activePreset.defaultDescription;
  const displayActionText = actionText || activePreset.defaultActionText;
  const displayIcon = icon || activePreset.icon;
  const shouldShowSuggestions =
    activePreset.showSuggestions &&
    Array.isArray(suggestions) &&
    suggestions.length > 0 &&
    typeof onSelectSuggestion === 'function';

  return (
    <div
      id={`empty-state-${type}`}
      role="status"
      className="max-w-lg mx-auto my-8 sm:my-12 p-6 sm:p-8 text-center bg-white rounded-2xl border border-[#E2E8F0] shadow-sm animate-fade-in"
    >
      {/* Visual Accent Icon Badge */}
      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#EAF4FF] border border-[#d0e5ff] flex items-center justify-center shadow-xs shrink-0">
        {displayIcon}
      </div>

      {/* Title */}
      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#003B73] mb-2 leading-snug break-words">
        {displayTitle}
      </h3>

      {/* Description */}
      <p className="font-sans text-xs sm:text-sm text-[#6c757d] leading-relaxed mb-5 max-w-md mx-auto">
        {displayDescription}
      </p>

      {/* Interactive Search Suggestions */}
      {shouldShowSuggestions && (
        <div className="mb-6 pt-1">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-[#6c757d] mb-2">
            Try searching for:
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {suggestions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onSelectSuggestion(item)}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F5F7FA] border border-[#E2E8F0] text-[#0056B3] hover:bg-[#0056B3] hover:text-white hover:border-[#0056B3] transition-colors cursor-pointer shadow-xs inline-flex items-center"
              >
                + {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Primary Action Button in Primary Blue #0056B3 */}
      {handleAction && (
        <button
          type="button"
          id="empty-state-action-btn"
          onClick={handleAction}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-[#0056B3] text-white text-xs sm:text-sm font-semibold hover:bg-[#003B73] transition-colors duration-150 cursor-pointer shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] focus-visible:ring-offset-2"
        >
          <RotateCcw size={14} />
          <span>{displayActionText}</span>
        </button>
      )}
    </div>
  );
}
