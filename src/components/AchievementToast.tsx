import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Sparkles, X } from 'lucide-react';
import { AchievementDefinition } from '../types/achievement';

interface AchievementToastProps {
  achievements: AchievementDefinition[];
  onDismiss: (id: string) => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({
  achievements,
  onDismiss,
}) => {
  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4 sm:px-0"
      aria-live="polite"
      role="region"
      aria-label="Achievement notifications"
    >
      <AnimatePresence>
        {achievements.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: 'spring', damping: 22, stiffness: 320 }}
            className="pointer-events-auto relative p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-400/80 shadow-2xl shadow-amber-500/25 overflow-hidden flex items-start gap-3.5 backdrop-blur-md"
          >
            {/* Soft decorative glow */}
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />

            {/* Glowing Icon Badge */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30 text-slate-950">
              <Trophy className="w-6 h-6 stroke-[2.5]" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-6">
              <div className="flex items-center gap-1.5 text-amber-400 text-[11px] font-bold uppercase tracking-wider mb-0.5">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>Achievement Unlocked!</span>
              </div>
              <h4 className="font-display font-extrabold text-white text-sm sm:text-base leading-snug truncate">
                {item.title}
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => onDismiss(item.id)}
              className="absolute top-2.5 right-2.5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              aria-label={`Dismiss ${item.title} notification`}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Bottom accent bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
