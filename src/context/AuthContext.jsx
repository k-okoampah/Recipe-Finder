import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  auth,
  signInWithGoogle as firebaseGoogleSignIn,
  signUpWithEmail as firebaseSignUpWithEmail,
  signInWithEmail as firebaseSignInWithEmail,
  sendPasswordReset as firebaseSendPasswordReset,
  signOutUser as firebaseSignOut,
  syncUserProfile,
  formatAuthError,
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
      const formatted = formatAuthError(err);
      setAuthError(formatted);
      const customErr = new Error(formatted.message);
      customErr.authDetails = formatted;
      throw customErr;
    }
  }, []);

  /**
   * Email Sign Up with Firebase Auth
   */
  const signUp = useCallback(async (email, password, displayName = '') => {
    setAuthError(null);
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      const err = { title: 'Invalid Email', message: 'Please enter a valid email address.' };
      setAuthError(err);
      throw new Error(err.message);
    }
    if (!password || password.length < 6) {
      const err = { title: 'Weak Password', message: 'Password must be at least 6 characters long.' };
      setAuthError(err);
      throw new Error(err.message);
    }

    try {
      const fbUser = await firebaseSignUpWithEmail(cleanEmail, password, displayName);
      if (fbUser) {
        const normalized = {
          uid: fbUser.uid,
          id: fbUser.uid,
          email: fbUser.email || cleanEmail,
          displayName: displayName || cleanEmail.split('@')[0],
          photoURL: fbUser.photoURL || '',
        };
        setUser(normalized);
        localStorage.setItem(LOCAL_AUTH_STORAGE_KEY, JSON.stringify(normalized));
        return { user: normalized };
      }
    } catch (err) {
      console.error('Firebase Email sign up error:', err);
      const formatted = formatAuthError(err);
      setAuthError(formatted);
      const customErr = new Error(formatted.message);
      customErr.authDetails = formatted;
      throw customErr;
    }
  }, []);

  /**
   * Email Sign In with Firebase Auth
   */
  const signIn = useCallback(async (email, password) => {
    setAuthError(null);
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !password) {
      const err = { title: 'Missing Credentials', message: 'Please enter both your email address and password.' };
      setAuthError(err);
      throw new Error(err.message);
    }

    try {
      const fbUser = await firebaseSignInWithEmail(cleanEmail, password);
      if (fbUser) {
        const normalized = {
          uid: fbUser.uid,
          id: fbUser.uid,
          email: fbUser.email || cleanEmail,
          displayName: fbUser.displayName || cleanEmail.split('@')[0],
          photoURL: fbUser.photoURL || '',
        };
        setUser(normalized);
        localStorage.setItem(LOCAL_AUTH_STORAGE_KEY, JSON.stringify(normalized));
        return { user: normalized };
      }
    } catch (err) {
      console.error('Firebase Email sign in error:', err);
      const formatted = formatAuthError(err);
      setAuthError(formatted);
      const customErr = new Error(formatted.message);
      customErr.authDetails = formatted;
      throw customErr;
    }
  }, []);

  /**
   * Password Reset with Firebase Auth
   */
  const resetPassword = useCallback(async (email) => {
    setAuthError(null);
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      const err = { title: 'Invalid Email', message: 'Please enter a valid email address.' };
      setAuthError(err);
      throw new Error(err.message);
    }

    try {
      await firebaseSendPasswordReset(cleanEmail);
      return true;
    } catch (err) {
      console.error('Firebase password reset error:', err);
      const formatted = formatAuthError(err);
      setAuthError(formatted);
      const customErr = new Error(formatted.message);
      customErr.authDetails = formatted;
      throw customErr;
    }
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
