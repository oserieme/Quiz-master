import React from 'react';
import {
  Trophy,
  CheckCircle2,
  HelpCircle,
  Percent,
  Award,
  TrendingUp,
  Medal,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { PlayerProgressStats } from '../types/achievement';
import { sound } from '../utils/audio';

interface MyProgressSectionProps {
  stats: PlayerProgressStats;
  onOpenLeaderboard?: () => void;
}

export const MyProgressSection: React.FC<MyProgressSectionProps> = ({
  stats,
  onOpenLeaderboard,
}) => {
  return (
    <div className="py-8 border-b border-slate-800" id="my-progress">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
              My Progress
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time statistics calculated from all your Firestore quiz sessions
          </p>
        </div>

        {onOpenLeaderboard && (
          <button
            type="button"
            onClick={() => {
              sound.playSelect();
              onOpenLeaderboard();
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-amber-300 hover:text-amber-200 border border-amber-500/30 hover:border-amber-500/50 text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer self-start sm:self-auto"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>View Global Rankings</span>
            <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
        )}
      </div>

      {/* 7 Metrics Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Metric 1: Total Quizzes Completed */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between shadow-lg shadow-black/20 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Total Quizzes
            </span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-white tabular-nums">
              {stats.totalQuizzesCompleted}
            </div>
            <span className="text-[11px] text-slate-400">
              Completed sessions
            </span>
          </div>
        </div>

        {/* Metric 2: Total Questions Answered */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between shadow-lg shadow-black/20 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Questions
            </span>
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-sky-400 tabular-nums">
              {stats.totalQuestionsAnswered}
            </div>
            <span className="text-[11px] text-slate-400">
              Total questions faced
            </span>
          </div>
        </div>

        {/* Metric 3: Total Correct Answers */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between shadow-lg shadow-black/20 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Correct Answers
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-emerald-400 tabular-nums">
              {stats.totalCorrectAnswers}
            </div>
            <span className="text-[11px] text-slate-400">
              Successful answers
            </span>
          </div>
        </div>

        {/* Metric 4: Overall Accuracy Percentage */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between shadow-lg shadow-black/20 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Overall Accuracy
            </span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-cyan-400 tabular-nums">
              {stats.overallAccuracy}%
            </div>
            <span className="text-[11px] text-slate-400">
              Correct answer ratio
            </span>
          </div>
        </div>

        {/* Metric 5: Highest Score */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-amber-500/30 flex flex-col justify-between shadow-lg shadow-black/20 hover:border-amber-500/50 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300">
              Highest Score
            </span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-amber-400 tabular-nums">
              {stats.highestScore}
              <span className="text-sm sm:text-base font-semibold text-slate-500 ml-1">
                / 10
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Personal best points
            </span>
          </div>
        </div>

        {/* Metric 6: Best Percentage */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 flex flex-col justify-between shadow-lg shadow-black/20 hover:border-emerald-500/50 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
              Best Percentage
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-emerald-400 tabular-nums">
              {stats.bestPercentage}%
            </div>
            <span className="text-[11px] text-slate-400">
              Peak quiz performance
            </span>
          </div>
        </div>

        {/* Metric 7: Current Leaderboard Position (Spans 2 cols on mobile/tablet if needed) */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-2 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-950 to-slate-950 border border-amber-500/40 flex flex-col justify-between shadow-lg shadow-black/20">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Medal className="w-3.5 h-3.5 text-amber-400" />
              Leaderboard Position
            </span>
            {stats.leaderboardRank !== null && stats.leaderboardRank <= 3 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                Podium
              </span>
            )}
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold font-display text-amber-400 tabular-nums">
                {stats.leaderboardRank !== null ? (
                  <>#{stats.leaderboardRank}</>
                ) : (
                  <span className="text-lg text-slate-400">Not Ranked</span>
                )}
              </div>
              <span className="text-[11px] text-slate-300">
                {stats.leaderboardRank !== null && stats.totalPlayers > 0
                  ? `Ranked among ${stats.totalPlayers} total players`
                  : stats.totalQuizzesCompleted > 0
                  ? 'Active contestant'
                  : 'Play a quiz to enter the leaderboard'}
              </span>
            </div>

            {onOpenLeaderboard && (
              <button
                type="button"
                onClick={() => {
                  sound.playSelect();
                  onOpenLeaderboard();
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer shrink-0"
              >
                View Board
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
