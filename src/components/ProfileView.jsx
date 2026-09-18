import React from 'react';
import { User, Mail, Heart, LogOut, ArrowLeft, ShieldCheck, Database, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * ProfileView Component
 *
 * Requirements:
 * - User email
 * - Number of saved recipes
 * - Log Out button
 * - Clean brand color scheme & simple layout
 *
 * @param {Object} props
 * @param {number} props.favoriteCount
 * @param {Function} props.onBackToBrowse
 * @param {Function} props.onViewFavorites
 */
export default function ProfileView({
  favoriteCount = 0,
  onBackToBrowse,
  onViewFavorites,
}) {
  const { user, signOut, isSupabaseConfigured } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    if (onBackToBrowse) onBackToBrowse();
  };

  const formattedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Active Member';

  return (
    <div id="profile-view-page" className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back to Browse Navigation */}
      <button
        type="button"
        id="profile-back-to-browse-btn"
        onClick={onBackToBrowse}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#6c757d] hover:text-[#0056B3] transition-colors mb-6 cursor-pointer group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] rounded-md px-1 -ml-1 py-1 min-h-[36px]"
      >
        <ArrowLeft size={14} aria-hidden="true" className="group-hover:-translate-x-0.5 transition-transform" />
        <span>Back to Recipes</span>
      </button>

      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        {/* Profile Card Header with Light Blue accent */}
        <div className="bg-[#EAF4FF] p-6 sm:p-8 border-b border-[#d4e7fc] flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-[#0056B3] border-4 border-white text-white flex items-center justify-center shadow-md shrink-0">
            <User size={38} className="text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white text-[#0056B3] border border-[#d0e5ff] text-xs font-semibold mb-2">
              <ShieldCheck size={12} className="text-[#0056B3]" />
              <span>Verified Account</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#003B73] tracking-tight truncate">
              User Profile
            </h1>
            <p className="text-xs sm:text-sm text-[#6c757d] mt-1 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail size={13} className="text-[#0056B3]" />
              <span className="font-medium text-[#212529]">{user?.email || 'Authenticated User'}</span>
            </p>
          </div>
        </div>

        {/* Profile Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key Metrics Bento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Number of Saved Recipes Metric */}
            <div className="p-5 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#6c757d]">
                  Saved Recipes
                </span>
                <div className="text-2xl sm:text-3xl font-bold text-[#003B73]">
                  {favoriteCount}
                </div>
                <p className="text-xs text-[#6c757d]">Synchronized in your personal cookbook</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#FFC107] shadow-xs">
                <Heart size={24} className="fill-[#FFC107] text-[#0056B3]" />
              </div>
            </div>

            {/* Cloud Sync Status */}
            <div className="p-5 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#6c757d]">
                  Database Sync
                </span>
                <div className="text-base sm:text-lg font-bold text-[#003B73] flex items-center gap-1.5">
                  <Database size={16} className="text-[#0056B3]" />
                  <span>{isSupabaseConfigured ? 'Supabase Cloud' : 'Active Session'}</span>
                </div>
                <p className="text-xs text-[#6c757d]">
                  {isSupabaseConfigured ? 'Cloud RLS Protected' : 'Ready for Supabase Cloud'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#0056B3] shadow-xs">
                <Calendar size={22} className="text-[#0056B3]" />
              </div>
            </div>
          </div>

          {/* Account Details Details List */}
          <div className="border border-[#E2E8F0] rounded-xl overflow-hidden divide-y divide-[#E2E8F0]">
            <div className="p-4 flex items-center justify-between text-xs sm:text-sm">
              <span className="text-[#6c757d] font-medium">Account Email</span>
              <span className="font-semibold text-[#212529]">{user?.email || 'N/A'}</span>
            </div>
            <div className="p-4 flex items-center justify-between text-xs sm:text-sm">
              <span className="text-[#6c757d] font-medium">Member Since</span>
              <span className="font-semibold text-[#212529]">{formattedDate}</span>
            </div>
            <div className="p-4 flex items-center justify-between text-xs sm:text-sm">
              <span className="text-[#6c757d] font-medium">Favorite Recipes</span>
              <button
                type="button"
                onClick={onViewFavorites}
                className="font-semibold text-[#0056B3] hover:text-[#003B73] hover:underline cursor-pointer"
              >
                View {favoriteCount} Saved {favoriteCount === 1 ? 'Dish' : 'Dishes'} →
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              id="profile-view-favorites-btn"
              onClick={onViewFavorites}
              className="w-full sm:w-auto px-5 py-2.5 min-h-[44px] rounded-xl bg-[#0056B3] hover:bg-[#003B73] text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3] focus-visible:ring-offset-2"
            >
              <Heart size={16} className="fill-[#FFC107] text-[#FFC107]" />
              <span>Open Favorites Collection</span>
            </button>

            {/* Log Out button */}
            <button
              type="button"
              id="profile-logout-btn"
              onClick={handleSignOut}
              className="w-full sm:w-auto px-5 py-2.5 min-h-[44px] rounded-xl bg-white border border-[#E2E8F0] hover:border-[#003B73] text-[#003B73] hover:bg-[#F5F7FA] font-medium text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0056B3]"
            >
              <LogOut size={16} className="text-[#0056B3]" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
