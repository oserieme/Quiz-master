import React, { useState, useEffect, useCallback } from 'react';
import {
  Mail,
  ShieldCheck,
  Key,
  Calendar,
  Clock,
  Trophy,
  Sparkles,
  ArrowRight,
  LogOut,
  Check,
  Copy,
  ArrowLeft,
  Flame,
  Zap,
  Atom,
  Landmark,
  Globe2,
  Cpu,
  Layers,
  CheckCircle2,
  XCircle,
  History,
  Eye,
  RefreshCw,
  Percent,
  X,
  Filter,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';
import { SavedQuizResult, Category, Difficulty } from '../types/quiz';
import { getUserQuizHistory } from '../services/quizService';
import {
  AchievementDefinition,
  AchievementProgress,
  PlayerProgressStats,
} from '../types/achievement';
import {
  syncAndSaveAchievements,
  calculatePlayerProgressStats,
  evaluateAllAchievements,
} from '../services/achievementService';
import { getLeaderboard } from '../services/leaderboardService';
import { MyProgressSection } from './MyProgressSection';
import { AchievementsGrid } from './AchievementsGrid';

interface ProfileDashboardProps {
  onBackToHome: () => void;
  onStartQuiz: () => void;
  onSignOut: () => Promise<void>;
  highScore: number | null;
  onSelectCategoryAndStartQuiz?: (category: Category) => void;
  onOpenLeaderboard?: () => void;
  onAchievementUnlocked?: (achievements: AchievementDefinition[]) => void;
}

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  'General Knowledge': <Sparkles className="w-4 h-4 text-amber-400" />,
  'Science': <Atom className="w-4 h-4 text-emerald-400" />,
  'History': <Landmark className="w-4 h-4 text-yellow-400" />,
  'Geography': <Globe2 className="w-4 h-4 text-cyan-400" />,
  'Technology': <Cpu className="w-4 h-4 text-indigo-400" />,
  'Sports': <Trophy className="w-4 h-4 text-rose-400" />,
};

const DIFFICULTY_STYLES: Record<Difficulty, { badge: string; icon: React.ReactNode }> = {
  Easy: {
    badge: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/25',
    icon: <Sparkles className="w-3 h-3 text-emerald-400" />,
  },
  Medium: {
    badge: 'text-amber-400 bg-amber-400/10 border-amber-400/25',
    icon: <Flame className="w-3 h-3 text-amber-400" />,
  },
  Hard: {
    badge: 'text-rose-400 bg-rose-400/10 border-rose-400/25',
    icon: <Zap className="w-3 h-3 text-rose-400" />,
  },
};

export const ProfileDashboard: React.FC<ProfileDashboardProps> = ({
  onBackToHome,
  onStartQuiz,
  onSignOut,
  highScore,
  onSelectCategoryAndStartQuiz,
  onOpenLeaderboard,
  onAchievementUnlocked,
}) => {
  const { user, userProfile } = useAuth();
  const [photoError, setPhotoError] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Quiz History states
  const [history, setHistory] = useState<SavedQuizResult[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [selectedResult, setSelectedResult] = useState<SavedQuizResult | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Player Progress & Achievements state
  const [achievementsProgress, setAchievementsProgress] = useState<AchievementProgress[]>(() =>
    evaluateAllAchievements([])
  );
  const [leaderboardRank, setLeaderboardRank] = useState<number | null>(null);
  const [totalParticipants, setTotalParticipants] = useState<number>(0);
  const [dashboardTab, setDashboardTab] = useState<'OVERVIEW' | 'ACHIEVEMENTS' | 'HISTORY'>('OVERVIEW');

  // Directly retrieve authenticated user details from Firebase Auth User
  const displayName =
    user?.displayName ||
    userProfile?.displayName ||
    user?.email?.split('@')[0] ||
    'Quiz Player';
  const email = user?.email || userProfile?.email || 'No email provided';
  const photoURL = user?.photoURL || userProfile?.photoURL;
  const uid = user?.uid || '';
  const initial = displayName.charAt(0).toUpperCase();

  // Load user's quiz history from Firestore collection 'quizResults'
  const fetchHistory = useCallback(async () => {
    if (!user?.uid) return;
    setLoadingHistory(true);
    setHistoryError(null);
    try {
      const records = await getUserQuizHistory(user.uid);
      setHistory(records);

      // Fetch leaderboard standing for progress section
      let rank: number | null = null;
      let totalPlayers = 0;
      try {
        const lb = await getLeaderboard('Overall', 'All Time', user.uid);
        rank = lb.currentUserRank;
        totalPlayers = lb.totalParticipants;
        setLeaderboardRank(rank);
        setTotalParticipants(totalPlayers);
      } catch (lbErr) {
        console.warn('Could not fetch leaderboard ranking for progress section:', lbErr);
      }

      // Automatically evaluate and persist achievements to Firestore
      try {
        const { newlyUnlocked, allProgress } = await syncAndSaveAchievements(
          user.uid,
          records
        );
        setAchievementsProgress(allProgress);
        if (newlyUnlocked.length > 0) {
          sound.playAchievement();
          onAchievementUnlocked?.(newlyUnlocked);
        }
      } catch (achErr) {
        console.warn('Could not sync achievements:', achErr);
        setAchievementsProgress(evaluateAllAchievements(records));
      }
    } catch (err) {
      console.error('Error fetching quiz history:', err);
      setHistoryError('Could not load quiz history. Please try refreshing.');
    } finally {
      setLoadingHistory(false);
    }
  }, [user?.uid, onAchievementUnlocked]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Format dates from Firebase Auth metadata or Firestore profile
  const creationTime = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : userProfile?.createdAt
    ? new Date(userProfile.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Active Member';

  const lastLoginTime = user?.metadata?.lastSignInTime
    ? new Date(user.metadata.lastSignInTime).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : userProfile?.lastLoginAt
    ? new Date(userProfile.lastLoginAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Recently';

  // Compute stats across history records or user profile
  const effectiveHighScore = Math.max(
    highScore ?? 0,
    userProfile?.highScore ?? 0,
    ...history.map((h) => h.score)
  );

  const totalQuizzes = Math.max(
    history.length,
    userProfile?.totalQuizzesPlayed ?? 0
  );

  const averageAccuracy =
    history.length > 0
      ? Math.round(
          history.reduce((acc, curr) => acc + curr.percentage, 0) / history.length
        )
      : totalQuizzes > 0
      ? 80
      : 0;

  const handleCopyUid = () => {
    if (uid && navigator.clipboard) {
      navigator.clipboard.writeText(uid);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    }
  };

  const handleSignOutClick = async () => {
    sound.playSelect();
    setIsSigningOut(true);
    try {
      await onSignOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  // Filter history items by selected category
  const filteredHistory =
    categoryFilter === 'All'
      ? history
      : history.filter((item) => item.category === categoryFilter);

  const categoriesInHistory = Array.from(
    new Set(history.map((h) => h.category))
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 animate-fadeIn">
      {/* Top navigation row */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              sound.playSelect();
              onBackToHome();
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all active:scale-[0.98] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          {onOpenLeaderboard && (
            <button
              type="button"
              onClick={() => {
                sound.playSelect();
                onOpenLeaderboard();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-amber-300 hover:text-amber-200 bg-slate-900/80 hover:bg-slate-850 border border-amber-500/30 hover:border-amber-500/50 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Leaderboard</span>
            </button>
          )}
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Firestore Connected</span>
        </div>
      </div>

      {/* Main Profile & Dashboard Card */}
      <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/95 border border-slate-800/90 shadow-2xl shadow-black/60 p-6 sm:p-10 mb-8 overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute -top-24 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* User Identity Header Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-slate-800">
          {/* Google Profile Photo / Monogram */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-xl shadow-amber-500/20 bg-slate-900 relative">
              {photoURL && !photoError ? (
                <img
                  src={photoURL}
                  alt={displayName}
                  referrerPolicy="no-referrer"
                  onError={() => setPhotoError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-display font-extrabold text-3xl shadow-inner">
                  {initial}
                </div>
              )}
            </div>
            {/* Google provider badge indicator */}
            <div
              className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-slate-950 border border-slate-700 shadow-md flex items-center justify-center"
              title="Signed in with Google"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
            </div>
          </div>

          {/* User Details & Credentials */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-1.5">
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {displayName}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Authenticated Player
              </span>
            </div>

            {/* Email Address */}
            <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-slate-300 mb-3">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{email}</span>
            </div>

            {/* Firebase UID Container */}
            <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-950/80 border border-slate-800/80 px-3 py-1.5 rounded-xl text-xs text-slate-400">
              <Key className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-medium text-slate-400">Firebase User UID:</span>
              <code className="font-mono text-amber-300 text-[11px] select-all">
                {uid}
              </code>
              <button
                type="button"
                onClick={handleCopyUid}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-[10px] font-medium transition-colors cursor-pointer"
                title="Copy Firebase UID"
              >
                {copiedUid ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Account Timestamps */}
            <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Joined: {creationTime}</span>
              </div>
              <span className="hidden sm:inline text-slate-600">·</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Last login: {lastLoginTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs for Dashboard Sections */}
        <div className="pt-6 pb-2 flex flex-wrap items-center gap-2 border-b border-slate-800">
          <button
            type="button"
            onClick={() => {
              sound.playSelect();
              setDashboardTab('OVERVIEW');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              dashboardTab === 'OVERVIEW'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-900/80 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>My Progress & Overview</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playSelect();
              setDashboardTab('ACHIEVEMENTS');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              dashboardTab === 'ACHIEVEMENTS'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-900/80 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Badges & Achievements</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {achievementsProgress.filter((a) => a.isUnlocked).length} / {achievementsProgress.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playSelect();
              setDashboardTab('HISTORY');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              dashboardTab === 'HISTORY'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-900/80 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Quiz History</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
              {history.length}
            </span>
          </button>
        </div>

        {/* SECTION 1: My Progress (Requirements 1 & 2) */}
        {(dashboardTab === 'OVERVIEW') && (
          <MyProgressSection
            stats={calculatePlayerProgressStats(
              history,
              userProfile,
              leaderboardRank,
              totalParticipants
            )}
            onOpenLeaderboard={onOpenLeaderboard}
          />
        )}

        {/* SECTION 2: Badges & Achievements (Requirements 3, 4, 5, 6) */}
        {(dashboardTab === 'OVERVIEW' || dashboardTab === 'ACHIEVEMENTS') && (
          <div className="py-8 border-b border-slate-800" id="achievements">
            <AchievementsGrid
              progressList={achievementsProgress}
              onPlayCategory={onSelectCategoryAndStartQuiz}
            />
          </div>
        )}

        {/* QUIZ HISTORY SECTION (Requirements 4, 5, 6, 7) */}
        {(dashboardTab === 'OVERVIEW' || dashboardTab === 'HISTORY') && (
        <div className="py-8 border-b border-slate-800" id="quiz-history">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-white flex items-center gap-2">
                <History className="w-5 h-5 text-amber-400" />
                <span>Your Quiz History</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Personal quiz attempts securely stored in Firestore and associated with your UID
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                sound.playSelect();
                fetchHistory();
              }}
              disabled={loadingHistory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-amber-400 ${
                  loadingHistory ? 'animate-spin' : ''
                }`}
              />
              <span>Refresh</span>
            </button>
          </div>

          {/* Category Filter Chips */}
          {history.length > 0 && categoriesInHistory.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0">
                <Filter className="w-3 h-3 text-slate-500" />
                Filter:
              </span>
              <button
                type="button"
                onClick={() => setCategoryFilter('All')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  categoryFilter === 'All'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                All ({history.length})
              </button>
              {categoriesInHistory.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Loading State */}
          {loadingHistory && (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mb-3" />
              <p className="text-sm font-medium text-slate-300">
                Loading your quiz history from Firestore...
              </p>
            </div>
          )}

          {/* Error State */}
          {!loadingHistory && historyError && (
            <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 flex items-center gap-3 text-rose-300 text-xs">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{historyError}</span>
            </div>
          )}

          {/* Empty State */}
          {!loadingHistory && !historyError && history.length === 0 && (
            <div className="py-12 px-4 rounded-2xl bg-slate-950/50 border border-dashed border-slate-800 text-center flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 mb-3 shadow-inner">
                <History className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                No Quiz Results Found
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mb-5 leading-relaxed">
                You haven't completed any quizzes under this account yet. Play a quiz challenge and your scores, category breakdown, and time metrics will automatically be saved to Firestore here!
              </p>
              <button
                type="button"
                onClick={() => {
                  sound.playSelect();
                  onStartQuiz();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <span>Take Your First Quiz</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quiz Attempts History List */}
          {!loadingHistory && !historyError && filteredHistory.length > 0 && (
            <div className="space-y-3">
              {filteredHistory.map((item, index) => {
                const diffStyle =
                  DIFFICULTY_STYLES[item.difficulty] || DIFFICULTY_STYLES.Medium;
                const dateFormatted = new Date(item.completedAt).toLocaleDateString(
                  undefined,
                  {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }
                );

                return (
                  <div
                    key={item.id || index}
                    className="p-4 rounded-2xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md shadow-black/20"
                  >
                    {/* Left details: Category & metadata */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                        {CATEGORY_ICONS[item.category] || (
                          <Sparkles className="w-4 h-4 text-amber-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="font-display font-bold text-white text-sm sm:text-base">
                            {item.category}
                          </h4>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${diffStyle.badge}`}
                          >
                            {diffStyle.icon}
                            <span>{item.difficulty}</span>
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1 text-[11px]">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            {dateFormatted}
                          </span>
                          <span className="text-slate-600">·</span>
                          <span className="flex items-center gap-1 text-[11px]">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {item.timeTakenFormatted || `${item.timeTaken}s`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right details: Score, Percentage & View Details Button */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-850">
                      <div className="text-left sm:text-right">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl sm:text-2xl font-extrabold font-display text-white tabular-nums">
                            {item.score}
                          </span>
                          <span className="text-xs text-slate-400 font-semibold">
                            / {item.totalQuestions}
                          </span>
                          <span
                            className={`ml-2 px-2 py-0.5 rounded text-[11px] font-bold ${
                              item.percentage >= 80
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : item.percentage >= 50
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {item.percentage}%
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {item.correctAnswers} correct · {item.incorrectAnswers} incorrect
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          sound.playSelect();
                          setSelectedResult(item);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer shrink-0"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        )}

        {/* Categories Available in Quiz Master */}
        <div className="py-6 border-b border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Available Quiz Categories</span>
            </span>
            <span className="text-xs text-slate-500">6 Domains</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => onSelectCategoryAndStartQuiz?.('General Knowledge')}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 text-xs text-slate-200 text-left transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>General Knowledge</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectCategoryAndStartQuiz?.('Science')}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 text-xs text-slate-200 text-left transition-colors cursor-pointer"
            >
              <Atom className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Science</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectCategoryAndStartQuiz?.('History')}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 text-xs text-slate-200 text-left transition-colors cursor-pointer"
            >
              <Landmark className="w-4 h-4 text-yellow-400 shrink-0" />
              <span>History</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectCategoryAndStartQuiz?.('Geography')}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 text-xs text-slate-200 text-left transition-colors cursor-pointer"
            >
              <Globe2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Geography</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectCategoryAndStartQuiz?.('Technology')}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 text-xs text-slate-200 text-left transition-colors cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Technology</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectCategoryAndStartQuiz?.('Sports')}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 text-xs text-slate-200 text-left transition-colors cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Sports</span>
            </button>
          </div>
        </div>

        {/* Action Controls: Start Quiz Challenge & Sign Out Button */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            disabled={isSigningOut}
            onClick={handleSignOutClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 border border-rose-500/40 hover:border-rose-500/70 font-semibold text-sm transition-all duration-150 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>{isSigningOut ? 'Signing out...' : 'Sign Out of Firebase'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playSelect();
              onStartQuiz();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-display font-extrabold text-base shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer"
          >
            <span>Start New Quiz Challenge</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* DETAIL MODAL: View Single Previous Quiz Result (Requirement 6) */}
      {selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 text-left overflow-hidden">
            {/* Soft decorative background glow */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400 shadow-md">
                  {CATEGORY_ICONS[selectedResult.category] || (
                    <Sparkles className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display text-xl font-bold text-white">
                      {selectedResult.category}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        DIFFICULTY_STYLES[selectedResult.difficulty]?.badge ||
                        DIFFICULTY_STYLES.Medium.badge
                      }`}
                    >
                      {DIFFICULTY_STYLES[selectedResult.difficulty]?.icon}
                      <span>{selectedResult.difficulty}</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      {new Date(selectedResult.completedAt).toLocaleDateString(
                        undefined,
                        {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedResult(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Key Score & Percentage Hero */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center mb-6 shadow-inner">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                Score Earned
              </span>
              <div className="text-4xl font-extrabold font-display text-amber-400 tabular-nums my-1">
                {selectedResult.score}{' '}
                <span className="text-xl text-slate-500 font-semibold">
                  / {selectedResult.totalQuestions}
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Percent className="w-3.5 h-3.5" />
                <span>{selectedResult.percentage}% Accuracy</span>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                    Correct Answers
                  </span>
                  <div className="text-xl font-bold font-display text-white">
                    {selectedResult.correctAnswers}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30 flex items-center gap-3">
                <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">
                    Incorrect Answers
                  </span>
                  <div className="text-xl font-bold font-display text-white">
                    {selectedResult.incorrectAnswers}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <Clock className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Time Taken
                  </span>
                  <div className="text-base font-bold font-display text-white">
                    {selectedResult.timeTakenFormatted || `${selectedResult.timeTaken}s`}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Storage Source
                  </span>
                  <div className="text-xs font-bold text-slate-300">
                    Firestore Database
                  </div>
                </div>
              </div>
            </div>

            {/* Authenticated UID Confirmation */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between mb-6">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Player UID:</span>
              </span>
              <code className="font-mono text-slate-300 text-[10px]">
                {selectedResult.userId}
              </code>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedResult(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all cursor-pointer"
              >
                Close
              </button>
              {onSelectCategoryAndStartQuiz && (
                <button
                  type="button"
                  onClick={() => {
                    const cat = selectedResult.category;
                    setSelectedResult(null);
                    onSelectCategoryAndStartQuiz(cat);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Play {selectedResult.category} Again</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
