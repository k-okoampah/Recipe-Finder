import React, { useEffect, useRef } from 'react';
import { X, ChefHat, ExternalLink, Heart, Sparkles, Utensils, ShieldCheck } from 'lucide-react';

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
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#003B73]/40 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        id="about-modal-content"
        className="w-full max-w-lg bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl p-5 sm:p-7 max-h-[92vh] sm:max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          ref={closeBtnRef}
          type="button"
          id="about-modal-close-btn"
          onClick={onClose}
          aria-label="Close about dialog"
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-8 h-8 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-lg text-[#6c757d] hover:text-[#003B73] hover:bg-[#EAF4FF] border border-transparent hover:border-[#E2E8F0] transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3]"
        >
          <X size={16} aria-hidden="true" />
        </button>

        {/* Header Badge & Brand */}
        <div className="flex items-center gap-3 mb-4 pr-10">
          <div className="w-10 h-10 rounded-xl bg-[#EAF4FF] border border-[#d0e5ff] flex items-center justify-center text-[#0056B3] shadow-xs shrink-0" aria-hidden="true">
            <ChefHat size={22} className="text-[#0056B3]" />
          </div>
          <div>
            <h2 id="about-modal-title" className="font-serif text-xl sm:text-2xl font-bold text-[#003B73]">
              Recipe Finder
            </h2>
            <p className="text-xs font-semibold text-[#0056B3] uppercase tracking-wider">
              Culinary Directory & Cloud Storage
            </p>
          </div>
        </div>

        {/* Story & Mission */}
        <div className="space-y-3.5 text-xs sm:text-sm text-[#6c757d] leading-relaxed my-4 border-y border-[#E2E8F0] py-4">
          <p>
            <strong className="text-[#212529] font-semibold">Recipe Finder</strong> is a full-featured culinary platform engineered to inspire cooks with authentic recipes from across the globe. Built with high-contrast accessibility, resilient cloud synchronization, and responsive design.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <div className="p-3 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0]">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#003B73] mb-1">
                <Utensils size={13} aria-hidden="true" className="text-[#0056B3]" />
                <span>Culinary Catalog</span>
              </div>
              <p className="text-[11px] text-[#6c757d]">
                Hundreds of international recipes across authentic categories.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0]">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#003B73] mb-1">
                <Heart size={13} aria-hidden="true" className="text-[#FFC107] fill-[#FFC107]" />
                <span>Supabase Cloud Favorites</span>
              </div>
              <p className="text-[11px] text-[#6c757d]">
                Save favorites with persistent cloud sync across all your devices.
              </p>
            </div>
          </div>

          {/* API Attribution Section */}
          <div className="p-3.5 rounded-xl bg-[#EAF4FF]/70 border border-[#d0e5ff] text-[#212529]">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-semibold text-xs text-[#003B73] uppercase tracking-wider">
                API Attribution
              </span>
              <a
                href="https://www.themealdb.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TheMealDB open community database (opens in new tab)"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0056B3] hover:text-[#003B73] transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#0056B3]"
              >
                <span>TheMealDB</span>
                <ExternalLink size={11} aria-hidden="true" />
              </a>
            </div>
            <p className="text-xs text-[#6c757d] leading-relaxed">
              Recipe data, ingredient lists, photography, and video guides are provided by{' '}
              <a
                href="https://www.themealdb.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TheMealDB API open community database (opens in new tab)"
                className="font-medium text-[#0056B3] underline hover:text-[#003B73]"
              >
                TheMealDB API
              </a>
              , an open community database for recipes from around the globe.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end">
          <button
            type="button"
            id="about-modal-close-action-btn"
            onClick={onClose}
            className="px-5 py-2 min-h-[40px] rounded-xl bg-[#0056B3] text-white text-xs sm:text-sm font-semibold hover:bg-[#003B73] transition-colors cursor-pointer shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
