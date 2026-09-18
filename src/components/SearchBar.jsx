import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';

/**
 * SearchBar Component
 *
 * @param {Object} props
 * @param {string} [props.value]
 * @param {Function} props.onSearch
 * @param {string} [props.placeholder]
 */
export default function SearchBar({
  value = '',
  onSearch,
  placeholder = 'Search for chicken, pasta, curry...',
}) {
  const [query, setQuery] = useState(value);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <form id="search-form" role="search" onSubmit={handleSubmit} className="w-full">
      <label htmlFor="recipe-search-input" className="sr-only">
        Search recipes by name or ingredient
      </label>
      <div className="relative flex items-center bg-white rounded-xl border border-[#E2E8F0] shadow-xs hover:border-[#cbd5e1] focus-within:border-[#0056B3] focus-within:ring-2 focus-within:ring-[#0056B3]/15 transition-all p-1.5 sm:p-2">
        {/* Search Icon in Primary Blue #0056B3 */}
        <div className="pl-3 sm:pl-3.5 pr-1.5 sm:pr-2 text-[#0056B3] shrink-0" aria-hidden="true">
          <Search size={20} className="text-[#0056B3] sm:w-[22px] sm:h-[22px]" />
        </div>

        {/* Input */}
        <input
          id="recipe-search-input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full min-w-0 flex-1 py-2.5 sm:py-3 pr-2 text-[#212529] placeholder:text-[#6c757d]/70 text-sm sm:text-base font-sans bg-transparent border-none outline-hidden"
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            id="clear-search-btn"
            onClick={handleClear}
            className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center mr-1 text-[#6c757d] hover:text-[#003B73] rounded-full hover:bg-[#EAF4FF] transition-colors cursor-pointer shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3]"
            aria-label="Clear search input"
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}

        {/* Submit Button in Primary Blue #0056B3 */}
        <button
          type="submit"
          id="submit-search-btn"
          className="shrink-0 px-4 sm:px-6 py-2.5 sm:py-3 min-h-[44px] rounded-xl bg-[#0056B3] hover:bg-[#003B73] active:scale-[0.98] text-white font-semibold text-sm sm:text-base transition-all duration-150 cursor-pointer shadow-xs flex items-center justify-center gap-1.5 sm:gap-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] focus-visible:ring-offset-2"
        >
          <span>Search</span>
          <ArrowRight size={16} aria-hidden="true" className="hidden sm:inline" />
        </button>
      </div>
    </form>
  );
}
