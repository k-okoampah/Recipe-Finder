import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable LoadingState Component
 *
 * @param {Object} props
 * @param {'skeleton'|'spinner'} [props.type='skeleton']
 * @param {number} [props.count=6]
 * @param {string} [props.message='Loading delicious recipes...']
 */
export default function LoadingState({
  type = 'skeleton',
  count = 6,
  message = 'Loading delicious recipes...',
}) {
  if (type === 'spinner') {
    return (
      <div
        id="loading-spinner-state"
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in"
      >
        <div className="w-12 h-12 rounded-2xl bg-[#EAF4FF] border border-[#d0e5ff] flex items-center justify-center text-[#0056B3] mb-4 shadow-xs">
          <Loader2 size={24} className="animate-spin text-[#0056B3]" />
        </div>
        <p className="font-serif text-base sm:text-lg font-bold text-[#003B73]">
          {message}
        </p>
        <p className="text-xs text-[#6c757d] mt-1">
          Gathering authentic ingredients and culinary details...
        </p>
      </div>
    );
  }

  return (
    <div
      id="loading-skeleton-grid"
      role="status"
      aria-live="polite"
      aria-label="Loading recipe cards"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-7 my-6 animate-pulse"
    >
      <span className="sr-only">{message}</span>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={`skeleton-card-${idx}`}
          className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs flex flex-col h-[340px]"
        >
          {/* Top image placeholder */}
          <div className="aspect-4/3 w-full bg-[#EAF4FF] relative">
            <div className="absolute bottom-3 left-3 w-20 h-5 bg-[#d0e5ff] rounded-full" />
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#d0e5ff]" />
          </div>

          {/* Body content placeholder */}
          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="h-5 bg-[#E2E8F0] rounded-md w-4/5" />
              <div className="h-4 bg-[#F5F7FA] rounded-md w-1/2" />
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
              <div className="h-4 bg-[#F5F7FA] rounded-md w-24" />
              <div className="h-4 bg-[#EAF4FF] rounded-md w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
