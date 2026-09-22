import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const STORAGE_PREFIX = 'recipe_finder_ratings_';
const GUEST_KEY = 'recipe_finder_ratings_guest';

/**
 * Custom hook to manage recipe 5-star ratings.
 * Supports:
 * - Local persistence for guests across browser sessions
 * - Profile-linked persistence for authenticated users
 * - Seamless migration of guest ratings when a user registers or logs in
 */
export function useRatings() {
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id || null;

  // Active storage key depending on authentication state
  const storageKey = isAuthenticated && userId ? `${STORAGE_PREFIX}${userId}` : GUEST_KEY;

  const [ratings, setRatings] = useState(() => {
    try {
      // Check user-specific storage first
      const stored = localStorage.getItem(storageKey);
      if (stored) return JSON.parse(stored);

      // If user just logged in and has no saved ratings yet, check if there are guest ratings to inherit
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

  // Re-sync whenever storageKey changes (e.g., login / logout)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setRatings(JSON.parse(stored));
      } else if (isAuthenticated && userId) {
        const guestStored = localStorage.getItem(GUEST_KEY);
        if (guestStored) {
          const parsedGuest = JSON.parse(guestStored);
          localStorage.setItem(storageKey, guestStored);
          setRatings(parsedGuest);
          return;
        }
        setRatings({});
      } else {
        setRatings({});
      }
    } catch {
      setRatings({});
    }
  }, [storageKey, isAuthenticated, userId]);

  // Set or update a recipe's star rating (1 to 5)
  const setRecipeRating = useCallback((recipeId, rating) => {
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
  }, [storageKey]);

  // Remove rating (reset to unrated)
  const removeRecipeRating = useCallback((recipeId) => {
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
  }, [storageKey]);

  // Get rating for a specific recipe
  const getRecipeRating = useCallback((recipeId) => {
    if (!recipeId) return 0;
    return ratings[String(recipeId)] || 0;
  }, [ratings]);

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
