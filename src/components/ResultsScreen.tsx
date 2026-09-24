import React, { useEffect, useState } from 'react';
import {
  RotateCcw,
  Home,
  CheckCircle2,
  XCircle,
  Trophy,
  ChevronDown,
  ChevronUp,
  Percent,
  Check,
  X,
  Sparkles,
  Award,
  Flame,
  Zap,
  Atom,
  Landmark,
  Globe2,
  Cpu,
  Clock,
  LayoutDashboard,
  HelpCircle,
  ListOrdered
} from 'lucide-react';
import { QuizResults, Category, Difficulty } from '../types/quiz';
import { sound } from '../utils/audio';
import { useAuth } from '../context/AuthContext';
import { updateUserQuizStats } from '../services/userService';
import { ShieldCheck, History, ArrowRight } from 'lucide-react';

interface ResultsScreenProps {
  results: QuizResults;
  onPlayAgain: () => void;
  onGoHome: () => void;
  onOpenSignIn?: () => void;
  onOpenProfile?: () => void;
  onOpenLeaderboard?: () => void;
  isNewHighScore: boolean;
}

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  'General Knowledge': <Sparkles className="w-4 h-4 text-amber-400" />,
  'Science': <Atom className="w-4 h-4 text-emerald-400" />,
  'History': <Landmark className="w-4 h-4 text-yellow-400" />,
  'Geography': <Globe2 className="w-4 h-4 text-cyan-400" />,
  'Technology': <Cpu className="w-4 h-4 text-indigo-400" />,
  'Sports': <Trophy className="w-4 h-4 text-rose-400" />,
};

const DIFFICULTY_BADGE_STYLE: Record<Difficulty, { badge: string; icon: React.ReactNode }> = {
  'Easy': {
    badge: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/25',
    icon: <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
  },
  'Medium': {
    badge: 'text-amber-400 bg-amber-400/10 border-amber-400/25',
    icon: <Flame className="w-3.5 h-3.5 text-amber-400" />
  },
  'Hard': {
    badge: 'text-rose-400 bg-rose-400/10 border-rose-400/25',
    icon: <Zap className="w-3.5 h-3.5 text-rose-400" />
  }
};

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  results,
  onPlayAgain,
  onGoHome,
  onOpenSignIn,
  onOpenProfile,
  onOpenLeaderboard,
  isNewHighScore,
}) => {
  const { user } = useAuth();
  const [showReview, setShowReview] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    sound.playResults();
    if (user?.uid) {
      updateUserQuizStats(user.uid, results.totalScore);
    }
  }, [user, results.totalScore]);

  // Compute performance title & commentary based on percentage and difficulty
  const getPerformanceFeedback = (percentage: number, difficulty: Difficulty) => {
    if (percentage === 100) {
      return {
        title: 'Perfect Mastermind!',
        message: `Incredible! A flawless 10 out of 10 in ${results.category} on ${difficulty} difficulty!`,
      };
    } else if (percentage >= 80) {
      return {
        title: 'Outstanding Scholar!',
        message: `Magnificent performance! You showed exceptional command of ${results.category}.`,
      };
    } else if (percentage >= 60) {
      return {
        title: 'Solid Achiever!',
        message: `Great game! You have strong grasp over ${results.category} fundamentals.`,
      };
    } else if (percentage >= 40) {
      return {
        title: 'Knowledge Explorer!',
        message: 'A respectable effort. Review the explanations below to level up your score.',
      };
    } else {
      return {
        title: 'Keep Practicing!',
        message: 'Every great mind starts somewhere. Review your answers and try another round!',
      };
    }
  };

  const feedback = getPerformanceFeedback(results.percentage, results.difficulty);
  const diffBadge = DIFFICULTY_BADGE_STYLE[results.difficulty];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 sm:py-12">
      {/* Main Results Container Card */}
      <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-slate-800/90 shadow-2xl shadow-black/50 p-6 sm:p-10 text-center mb-8 backdrop-blur-md overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Celebratory Emblem */}
        <div className="relative inline-block mb-4 group">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-2xl shadow-amber-500/20 border-2 border-slate-700/80 bg-slate-900 relative transition-transform duration-300 group-hover:scale-105 mx-auto">
            {!imageError ? (
              <img
                src="/src/assets/images/quiz_victory_trophy_1790209380609.jpg"
                alt="Victory Laurel Trophy"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500/20 to-emerald-500/20 text-amber-400">
                <Trophy className="w-12 h-12 stroke-[1.5]" />
              </div>
            )}
          </div>
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/30 via-emerald-500/20 to-amber-500/30 rounded-2xl blur-md -z-10 opacity-70" />
        </div>

        {/* High Score Banner if new record */}
        {isNewHighScore && (
          <div className="mb-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-bold uppercase tracking-wider animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span>New Personal Best Record!</span>
          </div>
        )}

        {/* Context Badges: Category Played & Difficulty Selected */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm font-semibold text-white shadow-sm">
            <span className="text-slate-400 font-normal">Category:</span>
            {CATEGORY_ICONS[results.category]}
            <span>{results.category}</span>
          </div>

          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-bold ${diffBadge.badge}`}>
            <span className="opacity-75 font-normal">Difficulty:</span>
            {diffBadge.icon}
            <span>{results.difficulty}</span>
          </div>
        </div>

        {/* Performance Feedback Title */}
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2">
          {feedback.title}
        </h1>

        <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed text-balance">
          {feedback.message}
        </p>

        {/* Prominent Score Highlight Display */}
        <div className="max-w-xs mx-auto mb-8 p-6 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner flex flex-col items-center">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
            Final Score
          </span>
          <div className="text-5xl sm:text-6xl font-extrabold font-display text-amber-400 tabular-nums leading-none my-2">
            {results.totalScore}
            <span className="text-2xl sm:text-3xl text-slate-500 font-semibold ml-1">
              / {results.totalQuestions}
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {results.percentage}% Accuracy Rate
          </span>
        </div>

        {/* 5 Key Metrics: Total Questions, Correct Answers, Incorrect Answers, Percentage, Time Taken */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
          {/* Total Questions */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 shadow-sm flex flex-col items-center justify-center">
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              <ListOrdered className="w-4 h-4 text-slate-400" />
              <span>Questions</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-white tabular-nums">
              {results.totalQuestions}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 font-medium">
              10 per round
            </span>
          </div>

          {/* Correct Answers */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 shadow-sm flex flex-col items-center justify-center">
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Correct</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-emerald-400 tabular-nums">
              {results.correctCount}
            </div>
            <span className="text-[11px] text-emerald-400/80 mt-1 font-medium">
              +{results.correctCount} points
            </span>
          </div>

          {/* Incorrect Answers */}
          <div className="p-4 sm:p-5 rounded-2xl bg-rose-950/30 border border-rose-500/30 shadow-sm flex flex-col items-center justify-center">
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-rose-400 uppercase tracking-wider mb-1.5">
              <XCircle className="w-4 h-4" />
              <span>Incorrect</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-rose-400 tabular-nums">
              {results.incorrectCount}
            </div>
            <span className="text-[11px] text-rose-400/80 mt-1 font-medium">
              missed
            </span>
          </div>

          {/* Percentage */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/30 border border-amber-500/30 shadow-sm flex flex-col items-center justify-center">
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5">
              <Percent className="w-4 h-4" />
              <span>Percentage</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-amber-400 tabular-nums">
              {results.percentage}%
            </div>
            <span className="text-[11px] text-amber-400/80 mt-1 font-medium">
              accuracy
            </span>
          </div>

          {/* Time Taken */}
          <div className="col-span-2 sm:col-span-1 p-4 sm:p-5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 shadow-sm flex flex-col items-center justify-center">
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1.5">
              <Clock className="w-4 h-4" />
              <span>Time Taken</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-cyan-400 tabular-nums">
              {results.timeTakenFormatted || (results.timeTaken ? `${results.timeTaken}s` : '35s')}
            </div>
            <span className="text-[11px] text-cyan-400/80 mt-1 font-medium">
              duration
            </span>
          </div>
        </div>

        {/* Authenticated User Status or Guest Sign-In Callout */}
        {user ? (
          <div className="mb-6 p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-3">
              {user.photoURL && !imageError ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Player'}
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-10 h-10 rounded-xl object-cover border-2 border-emerald-400/50 shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-bold flex items-center justify-center shrink-0">
                  {((user.displayName || user.email || 'P').charAt(0)).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 justify-center sm:justify-start">
                  <span>Saved to Firestore Quiz History</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Synced
                  </span>
                </p>
                <p className="text-[11px] text-slate-400">
                  {user.displayName || user.email} · UID: {user.uid.slice(0, 12)}...
                </p>
              </div>
            </div>

            {onOpenProfile && (
              <button
                type="button"
                onClick={() => {
                  sound.playSelect();
                  onOpenProfile();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-all cursor-pointer shrink-0"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>My Progress & History</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
            )}
          </div>
        ) : (
          onOpenSignIn && (
            <div className="mb-6 p-4 rounded-2xl bg-slate-950/80 border border-amber-500/25 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-white">
                  Played as Guest
                </p>
                <p className="text-[11px] sm:text-xs text-slate-400">
                  Sign in with Google to save future scores to your account and participate in the leaderboard.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenSignIn}
                className="shrink-0 px-4 py-2 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 font-semibold text-xs transition-all cursor-pointer"
              >
                Sign In with Google
              </button>
            </div>
          )
        )}

        {/* Buttons: Play Again, View Leaderboard & Back to Dashboard */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onPlayAgain}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-display font-extrabold text-base shadow-xl shadow-amber-500/25 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/40 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            <span>Play Again</span>
          </button>

          {onOpenLeaderboard && (
            <button
              type="button"
              onClick={() => {
                sound.playSelect();
                onOpenLeaderboard();
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-850 text-amber-300 hover:text-amber-200 font-semibold text-base border border-amber-500/30 hover:border-amber-500/50 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Leaderboard</span>
            </button>
          )}

          <button
            type="button"
            onClick={onGoHome}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white font-medium text-base border border-slate-800 hover:border-slate-700 transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4 text-slate-400" />
            <span>Dashboard</span>
          </button>
        </div>
      </div>

      {/* Review Section Toggle Card */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg shadow-black/20 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => setShowReview(!showReview)}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-850/50 transition-colors cursor-pointer"
        >
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Review Question Breakdown
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Inspect your answers and see educational explanations for all 10 questions
            </p>
          </div>
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
            {showReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {/* Detailed Question Review List */}
        {showReview && (
          <div className="p-5 pt-0 space-y-4 border-t border-slate-800/60">
            {results.answers.map((rec, idx) => (
              <div
                key={idx}
                className={`p-4 sm:p-5 rounded-2xl border ${
                  rec.isCorrect
                    ? 'bg-slate-950/60 border-emerald-500/30'
                    : 'bg-slate-950/60 border-rose-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="text-xs text-slate-400 font-medium">
                    <span className="text-slate-300 font-semibold">{rec.category}</span>
                    <span aria-hidden="true" className="mx-1.5 text-slate-600">·</span>
                    <span className="text-amber-400 font-medium">{rec.difficulty}</span>
                    <span aria-hidden="true" className="mx-1.5 text-slate-600">·</span>
                    <span>Question {idx + 1}</span>
                  </div>
                  {rec.isTimedOut ? (
                    <div className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-950/40 border border-rose-500/30 px-2 py-0.5 rounded-lg">
                      <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Time Expired</span>
                    </div>
                  ) : rec.isCorrect ? (
                    <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-lg">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Correct (+1)</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-950/40 border border-rose-500/30 px-2 py-0.5 rounded-lg">
                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Incorrect</span>
                    </div>
                  )}
                </div>

                <h3 className="text-sm sm:text-base font-semibold text-white mb-3 leading-snug">
                  {rec.questionText}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                  <div className={`p-3 rounded-xl border ${
                    rec.isCorrect
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                  }`}>
                    <span className="font-bold block text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">
                      Your Answer:
                    </span>
                    <span className="font-medium text-xs sm:text-sm">
                      {rec.isTimedOut ? (
                        <span className="italic text-rose-300">Time Expired (No answer submitted)</span>
                      ) : (
                        rec.options[rec.selectedIndex]
                      )}
                    </span>
                  </div>

                  {!rec.isCorrect && (
                    <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-200">
                      <span className="font-bold block text-[10px] uppercase tracking-wider text-emerald-400 mb-0.5">
                        Correct Answer:
                      </span>
                      <span className="font-medium text-xs sm:text-sm">{rec.options[rec.correctIndex]}</span>
                    </div>
                  )}
                </div>

                <div className="text-xs text-slate-300 bg-slate-950/80 border border-slate-800/80 p-3.5 rounded-xl leading-relaxed">
                  <strong className="text-amber-400 block mb-0.5 font-bold">Knowledge Brief:</strong>
                  {rec.explanation}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
