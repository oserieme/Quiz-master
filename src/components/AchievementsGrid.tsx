import React, { useState } from 'react';
import {
  Trophy,
  Lock,
  CheckCircle,
  Sparkles,
  Flame,
  Crown,
  Target,
  Landmark,
  Atom,
  Globe2,
  Cpu,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { AchievementProgress } from '../types/achievement';
import { Category } from '../types/quiz';
import { sound } from '../utils/audio';

interface AchievementsGridProps {
  progressList: AchievementProgress[];
  onPlayCategory?: (category: Category) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Trophy: <Trophy className="w-5 h-5" />,
  Flame: <Flame className="w-5 h-5" />,
  Crown: <Crown className="w-5 h-5" />,
  Target: <Target className="w-5 h-5" />,
  Landmark: <Landmark className="w-5 h-5" />,
  Atom: <Atom className="w-5 h-5" />,
  Globe2: <Globe2 className="w-5 h-5" />,
  Cpu: <Cpu className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
};

export const AchievementsGrid: React.FC<AchievementsGridProps> = ({
  progressList,
  onPlayCategory,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'UNLOCKED' | 'LOCKED'>('ALL');

  const unlockedCount = progressList.filter((p) => p.isUnlocked).length;
  const totalCount = progressList.length;
  const completionPercent = Math.round((unlockedCount / totalCount) * 100);

  const filteredList = progressList.filter((item) => {
    if (filter === 'UNLOCKED') return item.isUnlocked;
    if (filter === 'LOCKED') return !item.isUnlocked;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header with unlocked overview and completion bar */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/70 border border-slate-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-display font-extrabold text-lg sm:text-xl text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Badges & Achievements</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Unlock badges automatically as you complete quiz challenges and reach milestones
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-2xl font-extrabold font-display text-amber-400 tabular-nums">
              {unlockedCount}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              / {totalCount} Badges Unlocked
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 ml-1">
              {completionPercent}%
            </span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 rounded-full transition-all duration-500"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            Filter:
          </span>
          <button
            type="button"
            onClick={() => {
              sound.playSelect();
              setFilter('ALL');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filter === 'ALL'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playSelect();
              setFilter('UNLOCKED');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filter === 'UNLOCKED'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Unlocked ({unlockedCount})
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playSelect();
              setFilter('LOCKED');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filter === 'LOCKED'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Locked ({totalCount - unlockedCount})
          </button>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredList.length} badges
        </span>
      </div>

      {/* Achievements Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredList.map((item) => {
          const { definition, isUnlocked, unlockedAt, currentValue, targetValue, percentage } =
            item;
          const icon = ICON_MAP[definition.iconName] || <Trophy className="w-5 h-5" />;

          return (
            <div
              key={definition.id}
              className={`relative rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between overflow-hidden border ${
                isUnlocked
                  ? 'bg-gradient-to-b from-slate-900/90 to-slate-950/90 border-amber-500/50 shadow-lg shadow-amber-500/10 hover:border-amber-400 hover:-translate-y-0.5'
                  : 'bg-slate-950/50 border-slate-850 hover:border-slate-800 opacity-90'
              }`}
            >
              {/* Unlocked top banner accent */}
              {isUnlocked && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500" />
              )}

              {/* Top Row: Icon Badge & Status Chip */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3.5">
                  {/* Badge Icon */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                      isUnlocked
                        ? `bg-gradient-to-br ${definition.badgeGradient} text-slate-950 shadow-amber-500/30 font-bold ring-2 ring-amber-400/40`
                        : 'bg-slate-900 border border-slate-800 text-slate-500'
                    }`}
                  >
                    {isUnlocked ? icon : <Lock className="w-5 h-5 text-slate-500" />}
                  </div>

                  {/* Status chip */}
                  {isUnlocked ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-900 text-slate-400 border border-slate-800">
                      <Lock className="w-3 h-3 text-slate-500" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>

                {/* Achievement Title & Criteria */}
                <h4 className="font-display font-bold text-base text-white mb-1">
                  {definition.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed min-h-[36px]">
                  {definition.description}
                </p>
              </div>

              {/* Bottom: Progress Bar & Milestone metrics */}
              <div className="mt-4 pt-3.5 border-t border-slate-850/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400 text-[11px] font-medium">
                    {isUnlocked ? (
                      unlockedAt ? (
                        `Earned ${new Date(unlockedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}`
                      ) : (
                        'Completed'
                      )
                    ) : (
                      `Progress: ${currentValue} / ${targetValue} ${definition.unit}`
                    )}
                  </span>
                  <span
                    className={`font-mono text-[11px] font-bold tabular-nums ${
                      isUnlocked ? 'text-amber-400' : 'text-slate-400'
                    }`}
                  >
                    {percentage}%
                  </span>
                </div>

                {/* Progress bar line */}
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isUnlocked
                        ? 'bg-amber-400'
                        : 'bg-indigo-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {/* Quick Action Button for Category Achievement if Locked */}
                {!isUnlocked && definition.categoryFilter && onPlayCategory && (
                  <button
                    type="button"
                    onClick={() => onPlayCategory(definition.categoryFilter as Category)}
                    className="w-full mt-3 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    <span>Play {definition.categoryFilter}</span>
                    <ArrowRight className="w-3 h-3 text-amber-400" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
