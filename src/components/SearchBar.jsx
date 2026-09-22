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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]" aria-hidden="true">
            <Search size={16} />
          </div>

          <input
            id="recipe-search-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-9 pr-9 py-2.5 bg-white rounded-md border border-[#E2E8F0] hover:border-[#CBD5E1] text-sm text-[#0F172A] placeholder:text-[#94A3B8] transition-colors focus:outline-hidden focus:ring-1 focus:ring-[#0056B3] focus:border-[#0056B3]"
          />

          {query && (
            <button
              type="button"
              id="clear-search-btn"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94A3B8] hover:text-[#0F172A] transition-colors cursor-pointer"
              aria-label="Clear search input"
            >
              <X size={15} aria-hidden="true" />
            </button>
          )}
        </div>

        <button
          type="submit"
          id="submit-search-btn"
          className="px-5 py-2.5 rounded-md bg-[#0056B3] hover:bg-[#003B73] text-white font-medium text-sm transition-colors cursor-pointer inline-flex items-center justify-center shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] focus-visible:ring-offset-2"
        >
          Search
        </button>
      </div>
    </form>
  );
}
