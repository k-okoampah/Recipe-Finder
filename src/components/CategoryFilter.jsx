import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Utensils, Globe, Check, X, Filter } from 'lucide-react';

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
 * Implements the "Browse Recipes" dropdown filter section, allowing users
 * to explore dishes by cuisine or meal type via clean, responsive dropdown controls.
 *
 * @param {Object} props
 * @param {{type: 'mealType'|'cuisine', value: string}} [props.activeFilter]
 * @param {Function} [props.onSelectFilter] - Callback when a filter is chosen (type, value)
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
  const currentFilter = activeFilter || {
    type: 'mealType',
    value: selectedCategory || 'All',
  };

  const [isOpen, setIsOpen] = useState(false);
  const [dropdownTab, setDropdownTab] = useState(currentFilter.type || 'mealType');
  const [searchFilter, setSearchFilter] = useState('');
  const dropdownRef = useRef(null);

  // Sync tab with external filter updates
  useEffect(() => {
    if (currentFilter.type && currentFilter.type !== dropdownTab) {
      setDropdownTab(currentFilter.type);
    }
  }, [currentFilter.type]);

  // Click outside to close custom dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (type, value) => {
    setIsOpen(false);
    setSearchFilter('');
    if (onSelectFilter) {
      onSelectFilter(type, value);
    } else if (onSelectCategory) {
      onSelectCategory(value);
    }
  };

  const handleNativeSelectChange = (e) => {
    const val = e.target.value;
    if (!val || val === 'all' || val === 'All') {
      handleSelect('mealType', 'All');
      return;
    }
    const [type, value] = val.split(':');
    if (type && value) {
      handleSelect(type, value);
    } else {
      handleSelect('mealType', val);
    }
  };

  const isFiltering = currentFilter.value && currentFilter.value !== 'All';

  // Label for custom dropdown trigger button
  const getSelectedLabel = () => {
    if (!isFiltering) {
      return 'All Recipes';
    }
    const typeLabel = currentFilter.type === 'cuisine' ? 'Cuisine' : 'Meal Type';
    return `${currentFilter.value} (${typeLabel})`;
  };

  // Filter options for search inside custom dropdown
  const currentOptions = dropdownTab === 'cuisine' ? CUISINES : MEAL_TYPES;
  const filteredOptions = currentOptions.filter((opt) =>
    opt.name.toLowerCase().includes(searchFilter.trim().toLowerCase())
  );

  return (
    <section
      id="category-filter-section"
      aria-label="Filter recipes by cuisine or meal type"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8"
    >
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-5 shadow-xs">
        {/* Header & Dropdown Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Title & Description */}
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#EAF4FF] text-[#0056B3] flex items-center justify-center shrink-0">
                <Filter size={16} />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">
                Browse Recipes
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Filter dishes by meal type or world cuisine using the dropdown below
            </p>
          </div>

          {/* Dropdown Select Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* 1. Custom Interactive Dropdown Menu with Popover */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                id="browse-recipes-dropdown-btn"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls="browse-recipes-dropdown-menu"
                onClick={() => setIsOpen((prev) => !prev)}
                disabled={isLoading}
                className={`w-full sm:w-auto min-w-[240px] md:min-w-[270px] h-10 px-3.5 py-2 bg-white rounded-lg text-xs sm:text-sm font-medium flex items-center justify-between gap-2.5 shadow-xs transition-colors cursor-pointer border ${
                  isOpen
                    ? 'border-[#0056B3] ring-2 ring-[#0056B3]/20'
                    : 'border-[#CBD5E1] hover:border-[#0056B3] hover:bg-[#F8FAFC]'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-2 truncate">
                  {currentFilter.type === 'cuisine' ? (
                    <Globe size={15} className="text-[#0056B3] shrink-0" />
                  ) : (
                    <Utensils size={15} className="text-[#0056B3] shrink-0" />
                  )}
                  <span className="text-[#64748B] text-xs font-normal">Browse:</span>
                  <span className="font-semibold text-[#0F172A] truncate">
                    {getSelectedLabel()}
                  </span>
                </div>
                <ChevronDown
                  size={15}
                  className={`text-[#64748B] shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#0056B3]' : ''
                  }`}
                />
              </button>

              {/* Dropdown Popover Menu */}
              {isOpen && (
                <div
                  id="browse-recipes-dropdown-menu"
                  role="listbox"
                  aria-label="Browse Recipes Options"
                  className="absolute left-0 sm:right-0 sm:left-auto mt-1.5 w-full sm:w-[320px] bg-white rounded-xl border border-[#CBD5E1] shadow-xl z-50 p-2.5"
                >
                  {/* Category Switcher Tabs */}
                  <div className="flex items-center p-1 bg-[#F1F5F9] rounded-lg mb-2">
                    <button
                      type="button"
                      role="tab"
                      id="browse-dropdown-tab-meal"
                      aria-selected={dropdownTab === 'mealType'}
                      onClick={() => {
                        setDropdownTab('mealType');
                        setSearchFilter('');
                      }}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer text-center ${
                        dropdownTab === 'mealType'
                          ? 'bg-white text-[#0056B3] shadow-xs'
                          : 'text-[#64748B] hover:text-[#0F172A]'
                      }`}
                    >
                      Meal Types
                    </button>
                    <button
                      type="button"
                      role="tab"
                      id="browse-dropdown-tab-cuisine"
                      aria-selected={dropdownTab === 'cuisine'}
                      onClick={() => {
                        setDropdownTab('cuisine');
                        setSearchFilter('');
                      }}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer text-center ${
                        dropdownTab === 'cuisine'
                          ? 'bg-white text-[#0056B3] shadow-xs'
                          : 'text-[#64748B] hover:text-[#0F172A]'
                      }`}
                    >
                      Cuisines
                    </button>
                  </div>

                  {/* Search filter within dropdown */}
                  <div className="mb-2">
                    <input
                      type="text"
                      placeholder={`Search ${dropdownTab === 'cuisine' ? 'cuisines' : 'meal types'}...`}
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="w-full h-8 px-2.5 text-xs rounded-md bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#0056B3] focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  {/* Scrollable Items List */}
                  <div className="max-h-60 overflow-y-auto space-y-0.5 pr-0.5">
                    {/* All Recipes Reset Option */}
                    <button
                      type="button"
                      role="option"
                      aria-selected={!isFiltering}
                      onClick={() => handleSelect('mealType', 'All')}
                      className={`w-full px-3 py-2 text-xs font-medium rounded-lg flex items-center justify-between transition-colors cursor-pointer text-left ${
                        !isFiltering
                          ? 'bg-[#EAF4FF] text-[#003B73] font-semibold'
                          : 'text-[#334155] hover:bg-[#F1F5F9]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Utensils size={14} className="text-[#0056B3]" />
                        All Recipes (Show All)
                      </span>
                      {!isFiltering && <Check size={14} className="text-[#0056B3]" />}
                    </button>

                    <div className="my-1 border-t border-[#F1F5F9]" />

                    {filteredOptions.map((item) => {
                      if (item.value === 'All') return null;
                      const isSelected =
                        currentFilter.type === dropdownTab &&
                        currentFilter.value.toLowerCase() === item.value.toLowerCase();

                      return (
                        <button
                          key={item.id}
                          type="button"
                          role="option"
                          id={`dropdown-opt-${item.id}`}
                          aria-selected={isSelected}
                          onClick={() => handleSelect(dropdownTab, item.value)}
                          className={`w-full px-3 py-2 text-xs font-medium rounded-lg flex items-center justify-between transition-colors cursor-pointer text-left ${
                            isSelected
                              ? 'bg-[#EAF4FF] text-[#003B73] font-semibold'
                              : 'text-[#334155] hover:bg-[#F1F5F9]'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {dropdownTab === 'cuisine' ? (
                              <Globe size={13} className="text-[#64748B]" />
                            ) : (
                              <Utensils size={13} className="text-[#64748B]" />
                            )}
                            {item.name}
                          </span>
                          {isSelected && <Check size={14} className="text-[#0056B3]" />}
                        </button>
                      );
                    })}

                    {filteredOptions.length === 0 && (
                      <p className="py-3 text-center text-xs text-[#94A3B8]">
                        No matching categories found
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Accessible Native Select Dropdown */}
            <div className="relative">
              <select
                id="browse-recipes-select"
                aria-label="Browse Recipes by Meal Type or Cuisine Dropdown"
                disabled={isLoading}
                value={
                  !isFiltering
                    ? 'all'
                    : `${currentFilter.type}:${currentFilter.value}`
                }
                onChange={handleNativeSelectChange}
                className="w-full sm:w-auto h-10 pl-3.5 pr-8 bg-white border border-[#CBD5E1] hover:border-[#0056B3] rounded-lg text-xs sm:text-sm font-medium text-[#0F172A] cursor-pointer appearance-none focus:outline-hidden focus:ring-2 focus:ring-[#0056B3] focus:border-transparent shadow-xs transition-colors"
              >
                <option value="all">All Recipes (Browse All)</option>
                <optgroup label="── Meal Types ──">
                  {MEAL_TYPES.filter((m) => m.value !== 'All').map((meal) => (
                    <option key={`opt-meal-${meal.id}`} value={`mealType:${meal.value}`}>
                      {meal.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="── Cuisines ──">
                  {CUISINES.filter((c) => c.value !== 'All').map((cuisine) => (
                    <option key={`opt-cuis-${cuisine.id}`} value={`cuisine:${cuisine.value}`}>
                      {cuisine.name} Cuisine
                    </option>
                  ))}
                </optgroup>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#64748B]">
                <ChevronDown size={14} />
              </div>
            </div>
          </div>
        </div>

        {/* Active Filter Status & Reset Action */}
        {isFiltering && (
          <div
            id="filter-status-row"
            className="mt-3.5 pt-3.5 border-t border-[#F1F5F9] flex flex-wrap items-center justify-between gap-2 text-xs"
          >
            <div className="flex items-center gap-1.5 text-[#64748B]">
              <span>Active filter:</span>
              <span className="font-semibold text-[#003B73] bg-[#EAF4FF] px-2.5 py-0.5 rounded-md border border-[#0056B3]/20">
                {currentFilter.value} ({currentFilter.type === 'cuisine' ? 'Cuisine' : 'Meal Type'})
              </span>
            </div>
            <button
              type="button"
              id="clear-filter-btn"
              onClick={() => handleSelect('mealType', 'All')}
              className="inline-flex items-center gap-1 text-[#0056B3] hover:text-[#003B73] font-medium cursor-pointer transition-colors"
            >
              <X size={13} />
              <span>Reset to All Recipes</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

