import React from 'react';
import { Heart } from 'lucide-react';

/**
 * Reusable Favorite Button Component
 *
 * Uses:
 * - Yellow: #FFC107 for favorite accents and active fill
 * - Primary Blue: #0056B3 for border/active ring
 * - White: #FFFFFF for button surface
 *
 * @param {Object} props
 * @param {boolean} props.isFavorite
 * @param {Function} props.onToggle
 * @param {string} [props.className]
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {string} [props.id]
 * @param {string} [props.recipeName]
 */
export default function FavoriteButton({
  isFavorite = false,
  onToggle,
  className = '',
  size = 'md',
  id,
  recipeName = '',
}) {
  const sizeClasses = {
    sm: 'w-9 h-9 sm:w-8 sm:h-8 p-1.5 min-w-[36px] min-h-[36px] sm:min-w-8 sm:min-h-8',
    md: 'w-11 h-11 sm:w-10 sm:h-10 p-2 min-w-[44px] min-h-[44px]',
    lg: 'w-12 h-12 p-2.5 min-w-[48px] min-h-[48px]',
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 22,
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (onToggle) {
      onToggle();
    }
  };

  const handleKeyDown = (e) => {
    e.stopPropagation();
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onToggle) {
        onToggle();
      }
    }
  };

  const label = isFavorite
    ? recipeName
      ? `Remove ${recipeName} from favorites`
      : 'Remove from favorites'
    : recipeName
    ? `Add ${recipeName} to favorites`
    : 'Add to favorites';

  return (
    <button
      type="button"
      id={id || undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={label}
      aria-pressed={isFavorite}
      title={label}
      className={`inline-flex items-center justify-center rounded-full transition-colors duration-150 cursor-pointer border focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] focus-visible:ring-offset-2 ${
        isFavorite
          ? 'bg-[#FFF9E6] text-[#003B73] border-[#FFC107] hover:bg-[#fff3cc]'
          : 'bg-white text-[#6c757d] border-[#E2E8F0] hover:text-[#0056B3] hover:border-[#94A3B8] hover:bg-[#F8FAFC]'
      } ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      <Heart
        size={iconSizes[size] || 18}
        aria-hidden="true"
        className={`transition-colors duration-150 ${
          isFavorite
            ? 'fill-[#FFC107] text-[#FFC107]'
            : 'text-[#6c757d] group-hover:text-[#0056B3]'
        }`}
      />
    </button>
  );
}
