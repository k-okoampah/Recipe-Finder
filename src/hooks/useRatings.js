import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  getFirestoreRatings,
  setFirestoreRating,
  removeFirestoreRating,
} from '../services/firebase.js';

const STORAGE_PREFIX = 'recipe_finder_ratings_';
const GUEST_KEY = 'recipe_finder_ratings_guest';

/**
 * Custom hook to manage recipe 5-star ratings synchronized with Firestore.
 * Supports:
 * - Local persistence for guests across browser sessions
 * - Firestore cloud persistence for authenticated users
 * - Seamless migration of guest ratings when a user registers or logs in with Google
 */
export function useRatings() {
  const { user, isAuthenticated } = useAuth();
  const userId = user?.uid || user?.id || null;

  const storageKey = isAuthenticated && userId ? `${STORAGE_PREFIX}${userId}` : GUEST_KEY;

  const [ratings, setRatings] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) return JSON.parse(stored);

      if (isAuthenticated && userId) {
        const guestStored = localStorage.getItem(GUEST_KEY);
        if (guestStored) {
          const parsedGuest = JSON.parse(guestStored);
          localStorage.setItem(storageKey, guestStored);
          return parsedGuest;
        }
      }
      return {};
    } catch {
      return {};
    }
  });

  // Re-sync and load from Firestore when userId changes
  useEffect(() => {
    let isMounted = true;

    async function loadRatings() {
      if (isAuthenticated && userId) {
        // First check local storage
        try {
          const stored = localStorage.getItem(storageKey);
          if (stored && isMounted) {
            setRatings(JSON.parse(stored));
          }
        } catch {
          // ignore
        }

        // Fetch from Firestore
        try {
          const cloudRatings = await getFirestoreRatings(userId);
          if (isMounted && cloudRatings && Object.keys(cloudRatings).length > 0) {
            setRatings((prev) => {
              const merged = { ...prev, ...cloudRatings };
              localStorage.setItem(storageKey, JSON.stringify(merged));
              return merged;
            });
          }
        } catch (err) {
          console.warn('Firestore ratings sync notice:', err.message);
        }
      } else {
        // Guest mode
        try {
          const stored = localStorage.getItem(GUEST_KEY);
          if (stored && isMounted) {
            setRatings(JSON.parse(stored));
          } else if (isMounted) {
            setRatings({});
          }
        } catch {
          if (isMounted) setRatings({});
        }
      }
    }

    loadRatings();

    return () => {
      isMounted = false;
    };
  }, [storageKey, isAuthenticated, userId]);

  // Set or update a recipe's star rating (1 to 5)
  const setRecipeRating = useCallback(
    (recipeId, rating) => {
      if (!recipeId) return;
      const cleanId = String(recipeId);
      const starVal = Math.max(1, Math.min(5, Number(rating)));

      setRatings((prev) => {
        const next = { ...prev, [cleanId]: starVal };
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch (err) {
          console.warn('Rating storage notice:', err);
        }
        return next;
      });

      // Persist to Firestore if authenticated
      if (isAuthenticated && userId) {
        setFirestoreRating(userId, cleanId, starVal).catch((err) => {
          console.warn('Could not save rating to Firestore:', err);
        });
      }
    },
    [storageKey, isAuthenticated, userId]
  );

  // Remove rating
  const removeRecipeRating = useCallback(
    (recipeId) => {
      if (!recipeId) return;
      const cleanId = String(recipeId);

      setRatings((prev) => {
        const next = { ...prev };
        delete next[cleanId];
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch (err) {
          console.warn('Rating removal notice:', err);
        }
        return next;
      });

      // Remove from Firestore if authenticated
      if (isAuthenticated && userId) {
        removeFirestoreRating(userId, cleanId).catch((err) => {
          console.warn('Could not remove rating from Firestore:', err);
        });
      }
    },
    [storageKey, isAuthenticated, userId]
  );

  // Get rating for a specific recipe
  const getRecipeRating = useCallback(
    (recipeId) => {
      if (!recipeId) return 0;
      return ratings[String(recipeId)] || 0;
    },
    [ratings]
  );

  const ratedCount = Object.keys(ratings).length;

  return {
    ratings,
    ratedCount,
    setRecipeRating,
    removeRecipeRating,
    getRecipeRating,
    isAuthenticated,
    isLinkedToProfile: Boolean(isAuthenticated && userId),
  };
}
