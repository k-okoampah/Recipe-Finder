import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * Reusable ScrollToTop Component
 * 
 * Features:
 * - Appears smoothly when scrolled past 350px (between 300px - 400px)
 * - Smoothly scrolls viewport back to the top on click or keyboard activation
 * - Styled with CareerGhana Brand Colors:
 *   - Background: Primary Blue (#0056B3)
 *   - Icon: White (#FFFFFF)
 *   - Hover Background: Dark Blue (#003B73)
 * - Smooth fade and scale transition
 * - Circular shape with elevation shadow
 * - Full accessibility with aria-label and keyboard navigation support
 */
export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling past 350px (threshold in 300-400px range)
      const scrolledPastThreshold = window.scrollY > 350;
      setIsVisible(scrolledPastThreshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial verification
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scrollToTop();
    }
  };

  return (
    <button
      type="button"
      id="scroll-to-top-button"
      onClick={scrollToTop}
      onKeyDown={handleKeyDown}
      aria-label="Scroll to top"
      title="Scroll to top"
      tabIndex={isVisible ? 0 : -1}
      aria-hidden={!isVisible}
      className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center justify-center w-12 h-12 rounded-full bg-[#0056B3] hover:bg-[#003B73] active:bg-[#002850] text-white shadow-md hover:shadow-xl transition-all duration-300 ease-out transform cursor-pointer border border-white/20 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#FFC107] focus-visible:ring-offset-2 ${
        isVisible
          ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 scale-75 translate-y-4 pointer-events-none'
      }`}
    >
      <ArrowUp
        size={22}
        strokeWidth={2.5}
        aria-hidden="true"
        className="text-white transition-transform duration-200 group-hover:-translate-y-0.5"
      />
    </button>
  );
}
