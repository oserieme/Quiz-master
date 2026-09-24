import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QuizState, Question, UserAnswerRecord, QuizResults, Category, Difficulty } from './types/quiz';
import { getQuizQuestions } from './data/questions';
import { getQuizQuestionsFromFirestore } from './services/questionService';
import { AuthProvider, useAuth } from './context/AuthContext';
import { saveQuizResult, getUserQuizHistory } from './services/quizService';
import { syncAndSaveAchievements } from './services/achievementService';
import { AchievementDefinition } from './types/achievement';
import { AchievementToast } from './components/AchievementToast';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { ChooseCategoryScreen } from './components/ChooseCategoryScreen';
import { ChooseDifficultyScreen } from './components/ChooseDifficultyScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { ProfileDashboard } from './components/ProfileDashboard';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { SignInModal } from './components/SignInModal';
import { Footer } from './components/Footer';
import { Loader2 } from 'lucide-react';
import { sound } from './utils/audio';

const HIGH_SCORE_KEY = 'quiz_master_high_score';

function QuizApp() {
  const { user, signOutUser } = useAuth();
  const [quizState, setQuizState] = useState<QuizState>('HOME');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<QuizResults | null>(null);
  const [highScore, setHighScore] = useState<number | null>(null);
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSignInOpen, setIsSignInOpen] = useState<boolean>(false);
  const [unlockedToasts, setUnlockedToasts] = useState<AchievementDefinition[]>([]);
  const [isLoadingQuizQuestions, setIsLoadingQuizQuestions] = useState<boolean>(false);

  // Auto-dismiss achievement notifications
  useEffect(() => {
    if (unlockedToasts.length === 0) return;
    const timer = setTimeout(() => {
      setUnlockedToasts((prev) => prev.slice(1));
    }, 6000);
    return () => clearTimeout(timer);
  }, [unlockedToasts]);

  const handleDismissToast = useCallback((id: string) => {
    setUnlockedToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleAchievementUnlocked = useCallback(
    (newAchievements: AchievementDefinition[]) => {
      setUnlockedToasts((prev) => {
        const existingIds = new Set(prev.map((a) => a.id));
        const novel = newAchievements.filter((a) => !existingIds.has(a.id));
        return [...prev, ...novel];
      });
    },
    []
  );

  // Load initial high score & mute settings from localStorage
  useEffect(() => {
    try {
      const savedScore = localStorage.getItem(HIGH_SCORE_KEY);
      if (savedScore !== null) {
        setHighScore(parseInt(savedScore, 10));
      }
      setIsMuted(sound.isMuted());
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const handleToggleSound = useCallback(() => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  }, []);

  const handleOpenSignIn = useCallback(() => {
    setIsSignInOpen(true);
  }, []);

  const handleCloseSignIn = useCallback(() => {
    setIsSignInOpen(false);
  }, []);

  const handleSignInSuccess = useCallback(() => {
    setIsSignInOpen(false);
    if (quizState === 'HOME') {
      sound.playSelect();
      setQuizState('CHOOSE_CATEGORY');
    }
  }, [quizState]);

  // Open Quizmaster Profile / Dashboard
  const handleOpenProfile = useCallback(() => {
    sound.playSelect();
    setQuizState('PROFILE');
  }, []);

  // Open Global Leaderboard
  const handleOpenLeaderboard = useCallback(() => {
    sound.playSelect();
    setQuizState('LEADERBOARD');
  }, []);

  // Requirement 7 & 8: Sign out of Firebase Auth and return to Google Sign-In screen
  const handleSignOut = useCallback(async () => {
    sound.playSelect();
    await signOutUser();
    setQuizState('HOME');
  }, [signOutUser]);

  // If authentication state changes to signed out while viewing PROFILE, return to HOME
  useEffect(() => {
    if (!user && quizState === 'PROFILE') {
      setQuizState('HOME');
    }
  }, [user, quizState]);

  // Home -> Step 1: Choose Category
  const handleStartSetup = useCallback(() => {
    sound.playSelect();
    setQuizState('CHOOSE_CATEGORY');
  }, []);

  // Step 1: Category Selected -> Step 2: Choose Difficulty
  const handleSelectCategory = useCallback((category: Category) => {
    sound.playSelect();
    setSelectedCategory(category);
    setQuizState('CHOOSE_DIFFICULTY');
  }, []);

  // Back from Choose Difficulty -> Choose Category
  const handleBackToCategory = useCallback(() => {
    sound.playSelect();
    setQuizState('CHOOSE_CATEGORY');
  }, []);

  // Back from Choose Category -> Home
  const handleBackToHome = useCallback(() => {
    sound.playSelect();
    setQuizState('HOME');
  }, []);

  // Open Admin Dashboard
  const handleOpenAdmin = useCallback(() => {
    sound.playSelect();
    setQuizState('ADMIN');
  }, []);

  // Step 2: Difficulty Selected -> Start Quiz (Fetch from Firestore)
  const handleStartQuizWithDifficulty = useCallback(async (difficulty: Difficulty) => {
    if (!selectedCategory) return;
    sound.playSelect();
    setSelectedDifficulty(difficulty);
    setIsLoadingQuizQuestions(true);

    try {
      // Retrieve questions dynamically from Firestore collection
      const fetched = await getQuizQuestionsFromFirestore(selectedCategory, difficulty, 10);
      setQuestions(fetched);
    } catch (err) {
      console.warn('Failed to retrieve questions from Firestore, using fallback:', err);
      const fallback = getQuizQuestions(selectedCategory, difficulty, 10);
      setQuestions(fallback);
    } finally {
      setIsLoadingQuizQuestions(false);
      setResults(null);
      setIsNewHighScore(false);
      setQuizState('QUIZ');
    }
  }, [selectedCategory]);

  // Helper to format seconds nicely
  const formatTimeTaken = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Quiz completion handler
  const handleCompleteQuiz = useCallback(
    async (
      answers: UserAnswerRecord[],
      totalScore: number,
      timeTakenSeconds: number = 30
    ) => {
      if (!selectedCategory || !selectedDifficulty) return;

      const totalQuestions = answers.length;
      const correctCount = totalScore;
      const incorrectCount = totalQuestions - correctCount;
      const percentage = Math.round((correctCount / totalQuestions) * 100);
      const timeTakenFormatted = formatTimeTaken(timeTakenSeconds);
      const completedIso = new Date().toISOString();

      // Check personal best
      let isNewRecord = false;
      try {
        const prevHigh = highScore ?? 0;
        if (totalScore > prevHigh) {
          isNewRecord = true;
          setHighScore(totalScore);
          localStorage.setItem(HIGH_SCORE_KEY, String(totalScore));
        }
      } catch {
        // Ignore
      }

      setIsNewHighScore(isNewRecord);

      // Initialize result object
      const newResult: QuizResults = {
        totalScore,
        totalQuestions,
        correctCount,
        incorrectCount,
        percentage,
        category: selectedCategory,
        difficulty: selectedDifficulty,
        timeTaken: timeTakenSeconds,
        timeTakenFormatted,
        answers,
        isSavedToFirestore: false,
      };

      setResults(newResult);
      setQuizState('RESULTS');

      // If user is authenticated with Firebase, save result to Firestore
      if (user?.uid) {
        try {
          const docId = await saveQuizResult({
            userId: user.uid,
            userName:
              user.displayName ||
              user.email?.split('@')[0] ||
              'Quiz Player',
            displayName:
              user.displayName ||
              user.email?.split('@')[0] ||
              'Quiz Player',
            userEmail: user.email || '',
            email: user.email || '',
            category: selectedCategory,
            difficulty: selectedDifficulty,
            totalQuestions,
            correctAnswers: correctCount,
            incorrectAnswers: incorrectCount,
            score: totalScore,
            percentage,
            timeTaken: timeTakenSeconds,
            timeTakenFormatted,
            completedAt: completedIso,
          });

          setResults((prev) =>
            prev
              ? {
                  ...prev,
                  savedResultId: docId,
                  isSavedToFirestore: true,
                }
              : null
          );

          // Requirement 4 & 5 & 7: Automatically evaluate, persist and notify unlocked achievements
          try {
            const updatedHistory = await getUserQuizHistory(user.uid);
            const { newlyUnlocked } = await syncAndSaveAchievements(
              user.uid,
              updatedHistory
            );
            if (newlyUnlocked.length > 0) {
              sound.playAchievement();
              setUnlockedToasts((prev) => {
                const existing = new Set(prev.map((p) => p.id));
                const novel = newlyUnlocked.filter((n) => !existing.has(n.id));
                return [...prev, ...novel];
              });
            }
          } catch (achErr) {
            console.warn('Could not sync achievements after quiz completion:', achErr);
          }
        } catch (saveError) {
          console.error('Could not save quiz result to Firestore:', saveError);
        }
      }
    },
    [highScore, selectedCategory, selectedDifficulty, user]
  );

  // Return to home
  const handleGoHome = useCallback(() => {
    sound.playSelect();
    setQuizState('HOME');
  }, []);

  // Play Again: immediately restarts quiz with same Category and Difficulty
  const handlePlayAgain = useCallback(() => {
    if (!selectedCategory || !selectedDifficulty) {
      setQuizState('CHOOSE_CATEGORY');
      return;
    }
    sound.playSelect();
    const newQuestions = getQuizQuestions(selectedCategory, selectedDifficulty, 10);
    setQuestions(newQuestions);
    setResults(null);
    setIsNewHighScore(false);
    setQuizState('QUIZ');
  }, [selectedCategory, selectedDifficulty]);

  return (
    <div className="min-h-screen bg-slate-950 bg-mesh text-slate-100 flex flex-col antialiased selection:bg-amber-400 selection:text-slate-950">
      <Header
        quizState={quizState}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        onHomeClick={handleGoHome}
        onOpenSignIn={handleOpenSignIn}
        onOpenProfile={handleOpenProfile}
        onOpenLeaderboard={handleOpenLeaderboard}
        onOpenAdmin={handleOpenAdmin}
        onSignOut={handleSignOut}
        highScore={highScore}
      />

      <main className="flex-1 flex flex-col justify-center relative overflow-hidden">
        {/* Loading overlay when querying Firestore questions */}
        {isLoadingQuizQuestions && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md">
            <Loader2 className="w-10 h-10 text-amber-400 animate-spin mb-3" />
            <p className="text-white font-display font-semibold text-lg">
              Loading Questions from Firestore...
            </p>
            <p className="text-slate-400 text-xs mt-1">
              Preparing quiz for {selectedCategory} ({selectedDifficulty})
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* SCREEN 1: Home */}
          {quizState === 'HOME' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full"
            >
              <HomeScreen
                onStartSetup={handleStartSetup}
                onSelectCategory={handleSelectCategory}
                onOpenSignIn={handleOpenSignIn}
                onOpenProfile={handleOpenProfile}
                onOpenLeaderboard={handleOpenLeaderboard}
                onOpenAdmin={handleOpenAdmin}
                highScore={highScore}
              />
            </motion.div>
          )}

          {/* SCREEN 2: Choose Category */}
          {quizState === 'CHOOSE_CATEGORY' && (
            <motion.div
              key="choose-category"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full"
            >
              <ChooseCategoryScreen
                initialCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
                onBackToHome={handleBackToHome}
              />
            </motion.div>
          )}

          {/* SCREEN 3: Choose Difficulty */}
          {quizState === 'CHOOSE_DIFFICULTY' && selectedCategory && (
            <motion.div
              key="choose-difficulty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full"
            >
              <ChooseDifficultyScreen
                category={selectedCategory}
                initialDifficulty={selectedDifficulty}
                onSelectDifficulty={handleStartQuizWithDifficulty}
                onBackToCategory={handleBackToCategory}
              />
            </motion.div>
          )}

          {/* SCREEN 4: Quiz */}
          {quizState === 'QUIZ' && questions.length > 0 && selectedCategory && selectedDifficulty && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full"
            >
              <QuizScreen
                questions={questions}
                category={selectedCategory}
                difficulty={selectedDifficulty}
                onCompleteQuiz={handleCompleteQuiz}
              />
            </motion.div>
          )}

          {/* SCREEN 5: Results */}
          {quizState === 'RESULTS' && results && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full"
            >
              <ResultsScreen
                results={results}
                onPlayAgain={handlePlayAgain}
                onGoHome={handleGoHome}
                onOpenSignIn={handleOpenSignIn}
                onOpenProfile={handleOpenProfile}
                onOpenLeaderboard={handleOpenLeaderboard}
                isNewHighScore={isNewHighScore}
              />
            </motion.div>
          )}

          {/* SCREEN 6: Profile & Dashboard */}
          {quizState === 'PROFILE' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full"
            >
              <ProfileDashboard
                onBackToHome={handleGoHome}
                onStartQuiz={handleStartSetup}
                onSignOut={handleSignOut}
                highScore={highScore}
                onOpenLeaderboard={handleOpenLeaderboard}
                onAchievementUnlocked={handleAchievementUnlocked}
                onSelectCategoryAndStartQuiz={(category) => {
                  handleSelectCategory(category);
                }}
              />
            </motion.div>
          )}

          {/* SCREEN 7: Global Leaderboard */}
          {quizState === 'LEADERBOARD' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full"
            >
              <LeaderboardScreen
                onBackToHome={handleGoHome}
                onStartQuiz={handleStartSetup}
                onOpenSignIn={handleOpenSignIn}
                onSelectCategoryAndPlay={(category) => {
                  handleSelectCategory(category);
                }}
              />
            </motion.div>
          )}

          {/* SCREEN 8: Admin Question Management Dashboard */}
          {quizState === 'ADMIN' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full"
            >
              <AdminDashboard
                onBackToHome={handleGoHome}
                onStartQuizWithCategory={(category) => {
                  handleSelectCategory(category);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Achievement Unlock Notifications (Requirement 7) */}
      <AchievementToast
        achievements={unlockedToasts}
        onDismiss={handleDismissToast}
      />

      {/* Sign-In Modal */}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={handleCloseSignIn}
        onContinueAsGuest={handleCloseSignIn}
        onSuccess={handleSignInSuccess}
      />

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <QuizApp />
    </AuthProvider>
  );
}
