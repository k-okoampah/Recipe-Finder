import React from 'react';
import { User, Heart, LogOut, ArrowLeft, Star, Database, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useRatings } from '../hooks/useRatings.js';

/**
 * ProfileView Component
 *
 * Displays:
 * - User email, display name, and avatar
 * - Saved recipes count (Firestore)
 * - Rated recipes count (Firestore)
 * - Firebase Authentication & Cloud sync indicator
 * - Log Out button
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
  const { user, signOut } = useAuth();
  const { ratedCount } = useRatings();

  const handleSignOut = async () => {
    await signOut();
    if (onBackToBrowse) onBackToBrowse();
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Chef';

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
        <div className="px-6 py-5 border-b border-[#E2E8F0] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={displayName}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#0056B3]"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#EAF4FF] text-[#0056B3] flex items-center justify-center font-bold text-lg border border-[#c5e0fc]">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-semibold text-[#003B73]">
                  {displayName}
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-200">
                  <ShieldCheck size={12} />
                  <span>Firebase Auth</span>
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-[#6c757d] mt-0.5 font-medium">
                {user?.email || 'Logged In'}
              </p>
            </div>
          </div>

          <button
            type="button"
            id="profile-logout-btn"
            onClick={handleSignOut}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-md border border-[#E2E8F0] hover:border-[#cbd5e1] text-xs font-medium text-[#6c757d] hover:text-[#003B73] hover:bg-[#F5F7FA] transition-colors cursor-pointer self-start sm:self-auto"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
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
                <span>Synced in cloud</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0]">
              <span className="text-xs font-medium text-[#6c757d] block mb-1">
                Firestore Database
              </span>
              <div className="text-sm font-semibold text-[#003B73] flex items-center gap-1.5">
                <Database size={14} className="text-[#0056B3]" />
                <span>Connected</span>
              </div>
              <p className="text-[11px] text-[#6c757d] mt-2">
                Favorites, ratings & AI chats safely persisted in Firestore
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
