import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase.js';

const AuthContext = createContext(null);

const LOCAL_AUTH_STORAGE_KEY = 'recipe_finder_local_auth_user';
const LOCAL_USERS_DB_KEY = 'recipe_finder_local_registered_users';

/**
 * Friendly error message sanitizer for Auth errors.
 * Strictly prevents exposing raw database exceptions, stack traces, or technical jargon.
 */
function sanitizeAuthError(err) {
  if (!err) return null;
  const message = (typeof err === 'string' ? err : err.message || '').toLowerCase();

  if (message.includes('invalid login credentials') || message.includes('invalid credentials')) {
    return 'Invalid email or password. Please check your details and try again.';
  }
  if (message.includes('user already registered') || message.includes('already exists')) {
    return 'An account with this email address already exists. Please log in instead.';
  }
  if (message.includes('password should be at least') || message.includes('weak password')) {
    return 'Password should be at least 6 characters long.';
  }
  if (message.includes('invalid email') || message.includes('valid email')) {
    return 'Please enter a valid email address.';
  }
  if (message.includes('rate limit') || message.includes('too many requests')) {
    return 'Too many login attempts. Please wait a few moments and try again.';
  }
  if (message.includes('network error') || message.includes('failed to fetch')) {
    return 'Unable to connect to the authentication service. Please check your connection.';
  }

  return 'An unexpected error occurred during authentication. Please try again.';
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize session
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.auth.getSession();
          if (error) throw error;
          if (isMounted) {
            setUser(data?.session?.user || null);
          }
        } catch (err) {
          console.warn('Supabase auth session check notice:', err.message);
          if (isMounted) setUser(null);
        } finally {
          if (isMounted) setLoading(false);
        }

        // Listen for live Supabase auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange(
          (_event, session) => {
            if (isMounted) {
              setUser(session?.user || null);
              setLoading(false);
            }
          }
        );

        return () => {
          authListener?.subscription?.unsubscribe();
        };
      } else {
        // Fallback local session for zero-config preview environments
        try {
          const stored = localStorage.getItem(LOCAL_AUTH_STORAGE_KEY);
          if (stored && isMounted) {
            setUser(JSON.parse(stored));
          }
        } catch {
          // ignore corrupted data
        } finally {
          if (isMounted) setLoading(false);
        }
      }
    }

    initSession();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Sign Up Function
   * @param {string} email
   * @param {string} password
   */
  const signUp = useCallback(async (email, password) => {
    setAuthError(null);
    const cleanEmail = (email || '').trim().toLowerCase();

    // Client-side validation
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      const err = 'Please enter a valid email address.';
      setAuthError(err);
      throw new Error(err);
    }
    if (!password || password.length < 6) {
      const err = 'Password must be at least 6 characters long.';
      setAuthError(err);
      throw new Error(err);
    }

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
        });

        if (error) throw error;

        // If email confirmation is enabled, user may not have immediate session
        if (data?.user) {
          setUser(data.user);
        }
        return { user: data?.user, session: data?.session };
      } else {
        // Local simulation when Supabase credentials are not yet supplied
        let registered = [];
        try {
          const raw = localStorage.getItem(LOCAL_USERS_DB_KEY);
          if (raw) registered = JSON.parse(raw);
        } catch {
          registered = [];
        }

        const existing = registered.find((u) => u.email === cleanEmail);
        if (existing) {
          const err = 'An account with this email address already exists. Please log in instead.';
          setAuthError(err);
          throw new Error(err);
        }

        const newUser = {
          id: 'user_' + Math.random().toString(36).substring(2, 11),
          email: cleanEmail,
          created_at: new Date().toISOString(),
        };

        registered.push({ ...newUser, password });
        localStorage.setItem(LOCAL_USERS_DB_KEY, JSON.stringify(registered));
        localStorage.setItem(LOCAL_AUTH_STORAGE_KEY, JSON.stringify(newUser));
        setUser(newUser);
        return { user: newUser };
      }
    } catch (err) {
      const friendly = sanitizeAuthError(err);
      setAuthError(friendly);
      throw new Error(friendly);
    }
  }, []);

  /**
   * Log In Function
   * @param {string} email
   * @param {string} password
   */
  const signIn = useCallback(async (email, password) => {
    setAuthError(null);
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail || !password) {
      const err = 'Please enter both your email address and password.';
      setAuthError(err);
      throw new Error(err);
    }

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) throw error;

        setUser(data?.user || null);
        return { user: data?.user, session: data?.session };
      } else {
        // Local simulation
        let registered = [];
        try {
          const raw = localStorage.getItem(LOCAL_USERS_DB_KEY);
          if (raw) registered = JSON.parse(raw);
        } catch {
          registered = [];
        }

        const found = registered.find((u) => u.email === cleanEmail && u.password === password);
        if (!found) {
          // If first time trying in preview, auto-register seamless demo user if none exists
          const anyUserWithEmail = registered.find((u) => u.email === cleanEmail);
          if (anyUserWithEmail) {
            const err = 'Invalid email or password. Please try again.';
            setAuthError(err);
            throw new Error(err);
          }
          const newUser = {
            id: 'user_' + Math.random().toString(36).substring(2, 11),
            email: cleanEmail,
            created_at: new Date().toISOString(),
          };
          registered.push({ ...newUser, password });
          localStorage.setItem(LOCAL_USERS_DB_KEY, JSON.stringify(registered));
          localStorage.setItem(LOCAL_AUTH_STORAGE_KEY, JSON.stringify(newUser));
          setUser(newUser);
          return { user: newUser };
        }

        const sessionUser = { id: found.id, email: found.email, created_at: found.created_at };
        localStorage.setItem(LOCAL_AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
        setUser(sessionUser);
        return { user: sessionUser };
      }
    } catch (err) {
      const friendly = sanitizeAuthError(err);
      setAuthError(friendly);
      throw new Error(friendly);
    }
  }, []);

  /**
   * Log Out Function
   */
  const signOut = useCallback(async () => {
    setAuthError(null);
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      } else {
        localStorage.removeItem(LOCAL_AUTH_STORAGE_KEY);
      }
      setUser(null);
    } catch (err) {
      console.warn('Sign out notice:', err.message);
      setUser(null);
    }
  }, []);

  /**
   * Forgot Password Function
   * @param {string} email
   */
  const resetPassword = useCallback(async (email) => {
    setAuthError(null);
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      const err = 'Please enter a valid email address to reset your password.';
      setAuthError(err);
      throw new Error(err);
    }

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
      }
      // Success
      return { success: true };
    } catch (err) {
      const friendly = sanitizeAuthError(err);
      setAuthError(friendly);
      throw new Error(friendly);
    }
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    loading,
    authError,
    setAuthError,
    signUp,
    signIn,
    signOut,
    resetPassword,
    isSupabaseConfigured,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
