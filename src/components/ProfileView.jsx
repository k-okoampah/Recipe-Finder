import React from 'react';
import { User, Heart, LogOut, ArrowLeft, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useRatings } from '../hooks/useRatings.js';

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
  const { ratedCount } = useRatings();

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
    <div id="profile-view-page" className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back to Browse Navigation */}
      <button
        type="button"
        id="profile-back-to-browse-btn"
        onClick={onBackToBrowse}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6c757d] hover:text-[#0056B3] transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        <span>Back to Recipes</span>
      </button>

      {/* Main Profile Card */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E2E8F0] bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EAF4FF] text-[#0056B3] flex items-center justify-center font-bold">
              <User size={20} />
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold text-[#003B73]">
                Account Profile
              </h1>
              <p className="text-xs text-[#6c757d] mt-0.5">
                {user?.email || 'Logged In'}
              </p>
            </div>
          </div>

          <button
            type="button"
            id="profile-logout-btn"
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#E2E8F0] hover:border-[#cbd5e1] text-xs font-medium text-[#6c757d] hover:text-[#003B73] hover:bg-[#F5F7FA] transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Log Out</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0]">
              <span className="text-xs font-medium text-[#6c757d] block mb-1">
                Saved Recipes
              </span>
              <div className="text-2xl font-bold text-[#003B73]">
                {favoriteCount}
              </div>
              <button
                type="button"
                onClick={onViewFavorites}
                className="text-xs text-[#0056B3] hover:underline font-medium mt-2 inline-flex items-center gap-1"
              >
                <span>View favorites</span>
                <Heart size={12} className="text-[#0056B3]" />
              </button>
            </div>

            <div className="p-4 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0]">
              <span className="text-xs font-medium text-[#6c757d] block mb-1">
                Rated Recipes
              </span>
              <div className="text-2xl font-bold text-[#003B73]">
                {ratedCount}
              </div>
              <div className="text-xs text-[#64748B] mt-2 inline-flex items-center gap-1">
                <Star size={12} className="fill-[#FFC107] text-[#FFC107]" />
                <span>Linked to profile</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0]">
              <span className="text-xs font-medium text-[#6c757d] block mb-1">
                Account Status
              </span>
              <div className="text-sm font-semibold text-[#003B73]">
                Active Member
              </div>
              <p className="text-xs text-[#6c757d] mt-2">
                Member since {formattedDate}
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-start">
            <button
              type="button"
              id="profile-view-favorites-btn"
              onClick={onViewFavorites}
              className="px-4 py-2 rounded-md bg-[#0056B3] hover:bg-[#003B73] text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Open Saved Recipes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
