import React, { useState } from 'react';
import {
  Atom,
  Landmark,
  Globe2,
  Cpu,
  Trophy,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { Category } from '../types/quiz';
import { CATEGORIES } from '../data/questions';

interface ChooseCategoryScreenProps {
  initialCategory?: Category | null;
  onSelectCategory: (category: Category) => void;
  onBackToHome: () => void;
}

interface CategoryInfo {
  name: Category;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

const CATEGORY_DETAILS: Record<Category, CategoryInfo> = {
  'General Knowledge': {
    name: 'General Knowledge',
    description: 'Literature, art, cinema, culture, and famous trivia from across the world.',
    icon: <Sparkles className="w-6 h-6 text-amber-400" />,
    gradient: 'from-amber-500/20 via-amber-500/5 to-transparent',
  },
  'Science': {
    name: 'Science',
    description: 'Physics, chemistry, biology, celestial astronomy, and natural phenomena.',
    icon: <Atom className="w-6 h-6 text-emerald-400" />,
    gradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
  },
  'History': {
    name: 'History',
    description: 'Ancient empires, world wars, historical leaders, and pivotal revolutions.',
    icon: <Landmark className="w-6 h-6 text-yellow-400" />,
    gradient: 'from-yellow-500/20 via-yellow-500/5 to-transparent',
  },
  'Geography': {
    name: 'Geography',
    description: 'World capitals, majestic oceans, continental mountain ranges, and borders.',
    icon: <Globe2 className="w-6 h-6 text-cyan-400" />,
    gradient: 'from-cyan-500/20 via-cyan-500/5 to-transparent',
  },
  'Technology': {
    name: 'Technology',
    description: 'Computing algorithms, hardware architecture, software, internet, and AI.',
    icon: <Cpu className="w-6 h-6 text-indigo-400" />,
    gradient: 'from-indigo-500/20 via-indigo-500/5 to-transparent',
  },
  'Sports': {
    name: 'Sports',
    description: 'Athletic legends, Olympic Games, World Cups, tennis, and sporting records.',
    icon: <Trophy className="w-6 h-6 text-rose-400" />,
    gradient: 'from-rose-500/20 via-rose-500/5 to-transparent',
  },
};

export const ChooseCategoryScreen: React.FC<ChooseCategoryScreenProps> = ({
  initialCategory,
  onSelectCategory,
  onBackToHome,
}) => {
  const [selected, setSelected] = useState<Category | null>(initialCategory || null);

  const handleContinue = () => {
    if (selected) {
      onSelectCategory(selected);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Top Header Card */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-850 border border-slate-800 transition-all active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Step Counter Indicator */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <span className="px-2.5 py-1 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
            Step 1 of 2
          </span>
          <span className="hidden sm:inline text-slate-500">· Category Selection</span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-slate-800/90 shadow-2xl shadow-black/50 p-6 sm:p-10 mb-8 backdrop-blur-md">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            Choose a Category
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Select one of the six categories below to test your expertise.
          </p>
        </div>

        {/* 6 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {CATEGORIES.map((category) => {
            const info = CATEGORY_DETAILS[category];
            const isSelected = selected === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelected(category)}
                className={`relative group p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900/90 border-amber-400 ring-2 ring-amber-400/40 shadow-xl shadow-amber-500/10 scale-[1.02]'
                    : 'bg-slate-950/70 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/60 active:scale-[0.99]'
                }`}
              >
                {/* Background Gradient on Active/Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${info.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                    isSelected ? 'opacity-100' : ''
                  }`}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-md">
                      {info.icon}
                    </div>

                    {isSelected ? (
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/15 border border-amber-400/30 px-2.5 py-1 rounded-full animate-fadeIn">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Selected</span>
                      </div>
                    ) : (
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 group-hover:text-slate-400">
                        10 Questions
                      </span>
                    )}
                  </div>

                  <h2 className="font-display font-bold text-lg sm:text-xl text-white mb-1.5 group-hover:text-amber-300 transition-colors">
                    {info.name}
                  </h2>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {info.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Continue Button Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800/80">
          <div className="text-xs sm:text-sm text-slate-400 text-center sm:text-left">
            {selected ? (
              <span className="text-slate-300 font-medium">
                Selected category: <strong className="text-amber-400 font-bold">{selected}</strong>
              </span>
            ) : (
              <span className="text-amber-400/90 font-medium flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                Please select a category to continue
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={!selected}
            onClick={handleContinue}
            className={`w-full sm:w-auto flex items-center justify-center gap-2.5 py-3.5 sm:py-4 px-8 rounded-2xl font-display font-extrabold text-base transition-all duration-200 ${
              selected
                ? 'bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-xl shadow-amber-500/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer'
                : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <span>Continue to Difficulty</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
