import React, { useState } from 'react';
import {
  ArrowRight,
  Trophy,
  Compass,
  Award,
  Atom,
  Landmark,
  Globe2,
  Cpu,
  Sparkles,
  Layers,
  Gauge,
  LogOut,
  ShieldCheck,
  UserCheck,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  History,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';
import { Category } from '../types/quiz';
import { CATEGORIES } from '../data/questions';

interface HomeScreenProps {
  onStartSetup: () => void;
  onSelectCategory?: (category: Category) => void;
  onOpenSignIn: () => void;
  onOpenProfile?: () => void;
  onOpenLeaderboard?: () => void;
  onOpenAdmin?: () => void;
  highScore: number | null;
}

const CATEGORY_META: Record<
  Category,
  {
    icon: React.ReactNode;
    colorClass: string;
    borderClass: string;
    description: string;
  }
> = {
  'General Knowledge': {
    icon: <Sparkles className="w-5 h-5 text-amber-400" />,
    colorClass: 'text-amber-400',
    borderClass: 'hover:border-amber-400/60',
    description: 'Art, literature, culture, and famous world trivia.',
  },
  'Science': {
    icon: <Atom className="w-5 h-5 text-emerald-400" />,
    colorClass: 'text-emerald-400',
    borderClass: 'hover:border-emerald-400/60',
    description: 'Physics, chemistry, astronomy, biology, and nature.',
  },
  'History': {
    icon: <Landmark className="w-5 h-5 text-yellow-400" />,
    colorClass: 'text-yellow-400',
    borderClass: 'hover:border-yellow-400/60',
    description: 'Ancient empires, world wars, and historic leaders.',
  },
  'Geography': {
    icon: <Globe2 className="w-5 h-5 text-cyan-400" />,
    colorClass: 'text-cyan-400',
    borderClass: 'hover:border-cyan-400/60',
    description: 'World capitals, oceans, landscapes, and borders.',
  },
  'Sports': {
    icon: <Trophy className="w-5 h-5 text-rose-400" />,
    colorClass: 'text-rose-400',
    borderClass: 'hover:border-rose-400/60',
    description: 'Athletic legends, Olympic Games, and championships.',
  },
  'Technology': {
    icon: <Cpu className="w-5 h-5 text-indigo-400" />,
    colorClass: 'text-indigo-400',
    borderClass: 'hover:border-indigo-400/60',
    description: 'Computing, software, AI, internet, and gadgets.',
  },
};

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartSetup,
  onSelectCategory,
  onOpenProfile,
  onOpenLeaderboard,
  onOpenAdmin,
  highScore,
}) => {
  const [imageError, setImageError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [copiedHost, setCopiedHost] = useState(false);
  const {
    user,
    userProfile,
    isAdmin,
    signInWithGoogle,
    signInWithGoogleRedirect,
    signOutUser,
    isSigningIn,
    authError,
    authErrorCode,
    currentHost,
    projectId,
    clearAuthError,
  } = useAuth();

  // Retrieve authenticated details directly from Firebase Auth user, backed by userProfile
  const playerName = user?.displayName || userProfile?.displayName || user?.email?.split('@')[0] || 'Quiz Player';
  const playerEmail = user?.email || userProfile?.email || '';
  const playerPhoto = user?.photoURL || userProfile?.photoURL;
  const playerUid = user?.uid || '';
  const initial = playerName.charAt(0).toUpperCase();

  const handleGoogleSignIn = async () => {
    sound.playSelect();
    const success = await signInWithGoogle();
    if (success) {
      sound.playCorrect();
      // Requirement 6: After successful authentication, user is taken into the authenticated Quizmaster area
      onStartSetup();
    }
  };

  const handleContinueAsGuest = () => {
    sound.playSelect();
    clearAuthError();
    onStartSetup();
  };

  const handleStartQuiz = () => {
    sound.playSelect();
    onStartSetup();
  };

  const handleSignOut = async () => {
    sound.playSelect();
    await signOutUser();
  };

  const handleCopyHost = () => {
    if (currentHost && navigator.clipboard) {
      navigator.clipboard.writeText(currentHost);
      setCopiedHost(true);
      setTimeout(() => setCopiedHost(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
      {/* Hero Section Container with Modern Card Framing */}
      <div className="w-full relative rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/50 to-slate-950/90 border border-slate-800/80 shadow-2xl shadow-black/50 p-6 sm:p-10 md:p-12 mb-8 overflow-hidden text-center flex flex-col items-center">
        {/* Soft atmospheric background glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Quiz-themed visual emblem */}
        <div className="relative mb-6 group cursor-default">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-2xl shadow-amber-500/20 border-2 border-slate-700/80 bg-slate-900 relative transition-transform duration-300 group-hover:scale-105">
            {!imageError ? (
              <img
                src="/src/assets/images/quiz_master_hero_1790209368743.jpg"
                alt="Quiz Master Knowledge Compass Emblem"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500/20 to-indigo-500/20 text-amber-400">
                <Compass className="w-12 h-12 stroke-[1.5]" />
              </div>
            )}
          </div>
          {/* Subtle ambient aura */}
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/30 to-amber-300/20 rounded-2xl blur-md -z-10 opacity-70 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Prominent App Title */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-3 text-balance">
          Quiz Master
        </h1>

        {/* Exact Requested Subtitle */}
        <p className="text-lg sm:text-xl font-medium text-amber-400 mb-4 tracking-wide font-display text-balance">
          Test your knowledge. Challenge yourself. Have fun.
        </p>

        {/* Brief Editorial Description */}
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mb-6 leading-relaxed text-balance">
          Choose from 6 curated knowledge categories and 3 difficulty tiers. Answer 10 questions with immediate feedback, detailed explanations, and performance tracking.
        </p>

        {/* Curated Categories Overview (Anti-slop: clean inline typographic layout) */}
        <div className="w-full max-w-xl flex flex-wrap justify-center items-center gap-x-3 gap-y-1.5 text-xs text-slate-300 font-medium mb-6">
          <span className="flex items-center gap-1 text-amber-400">
            <Sparkles className="w-3.5 h-3.5" /> General Knowledge
          </span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <Atom className="w-3.5 h-3.5" /> Science
          </span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span className="flex items-center gap-1 text-yellow-400">
            <Landmark className="w-3.5 h-3.5" /> History
          </span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span className="flex items-center gap-1 text-cyan-400">
            <Globe2 className="w-3.5 h-3.5" /> Geography
          </span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span className="flex items-center gap-1 text-indigo-400">
            <Cpu className="w-3.5 h-3.5" /> Technology
          </span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span className="flex items-center gap-1 text-rose-400">
            <Trophy className="w-3.5 h-3.5" /> Sports
          </span>
        </div>

        {/* Personal Best Stat (if recorded) */}
        {highScore !== null && (
          <div className="mb-6 inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-950/80 border border-amber-500/30 text-slate-200 text-xs sm:text-sm shadow-inner">
            <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Personal Best:{' '}
              <strong className="text-amber-400 font-bold tabular-nums">
                {highScore} / 10
              </strong>{' '}
              ({Math.round((highScore / 10) * 100)}%)
            </span>
          </div>
        )}

        {/* AUTHENTICATION SECTION */}
        <div className="w-full max-w-md mx-auto mb-2">
          {!user ? (
            /* Unauthenticated / Guest State: Prompt to Sign in or Continue as Guest */
            <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-5 sm:p-6 text-center shadow-xl">
              <p className="text-sm sm:text-base font-semibold text-white mb-2 leading-snug">
                Sign in to save your scores and participate in the leaderboard.
              </p>
              <p className="text-xs text-slate-400 mb-5">
                Sign in with your Google account to track your progress and compete globally.
              </p>

              {/* Error notice if sign-in fails */}
              {authError && (
                <div className="mb-4 p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs text-left animate-fadeIn space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span className="flex-1 leading-relaxed">{authError}</span>
                  </div>

                  {/* Specific Actionable Guidance for auth/unauthorized-domain */}
                  {authErrorCode === 'auth/unauthorized-domain' && currentHost && (
                    <div className="mt-2 p-3 rounded-lg bg-slate-900 border border-amber-500/30 text-slate-200 space-y-2">
                      <div className="text-[11px] font-semibold text-amber-400 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Domain Setup in Firebase Console</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-normal">
                        Firebase Authentication restricts logins to verified domains. Add this domain to your Firebase Authorized Domains:
                      </p>
                      <div className="flex items-center gap-2 bg-slate-950 p-2 rounded border border-slate-800">
                        <code className="text-[11px] font-mono text-amber-300 flex-1 truncate select-all">
                          {currentHost}
                        </code>
                        <button
                          type="button"
                          onClick={handleCopyHost}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-medium cursor-pointer transition-colors"
                        >
                          {copiedHost ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      {projectId && (
                        <a
                          href={`https://console.firebase.google.com/project/${projectId}/authentication/settings`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 underline font-medium pt-1"
                        >
                          <span>Open Firebase Auth Settings</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}

                  {/* Fallback option if popup was blocked */}
                  {authErrorCode === 'auth/popup-blocked' && (
                    <button
                      type="button"
                      onClick={() => signInWithGoogleRedirect()}
                      className="w-full mt-2 py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors"
                    >
                      Try Redirect Sign-In
                    </button>
                  )}
                </div>
              )}

              <div className="space-y-3">
                {/* Prominent "Continue with Google" button */}
                <button
                  type="button"
                  disabled={isSigningIn}
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm sm:text-base shadow-lg shadow-white/5 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSigningIn ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-slate-700" />
                      <span>Connecting with Google...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>

                {/* Prominent "Continue as Guest" button */}
                <button
                  type="button"
                  onClick={handleContinueAsGuest}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white border border-slate-700 hover:border-slate-600 font-semibold text-sm sm:text-base transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] cursor-pointer"
                >
                  <span>Continue as Guest</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>

                {onOpenLeaderboard && (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playSelect();
                      onOpenLeaderboard();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-300 hover:text-amber-200 border border-amber-500/30 hover:border-amber-500/50 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                  >
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>View Global Leaderboard</span>
                  </button>
                )}
              </div>

              <p className="mt-3.5 text-[11px] text-slate-500">
                Guests can enjoy all categories and questions. Sign in anytime to link your score history.
              </p>
            </div>
          ) : (
            /* Authenticated Quizmaster Player Area */
            <div className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-amber-500/30 p-5 sm:p-6 text-center shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3 text-left">
                  {playerPhoto && !avatarError ? (
                    <img
                      src={playerPhoto}
                      alt={playerName}
                      referrerPolicy="no-referrer"
                      onError={() => setAvatarError(true)}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-amber-400/60 shadow-md"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-bold flex items-center justify-center text-base shadow-inner">
                      {initial}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-base font-bold text-white leading-tight">
                        {playerName}
                      </h2>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Player
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate max-w-[180px] sm:max-w-[240px]">
                      {playerEmail}
                    </p>
                    {playerUid && (
                      <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                        UID: {playerUid.slice(0, 10)}...
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 text-right">
                  <span className="text-xs text-emerald-400 font-medium flex items-center justify-end gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>Verified Player</span>
                  </span>
                  {highScore !== null && (
                    <span className="text-[11px] text-amber-400 font-semibold tabular-nums">
                      Record: {highScore}/10 ({Math.round((highScore / 10) * 100)}%)
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons for authenticated player */}
              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleStartQuiz}
                  className="w-full group relative flex items-center justify-center gap-3 py-3.5 px-8 rounded-xl bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-display font-extrabold text-base sm:text-lg shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer"
                >
                  <span>Start Quiz Challenge</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {onOpenLeaderboard && (
                    <button
                      type="button"
                      onClick={() => {
                        sound.playSelect();
                        onOpenLeaderboard();
                      }}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 text-amber-300 hover:text-amber-200 border border-amber-500/30 hover:border-amber-500/50 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                    >
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <span>Leaderboard</span>
                    </button>
                  )}

                  {onOpenProfile && (
                    <button
                      type="button"
                      onClick={() => {
                        sound.playSelect();
                        onOpenProfile();
                      }}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                    >
                      <History className="w-4 h-4 text-amber-400" />
                      <span>Quiz History</span>
                    </button>
                  )}
                </div>

                {/* Admin Management Button (visible to authorized admins) */}
                {isAdmin && onOpenAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playSelect();
                      onOpenAdmin();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 border border-amber-500/30 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Admin Question Management</span>
                  </button>
                )}
              </div>

              {/* Sign out row */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span className="text-[11px] text-slate-400">
                  Signed in as {playerName}
                </span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/30 hover:bg-rose-950/60 border border-rose-500/30 hover:border-rose-500/60 text-xs text-rose-300 hover:text-rose-200 font-semibold transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quiz Category Selection on Home Dashboard */}
      <div className="w-full max-w-4xl mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-4">
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Choose a Quiz Category</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Select any category to jump into difficulty selection and start your quiz
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
            6 Knowledge Domains
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {CATEGORIES.map((cat) => {
            const meta = CATEGORY_META[cat];
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  sound.playSelect();
                  if (onSelectCategory) {
                    onSelectCategory(cat);
                  } else {
                    onStartSetup();
                  }
                }}
                className={`group relative p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 transition-all duration-200 text-left flex flex-col justify-between cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] shadow-lg shadow-black/20 ${meta.borderClass}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shadow-sm">
                      {meta.icon}
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 group-hover:text-amber-400 transition-colors">
                      10 Questions
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-white mb-1 group-hover:text-amber-300 transition-colors">
                    {cat}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {meta.description}
                  </p>
                </div>

                <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-400 group-hover:text-white">
                  <span>Start Challenge</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feature / Rules Grid Cards */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg shadow-black/20 hover:border-slate-700/80 transition-all flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white mb-1">6 Curated Categories</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pick your preferred subject or challenge yourself in new domains of knowledge.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg shadow-black/20 hover:border-slate-700/80 transition-all flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white mb-1">3 Difficulty Tiers</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tailor the difficulty from Easy fundamentals up to Hard mastermind-level trivia.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg shadow-black/20 hover:border-slate-700/80 transition-all flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white mb-1">Instant Learning & Score</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Learn the context behind every question and get a detailed performance breakdown.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
