import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChefHat,
  Heart,
  ArrowRight,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#003B73]/40 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        id="auth-modal-card"
        className="w-full max-w-md bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          ref={closeBtnRef}
          type="button"
          id="auth-modal-close-btn"
          onClick={onClose}
          aria-label="Close authentication dialog"
          className="absolute top-4 right-4 w-8 h-8 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-lg text-[#6c757d] hover:text-[#003B73] hover:bg-[#EAF4FF] transition-colors cursor-pointer border border-transparent hover:border-[#E2E8F0] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3]"
        >
          <X size={17} aria-hidden="true" />
        </button>

        {/* Favorite Guest Prompt Mode */}
        {mode === 'prompt' ? (
          <div className="text-center py-2">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#EAF4FF] border border-[#d0e5ff] flex items-center justify-center text-[#0056B3] shadow-xs">
              <Heart size={26} className="text-[#0056B3] fill-[#FFC107]" />
            </div>

            <h2 id="auth-modal-title" className="font-serif text-xl sm:text-2xl font-bold text-[#003B73] mb-2 leading-tight">
              Save Your Favorite Recipes
            </h2>

            <p className="text-sm text-[#6c757d] leading-relaxed mb-6 max-w-xs mx-auto">
              Log in to save your favourite recipes and access your personal culinary cookbook anytime, across all devices.
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                id="auth-prompt-login-btn"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#0056B3] hover:bg-[#003B73] text-white font-medium text-sm transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] focus-visible:ring-offset-2 min-h-[44px]"
              >
                <span>Log In</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                id="auth-prompt-create-account-btn"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage(null);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-white border-1.5 border-[#0056B3] text-[#0056B3] hover:bg-[#EAF4FF] font-medium text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] focus-visible:ring-offset-2 min-h-[44px]"
              >
                <span>Create Account</span>
              </button>
            </div>
          </div>
        ) : (
          /* Standard Auth Form (Login / Signup / Forgot Password) */
          <div>
            {/* Header branding */}
            <div className="flex items-center gap-3 mb-5 pr-8">
              <div className="w-10 h-10 rounded-xl bg-[#0056B3] flex items-center justify-center text-white shadow-xs shrink-0" aria-hidden="true">
                <ChefHat size={22} className="text-white" />
              </div>
              <div>
                <h2 id="auth-modal-title" className="font-serif text-xl sm:text-2xl font-bold text-[#003B73] leading-tight">
                  {mode === 'login'
                    ? 'Welcome Back'
                    : mode === 'signup'
                    ? 'Create an Account'
                    : 'Reset Password'}
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#6c757d] mb-5">
              {mode === 'login'
                ? 'Sign in to access your cloud-saved favorites and recipes.'
                : mode === 'signup'
                ? 'Join Recipe Finder to build and synchronize your cookbook.'
                : 'Enter your email address and we’ll send you a password recovery link.'}
            </p>

            {/* Error Message Alert */}
            {errorMessage && (
              <div
                role="alert"
                aria-live="polite"
                className="flex items-start gap-2 p-3 rounded-xl bg-[#fff2f2] border border-[#ffcdd2] text-[#b71c1c] text-xs font-medium mb-4 animate-fade-in"
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
                className="flex items-start gap-2 p-3 rounded-xl bg-[#e8f5e9] border border-[#c8e6c9] text-[#1b5e20] text-xs font-medium mb-4 animate-fade-in"
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
                  className="block text-xs font-semibold text-[#003B73] mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-[#6c757d] pointer-events-none" aria-hidden="true">
                    <Mail size={16} />
                  </div>
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
                    className="w-full pl-9 pr-3 py-2.5 text-sm font-sans bg-white rounded-xl border border-[#E2E8F0] text-[#212529] placeholder:text-[#6c757d]/60 focus:border-[#0056B3] focus:ring-2 focus:ring-[#0056B3]/15 outline-hidden transition-all disabled:opacity-60 min-h-[44px]"
                  />
                </div>
              </div>

              {/* Password Input (Login and Signup only) */}
              {mode !== 'forgot-password' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="auth-password-input"
                      className="block text-xs font-semibold text-[#003B73]"
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
                        className="text-[11px] font-semibold text-[#0056B3] hover:text-[#003B73] hover:underline cursor-pointer focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#0056B3] rounded-xs"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-[#6c757d] pointer-events-none" aria-hidden="true">
                      <Lock size={16} />
                    </div>
                    <input
                      id="auth-password-input"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={mode === 'signup' ? 'At least 6 characters' : 'Enter your password'}
                      disabled={isSubmitting}
                      className="w-full pl-9 pr-10 py-2.5 text-sm font-sans bg-white rounded-xl border border-[#E2E8F0] text-[#212529] placeholder:text-[#6c757d]/60 focus:border-[#0056B3] focus:ring-2 focus:ring-[#0056B3]/15 outline-hidden transition-all disabled:opacity-60 min-h-[44px]"
                    />
                    {/* Password Visibility Toggle */}
                    <button
                      type="button"
                      id="auth-password-toggle-btn"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-2.5 p-1.5 text-[#6c757d] hover:text-[#003B73] rounded-lg hover:bg-[#EAF4FF] transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#0056B3]"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {mode === 'signup' && (
                    <p className="text-[11px] text-[#6c757d] mt-1">
                      Must be at least 6 characters long.
                    </p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                id="auth-submit-btn"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 min-h-[44px] rounded-xl bg-[#0056B3] hover:bg-[#003B73] active:scale-[0.99] text-white font-semibold text-sm transition-colors duration-150 cursor-pointer shadow-xs flex items-center justify-center gap-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] focus-visible:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin shrink-0" />
                    <span>Processing...</span>
                  </>
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
                  Don’t have an account?{' '}
                  <button
                    type="button"
                    id="switch-to-signup-btn"
                    onClick={() => {
                      setMode('signup');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="font-bold text-[#0056B3] hover:text-[#003B73] hover:underline cursor-pointer focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#0056B3] rounded-xs"
                  >
                    Sign Up
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
                    className="font-bold text-[#0056B3] hover:text-[#003B73] hover:underline cursor-pointer focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#0056B3] rounded-xs"
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
                    className="font-bold text-[#0056B3] hover:text-[#003B73] hover:underline cursor-pointer focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#0056B3] rounded-xs"
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
