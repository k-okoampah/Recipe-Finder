import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  auth,
  signInWithGoogle as firebaseGoogleSignIn,
  signOutUser as firebaseSignOut,
  syncUserProfile,
} from '../services/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext(null);

const LOCAL_AUTH_STORAGE_KEY = 'recipe_finder_local_auth_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!isMounted) return;

      if (firebaseUser) {
        const normalized = {
          uid: firebaseUser.uid,
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Chef'),
          photoURL: firebaseUser.photoURL || '',
          emailVerified: firebaseUser.emailVerified,
        };
        setUser(normalized);
        localStorage.setItem(LOCAL_AUTH_STORAGE_KEY, JSON.stringify(normalized));

        // Sync profile to Firestore in background
        try {
          await syncUserProfile(firebaseUser);
        } catch (err) {
          console.warn('Profile sync notice:', err);
        }
      } else {
        // Fallback: check if local cached session exists
        try {
          const cached = localStorage.getItem(LOCAL_AUTH_STORAGE_KEY);
          if (cached) {
            setUser(JSON.parse(cached));
          } else {
            setUser(null);
          }
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  /**
   * Google Sign-in with Firebase Auth
   */
  const signInWithGoogle = useCallback(async () => {
    setAuthError(null);
    try {
      const fbUser = await firebaseGoogleSignIn();
      if (fbUser) {
        const normalized = {
          uid: fbUser.uid,
          id: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Chef'),
          photoURL: fbUser.photoURL || '',
          emailVerified: fbUser.emailVerified,
        };
        setUser(normalized);
        localStorage.setItem(LOCAL_AUTH_STORAGE_KEY, JSON.stringify(normalized));
        return { user: normalized };
      }
    } catch (err) {
      console.error('Google Sign-in error:', err);
      const msg = err?.code === 'auth/popup-closed-by-user'
        ? 'Sign-in window was closed. Please try again.'
        : 'Google Sign-in could not be completed. Please try again.';
      setAuthError(msg);
      throw new Error(msg);
    }
  }, []);

  /**
   * Email Sign Up fallback
   */
  const signUp = useCallback(async (email, password) => {
    setAuthError(null);
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      const err = 'Please enter a valid email address.';
      setAuthError(err);
      throw new Error(err);
    }
    if (!password || password.length < 6) {
      const err = 'Password must be at least 6 characters long.';
      setAuthError(err);
      throw new Error(err);
    }

    // Local user creation when not using Google provider
    const newUser = {
      uid: 'user_' + Math.random().toString(36).substring(2, 11),
      id: 'user_' + Math.random().toString(36).substring(2, 11),
      email: cleanEmail,
      displayName: cleanEmail.split('@')[0],
      createdAt: new Date().toISOString(),
    };
    newUser.id = newUser.uid;
    localStorage.setItem(LOCAL_AUTH_STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
    return { user: newUser };
  }, []);

  /**
   * Email Sign In fallback
   */
  const signIn = useCallback(async (email, password) => {
    setAuthError(null);
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !password) {
      const err = 'Please enter both your email address and password.';
      setAuthError(err);
      throw new Error(err);
    }

    const sessionUser = {
      uid: 'user_' + cleanEmail.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20),
      id: 'user_' + cleanEmail.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20),
      email: cleanEmail,
      displayName: cleanEmail.split('@')[0],
      createdAt: new Date().toISOString(),
    };
    sessionUser.id = sessionUser.uid;
    localStorage.setItem(LOCAL_AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
    return { user: sessionUser };
  }, []);

  /**
   * Sign Out
   */
  const signOut = useCallback(async () => {
    setAuthError(null);
    try {
      await firebaseSignOut();
    } catch (err) {
      console.warn('Firebase signout notice:', err);
    }
    localStorage.removeItem(LOCAL_AUTH_STORAGE_KEY);
    setUser(null);
  }, []);

  /**
   * Password Reset
   */
  const resetPassword = useCallback(async (email) => {
    setAuthError(null);
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      const err = 'Please enter a valid email address.';
      setAuthError(err);
      throw new Error(err);
    }
    return { success: true };
  }, []);

  const value = {
    user,
    loading,
    authError,
    isAuthenticated: Boolean(user),
    signInWithGoogle,
    signUp,
    signIn,
    signOut,
    resetPassword,
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
