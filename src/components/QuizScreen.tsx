import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Check,
  X,
  ArrowRight,
  Lightbulb,
  Trophy,
  Atom,
  Landmark,
  Globe2,
  Cpu,
  Sparkles,
  Flame,
  Zap,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Question, UserAnswerRecord, Category, Difficulty } from '../types/quiz';
import { sound } from '../utils/audio';

interface QuizScreenProps {
  questions: Question[];
  category: Category;
  difficulty: Difficulty;
  onCompleteQuiz: (answers: UserAnswerRecord[], score: number, timeTakenSeconds: number) => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  'General Knowledge': <Sparkles className="w-3.5 h-3.5 text-amber-400" />,
  'Science': <Atom className="w-3.5 h-3.5 text-emerald-400" />,
  'History': <Landmark className="w-3.5 h-3.5 text-yellow-400" />,
  'Geography': <Globe2 className="w-3.5 h-3.5 text-cyan-400" />,
  'Technology': <Cpu className="w-3.5 h-3.5 text-indigo-400" />,
  'Sports': <Trophy className="w-3.5 h-3.5 text-rose-400" />,
};

const DIFFICULTY_BADGE_STYLE: Record<Difficulty, { badge: string; icon: React.ReactNode }> = {
  'Easy': {
    badge: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/25',
    icon: <Sparkles className="w-3 h-3 text-emerald-400" />
  },
  'Medium': {
    badge: 'text-amber-400 bg-amber-400/10 border-amber-400/25',
    icon: <Flame className="w-3 h-3 text-amber-400" />
  },
  'Hard': {
    badge: 'text-rose-400 bg-rose-400/10 border-rose-400/25',
    icon: <Zap className="w-3 h-3 text-rose-400" />
  }
};

/**
 * Returns the exact per-question countdown duration based on difficulty:
 * Easy: 30s | Medium: 20s | Hard: 15s
 */
const getTimeLimitForDifficulty = (diff: Difficulty): number => {
  switch (diff) {
    case 'Easy':
      return 30;
    case 'Medium':
      return 20;
    case 'Hard':
      return 15;
  }
};

type QuestionStatus = 'unanswered' | 'answered' | 'timed_out';

export const QuizScreen: React.FC<QuizScreenProps> = ({
  questions,
  category,
  difficulty,
  onCompleteQuiz,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionStatus, setQuestionStatus] = useState<QuestionStatus>('unanswered');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<UserAnswerRecord[]>([]);
  const [score, setScore] = useState(0);

  const totalTimeLimit = getTimeLimitForDifficulty(difficulty);
  const [timeLeft, setTimeLeft] = useState(totalTimeLimit);

  // Interval reference for countdown timer
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timeout reference for automatic transition when timer reaches zero
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // References to keep callbacks stable and avoid re-triggering timer effects
  const questionStatusRef = useRef<QuestionStatus>('unanswered');
  questionStatusRef.current = questionStatus;

  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;

  const answersRef = useRef<UserAnswerRecord[]>([]);
  answersRef.current = answers;

  const scoreRef = useRef(score);
  scoreRef.current = score;

  const quizStartTimeRef = useRef<number>(Date.now());

  const currentQuestion = questions[currentIndex];
  const isQuestionFinished = questionStatus !== 'unanswered';
  const isLastQuestion = currentIndex === questions.length - 1;

  // Reliable, single cleanup function for both countdown and auto-advance timers
  const clearTimers = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (autoAdvanceTimerRef.current !== null) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  }, []);

  // Advance to next question or complete quiz
  const advanceToNext = useCallback(
    (currentAnswers: UserAnswerRecord[], currentScore: number) => {
      clearTimers();

      if (currentIndexRef.current >= questions.length - 1) {
        const totalDurationSeconds = Math.max(
          1,
          Math.round((Date.now() - quizStartTimeRef.current) / 1000)
        );
        onCompleteQuiz(currentAnswers, currentScore, totalDurationSeconds);
      } else {
        setCurrentIndex((prev) => prev + 1);
        setQuestionStatus('unanswered');
        setSelectedOption(null);
        setTimeLeft(totalTimeLimit);
      }
    },
    [clearTimers, onCompleteQuiz, questions.length, totalTimeLimit]
  );

  // Handle timer reaching zero (Requirement 6: Automatically move to next question)
  const handleTimeExpired = useCallback(() => {
    // Stop countdown timer
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Guard: only apply timeout if still unanswered
    if (questionStatusRef.current !== 'unanswered') return;

    setQuestionStatus('timed_out');
    setTimeLeft(0);
    sound.playTimeout();

    const q = questions[currentIndexRef.current];
    const timeoutRecord: UserAnswerRecord = {
      questionId: q.id,
      questionText: q.question,
      category: q.category,
      difficulty: q.difficulty,
      options: q.options,
      selectedIndex: -1,
      correctIndex: q.correctAnswerIndex,
      isCorrect: false,
      isTimedOut: true,
      explanation: q.explanation,
    };

    const updatedAnswers = [...answersRef.current, timeoutRecord];
    setAnswers(updatedAnswers);
    answersRef.current = updatedAnswers;

    // Requirement 6: Automatically move to the next question when the timer reaches zero
    // Brief 1.5s delay so the user sees the time expired notification and the correct answer
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
    }
    autoAdvanceTimerRef.current = setTimeout(() => {
      advanceToNext(updatedAnswers, scoreRef.current);
    }, 1500);
  }, [advanceToNext, questions]);

  // Handle player selecting an answer
  const handleSelectOption = useCallback(
    (optionIndex: number) => {
      // 1. Prevent selecting if already answered or timed out
      if (questionStatusRef.current !== 'unanswered') return;

      // 2. Immediately stop and clear timers
      clearTimers();

      // 3. Mark as answered and record selection
      setQuestionStatus('answered');
      setSelectedOption(optionIndex);

      const q = questions[currentIndexRef.current];
      const isCorrect = optionIndex === q.correctAnswerIndex;

      // 4. Update score & play feedback sound
      let newScore = scoreRef.current;
      if (isCorrect) {
        newScore += 1;
        setScore(newScore);
        scoreRef.current = newScore;
        sound.playCorrect();
      } else {
        sound.playIncorrect();
      }

      // 5. Record the answer
      const answerRecord: UserAnswerRecord = {
        questionId: q.id,
        questionText: q.question,
        category: q.category,
        difficulty: q.difficulty,
        options: q.options,
        selectedIndex: optionIndex,
        correctIndex: q.correctAnswerIndex,
        isCorrect,
        isTimedOut: false,
        explanation: q.explanation,
      };

      const updatedAnswers = [...answersRef.current, answerRecord];
      setAnswers(updatedAnswers);
      answersRef.current = updatedAnswers;
    },
    [clearTimers, questions]
  );

  // Handle proceeding to the next question or viewing results
  const handleProceed = useCallback(() => {
    // Only allow proceeding if the current question is answered or timed out
    if (questionStatusRef.current === 'unanswered') return;

    sound.playSelect();
    advanceToNext(answersRef.current, scoreRef.current);
  }, [advanceToNext]);

  // Timer lifecycle: starts exactly ONE timer per question, cleaned up on change or unmount
  useEffect(() => {
    // Always clear any previous timer first
    clearTimers();

    // Reset countdown for this new question
    setTimeLeft(totalTimeLimit);

    // Start single interval for this question
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        // If already answered or timed out, stop
        if (questionStatusRef.current !== 'unanswered') {
          if (timerRef.current !== null) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return prev;
        }

        if (prev <= 1) {
          handleTimeExpired();
          return 0;
        }

        const next = prev - 1;
        // Subtle audio tick on urgent seconds (3, 2, 1)
        if (next <= 3 && next > 0) {
          sound.playUrgentTick();
        }
        return next;
      });
    }, 1000);

    // Cleanup on unmount or question change
    return () => {
      clearTimers();
    };
  }, [clearTimers, currentIndex, handleTimeExpired, totalTimeLimit]);

  // Keyboard shortcut listeners (1-4, A-D for options; Enter/Space for Next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (!isQuestionFinished) {
        if (e.key === '1' || e.key.toLowerCase() === 'a') {
          e.preventDefault();
          handleSelectOption(0);
        } else if (e.key === '2' || e.key.toLowerCase() === 'b') {
          e.preventDefault();
          handleSelectOption(1);
        } else if (e.key === '3' || e.key.toLowerCase() === 'c') {
          e.preventDefault();
          handleSelectOption(2);
        } else if (e.key === '4' || e.key.toLowerCase() === 'd') {
          e.preventDefault();
          handleSelectOption(3);
        }
      } else {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleProceed();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleProceed, handleSelectOption, isQuestionFinished]);

  const progressPercentage = Math.round(((currentIndex + 1) / questions.length) * 100);
  const timePercentage = Math.max(0, Math.min(100, (timeLeft / totalTimeLimit) * 100));

  // Determine timer visual urgency
  const isWarning = timeLeft <= 5 && timeLeft > 3 && !isQuestionFinished;
  const isUrgent = timeLeft <= 3 && timeLeft > 0 && !isQuestionFinished;
  const isExpired = questionStatus === 'timed_out' || (timeLeft === 0 && !isQuestionFinished);

  let timerBadgeStyles = 'bg-slate-950/80 border-slate-800 text-slate-200';
  if (isExpired) {
    timerBadgeStyles = 'bg-rose-950/60 border-rose-500/80 text-rose-300 font-bold ring-1 ring-rose-500/40';
  } else if (isUrgent) {
    timerBadgeStyles = 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold ring-2 ring-rose-500/50 animate-pulse shadow-lg shadow-rose-500/20';
  } else if (isWarning) {
    timerBadgeStyles = 'bg-amber-500/15 border-amber-400 text-amber-300 font-bold shadow-md shadow-amber-500/10';
  }

  const diffBadge = DIFFICULTY_BADGE_STYLE[difficulty];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 sm:py-10">
      {/* Top HUD Card: Progress Info, Category, Difficulty, Score, and Countdown Timer */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-lg shadow-black/20 mb-6 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-medium mb-3">
          {/* Category & Difficulty Badges */}
          <div className="flex items-center flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-white font-semibold text-xs shadow-sm">
              {CATEGORY_ICONS[category]}
              <span>{category}</span>
            </span>

            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold ${diffBadge.badge}`}>
              {diffBadge.icon}
              <span>{difficulty}</span>
            </span>

            <span aria-hidden="true" className="text-slate-600 hidden xs:inline">·</span>

            <span className="text-slate-300">
              Question <strong className="text-white font-bold">{currentIndex + 1}</strong> of {questions.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Prominent Countdown Timer Display */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs sm:text-sm tabular-nums transition-all duration-200 ${timerBadgeStyles}`}
              aria-label={`Time remaining: ${timeLeft} seconds`}
            >
              <Clock
                className={`w-3.5 h-3.5 shrink-0 ${
                  isUrgent ? 'animate-spin text-rose-400' : isWarning ? 'text-amber-400' : 'text-slate-400'
                }`}
              />
              <span className="font-mono font-bold">
                Time: {timeLeft}s
              </span>
            </div>

            {/* Current Score Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950/80 border border-slate-800 tabular-nums font-semibold text-slate-300 text-xs sm:text-sm shadow-inner">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Score: <span className="text-amber-400 font-bold">{score}</span></span>
            </div>
          </div>
        </div>

        {/* Question Progress Bar */}
        <div className="mb-2">
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-300 ease-out shadow-sm shadow-amber-400/30"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1.5 px-0.5 font-medium">
            <span>Overall Progress</span>
            <span>{progressPercentage}% Completed</span>
          </div>
        </div>

        {/* Timer Dynamic Countdown Bar */}
        <div>
          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/60">
            <div
              className={`h-full transition-all duration-1000 ease-linear rounded-full ${
                isUrgent || isExpired
                  ? 'bg-rose-500 shadow-sm shadow-rose-500/50'
                  : isWarning
                  ? 'bg-amber-400 shadow-sm shadow-amber-400/50'
                  : 'bg-emerald-400 shadow-sm shadow-emerald-400/30'
              }`}
              style={{ width: `${timePercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-gradient-to-b from-slate-900/90 to-slate-900/60 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl shadow-black/40 mb-6 backdrop-blur-sm relative overflow-hidden">
        {/* Subtle decorative glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Time's Up Banner if time expired before answer */}
        {questionStatus === 'timed_out' && (
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-rose-950/50 border border-rose-500/60 flex items-center gap-3 text-rose-200 animate-fadeIn shadow-lg shadow-rose-500/10">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-bold text-white">Time's Up!</p>
              <p className="text-xs sm:text-sm text-rose-300">
                Time expired before an answer was selected. This question has been marked incorrect.
              </p>
            </div>
          </div>
        )}

        {/* Question Title */}
        <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white leading-snug sm:leading-relaxed mb-6 sm:mb-8 text-balance">
          {currentQuestion.question}
        </h2>

        {/* Four Answer Choices */}
        <div className="space-y-3 sm:space-y-3.5" role="radiogroup" aria-label="Answer options">
          {currentQuestion.options.map((option, idx) => {
            const letter = OPTION_LETTERS[idx];
            const isSelected = selectedOption === idx;
            const isCorrectAnswer = idx === currentQuestion.correctAnswerIndex;

            let optionStyles = 'bg-slate-950/70 border-slate-800/90 text-slate-100 hover:border-amber-400/50 hover:bg-slate-900/90 shadow-sm';
            let badgeStyles = 'bg-slate-900 border-slate-700/80 text-slate-300';
            let statusIcon: React.ReactNode = null;
            let statusText: string | null = null;

            if (isQuestionFinished) {
              if (isCorrectAnswer) {
                // Correct answer is always highlighted in emerald green
                optionStyles = 'bg-emerald-950/40 border-emerald-500 text-white font-medium ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-500/10';
                badgeStyles = 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold';
                statusIcon = <Check className="w-5 h-5 text-emerald-400 shrink-0" />;
                statusText = isSelected ? 'Correct!' : 'Correct Answer';
              } else if (isSelected && !isCorrectAnswer) {
                // Selected wrong answer highlighted in rose
                optionStyles = 'bg-rose-950/40 border-rose-500 text-white font-medium ring-2 ring-rose-500/40 shadow-lg shadow-rose-500/10';
                badgeStyles = 'bg-rose-500 text-white border-rose-400 font-bold';
                statusIcon = <X className="w-5 h-5 text-rose-400 shrink-0" />;
                statusText = 'Incorrect';
              } else {
                // Other non-selected options dimmed
                optionStyles = 'bg-slate-950/30 border-slate-900/60 text-slate-500 opacity-50';
                badgeStyles = 'bg-slate-950 border-slate-900 text-slate-600';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isQuestionFinished}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-150 flex items-center justify-between gap-3.5 min-h-[64px] sm:min-h-[70px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${optionStyles} ${
                  !isQuestionFinished ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default'
                }`}
              >
                <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold border shrink-0 transition-colors shadow-sm ${badgeStyles}`}
                  >
                    {letter}
                  </div>
                  <span className="text-sm sm:text-base md:text-lg leading-relaxed break-words font-medium">
                    {option}
                  </span>
                </div>

                {statusIcon && (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs sm:text-sm font-semibold hidden sm:inline ${
                      isCorrectAnswer ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {statusText}
                    </span>
                    {statusIcon}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Immediate Educational Explanation Card */}
        {isQuestionFinished && (
          <div className="mt-6 pt-5 border-t border-slate-800/90 animate-fadeIn">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-3.5 shadow-inner">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0 mt-0.5">
                <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-xs sm:text-sm leading-relaxed text-slate-300">
                <strong className="text-amber-400 font-bold block mb-1">Knowledge Brief:</strong>
                {currentQuestion.explanation}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Next Question / Finish Action Bar (Always visible with appropriate active/disabled states) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="text-xs text-slate-400 order-2 sm:order-1 text-center sm:text-left">
          {questionStatus === 'timed_out' ? (
            <span className="inline-flex items-center gap-1.5 text-rose-300 font-medium animate-pulse">
              <Clock className="w-3.5 h-3.5 text-rose-400" />
              <span>Time expired! Automatically moving to next question...</span>
            </span>
          ) : isQuestionFinished ? (
            <span className="hidden sm:inline">
              Tip: Press <kbd className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 font-mono text-[11px] shadow-sm">Enter</kbd> or <kbd className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 font-mono text-[11px] shadow-sm">Space</kbd> to proceed
            </span>
          ) : (
            <span className="text-slate-500">
              Select one of the 4 options above to record your answer
            </span>
          )}
        </div>

        <button
          type="button"
          disabled={!isQuestionFinished}
          onClick={handleProceed}
          className={`w-full sm:w-auto order-1 sm:order-2 flex items-center justify-center gap-2.5 py-4 px-8 rounded-2xl font-display font-extrabold text-base sm:text-lg transition-all duration-150 ${
            isQuestionFinished
              ? 'bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-xl shadow-amber-500/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer'
              : 'bg-slate-900/80 border border-slate-800 text-slate-500 cursor-not-allowed opacity-60'
          }`}
        >
          <span>{isLastQuestion ? 'View Results' : 'Next Question'}</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
