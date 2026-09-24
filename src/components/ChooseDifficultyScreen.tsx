import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Flame,
  Zap,
  Layers,
  Atom,
  Landmark,
  Globe2,
  Cpu,
  Trophy,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { Category, Difficulty } from '../types/quiz';

interface ChooseDifficultyScreenProps {
  category: Category;
  initialDifficulty?: Difficulty | null;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onBackToCategory: () => void;
}

interface DifficultyDetails {
  name: Difficulty;
  tagline: string;
  timeLimit: string;
  description: string;
  icon: React.ReactNode;
  badgeClass: string;
  gradient: string;
}

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  'General Knowledge': <Sparkles className="w-4 h-4 text-amber-400" />,
  'Science': <Atom className="w-4 h-4 text-emerald-400" />,
  'History': <Landmark className="w-4 h-4 text-yellow-400" />,
  'Geography': <Globe2 className="w-4 h-4 text-cyan-400" />,
  'Technology': <Cpu className="w-4 h-4 text-indigo-400" />,
  'Sports': <Trophy className="w-4 h-4 text-rose-400" />,
};

const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyDetails> = {
  'Easy': {
    name: 'Easy',
    tagline: 'Casual & Fundamentals',
    timeLimit: '30s / question',
    description: 'Accessible questions testing common knowledge, popular culture, and foundational facts.',
    icon: <Sparkles className="w-6 h-6 text-emerald-400" />,
    badgeClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    gradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
  },
  'Medium': {
    name: 'Medium',
    tagline: 'Balanced Challenge',
    timeLimit: '20s / question',
    description: 'Requires solid recall, broader domain understanding, and sharper analytical thinking.',
    icon: <Flame className="w-6 h-6 text-amber-400" />,
    badgeClass: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    gradient: 'from-amber-500/20 via-amber-500/5 to-transparent',
  },
  'Hard': {
    name: 'Hard',
    tagline: 'Mastermind Level',
    timeLimit: '15s / question',
    description: 'Rigorous trivia covering nuanced historical events, deep science, and specialized expertise.',
    icon: <Zap className="w-6 h-6 text-rose-400" />,
    badgeClass: 'text-rose-400 bg-rose-400/10 border-rose-400/30',
    gradient: 'from-rose-500/20 via-rose-500/5 to-transparent',
  },
};

export const ChooseDifficultyScreen: React.FC<ChooseDifficultyScreenProps> = ({
  category,
  initialDifficulty,
  onSelectDifficulty,
  onBackToCategory,
}) => {
  const [selected, setSelected] = useState<Difficulty | null>(initialDifficulty || null);

  const handleStart = () => {
    if (selected) {
      onSelectDifficulty(selected);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={onBackToCategory}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-850 border border-slate-800 transition-all active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Change Category</span>
        </button>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <span className="px-2.5 py-1 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
            Step 2 of 2
          </span>
          <span className="hidden sm:inline text-slate-500">· Difficulty Selection</span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-slate-800/90 shadow-2xl shadow-black/50 p-6 sm:p-10 mb-8 backdrop-blur-md">
        {/* Selected Category Header Banner */}
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner">
            <span className="text-xs text-slate-400 font-medium">Selected Category:</span>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white">
              {CATEGORY_ICONS[category]}
              <span>{category}</span>
            </div>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-amber-400 font-semibold">10 Questions</span>
          </div>
        </div>

        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            Choose Difficulty
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Select how challenging you want your questions to be.
          </p>
        </div>

        {/* 3 Difficulty Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((level) => {
            const config = DIFFICULTY_CONFIG[level];
            const isSelected = selected === level;

            return (
              <button
                key={level}
                type="button"
                onClick={() => setSelected(level)}
                className={`relative group p-6 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900/90 border-amber-400 ring-2 ring-amber-400/40 shadow-xl shadow-amber-500/10 scale-[1.02]'
                    : 'bg-slate-950/70 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/60 active:scale-[0.99]'
                }`}
              >
                {/* Background Gradient on Active/Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                    isSelected ? 'opacity-100' : ''
                  }`}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-md">
                      {config.icon}
                    </div>

                    {isSelected ? (
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/15 border border-amber-400/30 px-2.5 py-1 rounded-full animate-fadeIn">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Selected</span>
                      </div>
                    ) : (
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${config.badgeClass}`}>
                        {level}
                      </span>
                    )}
                  </div>

                  <h2 className="font-display font-bold text-xl text-white mb-1 group-hover:text-amber-300 transition-colors">
                    {level}
                  </h2>

                  <p className="text-xs font-semibold text-amber-400/90 mb-2">
                    {config.tagline}
                  </p>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-300 mb-3">
                    <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{config.timeLimit}</span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {config.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Start Quiz Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800/80">
          <div className="text-xs sm:text-sm text-slate-400 text-center sm:text-left">
            {selected ? (
              <span className="text-slate-300 font-medium">
                Quiz ready:{' '}
                <strong className="text-white font-bold">{category}</strong> at{' '}
                <strong className="text-amber-400 font-bold">{selected}</strong> difficulty
              </span>
            ) : (
              <span className="text-amber-400/90 font-medium flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                Please select a difficulty to start
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={!selected}
            onClick={handleStart}
            className={`w-full sm:w-auto flex items-center justify-center gap-2.5 py-3.5 sm:py-4 px-9 rounded-2xl font-display font-extrabold text-base sm:text-lg transition-all duration-200 ${
              selected
                ? 'bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-xl shadow-amber-500/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer'
                : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <span>Start Quiz</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
