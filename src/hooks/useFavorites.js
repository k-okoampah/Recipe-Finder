import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  getFirestoreFavorites,
  addFirestoreFavorite,
  removeFirestoreFavorite,
  subscribeFirestoreFavorites,
} from '../services/firebase.js';

const STORAGE_PREFIX = 'recipe_finder_favs_';

/**
 * Custom hook for managing recipe favorites synchronized with Firebase Firestore database.
 * Supports optimistic UI updates, real-time Firestore sync, and offline-first cache.
 */
export function useFavorites() {
  const { user, isAuthenticated } = useAuth();
  const userId = user?.uid || user?.id || null;

  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  // Sync favorites when user changes and attach real-time Firestore listener
  useEffect(() => {
    let isMounted = true;

    if (!userId) {
      setFavorites([]);
      return;
    }

    setLoadingFavorites(true);

    // Check local cache first for instant render
    const localKey = `${STORAGE_PREFIX}${userId}`;
    try {
      const cached = localStorage.getItem(localKey);
      if (cached && isMounted) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      }
    } catch (err) {
      console.warn('Cache read notice:', err);
    }

    // Attach real-time Firestore listener
    let unsubscribeFirestore = () => {};
    try {
      unsubscribeFirestore = subscribeFirestoreFavorites(userId, (cloudFavorites) => {
        if (isMounted && cloudFavorites) {
          setFavorites(cloudFavorites);
          localStorage.setItem(localKey, JSON.stringify(cloudFavorites));
          setLoadingFavorites(false);
        }
      });
    } catch (err) {
      console.warn('Firestore subscription notice, falling back to manual fetch:', err);
      getFirestoreFavorites(userId).then((cloudFavorites) => {
        if (isMounted && cloudFavorites) {
          setFavorites(cloudFavorites);
          localStorage.setItem(localKey, JSON.stringify(cloudFavorites));
        }
        if (isMounted) setLoadingFavorites(false);
      });
    }

    return () => {
      isMounted = false;
      unsubscribeFirestore();
    };
  }, [userId]);

  // Persist current favorites in user-scoped cache
  useEffect(() => {
    if (userId) {
      const localKey = `${STORAGE_PREFIX}${userId}`;
      try {
        localStorage.setItem(localKey, JSON.stringify(favorites));
      } catch (err) {
        console.warn('Could not save favorites to cache:', err);
      }
    }
  }, [favorites, userId]);

  // Quick lookup set of favorite IDs
  const favoriteIdSet = useMemo(() => {
    return new Set(favorites.map((item) => String(item.idMeal)));
  }, [favorites]);

  // Check if recipe is favorited
  const isFavorite = useCallback(
    (recipeOrId) => {
      if (!recipeOrId || !isAuthenticated) return false;
      const id = typeof recipeOrId === 'object' ? recipeOrId.idMeal : recipeOrId;
      return favoriteIdSet.has(String(id));
    },
    [favoriteIdSet, isAuthenticated]
  );

  // Add favorite
  const addFavorite = useCallback(
    async (recipe) => {
      if (!recipe || !recipe.idMeal || !userId) return;

      const normalizedMeal = {
        idMeal: String(recipe.idMeal),
        strMeal: recipe.strMeal || 'Recipe',
        strMealThumb: recipe.strMealThumb || '',
        strCategory: recipe.strCategory || 'General',
        strArea: recipe.strArea || 'International',
      };

      // Optimistic update
      setFavorites((prev) => {
        const exists = prev.some((item) => String(item.idMeal) === String(recipe.idMeal));
        if (exists) return prev;
        return [normalizedMeal, ...prev];
      });

      // Background Firestore persistence
      try {
        await addFirestoreFavorite(userId, normalizedMeal);
      } catch (err) {
        console.warn('Firestore error when adding favorite:', err.message);
      }
    },
    [userId]
  );

  // Remove favorite
  const removeFavorite = useCallback(
    async (recipeOrId) => {
      if (!recipeOrId || !userId) return;
      const targetId = String(
        typeof recipeOrId === 'object' ? recipeOrId.idMeal : recipeOrId
      );

      // Optimistic update
      setFavorites((prev) => prev.filter((item) => String(item.idMeal) !== targetId));

      // Background Firestore persistence
      try {
        await removeFirestoreFavorite(userId, targetId);
      } catch (err) {
        console.warn('Firestore error when removing favorite:', err.message);
      }
    },
    [userId]
  );

  // Toggle favorite status
  const toggleFavorite = useCallback(
    (recipe) => {
      if (!recipe || !recipe.idMeal || !userId) return;
      const targetId = String(recipe.idMeal);

      if (favoriteIdSet.has(targetId)) {
        removeFavorite(targetId);
      } else {
        addFavorite(recipe);
      }
    },
    [favoriteIdSet, addFavorite, removeFavorite, userId]
  );

  return {
    favorites,
    favoriteCount: favorites.length,
    loadingFavorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isAuthenticated,
  };
}
