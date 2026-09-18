import React from 'react';
import { Utensils, Soup, Drumstick, Flame, Fish, Salad, Cake } from 'lucide-react';

const DEFAULT_CATEGORIES = [
  { id: 'all', name: 'All', icon: Utensils },
  { id: 'ghanaian', name: 'Ghanaian', icon: Soup },
  { id: 'chicken', name: 'Chicken', icon: Drumstick },
  { id: 'beef', name: 'Beef', icon: Flame },
  { id: 'seafood', name: 'Seafood', icon: Fish },
  { id: 'vegetarian', name: 'Vegetarian', icon: Salad },
  { id: 'dessert', name: 'Dessert', icon: Cake },
];

/**
 * CategoryFilter Component
 *
 * Active category filter: Primary Blue #0056B3
 * Inactive filters: White #FFFFFF with #E2E8F0 border, hover #EAF4FF
 * Heading: Dark Blue #003B73 / Dark Text #212529
 *
 * @param {Object} props
 * @param {Array} [props.categories]
 * @param {string} [props.selectedCategory='All']
 * @param {Function} props.onSelectCategory
 * @param {boolean} [props.isLoading=false]
 */
export default function CategoryFilter({
  categories = DEFAULT_CATEGORIES,
  selectedCategory = 'All',
  onSelectCategory,
  isLoading = false,
}) {
  const normalizedCategories = (categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES).map(
    (item) => {
      if (typeof item === 'string') {
        const matchingDefault = DEFAULT_CATEGORIES.find(
          (d) => d.name.toLowerCase() === item.toLowerCase()
        );
        return {
          id: item.toLowerCase(),
          name: item,
          icon: matchingDefault ? matchingDefault.icon : Utensils,
        };
      }
      return {
        id: item.id || item.idCategory || item.name || item.strCategory,
        name: item.name || item.strCategory,
        icon: item.icon || Utensils,
      };
    }
  );

  return (
    <section
      id="category-filter-section"
      aria-label="Filter recipes by category"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#003B73]">
          Explore by Category
        </h2>
        <span className="text-xs text-[#6c757d] hidden sm:inline-block font-medium">
          Select a category to filter dishes
        </span>
      </div>

      {/* Horizontally scrollable category pills */}
      <div
        role="group"
        aria-label="Recipe categories"
        className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-2 scroll-smooth no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 overscroll-x-contain"
      >
        {normalizedCategories.map((category) => {
          const isSelected = selectedCategory.toLowerCase() === category.name.toLowerCase();
          const Icon = category.icon;

          return (
            <button
              key={category.id}
              type="button"
              id={`filter-category-${category.id}`}
              aria-pressed={isSelected}
              aria-label={`Filter by ${category.name} recipes`}
              onClick={() => onSelectCategory && onSelectCategory(category.name)}
              className={`group flex items-center gap-2 px-4 py-2 min-h-[40px] sm:min-h-[42px] rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors duration-150 cursor-pointer border select-none shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] focus-visible:ring-offset-2 ${
                isSelected
                  ? 'bg-[#0056B3] text-white border-[#0056B3] shadow-xs font-semibold'
                  : 'bg-white text-[#212529] hover:text-[#003B73] border-[#E2E8F0] hover:border-[#0056B3] hover:bg-[#EAF4FF]'
              }`}
            >
              {Icon && (
                <Icon
                  size={14}
                  aria-hidden="true"
                  className={`transition-colors ${
                    isSelected ? 'text-[#FFC107]' : 'text-[#0056B3] group-hover:text-[#003B73]'
                  }`}
                />
              )}
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
