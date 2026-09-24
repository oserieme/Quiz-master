import React, { useState, useEffect, useCallback } from 'react';
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Sparkles,
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  UserCheck,
  Flame,
  Atom,
  Landmark,
  Globe2,
  Cpu,
  Layers,
  Percent,
  Play,
  LogIn,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';
import {
  LeaderboardEntry,
  LeaderboardCategoryFilter,
  LeaderboardTimeFilter,
  Category,
} from '../types/quiz';
import { getLeaderboard, LeaderboardResult } from '../services/leaderboardService';

interface LeaderboardScreenProps {
  onBackToHome: () => void;
  onStartQuiz: () => void;
  onOpenSignIn: () => void;
  onSelectCategoryAndPlay?: (category: Category) => void;
}

const CATEGORIES: { label: string; value: LeaderboardCategoryFilter; icon: React.ReactNode }[] = [
  { label: 'Overall', value: 'Overall', icon: <Layers className="w-4 h-4 text-amber-400" /> },
  { label: 'General Knowledge', value: 'General Knowledge', icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
  { label: 'Science', value: 'Science', icon: <Atom className="w-4 h-4 text-emerald-400" /> },
  { label: 'History', value: 'History', icon: <Landmark className="w-4 h-4 text-yellow-400" /> },
  { label: 'Geography', value: 'Geography', icon: <Globe2 className="w-4 h-4 text-cyan-400" /> },
  { label: 'Technology', value: 'Technology', icon: <Cpu className="w-4 h-4 text-indigo-400" /> },
  { label: 'Sports', value: 'Sports', icon: <Trophy className="w-4 h-4 text-rose-400" /> },
];

const TIME_FILTERS: { label: string; value: LeaderboardTimeFilter; icon: React.ReactNode }[] = [
  { label: 'All Time', value: 'All Time', icon: <Trophy className="w-3.5 h-3.5" /> },
  { label: 'This Month', value: 'This Month', icon: <Calendar className="w-3.5 h-3.5" /> },
  { label: 'This Week', value: 'This Week', icon: <Clock className="w-3.5 h-3.5" /> },
];

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
  onBackToHome,
  onStartQuiz,
  onOpenSignIn,
  onSelectCategoryAndPlay,
}) => {
  const { user } = useAuth();
  const [categoryFilter, setCategoryFilter] = useState<LeaderboardCategoryFilter>('Overall');
  const [timeFilter, setTimeFilter] = useState<LeaderboardTimeFilter>('All Time');

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardResult>({
    entries: [],
    currentUserEntry: null,
    currentUserRank: null,
    totalParticipants: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch leaderboard rankings whenever category or time filter changes
  const fetchRankings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLeaderboard(categoryFilter, timeFilter, user?.uid);
      setLeaderboardData(data);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
      setError('Could not load leaderboard data. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, timeFilter, user?.uid]);

  useEffect(() => {
    fetchRankings();
  }, [fetchRankings]);

  const { entries, currentUserEntry, currentUserRank } = leaderboardData;
  const topThree = entries.slice(0, 3);
  const remainingEntries = entries.slice(3);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/30">
            <Crown className="w-4 h-4 fill-slate-950" />
          </div>
        );
      case 2:
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 flex items-center justify-center text-slate-900 font-bold shadow-md shadow-slate-300/20">
            <Medal className="w-4 h-4" />
          </div>
        );
      case 3:
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900 flex items-center justify-center text-amber-200 font-bold shadow-md shadow-amber-900/30 border border-amber-600/40">
            <Award className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs font-mono">
            #{rank}
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-10 animate-fadeIn">
      {/* Top Header Row with Navigation */}
      <div className="flex items-center justify-between gap-4 mb-6">
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

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              sound.playSelect();
              fetchRankings();
            }}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-all cursor-pointer disabled:opacity-50"
            title="Refresh Leaderboard"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playSelect();
              if (categoryFilter !== 'Overall' && onSelectCategoryAndPlay) {
                onSelectCategoryAndPlay(categoryFilter as Category);
              } else {
                onStartQuiz();
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Play Quiz</span>
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/95 border border-slate-800/90 shadow-2xl p-6 sm:p-8 mb-8 overflow-hidden">
        <div className="absolute -top-24 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/25 shrink-0">
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Global Leaderboard
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Live
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md">
                Rankings calculated directly from verified Firestore quiz attempts. Compete with players worldwide for the top spot!
              </p>
            </div>
          </div>

          {/* Quick Counter */}
          <div className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-slate-950/70 border border-slate-800 shadow-inner">
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Ranked Players</span>
              <span className="text-xl sm:text-2xl font-black font-display text-amber-400 tabular-nums">
                {entries.length}
              </span>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Filter Scope</span>
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {timeFilter}
              </span>
            </div>
          </div>
        </div>

        {/* Filters Controls Section */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-4">
          {/* Time Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 w-full sm:w-auto">
              {TIME_FILTERS.map((tf) => {
                const isActive = timeFilter === tf.value;
                return (
                  <button
                    key={tf.value}
                    type="button"
                    onClick={() => {
                      sound.playSelect();
                      setTimeFilter(tf.value);
                    }}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    {tf.icon}
                    <span>{tf.label}</span>
                  </button>
                );
              })}
            </div>

            <span className="text-xs text-slate-500 text-center sm:text-right">
              Showing rankings for: <strong className="text-amber-400">{categoryFilter}</strong>
            </span>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = categoryFilter === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    setCategoryFilter(cat.value);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-amber-300 border-2 border-amber-400 shadow-md shadow-amber-500/10'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CURRENT USER POSITION HIGHLIGHT (Requirement 5) */}
      <div className="mb-8">
        {user ? (
          currentUserEntry ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-amber-500/10 border-2 border-amber-500/40 shadow-xl shadow-amber-500/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                  #{currentUserRank}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      Your Position
                    </span>
                    <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                      YOU
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-white text-base sm:text-lg">
                    {currentUserEntry.displayName}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-6 text-center">
                <div>
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block">Total Score</span>
                  <span className="text-xl font-extrabold font-display text-amber-400 tabular-nums">
                    {currentUserEntry.totalScore}
                  </span>
                </div>
                <div className="w-px h-8 bg-slate-800" />
                <div>
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block">Quizzes</span>
                  <span className="text-xl font-extrabold font-display text-emerald-400 tabular-nums">
                    {currentUserEntry.quizzesCompleted}
                  </span>
                </div>
                <div className="w-px h-8 bg-slate-800" />
                <div>
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block">Accuracy</span>
                  <span className="text-xl font-extrabold font-display text-cyan-400 tabular-nums">
                    {currentUserEntry.averagePercentage}%
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-dashed border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">
                    You are not ranked in <span className="text-amber-400">{categoryFilter}</span> ({timeFilter})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Complete a quiz challenge in this category to establish your leaderboard standing!
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  sound.playSelect();
                  if (categoryFilter !== 'Overall' && onSelectCategoryAndPlay) {
                    onSelectCategoryAndPlay(categoryFilter as Category);
                  } else {
                    onStartQuiz();
                  }
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer shrink-0"
              >
                Play {categoryFilter === 'Overall' ? 'a Quiz' : categoryFilter} Now
              </button>
            </div>
          )
        ) : (
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <LogIn className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">
                  Sign in with Google to Compete on the Leaderboard
                </h3>
                <p className="text-xs text-slate-400">
                  Authenticate your account to track your position, save quiz results to Firestore, and climb the ranks.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                sound.playSelect();
                onOpenSignIn();
              }}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer shrink-0"
            >
              Sign In to Join
            </button>
          </div>
        )}
      </div>

      {/* TOP 3 PODIUM SECTION (When at least 1 entry is available) */}
      {!loading && entries.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Top Champions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Rank #1 */}
            {topThree[0] && (
              <div className="relative order-1 md:order-2 p-6 rounded-3xl bg-gradient-to-b from-amber-500/15 via-slate-900 to-slate-950 border-2 border-amber-400/70 shadow-xl shadow-amber-500/10 flex flex-col items-center text-center">
                <div className="absolute -top-3.5 px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md">
                  <Crown className="w-3.5 h-3.5 fill-slate-950" />
                  <span>1ST PLACE</span>
                </div>

                {/* Avatar */}
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-lg shadow-amber-500/30 my-3 bg-slate-900 flex items-center justify-center">
                  {topThree[0].photoURL ? (
                    <img
                      src={topThree[0].photoURL}
                      alt={topThree[0].displayName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-display font-extrabold text-2xl">
                      {topThree[0].displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 mb-1">
                  <h4 className="font-display font-bold text-white text-lg truncate max-w-[180px]">
                    {topThree[0].displayName}
                  </h4>
                  {topThree[0].isCurrentUser && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-400 text-slate-950">
                      YOU
                    </span>
                  )}
                </div>

                <div className="text-3xl font-extrabold font-display text-amber-400 tabular-nums my-1">
                  {topThree[0].totalScore}
                  <span className="text-xs text-slate-500 font-semibold ml-1">pts</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                  <span className="bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                    {topThree[0].quizzesCompleted} {topThree[0].quizzesCompleted === 1 ? 'quiz' : 'quizzes'}
                  </span>
                  <span className="bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-cyan-400 font-semibold">
                    {topThree[0].averagePercentage}% avg
                  </span>
                </div>
              </div>
            )}

            {/* Rank #2 */}
            {topThree[1] && (
              <div className="relative order-2 md:order-1 p-5 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-lg flex flex-col items-center text-center">
                <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-slate-300 text-slate-950 font-bold text-[11px] flex items-center gap-1 shadow-md">
                  <Medal className="w-3 h-3" />
                  <span>2ND PLACE</span>
                </div>

                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-300 shadow-md my-3 bg-slate-900 flex items-center justify-center">
                  {topThree[1].photoURL ? (
                    <img
                      src={topThree[1].photoURL}
                      alt={topThree[1].displayName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-300 text-slate-950 font-display font-extrabold text-xl">
                      {topThree[1].displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 mb-1">
                  <h4 className="font-display font-bold text-white text-base truncate max-w-[160px]">
                    {topThree[1].displayName}
                  </h4>
                  {topThree[1].isCurrentUser && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-400 text-slate-950">
                      YOU
                    </span>
                  )}
                </div>

                <div className="text-2xl font-extrabold font-display text-slate-200 tabular-nums my-1">
                  {topThree[1].totalScore}
                  <span className="text-xs text-slate-500 font-semibold ml-1">pts</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <span>{topThree[1].quizzesCompleted} quizzes</span>
                  <span>·</span>
                  <span className="text-cyan-400">{topThree[1].averagePercentage}% avg</span>
                </div>
              </div>
            )}

            {/* Rank #3 */}
            {topThree[2] && (
              <div className="relative order-3 md:order-3 p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col items-center text-center">
                <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-amber-800 text-amber-200 font-bold text-[11px] flex items-center gap-1 shadow-md border border-amber-600/40">
                  <Award className="w-3 h-3" />
                  <span>3RD PLACE</span>
                </div>

                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-700/60 shadow-md my-3 bg-slate-900 flex items-center justify-center">
                  {topThree[2].photoURL ? (
                    <img
                      src={topThree[2].photoURL}
                      alt={topThree[2].displayName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-amber-800 text-amber-200 font-display font-extrabold text-xl">
                      {topThree[2].displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 mb-1">
                  <h4 className="font-display font-bold text-white text-base truncate max-w-[160px]">
                    {topThree[2].displayName}
                  </h4>
                  {topThree[2].isCurrentUser && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-400 text-slate-950">
                      YOU
                    </span>
                  )}
                </div>

                <div className="text-2xl font-extrabold font-display text-amber-600 tabular-nums my-1">
                  {topThree[2].totalScore}
                  <span className="text-xs text-slate-500 font-semibold ml-1">pts</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <span>{topThree[2].quizzesCompleted} quizzes</span>
                  <span>·</span>
                  <span className="text-cyan-400">{topThree[2].averagePercentage}% avg</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MAIN LEADERBOARD LIST / TABLE SECTION */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <h3 className="font-display font-bold text-white text-sm sm:text-base">
              Rankings Standings
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {entries.length} {entries.length === 1 ? 'Player' : 'Players'}
          </span>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mb-3" />
            <p className="text-sm font-medium text-slate-300">
              Calculating rankings from Firestore quiz results...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <AlertCircle className="w-8 h-8 text-rose-400 mb-2" />
            <p className="text-sm text-rose-300 mb-4">{error}</p>
            <button
              type="button"
              onClick={fetchRankings}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-white transition-all cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && entries.length === 0 && (
          <div className="py-16 px-4 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400 mb-3 shadow-inner">
              <Trophy className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">
              No Quiz Results Recorded Yet
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mb-5 leading-relaxed">
              No players have completed quizzes under the filter "{categoryFilter}" ({timeFilter}) yet. Be the first to establish a score on the leaderboard!
            </p>
            <button
              type="button"
              onClick={() => {
                sound.playSelect();
                if (categoryFilter !== 'Overall' && onSelectCategoryAndPlay) {
                  onSelectCategoryAndPlay(categoryFilter as Category);
                } else {
                  onStartQuiz();
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <span>Play Now & Take #1</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Full Rankings List */}
        {!loading && !error && entries.length > 0 && (
          <div className="divide-y divide-slate-800/80">
            {entries.map((entry) => {
              const isCurrentUser = entry.isCurrentUser;
              return (
                <div
                  key={entry.userId}
                  className={`p-4 sm:px-6 sm:py-4 flex items-center justify-between gap-4 transition-colors ${
                    isCurrentUser
                      ? 'bg-amber-500/10 hover:bg-amber-500/15 border-l-4 border-amber-400'
                      : 'hover:bg-slate-850/50'
                  }`}
                >
                  {/* Left: Rank & Player identity */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Rank Badge */}
                    <div className="shrink-0">{getRankBadge(entry.rank)}</div>

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                      {entry.photoURL ? (
                        <img
                          src={entry.photoURL}
                          alt={entry.displayName}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-bold text-xs">
                          {entry.displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Player Name (No email exposed!) */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-sm sm:text-base text-white truncate block">
                          {entry.displayName}
                        </span>
                        {isCurrentUser && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 shrink-0">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span>{entry.quizzesCompleted} {entry.quizzesCompleted === 1 ? 'quiz' : 'quizzes'}</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-cyan-400 font-medium">{entry.averagePercentage}% accuracy</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Total Points Hero */}
                  <div className="text-right shrink-0">
                    <div className="flex items-baseline justify-end gap-1">
                      <span className="text-xl sm:text-2xl font-extrabold font-display text-amber-400 tabular-nums">
                        {entry.totalScore}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">pts</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      Best: {entry.highestScore}/10
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
