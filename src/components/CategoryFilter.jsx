import React, { useState, useEffect } from 'react';

export const MEAL_TYPES = [
  { id: 'all-meals', name: 'All Dishes', value: 'All' },
  { id: 'breakfast', name: 'Breakfast', value: 'Breakfast' },
  { id: 'chicken', name: 'Chicken', value: 'Chicken' },
  { id: 'beef', name: 'Beef', value: 'Beef' },
  { id: 'seafood', name: 'Seafood', value: 'Seafood' },
  { id: 'vegetarian', name: 'Vegetarian', value: 'Vegetarian' },
  { id: 'pasta', name: 'Pasta', value: 'Pasta' },
  { id: 'dessert', name: 'Dessert', value: 'Dessert' },
  { id: 'starter', name: 'Starter', value: 'Starter' },
  { id: 'side', name: 'Side Dishes', value: 'Side' },
  { id: 'pork', name: 'Pork', value: 'Pork' },
  { id: 'lamb', name: 'Lamb', value: 'Lamb' },
];

export const CUISINES = [
  { id: 'all-cuisines', name: 'All Cuisines', value: 'All' },
  { id: 'ghanaian', name: 'Ghanaian', value: 'Ghanaian' },
  { id: 'italian', name: 'Italian', value: 'Italian' },
  { id: 'mexican', name: 'Mexican', value: 'Mexican' },
  { id: 'american', name: 'American', value: 'American' },
  { id: 'indian', name: 'Indian', value: 'Indian' },
  { id: 'chinese', name: 'Chinese', value: 'Chinese' },
  { id: 'french', name: 'French', value: 'French' },
  { id: 'japanese', name: 'Japanese', value: 'Japanese' },
  { id: 'greek', name: 'Greek', value: 'Greek' },
  { id: 'jamaican', name: 'Jamaican', value: 'Jamaican' },
  { id: 'british', name: 'British', value: 'British' },
];

/**
 * CategoryFilter Component
 *
 * Implements a clean category filter section on the homepage allowing users
 * to browse recipes by cuisine or meal type using a simple, clean grid of
 * text-based buttons.
 *
 * @param {Object} props
 * @param {{type: 'mealType'|'cuisine', value: string}} [props.activeFilter]
 * @param {Function} [props.onSelectFilter] - Callback when a filter button is clicked (type, value)
 * @param {boolean} [props.isLoading=false]
 * @param {string} [props.selectedCategory='All'] - Backward compatibility
 * @param {Function} [props.onSelectCategory] - Backward compatibility
 */
export default function CategoryFilter({
  activeFilter = { type: 'mealType', value: 'All' },
  onSelectFilter,
  isLoading = false,
  selectedCategory = 'All',
  onSelectCategory,
}) {
  // Determine current active filter object
  const currentFilter = activeFilter || {
    type: 'mealType',
    value: selectedCategory || 'All',
  };

  // State to track whether user is viewing Meal Types or Cuisines grid
  const [activeMode, setActiveMode] = useState(currentFilter.type || 'mealType');

  // Keep activeMode in sync when an external filter of a different type is triggered
  useEffect(() => {
    if (currentFilter.type && currentFilter.type !== activeMode) {
      setActiveMode(currentFilter.type);
    }
  }, [currentFilter.type]);

  const handleSelect = (mode, value) => {
    if (onSelectFilter) {
      onSelectFilter(mode, value);
    } else if (onSelectCategory) {
      onSelectCategory(value);
    }
  };

  const currentOptions = activeMode === 'cuisine' ? CUISINES : MEAL_TYPES;
  const isFiltering = currentFilter.value && currentFilter.value !== 'All';

  return (
    <section
      id="category-filter-section"
      aria-label="Filter recipes by cuisine or meal type"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8"
    >
      <div className="bg-white rounded-lg border border-[#E2E8F0] p-4 sm:p-5 shadow-xs">
        {/* Section Header: Title & Clean Text Segment Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3.5 mb-3.5 border-b border-[#F1F5F9]">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#0F172A]">
              Browse Recipes
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Filter by cuisine or meal type using the categories below
            </p>
          </div>

          {/* Clean Segmented Tab Switcher */}
          <div
            role="tablist"
            aria-label="Filter mode"
            className="inline-flex items-center p-1 bg-[#F1F5F9] rounded-md border border-[#E2E8F0] self-start sm:self-auto"
          >
            <button
              type="button"
              role="tab"
              id="tab-filter-meal-type"
              aria-selected={activeMode === 'mealType'}
              aria-controls="filter-grid-panel"
              onClick={() => setActiveMode('mealType')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-colors cursor-pointer select-none ${
                activeMode === 'mealType'
                  ? 'bg-white text-[#0056B3] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Meal Type
            </button>
            <button
              type="button"
              role="tab"
              id="tab-filter-cuisine"
              aria-selected={activeMode === 'cuisine'}
              aria-controls="filter-grid-panel"
              onClick={() => setActiveMode('cuisine')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-colors cursor-pointer select-none ${
                activeMode === 'cuisine'
                  ? 'bg-white text-[#0056B3] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Cuisine
            </button>
          </div>
        </div>

        {/* Simple, Clean Grid of Text-Based Buttons */}
        <div
          id="filter-grid-panel"
          role="tabpanel"
          aria-labelledby={activeMode === 'mealType' ? 'tab-filter-meal-type' : 'tab-filter-cuisine'}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-2.5"
        >
          {currentOptions.map((item) => {
            const isAllButton = item.value === 'All';
            const isSelected =
              (isAllButton && !isFiltering) ||
              (!isAllButton &&
                currentFilter.type === activeMode &&
                currentFilter.value.toLowerCase() === item.value.toLowerCase());

            return (
              <button
                key={item.id}
                type="button"
                id={`filter-btn-${item.id}`}
                aria-pressed={isSelected}
                disabled={isLoading}
                onClick={() => handleSelect(activeMode, item.value)}
                className={`min-h-[42px] px-3.5 py-2.5 rounded-md text-xs sm:text-sm font-medium text-center transition-colors cursor-pointer select-none border flex items-center justify-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSelected
                    ? 'bg-[#0056B3] text-white border-[#0056B3] font-semibold shadow-xs'
                    : 'bg-white text-[#334155] border-[#E2E8F0] hover:border-[#94A3B8] hover:bg-[#F8FAFC]'
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>

        {/* Active Filter Status & Reset Action */}
        {isFiltering && (
          <div
            id="filter-status-row"
            className="mt-3 pt-3 border-t border-[#F1F5F9] flex flex-wrap items-center justify-between gap-2 text-xs"
          >
            <div className="flex items-center gap-1.5 text-[#64748B]">
              <span>Active filter:</span>
              <span className="font-semibold text-[#0F172A] bg-[#F1F5F9] px-2 py-0.5 rounded border border-[#E2E8F0]">
                {currentFilter.value} ({currentFilter.type === 'cuisine' ? 'Cuisine' : 'Meal Type'})
              </span>
            </div>
            <button
              type="button"
              id="clear-filter-btn"
              onClick={() => handleSelect(activeMode, 'All')}
              className="text-[#0056B3] hover:text-[#003B73] font-medium underline cursor-pointer transition-colors"
            >
              Reset to All Recipes
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
