/**
 * Recipe API Service for TheMealDB public API
 * Base URL: https://www.themealdb.com/api/json/v1/1
 * 
 * Includes robust error handling, empty/null response protection,
 * field normalization, and predictable data structures.
 */

import { GHANAIAN_RECIPES } from '../data/ghanaianRecipes.js';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';
const REQUEST_TIMEOUT_MS = 10000;

// High-quality culinary fallback image if thumbnail is missing or broken
const FALLBACK_RECIPE_IMAGE =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80';

// Pre-normalize Ghanaian recipes for fast in-memory access and search
const NORMALIZED_GHANAIAN_RECIPES = GHANAIAN_RECIPES.map((recipe) => normalizeMeal(recipe)).filter(Boolean);

/**
 * Checks if a Ghanaian recipe matches a search query
 * @param {Object} recipe
 * @param {string} query
 * @returns {boolean}
 */
function matchesGhanaianQuery(recipe, query) {
  if (!query) return true;
  const q = query.toLowerCase().trim();

  // General area / country matches
  if (q === 'ghana' || q === 'ghanaian' || q === 'africa' || q === 'african' || q === 'west african') {
    return true;
  }

  // Name match
  if (recipe.strMeal && recipe.strMeal.toLowerCase().includes(q)) {
    return true;
  }

  // Category or Area match
  if (recipe.strCategory && recipe.strCategory.toLowerCase().includes(q)) {
    return true;
  }
  if (recipe.strArea && recipe.strArea.toLowerCase().includes(q)) {
    return true;
  }

  // Description or instructions match
  if (recipe.description && recipe.description.toLowerCase().includes(q)) {
    return true;
  }
  if (recipe.strInstructions && recipe.strInstructions.toLowerCase().includes(q)) {
    return true;
  }

  // Ingredients match
  if (Array.isArray(recipe.ingredients)) {
    return recipe.ingredients.some(
      (item) => item.ingredient && item.ingredient.toLowerCase().includes(q)
    );
  }

  return false;
}

/**
 * Extracts a clean short summary from instructions for the card view
 * @param {string} [instructions='']
 * @returns {string}
 */
function extractShortDescription(instructions = '') {
  if (!instructions || typeof instructions !== 'string') {
    return 'A flavorful, chef-crafted recipe prepared with balanced seasonings and fresh ingredients.';
  }

  // Remove markdown headers or numbered steps prefix
  const cleaned = instructions
    .replace(/^(\d+\.?|\bSTEP\s*\d+:?|-|\*)\s*/gim, '')
    .replace(/[\r\n]+/g, ' ')
    .trim();

  if (cleaned.length <= 150) {
    return cleaned;
  }

  // Truncate to clean sentence or word boundary
  const truncated = cleaned.slice(0, 140);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 60 ? truncated.slice(0, lastSpace) : truncated) + '...';
}

/**
 * Estimates preparation time based on instructions length or defaults
 * @param {Object} rawMeal
 * @returns {string}
 */
function estimatePrepTime(rawMeal) {
  if (rawMeal?.prepTime) return rawMeal.prepTime;
  const length = (rawMeal?.strInstructions || '').length;
  if (length > 1200) return '45-60 min';
  if (length > 600) return '30-40 min';
  return '20-30 min';
}

/**
 * Estimates difficulty based on ingredient count and step complexity
 * @param {Object} rawMeal
 * @returns {string}
 */
function estimateDifficulty(rawMeal) {
  if (rawMeal?.difficulty) return rawMeal.difficulty;
  const length = (rawMeal?.strInstructions || '').length;
  if (length > 1200) return 'Advanced';
  if (length > 600) return 'Moderate';
  return 'Easy';
}

/**
 * Safely extracts non-empty ingredients and measures from a meal object
 * @param {Object} meal
 * @returns {Array<{ingredient: string, measure: string}>}
 */
export function extractIngredients(meal) {
  if (!meal || typeof meal !== 'object') return [];

  if (Array.isArray(meal.ingredients) && meal.ingredients.length > 0) {
    return meal.ingredients;
  }

  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (
      ingredient &&
      typeof ingredient === 'string' &&
      ingredient.trim() !== '' &&
      ingredient.trim().toLowerCase() !== 'null'
    ) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure:
          measure && typeof measure === 'string' && measure.trim().toLowerCase() !== 'null'
            ? measure.trim()
            : '',
      });
    }
  }

  return ingredients;
}

/**
 * Normalizes a meal object into a predictable, safe data structure
 * with guaranteed fields and sensible fallbacks.
 * @param {Object} rawMeal
 * @param {Object} [defaults={}]
 * @returns {Object|null}
 */
export function normalizeMeal(rawMeal, defaults = {}) {
  if (!rawMeal || typeof rawMeal !== 'object') {
    return null;
  }

  const ingredients = extractIngredients(rawMeal);
  const rawCategory = rawMeal.strCategory?.trim();
  const rawArea = rawMeal.strArea?.trim();

  return {
    ...rawMeal,
    idMeal: String(rawMeal.idMeal || defaults.idMeal || ''),
    strMeal: (rawMeal.strMeal || defaults.strMeal || 'Untitled Recipe').trim(),
    strMealThumb:
      rawMeal.strMealThumb && typeof rawMeal.strMealThumb === 'string' && rawMeal.strMealThumb.trim() !== ''
        ? rawMeal.strMealThumb.trim()
        : FALLBACK_RECIPE_IMAGE,
    strCategory: rawCategory && rawCategory.toLowerCase() !== 'null' ? rawCategory : defaults.category || 'General',
    strArea: rawArea && rawArea.toLowerCase() !== 'null' ? rawArea : defaults.area || 'International',
    strInstructions: typeof rawMeal.strInstructions === 'string' ? rawMeal.strInstructions.trim() : '',
    strTags: rawMeal.strTags || '',
    strYoutube: typeof rawMeal.strYoutube === 'string' ? rawMeal.strYoutube.trim() : '',
    strSource: typeof rawMeal.strSource === 'string' ? rawMeal.strSource.trim() : '',
    ingredients,
    prepTime: estimatePrepTime(rawMeal),
    difficulty: estimateDifficulty(rawMeal),
    description: rawMeal.description || extractShortDescription(rawMeal.strInstructions),
  };
}

/**
 * Generic fetch wrapper with timeout, network error trapping, and JSON safety
 * @param {string} endpoint
 * @returns {Promise<any>}
 */
async function fetchFromApi(endpoint) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, { signal: controller.signal });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[TheMealDB Service] HTTP ${response.status} returned for ${endpoint}`);
      throw new Error(`The recipe server responded with status ${response.status}.`);
    }

    const text = await response.text();
    if (!text || text.trim() === '') {
      return { meals: null };
    }

    try {
      return JSON.parse(text);
    } catch {
      throw new Error('Received an unparseable response from the recipe service.');
    }
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('The recipe search request timed out. Please check your connection and try again.');
    }
    // Re-throw with clean user-friendly wording
    throw new Error(error.message || 'Unable to connect to the recipe service. Please try again.');
  }
}

/**
 * 1. Search meals by name / keyword
 * @param {string} [query='']
 * @returns {Promise<Array<Object>>} Resolves to an array of normalized meals, empty array if none found
 */
export async function searchMealsByName(query = '') {
  const sanitizedQuery = (query || '').trim();

  // Find matching Ghanaian recipes
  const ghanaianMatches = sanitizedQuery
    ? NORMALIZED_GHANAIAN_RECIPES.filter((meal) => matchesGhanaianQuery(meal, sanitizedQuery))
    : NORMALIZED_GHANAIAN_RECIPES;

  let apiMeals = [];
  try {
    const endpoint = sanitizedQuery
      ? `/search.php?s=${encodeURIComponent(sanitizedQuery)}`
      : '/search.php?s=';

    const data = await fetchFromApi(endpoint);

    if (data && Array.isArray(data.meals)) {
      apiMeals = data.meals
        .map((meal) => normalizeMeal(meal))
        .filter((meal) => meal && meal.idMeal && meal.strMeal);
    }
  } catch (err) {
    console.warn('[recipeApi] API fetch failed, falling back to local matches:', err);
    if (ghanaianMatches.length > 0) {
      return ghanaianMatches;
    }
    throw err;
  }

  // Merge Ghanaian recipes with API meals, placing Ghanaian matches first
  const seenIds = new Set();
  const combined = [];

  for (const meal of ghanaianMatches) {
    if (!seenIds.has(meal.idMeal)) {
      seenIds.add(meal.idMeal);
      combined.push(meal);
    }
  }

  for (const meal of apiMeals) {
    if (!seenIds.has(meal.idMeal)) {
      seenIds.add(meal.idMeal);
      combined.push(meal);
    }
  }

  return combined;
}

// Backward-compatible alias
export const searchRecipes = searchMealsByName;

/**
 * 2. Get meal details by ID
 * @param {string|number} id
 * @returns {Promise<Object|null>} Resolves to a normalized meal object or null
 */
export async function getMealDetailsById(id) {
  if (!id && id !== 0) {
    return null;
  }

  const sanitizedId = String(id).trim();
  if (!sanitizedId) {
    return null;
  }

  // Check Ghanaian recipes first for instant load
  const localGhanaianMeal = NORMALIZED_GHANAIAN_RECIPES.find(
    (meal) => String(meal.idMeal) === sanitizedId
  );
  if (localGhanaianMeal) {
    return localGhanaianMeal;
  }

  const data = await fetchFromApi(`/lookup.php?i=${encodeURIComponent(sanitizedId)}`);

  if (!data || !Array.isArray(data.meals) || data.meals.length === 0) {
    return null;
  }

  return normalizeMeal(data.meals[0]);
}

// Backward-compatible alias
export const getRecipeById = getMealDetailsById;

/**
 * 3. Get meals by category
 * @param {string} category - Category name (e.g. 'Ghanaian', 'Seafood', 'Chicken')
 * @returns {Promise<Array<Object>>} Resolves to an array of normalized meals
 */
export async function getMealsByCategory(category) {
  if (!category || typeof category !== 'string' || !category.trim()) {
    return [];
  }

  const sanitizedCategory = category.trim();

  // If user selected 'Ghanaian', return all Ghanaian dishes
  if (sanitizedCategory.toLowerCase() === 'ghanaian') {
    return NORMALIZED_GHANAIAN_RECIPES;
  }

  // Find Ghanaian dishes that fit into this category (Chicken, Seafood, Vegetarian, Beef)
  const ghanaianCategoryMatches = NORMALIZED_GHANAIAN_RECIPES.filter((meal) => {
    return meal.strCategory && meal.strCategory.toLowerCase() === sanitizedCategory.toLowerCase();
  });

  let apiMeals = [];
  try {
    const data = await fetchFromApi(`/filter.php?c=${encodeURIComponent(sanitizedCategory)}`);

    if (data && Array.isArray(data.meals)) {
      apiMeals = data.meals
        .map((meal) => normalizeMeal(meal, { category: sanitizedCategory }))
        .filter((meal) => meal && meal.idMeal && meal.strMeal);
    }
  } catch (err) {
    console.warn(`[recipeApi] Category fetch failed for ${sanitizedCategory}:`, err);
    if (ghanaianCategoryMatches.length > 0) {
      return ghanaianCategoryMatches;
    }
    throw err;
  }

  // Combine Ghanaian matches with API results
  const seenIds = new Set();
  const combined = [];

  for (const meal of ghanaianCategoryMatches) {
    if (!seenIds.has(meal.idMeal)) {
      seenIds.add(meal.idMeal);
      combined.push(meal);
    }
  }

  for (const meal of apiMeals) {
    if (!seenIds.has(meal.idMeal)) {
      seenIds.add(meal.idMeal);
      combined.push(meal);
    }
  }

  return combined;
}

// Backward-compatible alias
export const filterByCategory = getMealsByCategory;

/**
 * 4. Get meals by area (cuisine / country)
 * @param {string} area - Area/Cuisine name (e.g. 'Ghanaian', 'Italian', 'Mexican')
 * @returns {Promise<Array<Object>>} Resolves to an array of normalized meals
 */
export async function getMealsByArea(area) {
  if (!area || typeof area !== 'string' || !area.trim()) {
    return [];
  }

  const sanitizedArea = area.trim();

  if (
    sanitizedArea.toLowerCase() === 'ghanaian' ||
    sanitizedArea.toLowerCase() === 'african' ||
    sanitizedArea.toLowerCase() === 'ghana'
  ) {
    return NORMALIZED_GHANAIAN_RECIPES;
  }

  const data = await fetchFromApi(`/filter.php?a=${encodeURIComponent(sanitizedArea)}`);

  if (!data || !Array.isArray(data.meals)) {
    return [];
  }

  return data.meals
    .map((meal) => normalizeMeal(meal, { area: sanitizedArea }))
    .filter((meal) => meal && meal.idMeal && meal.strMeal);
}

// Backward-compatible alias
export const filterByArea = getMealsByArea;

/**
 * 5. Get a single random meal
 * @returns {Promise<Object|null>} Resolves to a normalized meal object or null
 */
export async function getRandomMeal() {
  // Frequently showcase authentic Ghanaian dishes
  if (Math.random() < 0.4 && NORMALIZED_GHANAIAN_RECIPES.length > 0) {
    const randomIndex = Math.floor(Math.random() * NORMALIZED_GHANAIAN_RECIPES.length);
    return NORMALIZED_GHANAIAN_RECIPES[randomIndex];
  }

  try {
    const data = await fetchFromApi('/random.php');

    if (data && Array.isArray(data.meals) && data.meals.length > 0) {
      return normalizeMeal(data.meals[0]);
    }
  } catch (err) {
    console.warn('[recipeApi] Random meal API error, using Ghanaian fallback:', err);
  }

  const randomIndex = Math.floor(Math.random() * NORMALIZED_GHANAIAN_RECIPES.length);
  return NORMALIZED_GHANAIAN_RECIPES[randomIndex];
}

// Backward-compatible alias
export const getRandomRecipe = getRandomMeal;

/**
 * 6. Get all recipe categories with metadata
 * @returns {Promise<Array<{idCategory: string, strCategory: string, strCategoryThumb: string, strCategoryDescription: string}>>}
 */
export async function getCategories() {
  const data = await fetchFromApi('/categories.php');

  const categories = [
    {
      idCategory: 'gh',
      strCategory: 'Ghanaian',
      strCategoryThumb: '/images/ghana/jollof.jpg',
      strCategoryDescription: 'Authentic Ghanaian delicacies including Jollof Rice, Waakye, Banku & Tilapia, Red Red, and comforting soups.',
    },
  ];

  if (!data || !Array.isArray(data.categories)) {
    return categories;
  }

  const apiCategories = data.categories.map((cat) => ({
    idCategory: String(cat.idCategory || ''),
    strCategory: (cat.strCategory || '').trim(),
    strCategoryThumb: cat.strCategoryThumb || '',
    strCategoryDescription: cat.strCategoryDescription || '',
  }));

  return [...categories, ...apiCategories];
}

/**
 * 7. Get all available areas / cuisines
 * @returns {Promise<Array<{strArea: string}>>}
 */
export async function getAreas() {
  const data = await fetchFromApi('/list.php?a=list');

  const areas = [{ strArea: 'Ghanaian' }];

  if (!data || !Array.isArray(data.meals)) {
    return areas;
  }

  const apiAreas = data.meals
    .map((item) => ({
      strArea: (item.strArea || '').trim(),
    }))
    .filter((item) => item.strArea && item.strArea.toLowerCase() !== 'unknown');

  return [...areas, ...apiAreas];
}
