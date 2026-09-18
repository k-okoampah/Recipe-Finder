import React from 'react';
import { AlertCircle, RefreshCw, ArrowLeft, WifiOff } from 'lucide-react';

/**
 * Reusable ErrorState Component
 *
 * @param {Object} props
 * @param {string} [props.title]
 * @param {string|Error} [props.message]
 * @param {Function} [props.onRetry]
 * @param {string} [props.retryText='Try again']
 * @param {Function} [props.onReset]
 * @param {string} [props.resetText='Return to all recipes']
 * @param {boolean} [props.isNetworkError=false]
 */
export default function ErrorState({
  title = 'Something went wrong while loading recipes.',
  message,
  onRetry,
  retryText = 'Try again',
  onReset,
  resetText = 'Return to all recipes',
  isNetworkError = false,
}) {
  const sanitizeErrorMessage = (raw) => {
    if (!raw) {
      return 'Please check your internet connection or try again in a few moments.';
    }

    const text = typeof raw === 'string' ? raw : raw?.message || '';

    const technicalPatterns = [
      /failed to fetch/i,
      /network error/i,
      /typeerror/i,
      /syntaxerror/i,
      /referenceerror/i,
      /cannot read/i,
      /at /i,
      /status code/i,
      /500|502|503|504|404/,
      /cors/i,
      /xhr/i,
      /\[object/i,
    ];

    const isTechnical = technicalPatterns.some((pattern) => pattern.test(text));

    if (isTechnical || text.length > 200) {
      return 'We are having trouble reaching the recipe service right now. Please check your connection and try again.';
    }

    return text;
  };

  const friendlyDescription = sanitizeErrorMessage(message);

  return (
    <div
      id="app-error-state"
      role="alert"
      aria-live="polite"
      className="max-w-lg mx-auto my-8 sm:my-14 p-6 sm:p-8 text-center bg-white rounded-2xl border border-[#E2E8F0] shadow-sm animate-fade-in"
    >
      {/* Icon in Light Blue container with Primary Blue icon */}
      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#EAF4FF] border border-[#d0e5ff] flex items-center justify-center text-[#0056B3] shadow-xs shrink-0">
        {isNetworkError ? <WifiOff size={24} /> : <AlertCircle size={24} />}
      </div>

      {/* Friendly Title in Dark Blue #003B73 */}
      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#003B73] mb-2 leading-snug break-words">
        {title}
      </h3>

      {/* Sanitized Friendly Description */}
      <p className="font-sans text-xs sm:text-sm text-[#6c757d] leading-relaxed mb-6 max-w-md mx-auto">
        {friendlyDescription}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
        {onRetry && (
          <button
            type="button"
            id="error-state-retry-btn"
            onClick={onRetry}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-[#0056B3] text-white text-xs sm:text-sm font-semibold hover:bg-[#003B73] transition-colors duration-150 cursor-pointer shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] focus-visible:ring-offset-2"
          >
            <RefreshCw size={15} />
            <span>{retryText}</span>
          </button>
        )}

        {onReset && (
          <button
            type="button"
            id="error-state-reset-btn"
            onClick={onReset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-[#E2E8F0] text-[#003B73] text-xs sm:text-sm font-semibold hover:bg-[#EAF4FF] hover:border-[#0056B3] transition-colors duration-150 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3]"
          >
            <ArrowLeft size={14} />
            <span>{resetText}</span>
          </button>
        )}
      </div>
    </div>
  );
}
