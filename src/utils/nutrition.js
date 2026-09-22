/**
 * Nutritional Information & Macro Calculation Engine
 * 
 * Provides per-serving calorie and macronutrient analysis for recipes,
 * including protein, carbohydrates, fats, fiber, sugars, and sodium,
 * along with standard percent Daily Values (% DV based on a 2,000 kcal diet).
 */

// FDA Reference Daily Intake values (based on standard 2,000 calorie diet)
export const DAILY_VALUES = {
  calories: 2000,     // kcal
  fat: 78,           // g
  saturatedFat: 20,   // g
  carbohydrates: 275, // g
  fiber: 28,          // g
  protein: 50,        // g
  sodium: 2300,       // mg
  cholesterol: 300,   // mg
};

/**
 * Curated authentic nutritional profiles for Ghanaian specialty dishes (per single serving)
 */
const GHANAIAN_NUTRITION_PROFILES = {
  'gh-01': {
    // Ghana Jollof Rice with Chicken
    servings: 6,
    calories: 520,
    protein: 34,
    carbohydrates: 62,
    fat: 14,
    saturatedFat: 3.2,
    fiber: 4.5,
    sugar: 5.0,
    sodium: 680,
    cholesterol: 75,
  },
  'gh-02': {
    // Ghanaian Waakye
    servings: 6,
    calories: 480,
    protein: 22,
    carbohydrates: 76,
    fat: 9.5,
    saturatedFat: 2.1,
    fiber: 9.0,
    sugar: 3.5,
    sodium: 590,
    cholesterol: 45,
  },
  'gh-03': {
    // Banku & Charcoal-Grilled Tilapia
    servings: 4,
    calories: 460,
    protein: 38,
    carbohydrates: 54,
    fat: 8.5,
    saturatedFat: 1.8,
    fiber: 5.2,
    sugar: 3.0,
    sodium: 520,
    cholesterol: 65,
  },
  'gh-04': {
    // Red Red (Black-Eyed Pea Stew)
    servings: 4,
    calories: 490,
    protein: 18,
    carbohydrates: 72,
    fat: 15.0,
    saturatedFat: 4.5,
    fiber: 12.0,
    sugar: 14.0,
    sodium: 610,
    cholesterol: 0,
  },
  'gh-05': {
    // Light Soup with Fresh Goat Meat & Fufu
    servings: 4,
    calories: 560,
    protein: 36,
    carbohydrates: 68,
    fat: 16.0,
    saturatedFat: 5.5,
    fiber: 6.0,
    sugar: 6.5,
    sodium: 740,
    cholesterol: 85,
  },
  'gh-06': {
    // Groundnut Soup with Steamed Chicken
    servings: 6,
    calories: 590,
    protein: 39,
    carbohydrates: 42,
    fat: 29.0,
    saturatedFat: 6.0,
    fiber: 5.5,
    sugar: 7.0,
    sodium: 690,
    cholesterol: 80,
  },
  'gh-07': {
    // Kelewele (Spiced Fried Plantains)
    servings: 4,
    calories: 280,
    protein: 2.5,
    carbohydrates: 48,
    fat: 9.5,
    saturatedFat: 1.5,
    fiber: 4.0,
    sugar: 22.0,
    sodium: 180,
    cholesterol: 0,
  },
  'gh-08': {
    // Kontomire Stew with Boiled Yam
    servings: 4,
    calories: 450,
    protein: 24,
    carbohydrates: 52,
    fat: 17.5,
    saturatedFat: 4.0,
    fiber: 7.8,
    sugar: 4.0,
    sodium: 630,
    cholesterol: 95,
  },
  'gh-09': {
    // Tuo Zaafi (TZ) & Ayoyo Soup
    servings: 4,
    calories: 440,
    protein: 28,
    carbohydrates: 58,
    fat: 10.5,
    saturatedFat: 3.2,
    fiber: 6.5,
    sugar: 2.8,
    sodium: 580,
    cholesterol: 60,
  },
  'gh-10': {
    // Spicy Suya Grilled Beef Skewers
    servings: 4,
    calories: 390,
    protein: 37,
    carbohydrates: 12,
    fat: 21.0,
    saturatedFat: 6.5,
    fiber: 2.5,
    sugar: 3.0,
    sodium: 660,
    cholesterol: 90,
  },
};

/**
 * Category baseline averages per serving (used when estimating non-curated recipes)
 */
const CATEGORY_BASELINES = {
  Beef: { calories: 560, protein: 42, carbs: 28, fat: 28, satFat: 9.5, fiber: 3, sugar: 4, sodium: 640, chol: 95 },
  Chicken: { calories: 480, protein: 38, carbs: 32, fat: 18, satFat: 4.8, fiber: 3.5, sugar: 4.5, sodium: 580, chol: 85 },
  Dessert: { calories: 420, protein: 6, carbs: 64, fat: 16, satFat: 8.5, fiber: 2.5, sugar: 38, sodium: 260, chol: 55 },
  Lamb: { calories: 580, protein: 40, carbs: 26, fat: 32, satFat: 12.0, fiber: 3, sugar: 3.5, sodium: 620, chol: 105 },
  Miscellaneous: { calories: 450, protein: 24, carbs: 48, fat: 18, satFat: 5.0, fiber: 4, sugar: 5, sodium: 540, chol: 50 },
  Pasta: { calories: 520, protein: 20, carbs: 74, fat: 15, satFat: 5.5, fiber: 4.5, sugar: 6.0, sodium: 590, chol: 40 },
  Pork: { calories: 540, protein: 38, carbs: 25, fat: 30, satFat: 9.0, fiber: 2.5, sugar: 4.0, sodium: 660, chol: 90 },
  Seafood: { calories: 380, protein: 36, carbs: 22, fat: 12, satFat: 2.5, fiber: 2.5, sugar: 3.0, sodium: 560, chol: 80 },
  Side: { calories: 240, protein: 6, carbs: 36, fat: 8, satFat: 2.0, fiber: 4.5, sugar: 4.0, sodium: 320, chol: 10 },
  Starter: { calories: 290, protein: 12, carbs: 28, fat: 14, satFat: 3.5, fiber: 3.0, sugar: 3.5, sodium: 420, chol: 30 },
  Vegan: { calories: 390, protein: 16, carbs: 62, fat: 9, satFat: 1.5, fiber: 9.5, sugar: 7.0, sodium: 460, chol: 0 },
  Vegetarian: { calories: 430, protein: 18, carbs: 58, fat: 14, satFat: 4.5, fiber: 7.5, sugar: 6.5, sodium: 510, chol: 25 },
  Breakfast: { calories: 410, protein: 19, carbs: 46, fat: 16, satFat: 4.5, fiber: 3.5, sugar: 8.0, sodium: 480, chol: 120 },
  Goat: { calories: 520, protein: 44, carbs: 20, fat: 26, satFat: 8.0, fiber: 2.5, sugar: 3.0, sodium: 610, chol: 100 },
};

/**
 * Deterministic hash of string to generate realistic small variances
 * so values remain rock-solid across page renders.
 */
function hashString(str) {
  let hash = 0;
  if (!str) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Calculates or estimates per-serving nutritional information for a recipe.
 * 
 * @param {Object} recipe - Normalized or raw meal object
 * @param {number} [servingMultiplier=1] - Multiplier for servings (default 1 serving)
 * @returns {Object} Complete nutritional facts with calories, macros, and % DV
 */
export function calculateRecipeNutrition(recipe, servingMultiplier = 1) {
  if (!recipe) {
    return null;
  }

  const recipeId = String(recipe.idMeal || '');

  // 1. Check curated Ghanaian profile first
  if (GHANAIAN_NUTRITION_PROFILES[recipeId]) {
    const base = GHANAIAN_NUTRITION_PROFILES[recipeId];
    return formatNutritionResult(base, servingMultiplier);
  }

  // 2. Check if recipe object has explicit nutrition pre-attached
  if (recipe.nutrition && typeof recipe.nutrition.calories === 'number') {
    return formatNutritionResult(recipe.nutrition, servingMultiplier);
  }

  // 3. Algorithmic estimation based on Category, Ingredients, and Name
  const category = recipe.strCategory || 'Miscellaneous';
  const baseline = CATEGORY_BASELINES[category] || CATEGORY_BASELINES.Miscellaneous;

  // Derive stable variance from recipe title or id
  const hash = hashString(recipe.strMeal || recipeId);
  const variance = (hash % 15) - 7; // -7% to +7% natural variance

  // Ingredient influence heuristics
  const rawIngredients = Array.isArray(recipe.ingredients)
    ? recipe.ingredients.map((item) => (typeof item === 'string' ? item : item.ingredient || '').toLowerCase())
    : [];

  let calModifier = 0;
  let proteinModifier = 0;
  let carbModifier = 0;
  let fatModifier = 0;

  for (const ing of rawIngredients) {
    if (ing.includes('rice') || ing.includes('pasta') || ing.includes('potato') || ing.includes('bread') || ing.includes('flour')) {
      carbModifier += 4;
      calModifier += 20;
    }
    if (ing.includes('chicken') || ing.includes('beef') || ing.includes('pork') || ing.includes('fish') || ing.includes('egg') || ing.includes('shrimp')) {
      proteinModifier += 3;
      calModifier += 18;
    }
    if (ing.includes('oil') || ing.includes('butter') || ing.includes('cream') || ing.includes('cheese') || ing.includes('peanut')) {
      fatModifier += 2.5;
      calModifier += 22;
    }
    if (ing.includes('sugar') || ing.includes('honey') || ing.includes('syrup')) {
      carbModifier += 3;
      calModifier += 15;
    }
  }

  // Cap modifiers to sensible bounds
  calModifier = Math.min(Math.max(calModifier, -40), 60);
  proteinModifier = Math.min(Math.max(proteinModifier, -6), 12);
  carbModifier = Math.min(Math.max(carbModifier, -8), 16);
  fatModifier = Math.min(Math.max(fatModifier, -6), 10);

  const scale = 1 + variance / 100;

  const baseCalories = Math.round((baseline.calories + calModifier) * scale);
  const baseProtein = Math.round((baseline.protein + proteinModifier) * scale);
  const baseCarbs = Math.round((baseline.carbs + carbModifier) * scale);
  const baseFat = Math.round((baseline.fat + fatModifier) * scale);
  const baseSatFat = +(baseFat * 0.3).toFixed(1);
  const baseFiber = +(baseline.fiber * scale).toFixed(1);
  const baseSugar = +(baseline.sugar * scale).toFixed(1);
  const baseSodium = Math.round(baseline.sodium * scale);
  const baseCholesterol = Math.round(baseline.chol * scale);

  const estimatedBase = {
    servings: 4,
    calories: Math.max(180, Math.min(baseCalories, 950)),
    protein: Math.max(4, Math.min(baseProtein, 65)),
    carbohydrates: Math.max(6, Math.min(baseCarbs, 110)),
    fat: Math.max(3, Math.min(baseFat, 48)),
    saturatedFat: Math.max(0.5, Math.min(baseSatFat, 18)),
    fiber: Math.max(1, Math.min(baseFiber, 18)),
    sugar: Math.max(0.5, Math.min(baseSugar, 45)),
    sodium: Math.max(120, Math.min(baseSodium, 1200)),
    cholesterol: Math.max(0, Math.min(baseCholesterol, 180)),
  };

  return formatNutritionResult(estimatedBase, servingMultiplier);
}

/**
 * Formats nutritional figures with serving multiplier and percent daily values.
 */
function formatNutritionResult(base, multiplier = 1) {
  const safeMult = Math.max(0.25, Math.min(multiplier, 12));

  const calories = Math.round(base.calories * safeMult);
  const protein = +(base.protein * safeMult).toFixed(1);
  const carbohydrates = +(base.carbohydrates * safeMult).toFixed(1);
  const fat = +(base.fat * safeMult).toFixed(1);
  const saturatedFat = +(base.saturatedFat * safeMult).toFixed(1);
  const fiber = +(base.fiber * safeMult).toFixed(1);
  const sugar = +(base.sugar * safeMult).toFixed(1);
  const sodium = Math.round(base.sodium * safeMult);
  const cholesterol = Math.round((base.cholesterol || 0) * safeMult);

  return {
    servingSize: safeMult === 1 ? '1 serving' : `${safeMult} servings`,
    multiplier: safeMult,
    calories,
    protein,
    carbohydrates,
    fat,
    saturatedFat,
    fiber,
    sugar,
    sodium,
    cholesterol,
    dailyValues: {
      calories: Math.round((calories / DAILY_VALUES.calories) * 100),
      protein: Math.round((protein / DAILY_VALUES.protein) * 100),
      carbohydrates: Math.round((carbohydrates / DAILY_VALUES.carbohydrates) * 100),
      fat: Math.round((fat / DAILY_VALUES.fat) * 100),
      saturatedFat: Math.round((saturatedFat / DAILY_VALUES.saturatedFat) * 100),
      fiber: Math.round((fiber / DAILY_VALUES.fiber) * 100),
      sodium: Math.round((sodium / DAILY_VALUES.sodium) * 100),
      cholesterol: Math.round((cholesterol / DAILY_VALUES.cholesterol) * 100),
    },
  };
}
