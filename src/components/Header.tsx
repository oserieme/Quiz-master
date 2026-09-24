import React, { useState, useRef, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Trophy,
  LogIn,
  LogOut,
  User as UserIcon,
  ChevronDown,
  ShieldCheck,
  LayoutDashboard,
  Play,
} from 'lucide-react';
import { QuizState } from '../types/quiz';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';

interface HeaderProps {
  quizState: QuizState;
  isMuted: boolean;
  onToggleSound: () => void;
  onHomeClick: () => void;
  onOpenSignIn: () => void;
  onOpenProfile?: () => void;
  onOpenLeaderboard?: () => void;
  onOpenAdmin?: () => void;
  onSignOut?: () => void;
  highScore: number | null;
}

export const Header: React.FC<HeaderProps> = ({
  quizState,
  isMuted,
  onToggleSound,
  onHomeClick,
  onOpenSignIn,
  onOpenProfile,
  onOpenLeaderboard,
  onOpenAdmin,
  onSignOut,
  highScore,
}) => {
  const { user, userProfile, isAdmin, signOutUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    sound.playSelect();
    setDropdownOpen(false);
    if (onSignOut) {
      await onSignOut();
    } else {
      await signOutUser();
    }
  };

  const displayName = userProfile?.displayName || user?.displayName || 'Player';
  const photoURL = userProfile?.photoURL || user?.photoURL;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40 transition-all">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand logo & title */}
        <button
          onClick={onHomeClick}
          className="flex items-center gap-3 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-xl p-1 -ml-1 transition-all active:scale-[0.98] cursor-pointer"
          aria-label="Quiz Master Home"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-white group-hover:text-amber-300 transition-colors block leading-tight">
              Quiz Master
            </span>
            <span className="text-[10px] sm:text-xs text-slate-400 font-medium hidden xs:block">
              General Knowledge Challenge
            </span>
          </div>
        </button>

        {/* Informative Context */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-400">
          <span className="text-slate-300">6 Categories</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>3 Difficulties</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>10 Questions</span>
        </div>

        {/* Right side actions: Leaderboard, Best score, Audio toggle, User Auth indicator, Exit button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Leaderboard Nav Button */}
          {onOpenLeaderboard && (
            <button
              type="button"
              onClick={() => {
                sound.playSelect();
                onOpenLeaderboard();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl border text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer ${
                quizState === 'LEADERBOARD'
                  ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 font-bold'
                  : 'bg-slate-900/90 hover:bg-slate-850 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
              }`}
              title="View Global Leaderboard"
            >
              <Trophy className={`w-3.5 h-3.5 ${quizState === 'LEADERBOARD' ? 'text-slate-950' : 'text-amber-400'}`} />
              <span className="hidden xs:inline">Leaderboard</span>
            </button>
          )}

          {/* Best score pill */}
          {highScore !== null && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-200 bg-slate-900/90 border border-amber-500/20 px-3 py-1.5 rounded-xl shadow-sm tabular-nums">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">Best:</span>
              <span className="font-semibold text-amber-400">{highScore}/10</span>
            </div>
          )}

          {/* Admin Dashboard Nav Button (visible if user is an admin) */}
          {isAdmin && onOpenAdmin && (
            <button
              type="button"
              onClick={() => {
                sound.playSelect();
                onOpenAdmin();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl border text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer ${
                quizState === 'ADMIN'
                  ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 font-bold'
                  : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}
              title="Open Admin Question Management"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin</span>
            </button>
          )}

          {/* Sound toggle button */}
          <button
            onClick={onToggleSound}
            aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
            title={isMuted ? 'Sound is muted' : 'Sound is enabled'}
            className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* User Authentication Status Indicator / Profile Menu */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-left transition-all active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                {/* User Avatar */}
                {photoURL && !imgError ? (
                  <img
                    src={photoURL}
                    alt={displayName}
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover border border-amber-500/30"
                  />
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 font-bold flex items-center justify-center text-xs shadow-inner">
                    {initial}
                  </div>
                )}

                {/* Display name */}
                <div className="hidden sm:block text-left leading-tight max-w-[110px] truncate">
                  <span className="block text-xs font-semibold text-white truncate">
                    {displayName}
                  </span>
                  <span className="block text-[10px] text-amber-400 flex items-center gap-0.5">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    Signed In
                  </span>
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5 hidden sm:block" />
              </button>

              {/* Profile Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl shadow-black/70 py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2.5 border-b border-slate-800/80">
                    <p className="text-xs font-bold text-white truncate">{displayName}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <p className="text-[10px] font-mono text-slate-500 truncate mt-0.5">UID: {user.uid.slice(0, 14)}...</p>
                  </div>

                  <div className="px-2 pt-1.5 space-y-1">
                    {isAdmin && onOpenAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          sound.playSelect();
                          setDropdownOpen(false);
                          onOpenAdmin();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 transition-all cursor-pointer text-left"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        <span>Admin Question Portal</span>
                      </button>
                    )}

                    {onOpenLeaderboard && (
                      <button
                        type="button"
                        onClick={() => {
                          sound.playSelect();
                          setDropdownOpen(false);
                          onOpenLeaderboard();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800/70 transition-all cursor-pointer text-left"
                      >
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <span>Global Leaderboard</span>
                      </button>
                    )}

                    {onOpenProfile && (
                      <button
                        type="button"
                        onClick={() => {
                          sound.playSelect();
                          setDropdownOpen(false);
                          onOpenProfile();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800/70 transition-all cursor-pointer text-left"
                      >
                        <LayoutDashboard className="w-4 h-4 text-amber-400" />
                        <span>Profile & Dashboard</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-200 hover:bg-rose-950/40 transition-all cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenSignIn}
              className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500/15 to-amber-500/5 hover:from-amber-500/25 hover:to-amber-500/15 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-xs sm:text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-400" />
              <span>Sign In</span>
            </button>
          )}

          {/* Exit Quiz Button if not on Home */}
          {quizState !== 'HOME' && (
            <button
              onClick={onHomeClick}
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/80 hover:bg-slate-850 transition-all active:scale-[0.97] cursor-pointer"
            >
              Exit
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
