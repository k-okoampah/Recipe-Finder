import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * AuthModal Component
 *
 * Provides:
 * - Log In
 * - Sign Up
 * - Forgot Password
 * - Friendly Log-In-To-Save Prompt when guest clicks the favorite button
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {'login'|'signup'|'forgot-password'|'prompt'} [props.initialMode='login']
 * @param {Function} [props.onSuccess]
 */
export default function AuthModal({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess,
}) {
  const { signIn, signUp, resetPassword } = useAuth();

  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const emailInputRef = useRef(null);
  const closeBtnRef = useRef(null);

  // Sync mode when initialMode changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMessage(null);
      setSuccessMessage(null);
      setTimeout(() => {
        if (emailInputRef.current && initialMode !== 'prompt') {
          emailInputRef.current.focus();
        } else if (closeBtnRef.current) {
          closeBtnRef.current.focus();
        }
      }, 50);
    }
  }, [isOpen, initialMode]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (mode === 'forgot-password') {
      setIsSubmitting(true);
      try {
        await resetPassword(cleanEmail);
        setSuccessMessage('Password reset instructions have been sent to your email.');
      } catch (err) {
        setErrorMessage(err.message || 'Failed to send reset email. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await signIn(cleanEmail, password);
        if (onSuccess) onSuccess();
        onClose();
      } else if (mode === 'signup') {
        await signUp(cleanEmail, password);
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="auth-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        id="auth-modal-card"
        className="w-full max-w-sm bg-white rounded-xl border border-[#E2E8F0] shadow-xl p-6 sm:p-7 max-h-[92vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          ref={closeBtnRef}
          type="button"
          id="auth-modal-close-btn"
          onClick={onClose}
          aria-label="Close authentication dialog"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-md text-[#6c757d] hover:text-[#003B73] hover:bg-[#F5F7FA] transition-colors cursor-pointer"
        >
          <X size={18} aria-hidden="true" />
        </button>

        {/* Favorite Guest Prompt Mode */}
        {mode === 'prompt' ? (
          <div className="text-center py-2">
            <h2 id="auth-modal-title" className="font-serif text-xl font-bold text-[#003B73] mb-2 leading-tight">
              Save Your Favorite Recipes
            </h2>

            <p className="text-xs sm:text-sm text-[#6c757d] leading-relaxed mb-6">
              Log in to save recipes to your collection and access them anytime.
            </p>

            <div className="space-y-2">
              <button
                type="button"
                id="auth-prompt-login-btn"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                }}
                className="w-full py-2.5 px-4 rounded-md bg-[#0056B3] hover:bg-[#003B73] text-white font-medium text-sm transition-colors cursor-pointer"
              >
                Log In
              </button>

              <button
                type="button"
                id="auth-prompt-create-account-btn"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage(null);
                }}
                className="w-full py-2.5 px-4 rounded-md bg-white border border-[#E2E8F0] text-[#0056B3] hover:bg-[#EAF4FF] font-medium text-sm transition-colors cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </div>
        ) : (
          /* Standard Auth Form (Login / Signup / Forgot Password) */
          <div>
            <div className="mb-5 pr-6">
              <h2 id="auth-modal-title" className="font-serif text-xl font-bold text-[#003B73] leading-tight">
                {mode === 'login'
                  ? 'Log In'
                  : mode === 'signup'
                  ? 'Create Account'
                  : 'Reset Password'}
              </h2>
              <p className="text-xs text-[#6c757d] mt-1">
                {mode === 'login'
                  ? 'Sign in to access your saved recipes.'
                  : mode === 'signup'
                  ? 'Create an account to save your favorite dishes.'
                  : 'Enter your email to receive password reset instructions.'}
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div
                role="alert"
                aria-live="polite"
                className="flex items-start gap-2 p-3 rounded-md bg-[#fff2f2] border border-[#ffcdd2] text-[#b71c1c] text-xs font-medium mb-4"
              >
                <AlertCircle size={15} className="shrink-0 mt-0.5 text-[#b71c1c]" />
                <span className="leading-snug">{errorMessage}</span>
              </div>
            )}

            {/* Success Message Alert */}
            {successMessage && (
              <div
                role="status"
                aria-live="polite"
                className="flex items-start gap-2 p-3 rounded-md bg-[#e8f5e9] border border-[#c8e6c9] text-[#1b5e20] text-xs font-medium mb-4"
              >
                <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-[#1b5e20]" />
                <span className="leading-snug">{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="auth-email-input"
                  className="block text-xs font-medium text-[#212529] mb-1"
                >
                  Email
                </label>
                <input
                  ref={emailInputRef}
                  id="auth-email-input"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 text-sm bg-white rounded-md border border-[#E2E8F0] text-[#212529] placeholder:text-[#6c757d]/60 focus:border-[#0056B3] focus:ring-1 focus:ring-[#0056B3] outline-hidden transition-colors disabled:opacity-60"
                />
              </div>

              {/* Password Input (Login and Signup only) */}
              {mode !== 'forgot-password' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="auth-password-input"
                      className="block text-xs font-medium text-[#212529]"
                    >
                      Password
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot-password');
                          setErrorMessage(null);
                          setSuccessMessage(null);
                        }}
                        className="text-[11px] text-[#0056B3] hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <input
                      id="auth-password-input"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
                      disabled={isSubmitting}
                      className="w-full px-3 py-2 pr-10 text-sm bg-white rounded-md border border-[#E2E8F0] text-[#212529] placeholder:text-[#6c757d]/60 focus:border-[#0056B3] focus:ring-1 focus:ring-[#0056B3] outline-hidden transition-colors disabled:opacity-60"
                    />
                    {/* Password Visibility Toggle */}
                    <button
                      type="button"
                      id="auth-password-toggle-btn"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-2.5 p-1 text-[#6c757d] hover:text-[#003B73] rounded-md transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {mode === 'signup' && (
                    <p className="text-[11px] text-[#6c757d] mt-1">
                      Must be at least 6 characters.
                    </p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                id="auth-submit-btn"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-md bg-[#0056B3] hover:bg-[#003B73] text-white font-medium text-sm transition-colors cursor-pointer disabled:opacity-70 mt-1"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={15} className="animate-spin shrink-0" />
                    <span>Processing...</span>
                  </span>
                ) : (
                  <span>
                    {mode === 'login'
                      ? 'Log In'
                      : mode === 'signup'
                      ? 'Create Account'
                      : 'Send Reset Link'}
                  </span>
                )}
              </button>
            </form>

            {/* Bottom Switcher */}
            <div className="mt-5 pt-4 border-t border-[#E2E8F0] text-center text-xs text-[#6c757d]">
              {mode === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    id="switch-to-signup-btn"
                    onClick={() => {
                      setMode('signup');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="font-semibold text-[#0056B3] hover:underline cursor-pointer"
                  >
                    Create Account
                  </button>
                </p>
              ) : mode === 'signup' ? (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    id="switch-to-login-btn"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="font-semibold text-[#0056B3] hover:underline cursor-pointer"
                  >
                    Log In
                  </button>
                </p>
              ) : (
                <p>
                  Remembered your password?{' '}
                  <button
                    type="button"
                    id="switch-back-to-login-btn"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="font-semibold text-[#0056B3] hover:underline cursor-pointer"
                  >
                    Back to Log In
                  </button>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
