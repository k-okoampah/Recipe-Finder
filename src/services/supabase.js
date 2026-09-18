import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Validates whether Supabase environment variables are provided and active.
 */
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project') &&
  !supabaseUrl.includes('MY_SUPABASE')
);

/**
 * Official Supabase Client
 * Initialized only when valid environment credentials are provided.
 */
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * SQL Schema Reference for the `favorites` table:
 * 
 * -- Create favorites table with RLS enabled
 * create table if not exists public.favorites (
 *   id uuid default gen_random_uuid() primary key,
 *   user_id uuid references auth.users(id) on delete cascade not null,
 *   meal_id text not null,
 *   meal_name text not null,
 *   meal_image text,
 *   category text,
 *   area text,
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null,
 *   unique (user_id, meal_id)
 * );
 * 
 * -- Enable Row Level Security (RLS)
 * alter table public.favorites enable row level security;
 * 
 * -- Policies: Each user can only SELECT, INSERT, DELETE their own favorites
 * create policy "Users can select own favorites"
 *   on public.favorites for select
 *   to authenticated
 *   using (auth.uid() = user_id);
 * 
 * create policy "Users can insert own favorites"
 *   on public.favorites for insert
 *   to authenticated
 *   with check (auth.uid() = user_id);
 * 
 * create policy "Users can delete own favorites"
 *   on public.favorites for delete
 *   to authenticated
 *   using (auth.uid() = user_id);
 */

/**
 * Fetch all favorites for the authenticated user from Supabase.
 * @param {string} userId - Auth user ID
 * @returns {Promise<Array>}
 */
export async function getFavoritesFromSupabase(userId) {
  if (!isSupabaseConfigured || !supabase || !userId) {
    return null;
  }

  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Supabase fetch favorites warning:', error.message);
    throw error;
  }

  // Transform row structure into Recipe Finder meal format
  return (data || []).map((row) => ({
    idMeal: row.meal_id,
    strMeal: row.meal_name,
    strMealThumb: row.meal_image,
    strCategory: row.category || 'General',
    strArea: row.area || 'International',
    createdAt: row.created_at,
  }));
}

/**
 * Insert a recipe into the Supabase favorites table.
 * @param {string} userId
 * @param {Object} recipe
 * @returns {Promise<Object>}
 */
export async function addFavoriteToSupabase(userId, recipe) {
  if (!isSupabaseConfigured || !supabase || !userId || !recipe) {
    return null;
  }

  const mealId = String(recipe.idMeal);
  const payload = {
    user_id: userId,
    meal_id: mealId,
    meal_name: recipe.strMeal || 'Delicious Recipe',
    meal_image: recipe.strMealThumb || '',
    category: recipe.strCategory || 'General',
    area: recipe.strArea || 'International',
  };

  const { data, error } = await supabase
    .from('favorites')
    .upsert(payload, { onConflict: 'user_id,meal_id' })
    .select()
    .single();

  if (error) {
    console.warn('Supabase add favorite error:', error.message);
    throw error;
  }

  return data;
}

/**
 * Delete a recipe from the Supabase favorites table.
 * @param {string} userId
 * @param {string} mealId
 * @returns {Promise<boolean>}
 */
export async function removeFavoriteFromSupabase(userId, mealId) {
  if (!isSupabaseConfigured || !supabase || !userId || !mealId) {
    return null;
  }

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('meal_id', String(mealId));

  if (error) {
    console.warn('Supabase remove favorite error:', error.message);
    throw error;
  }

  return true;
}
