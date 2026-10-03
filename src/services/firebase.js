import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  collection,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrors.js';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID per skill
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

/**
 * Maps Firebase Auth error codes to helpful, user-friendly diagnostic objects
 */
export function formatAuthError(err) {
  if (!err) return { title: 'Error', message: 'An unknown error occurred. Please try again.' };
  
  const code = err.code || '';
  const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'current domain';

  switch (code) {
    case 'auth/unauthorized-domain':
      return {
        code,
        isUnauthorizedDomain: true,
        title: 'Domain Authorization Required',
        message: `This domain (${currentHost}) is not yet authorized for Google Sign-In in your Firebase Console.`,
        action: `To enable Google Sign-In, go to Firebase Console > Authentication > Settings > Authorized domains and add "${currentHost}".`,
        domain: currentHost,
      };
    case 'auth/popup-closed-by-user':
      return {
        code,
        title: 'Sign-In Cancelled',
        message: 'The sign-in window was closed before completing authentication. Please try again.',
      };
    case 'auth/popup-blocked':
      return {
        code,
        title: 'Popup Blocked',
        message: 'The sign-in popup was blocked by your browser. Please allow popups for this site or use Email/Password sign-in.',
      };
    case 'auth/operation-not-allowed':
      return {
        code,
        title: 'Provider Not Enabled',
        message: 'This sign-in method is not enabled in Firebase. Please enable it in Firebase Console > Authentication > Sign-in method.',
      };
    case 'auth/email-already-in-use':
      return {
        code,
        title: 'Account Already Exists',
        message: 'An account with this email address already exists. Please sign in instead.',
      };
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return {
        code,
        title: 'Invalid Credentials',
        message: 'Incorrect email or password. Please verify your details or reset your password.',
      };
    case 'auth/user-not-found':
      return {
        code,
        title: 'Account Not Found',
        message: 'No account was found with this email. Please check your spelling or sign up.',
      };
    case 'auth/weak-password':
      return {
        code,
        title: 'Weak Password',
        message: 'Password must be at least 6 characters long.',
      };
    case 'auth/invalid-email':
      return {
        code,
        title: 'Invalid Email',
        message: 'Please provide a valid email address.',
      };
    case 'auth/too-many-requests':
      return {
        code,
        title: 'Too Many Attempts',
        message: 'Access temporarily disabled due to multiple failed login attempts. Please reset your password or try again later.',
      };
    case 'auth/network-request-failed':
      return {
        code,
        title: 'Network Error',
        message: 'Failed to connect to Firebase authentication service. Please check your internet connection.',
      };
    default:
      return {
        code,
        title: 'Authentication Error',
        message: err.message || 'Authentication could not be completed. Please try again.',
      };
  }
}

/**
 * Sign in with Google using popup
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      await syncUserProfile(result.user);
    }
    return result.user;
  } catch (err) {
    console.error('Google Sign-in failed:', err);
    throw err;
  }
}

/**
 * Sign up with Email & Password using Firebase Auth
 */
export async function signUpWithEmail(email, password, displayName = '') {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    if (displayName && user) {
      await updateProfile(user, { displayName });
    }
    await syncUserProfile(user);
    return user;
  } catch (err) {
    console.error('Email sign up failed:', err);
    throw err;
  }
}

/**
 * Sign in with Email & Password using Firebase Auth
 */
export async function signInWithEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await syncUserProfile(user);
    return user;
  } catch (err) {
    console.error('Email sign in failed:', err);
    throw err;
  }
}

/**
 * Send password reset email using Firebase Auth
 */
export async function sendPasswordReset(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (err) {
    console.error('Password reset failed:', err);
    throw err;
  }
}

/**
 * Sign out of Firebase Auth
 */
export async function signOutUser() {
  try {
    await firebaseSignOut(auth);
  } catch (err) {
    console.error('Firebase sign out failed:', err);
    throw err;
  }
}

/**
 * Sync user profile to Firestore
 */
export async function syncUserProfile(user) {
  if (!user || !user.uid) return;
  const userPath = `users/${user.uid}`;
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const profileData = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || 'Chef',
      photoURL: user.photoURL || '',
      updatedAt: new Date().toISOString(),
    };
    await setDoc(userDocRef, profileData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, userPath);
  }
}

// ----------------------------------------------------
// Firestore Favorites Persistence
// ----------------------------------------------------

export async function getFirestoreFavorites(userId) {
  if (!userId) return [];
  const path = `users/${userId}/favorites`;
  try {
    const snap = await getDocs(collection(db, 'users', userId, 'favorites'));
    const favorites = [];
    snap.forEach((docSnap) => {
      favorites.push(docSnap.data());
    });
    return favorites;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return [];
  }
}

export function subscribeFirestoreFavorites(userId, onUpdate) {
  if (!userId) return () => {};
  const path = `users/${userId}/favorites`;
  const unsubscribe = onSnapshot(
    collection(db, 'users', userId, 'favorites'),
    (snapshot) => {
      const favorites = [];
      snapshot.forEach((docSnap) => {
        favorites.push(docSnap.data());
      });
      onUpdate(favorites);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
  return unsubscribe;
}

export async function addFirestoreFavorite(userId, recipe) {
  if (!userId || !recipe || !recipe.idMeal) return;
  const docId = String(recipe.idMeal);
  const path = `users/${userId}/favorites/${docId}`;
  try {
    const payload = {
      idMeal: docId,
      strMeal: recipe.strMeal || 'Recipe',
      strMealThumb: recipe.strMealThumb || '',
      strCategory: recipe.strCategory || 'General',
      strArea: recipe.strArea || 'International',
      userId,
      savedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'users', userId, 'favorites', docId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function removeFirestoreFavorite(userId, recipeId) {
  if (!userId || !recipeId) return;
  const docId = String(recipeId);
  const path = `users/${userId}/favorites/${docId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'favorites', docId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ----------------------------------------------------
// Firestore Recipe Ratings Persistence
// ----------------------------------------------------

export async function getFirestoreRatings(userId) {
  if (!userId) return {};
  const path = `users/${userId}/ratings`;
  try {
    const snap = await getDocs(collection(db, 'users', userId, 'ratings'));
    const ratingsMap = {};
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.recipeId && data.rating) {
        ratingsMap[String(data.recipeId)] = Number(data.rating);
      }
    });
    return ratingsMap;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return {};
  }
}

export async function setFirestoreRating(userId, recipeId, rating) {
  if (!userId || !recipeId) return;
  const docId = String(recipeId);
  const path = `users/${userId}/ratings/${docId}`;
  try {
    const payload = {
      recipeId: docId,
      rating: Number(rating),
      userId,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'users', userId, 'ratings', docId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function removeFirestoreRating(userId, recipeId) {
  if (!userId || !recipeId) return;
  const docId = String(recipeId);
  const path = `users/${userId}/ratings/${docId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'ratings', docId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
