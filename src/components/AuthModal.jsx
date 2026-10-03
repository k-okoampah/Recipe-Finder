import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { formatAuthError } from '../services/firebase.js';

/**
 * Google SVG Logo
 */
function GoogleIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

/**
 * AuthModal Component with Firebase Google Sign-In & Email Authentication
 */
export default function AuthModal({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess,
}) {
  const { signInWithGoogle, signIn, signUp, resetPassword } = useAuth();

  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [authErrorDetails, setAuthErrorDetails] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [copiedDomain, setCopiedDomain] = useState(false);

  const emailInputRef = useRef(null);
  const closeBtnRef = useRef(null);

  const handleCopyDomain = (domainToCopy) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(domainToCopy);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2500);
    }
  };

  useEffect(() => {
    if (isOpen) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setMode(initialMode);
      setErrorMessage(null);
      setAuthErrorDetails(null);
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

  useEffect(() => {
    if (isOpen) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setErrorMessage(null);
      setAuthErrorDetails(null);
    }
  }, [isOpen, mode]);

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

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setAuthErrorDetails(null);
    setSuccessMessage(null);
    setIsGoogleSubmitting(true);
    try {
      await signInWithGoogle();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      const details = err?.authDetails || (err?.code ? formatAuthError(err) : null);
      if (details) {
        setAuthErrorDetails(details);
        setErrorMessage(details.message);
      } else {
        setErrorMessage(err.message || 'Google sign-in could not be completed.');
      }
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setAuthErrorDetails(null);
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
        setSuccessMessage('Password reset email sent! Check your inbox for instructions.');
      } catch (err) {
        const details = err?.authDetails || (err?.code ? formatAuthError(err) : null);
        if (details) {
          setAuthErrorDetails(details);
          setErrorMessage(details.message);
        } else {
          setErrorMessage(err.message || 'Failed to send password reset email.');
        }
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
      const details = err?.authDetails || (err?.code ? formatAuthError(err) : null);
      if (details) {
        setAuthErrorDetails(details);
        setErrorMessage(details.message);
      } else {
        setErrorMessage(err.message || 'Authentication failed. Please try again.');
      }
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
            <h2 id="auth-modal-title" className="text-xl sm:text-2xl font-semibold text-[#003B73] mb-2 leading-tight">
              Save Your Favorite Recipes
            </h2>

            <p className="text-xs sm:text-[14px] text-[#6c757d] leading-relaxed mb-6 font-normal">
              Sign in with Google to save recipes to Firestore and access your collection across all devices.
            </p>

            <div className="space-y-3">
              {/* Google Sign In CTA */}
              <button
                type="button"
                id="auth-prompt-google-btn"
                onClick={handleGoogleSignIn}
                disabled={isGoogleSubmitting}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-md bg-white border border-[#CBD5E1] text-[#1E293B] hover:bg-[#F8FAFC] font-semibold text-sm transition-colors shadow-xs cursor-pointer disabled:opacity-60"
              >
                {isGoogleSubmitting ? (
                  <Loader2 size={16} className="animate-spin text-[#0056B3]" />
                ) : (
                  <GoogleIcon className="w-4 h-4" />
                )}
                <span>Sign in with Google</span>
              </button>

              <button
                type="button"
                id="auth-prompt-login-btn"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                }}
                className="w-full py-2 px-4 rounded-md bg-[#F1F5F9] text-[#003B73] hover:bg-[#E2E8F0] font-medium text-xs transition-colors cursor-pointer"
              >
                Use Email & Password
              </button>
            </div>
          </div>
        ) : (
          /* Standard Auth Form (Login / Signup / Forgot Password) */
          <div>
            <div className="mb-5 pr-6">
              <h2 id="auth-modal-title" className="text-xl sm:text-2xl font-semibold text-[#003B73] leading-tight">
                {mode === 'login'
                  ? 'Sign In'
                  : mode === 'signup'
                  ? 'Create Account'
                  : 'Reset Password'}
              </h2>
              <p className="text-xs sm:text-[13px] text-[#6c757d] mt-1 font-normal">
                {mode === 'login'
                  ? 'Sign in to access your saved recipes.'
                  : mode === 'signup'
                  ? 'Create an account to save your favorite dishes in Firestore.'
                  : 'Enter your email to receive password reset instructions.'}
              </p>
            </div>

            {/* Error Message Alert */}
            {authErrorDetails?.isUnauthorizedDomain ? (
              <div
                role="alert"
                aria-live="polite"
                className="p-3.5 rounded-lg bg-[#fff8e1] border border-[#ffe082] text-[#5d4037] text-xs mb-4 shadow-xs"
              >
                <div className="flex items-center gap-2 font-semibold text-[#e65100] mb-1">
                  <AlertCircle size={16} className="shrink-0 text-[#e65100]" />
                  <span>Domain Authorization Required</span>
                </div>
                <p className="text-[12px] text-[#424242] leading-relaxed mb-2.5">
                  Google Sign-In requires this domain to be authorized in your Firebase project.
                </p>
                <div className="bg-white p-2 rounded border border-[#ffe082] flex items-center justify-between gap-2 mb-2.5 font-mono text-[11px] text-[#212121]">
                  <span className="truncate select-all">{authErrorDetails.domain}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyDomain(authErrorDetails.domain)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#fff3e0] hover:bg-[#ffe0b2] text-[#e65100] font-sans font-semibold text-[11px] cursor-pointer shrink-0 transition-colors"
                  >
                    {copiedDomain ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                    <span>{copiedDomain ? 'Copied' : 'Copy Domain'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-[#616161] leading-relaxed">
                  <strong>Fix in Firebase Console:</strong> Go to <em>Authentication &gt; Settings &gt; Authorized domains</em> and click <strong>Add domain</strong> to paste this domain.
                </p>
                <div className="mt-2.5 pt-2 border-t border-[#ffe082]/60 text-[11px] text-[#e65100] font-semibold">
                  Instant option: You can sign up and sign in right away with Email &amp; Password below!
                </div>
              </div>
            ) : errorMessage && (
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

            {/* Primary Google Sign-in Option */}
            {mode !== 'forgot-password' && (
              <div className="mb-4">
                <button
                  type="button"
                  id="auth-google-signin-btn"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleSubmitting || isSubmitting}
                  className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-md bg-white border border-[#CBD5E1] text-[#1E293B] hover:bg-[#F8FAFC] font-semibold text-sm transition-colors shadow-xs cursor-pointer disabled:opacity-60"
                >
                  {isGoogleSubmitting ? (
                    <Loader2 size={16} className="animate-spin text-[#0056B3]" />
                  ) : (
                    <GoogleIcon className="w-4 h-4" />
                  )}
                  <span>Continue with Google</span>
                </button>

                <div className="relative flex items-center justify-center my-4">
                  <div className="border-t border-[#E2E8F0] w-full" />
                  <span className="bg-white px-2 text-[11px] text-[#94A3B8] uppercase tracking-wider font-medium absolute">
                    or with email
                  </span>
                </div>
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
                  disabled={isSubmitting || isGoogleSubmitting}
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
                      placeholder="••••••••"
                      disabled={isSubmitting || isGoogleSubmitting}
                      className="w-full px-3 py-2 pr-10 text-sm bg-white rounded-md border border-[#E2E8F0] text-[#212529] placeholder:text-[#6c757d]/60 focus:border-[#0056B3] focus:ring-1 focus:ring-[#0056B3] outline-hidden transition-colors disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 text-[#6c757d] hover:text-[#212529] transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                id="auth-modal-submit-btn"
                disabled={isSubmitting || isGoogleSubmitting}
                className="w-full py-2.5 px-4 rounded-md bg-[#0056B3] hover:bg-[#003B73] text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] focus-visible:ring-offset-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Please wait...</span>
                  </>
                ) : (
                  <span>
                    {mode === 'login'
                      ? 'Sign In'
                      : mode === 'signup'
                      ? 'Create Account'
                      : 'Send Reset Link'}
                  </span>
                )}
              </button>
            </form>

            {/* Switch Mode Footer */}
            <div className="mt-5 pt-4 border-t border-[#E2E8F0] text-center text-xs text-[#6c757d]">
              {mode === 'login' && (
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    id="auth-switch-to-signup"
                    onClick={() => {
                      setMode('signup');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="text-[#0056B3] font-semibold hover:underline cursor-pointer"
                  >
                    Sign up
                  </button>
                </p>
              )}

              {mode === 'signup' && (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    id="auth-switch-to-login"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="text-[#0056B3] font-semibold hover:underline cursor-pointer"
                  >
                    Sign in
                  </button>
                </p>
              )}

              {mode === 'forgot-password' && (
                <p>
                  Remember your password?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="text-[#0056B3] font-semibold hover:underline cursor-pointer"
                  >
                    Back to login
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
