import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  getFirestoreFavorites,
  addFirestoreFavorite,
  removeFirestoreFavorite,
  subscribeFirestoreFavorites,
} from '../services/firebase.js';

const GUEST_STORAGE_KEY = 'recipe_finder_local_favorites';
const USER_STORAGE_PREFIX = 'recipe_finder_favs_';

/**
 * Normalizes a recipe object for consistent storage
 */
function normalizeMeal(recipe) {
  if (!recipe || !recipe.idMeal) return null;
  return {
    idMeal: String(recipe.idMeal),
    strMeal: recipe.strMeal || 'Recipe',
    strMealThumb: recipe.strMealThumb || '',
    strCategory: recipe.strCategory || 'General',
    strArea: recipe.strArea || 'International',
    prepTime: recipe.prepTime || '25-30 min',
    difficulty: recipe.difficulty || 'Easy',
  };
}

/**
 * Custom hook for managing a local-first recipe favorites system.
 * 
 * Capabilities:
 * - 100% Local Storage persistence for all users (guests and members alike)
 * - Seamless background Firestore synchronization when authenticated
 * - Automatic migration of local guest favorites to cloud upon login
 * - Real-time live updates across browser tabs
 */
export function useFavorites() {
  const { user, isAuthenticated } = useAuth();
  const userId = user?.uid || user?.id || null;
  const prevUserIdRef = useRef(userId);

  // Initialize from localStorage immediately for zero layout shift & instant loading
  const [favorites, setFavorites] = useState(() => {
    try {
      if (typeof window === 'undefined') return [];

      // If user is authenticated, check their user-specific cache first
      if (userId) {
        const userCache = localStorage.getItem(`${USER_STORAGE_PREFIX}${userId}`);
        if (userCache) {
          const parsed = JSON.parse(userCache);
          if (Array.isArray(parsed)) return parsed;
        }
      }

      // Check global local storage (for guests or offline)
      const guestCache = localStorage.getItem(GUEST_STORAGE_KEY);
      if (guestCache) {
        const parsed = JSON.parse(guestCache);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch (e) {
      console.warn('Error reading initial favorites from localStorage:', e);
      return [];
    }
  });

  const [loadingFavorites, setLoadingFavorites] = useState(false);

  // Sync favorites when auth state changes (guest <-> logged in)
  useEffect(() => {
    let isMounted = true;

    // Guest mode: load from local storage
    if (!userId) {
      try {
        const guestCache = localStorage.getItem(GUEST_STORAGE_KEY);
        if (guestCache && isMounted) {
          const parsed = JSON.parse(guestCache);
          if (Array.isArray(parsed)) {
            setFavorites(parsed);
          }
        }
      } catch (err) {
        console.warn('Error reading guest favorites:', err);
      }
      prevUserIdRef.current = null;
      return;
    }

    // Authenticated mode:
    setLoadingFavorites(true);
    const userStorageKey = `${USER_STORAGE_PREFIX}${userId}`;

    // Read existing user cache or local cache
    let localItems = [];
    try {
      const cached = localStorage.getItem(userStorageKey) || localStorage.getItem(GUEST_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          localItems = parsed;
          if (isMounted) setFavorites(parsed);
        }
      }
    } catch (err) {
      console.warn('Error reading cached favorites for user:', err);
    }

    // If user just logged in and had local guest favorites, migrate them to Firestore
    const justLoggedIn = !prevUserIdRef.current && userId;
    if (justLoggedIn && localItems.length > 0) {
      localItems.forEach((item) => {
        addFirestoreFavorite(userId, item).catch(() => {});
      });
    }
    prevUserIdRef.current = userId;

    // Listen to Firestore real-time updates
    let unsubscribeFirestore = () => {};
    try {
      unsubscribeFirestore = subscribeFirestoreFavorites(userId, (cloudFavorites) => {
        if (isMounted && cloudFavorites) {
          // Merge local and cloud to ensure nothing is lost
          setFavorites((prev) => {
            const combinedMap = new Map();
            // Cloud items take precedence
            cloudFavorites.forEach((m) => combinedMap.set(String(m.idMeal), m));
            // Keep any local items that may be pending sync
            prev.forEach((m) => {
              if (!combinedMap.has(String(m.idMeal))) {
                combinedMap.set(String(m.idMeal), m);
              }
            });
            const merged = Array.from(combinedMap.values());
            try {
              localStorage.setItem(userStorageKey, JSON.stringify(merged));
              localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(merged));
            } catch (e) {
              console.warn('Cache write notice:', e);
            }
            return merged;
          });
          setLoadingFavorites(false);
        }
      });
    } catch (err) {
      console.warn('Firestore subscription notice, falling back to manual fetch:', err);
      getFirestoreFavorites(userId)
        .then((cloudFavorites) => {
          if (isMounted && cloudFavorites && Array.isArray(cloudFavorites)) {
            setFavorites(cloudFavorites);
            try {
              localStorage.setItem(userStorageKey, JSON.stringify(cloudFavorites));
              localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(cloudFavorites));
            } catch (e) {
              console.warn('Cache write notice:', e);
            }
          }
        })
        .finally(() => {
          if (isMounted) setLoadingFavorites(false);
        });
    }

    return () => {
      isMounted = false;
      unsubscribeFirestore();
    };
  }, [userId]);

  // Persist favorites in localStorage whenever favorites array changes
  useEffect(() => {
    try {
      const serialized = JSON.stringify(favorites);
      localStorage.setItem(GUEST_STORAGE_KEY, serialized);
      if (userId) {
        localStorage.setItem(`${USER_STORAGE_PREFIX}${userId}`, serialized);
      }
    } catch (err) {
      console.warn('Could not persist favorites to localStorage:', err);
    }
  }, [favorites, userId]);

  // Quick Set for O(1) membership checks
  const favoriteIdSet = useMemo(() => {
    return new Set(favorites.map((item) => String(item.idMeal)));
  }, [favorites]);

  /**
   * Check if a recipe is saved in favorites.
   * Works for both guests and authenticated users!
   */
  const isFavorite = useCallback(
    (recipeOrId) => {
      if (!recipeOrId) return false;
      const id = typeof recipeOrId === 'object' ? recipeOrId.idMeal : recipeOrId;
      return favoriteIdSet.has(String(id));
    },
    [favoriteIdSet]
  );

  /**
   * Add a recipe to local favorites (and Firestore if authenticated)
   */
  const addFavorite = useCallback(
    async (recipe) => {
      const normalized = normalizeMeal(recipe);
      if (!normalized) return;

      const targetId = normalized.idMeal;

      // Optimistic local state update
      setFavorites((prev) => {
        const exists = prev.some((item) => String(item.idMeal) === targetId);
        if (exists) return prev;
        const next = [normalized, ...prev];
        try {
          localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(next));
          if (userId) {
            localStorage.setItem(`${USER_STORAGE_PREFIX}${userId}`, JSON.stringify(next));
          }
        } catch (e) {
          console.warn('Local storage write notice:', e);
        }
        return next;
      });

      // Background Firestore sync if authenticated
      if (userId) {
        try {
          await addFirestoreFavorite(userId, normalized);
        } catch (err) {
          console.warn('Firestore sync notice (local save succeeded):', err.message);
        }
      }
    },
    [userId]
  );

  /**
   * Remove a recipe from local favorites (and Firestore if authenticated)
   */
  const removeFavorite = useCallback(
    async (recipeOrId) => {
      if (!recipeOrId) return;
      const targetId = String(
        typeof recipeOrId === 'object' ? recipeOrId.idMeal : recipeOrId
      );

      // Optimistic local state update
      setFavorites((prev) => {
        const next = prev.filter((item) => String(item.idMeal) !== targetId);
        try {
          localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(next));
          if (userId) {
            localStorage.setItem(`${USER_STORAGE_PREFIX}${userId}`, JSON.stringify(next));
          }
        } catch (e) {
          console.warn('Local storage write notice:', e);
        }
        return next;
      });

      // Background Firestore sync if authenticated
      if (userId) {
        try {
          await removeFirestoreFavorite(userId, targetId);
        } catch (err) {
          console.warn('Firestore removal notice (local save updated):', err.message);
        }
      }
    },
    [userId]
  );

  /**
   * Toggle a recipe's favorite status
   */
  const toggleFavorite = useCallback(
    (recipe) => {
      if (!recipe) return;
      const targetId = String(recipe.idMeal);

      if (favoriteIdSet.has(targetId)) {
        removeFavorite(targetId);
      } else {
        addFavorite(recipe);
      }
    },
    [favoriteIdSet, addFavorite, removeFavorite]
  );

  /**
   * Clear all local favorites
   */
  const clearFavorites = useCallback(() => {
    setFavorites([]);
    try {
      localStorage.removeItem(GUEST_STORAGE_KEY);
      if (userId) {
        localStorage.removeItem(`${USER_STORAGE_PREFIX}${userId}`);
      }
    } catch (e) {
      console.warn('Error clearing local favorites:', e);
    }
  }, [userId]);

  return {
    favorites,
    favoriteCount: favorites.length,
    loadingFavorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
    isAuthenticated,
  };
}
