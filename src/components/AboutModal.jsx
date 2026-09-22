import React, { useEffect, useRef } from 'react';
import { X, ChefHat, ExternalLink, Heart, Utensils } from 'lucide-react';

/**
 * AboutModal Component
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 */
export default function AboutModal({ isOpen, onClose }) {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    if (closeBtnRef.current) {
      closeBtnRef.current.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="about-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        id="about-modal-content"
        className="w-full max-w-lg bg-white rounded-xl border border-[#E2E8F0] shadow-xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          ref={closeBtnRef}
          type="button"
          id="about-modal-close-btn"
          onClick={onClose}
          aria-label="Close about dialog"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-md text-[#6c757d] hover:text-[#003B73] hover:bg-[#F5F7FA] transition-colors cursor-pointer"
        >
          <X size={18} aria-hidden="true" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4 pr-8">
          <div className="w-10 h-10 rounded-lg bg-[#EAF4FF] border border-[#d0e5ff] flex items-center justify-center text-[#0056B3] shrink-0" aria-hidden="true">
            <ChefHat size={20} className="text-[#0056B3]" />
          </div>
          <div>
            <h2 id="about-modal-title" className="font-serif text-xl font-bold text-[#003B73]">
              Recipe Finder
            </h2>
            <p className="text-xs text-[#6c757d]">
              International Recipes & Cloud Favorites
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3.5 text-xs sm:text-sm text-[#6c757d] leading-relaxed my-4 border-y border-[#E2E8F0] py-4">
          <p>
            <strong className="text-[#212529] font-medium">Recipe Finder</strong> is a clean, practical recipe exploration web app built with React, Vite, and Tailwind CSS. It connects to TheMealDB open API to deliver dishes from various culinary traditions worldwide, paired with Supabase authentication and cloud-synced favorites.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0]">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#003B73] mb-1">
                <Utensils size={13} aria-hidden="true" className="text-[#0056B3]" />
                <span>Recipe Directory</span>
              </div>
              <p className="text-[11px] text-[#6c757d]">
                Explore meals filtered by category, search by dish or ingredient, and view step-by-step cooking steps.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0]">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#003B73] mb-1">
                <Heart size={13} aria-hidden="true" className="text-[#0056B3]" />
                <span>Favorites</span>
              </div>
              <p className="text-[11px] text-[#6c757d]">
                Save recipes to your personal collection with persistent cloud storage.
              </p>
            </div>
          </div>

          {/* API Attribution Section */}
          <div className="p-3 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0] text-[#212529]">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-semibold text-xs text-[#003B73]">
                Data Source
              </span>
              <a
                href="https://www.themealdb.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#0056B3] hover:underline"
              >
                <span>TheMealDB</span>
                <ExternalLink size={11} aria-hidden="true" />
              </a>
            </div>
            <p className="text-xs text-[#6c757d] leading-relaxed">
              Recipe information, ingredients, and preparation videos are provided via TheMealDB open API.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end">
          <button
            type="button"
            id="about-modal-close-action-btn"
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-[#0056B3] text-white text-xs sm:text-sm font-medium hover:bg-[#003B73] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
