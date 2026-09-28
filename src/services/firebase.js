import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
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
  getDocFromServer,
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
 * Validates connection to Firestore on initial boot per skill directive
 */
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline. Check network and configuration.');
    }
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

// ----------------------------------------------------
// Firestore Chat History Persistence
// ----------------------------------------------------

export async function getFirestoreChatMessages(userId) {
  if (!userId) return [];
  const path = `users/${userId}/chatMessages`;
  try {
    const snap = await getDocs(collection(db, 'users', userId, 'chatMessages'));
    const messages = [];
    snap.forEach((docSnap) => {
      messages.push(docSnap.data());
    });
    // Sort chronologically by timestamp
    messages.sort((a, b) => (a.timestamp || '').localeCompare(b.timestamp || ''));
    return messages;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return [];
  }
}

export async function saveFirestoreChatMessage(userId, message) {
  if (!userId || !message || !message.id) return;
  const docId = String(message.id);
  const path = `users/${userId}/chatMessages/${docId}`;
  try {
    const payload = {
      id: docId,
      userId,
      role: message.role || 'user',
      text: message.text || '',
      timestamp: message.timestamp || new Date().toISOString(),
    };
    await setDoc(doc(db, 'users', userId, 'chatMessages', docId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function clearFirestoreChatMessages(userId) {
  if (!userId) return;
  const path = `users/${userId}/chatMessages`;
  try {
    const snap = await getDocs(collection(db, 'users', userId, 'chatMessages'));
    const deletePromises = [];
    snap.forEach((docSnap) => {
      deletePromises.push(deleteDoc(docSnap.ref));
    });
    await Promise.all(deletePromises);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
