import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { SavedQuizResult } from '../types/quiz';
import { UserProfile } from '../types/user';
import {
  AchievementDefinition,
  AchievementProgress,
  AchievementId,
  StoredUserAchievement,
  PlayerProgressStats,
} from '../types/achievement';
import { handleFirestoreError, OperationType } from './firestoreErrors';

/**
 * List of all official Quizmaster achievements as required:
 * - First Quiz — complete your first quiz
 * - Quiz Starter — complete 5 quizzes
 * - Quiz Master — complete 10 quizzes
 * - Perfect Score — get 100% on a quiz
 * - Sports Fan — complete 5 Sports quizzes
 * - History Buff — complete 5 History quizzes
 * - Science Expert — complete 5 Science quizzes
 * - Geography Explorer — complete 5 Geography quizzes
 * - Tech Expert — complete 5 Technology quizzes
 * - General Knowledge Pro — complete 5 General Knowledge quizzes
 */
export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'first_quiz',
    title: 'First Quiz',
    description: 'Complete your first quiz challenge',
    group: 'Milestone',
    rarity: 'Bronze',
    target: 1,
    unit: 'quiz',
    badgeGradient: 'from-amber-500 via-amber-400 to-yellow-500',
    iconName: 'Trophy',
  },
  {
    id: 'quiz_starter',
    title: 'Quiz Starter',
    description: 'Complete 5 quizzes across any category',
    group: 'Milestone',
    rarity: 'Silver',
    target: 5,
    unit: 'quizzes',
    badgeGradient: 'from-slate-300 via-slate-100 to-slate-400',
    iconName: 'Flame',
  },
  {
    id: 'quiz_master',
    title: 'Quiz Master',
    description: 'Complete 10 quizzes and demonstrate your dedication',
    group: 'Milestone',
    rarity: 'Diamond',
    target: 10,
    unit: 'quizzes',
    badgeGradient: 'from-amber-300 via-yellow-400 to-amber-500',
    iconName: 'Crown',
  },
  {
    id: 'perfect_score',
    title: 'Perfect Score',
    description: 'Score a perfect 10/10 (100%) on any quiz',
    group: 'Score',
    rarity: 'Gold',
    target: 1,
    unit: 'perfect quiz',
    badgeGradient: 'from-emerald-400 via-teal-400 to-emerald-600',
    iconName: 'Target',
  },
  {
    id: 'sports_fan',
    title: 'Sports Fan',
    description: 'Complete 5 Sports quizzes',
    group: 'Category',
    rarity: 'Silver',
    target: 5,
    unit: 'Sports quizzes',
    badgeGradient: 'from-rose-500 via-red-500 to-rose-600',
    iconName: 'Trophy',
    categoryFilter: 'Sports',
  },
  {
    id: 'history_buff',
    title: 'History Buff',
    description: 'Complete 5 History quizzes',
    group: 'Category',
    rarity: 'Silver',
    target: 5,
    unit: 'History quizzes',
    badgeGradient: 'from-amber-600 via-yellow-600 to-amber-700',
    iconName: 'Landmark',
    categoryFilter: 'History',
  },
  {
    id: 'science_expert',
    title: 'Science Expert',
    description: 'Complete 5 Science quizzes',
    group: 'Category',
    rarity: 'Gold',
    target: 5,
    unit: 'Science quizzes',
    badgeGradient: 'from-emerald-500 via-green-500 to-teal-600',
    iconName: 'Atom',
    categoryFilter: 'Science',
  },
  {
    id: 'geography_explorer',
    title: 'Geography Explorer',
    description: 'Complete 5 Geography quizzes',
    group: 'Category',
    rarity: 'Silver',
    target: 5,
    unit: 'Geography quizzes',
    badgeGradient: 'from-cyan-400 via-sky-500 to-blue-600',
    iconName: 'Globe2',
    categoryFilter: 'Geography',
  },
  {
    id: 'tech_expert',
    title: 'Tech Expert',
    description: 'Complete 5 Technology quizzes',
    group: 'Category',
    rarity: 'Gold',
    target: 5,
    unit: 'Technology quizzes',
    badgeGradient: 'from-indigo-500 via-purple-500 to-indigo-700',
    iconName: 'Cpu',
    categoryFilter: 'Technology',
  },
  {
    id: 'gk_pro',
    title: 'General Knowledge Pro',
    description: 'Complete 5 General Knowledge quizzes',
    group: 'Category',
    rarity: 'Gold',
    target: 5,
    unit: 'GK quizzes',
    badgeGradient: 'from-amber-400 via-orange-400 to-amber-600',
    iconName: 'Sparkles',
    categoryFilter: 'General Knowledge',
  },
];

/**
 * Calculates the current progress value for a given achievement from quiz history.
 */
export function calculateAchievementProgressValue(
  def: AchievementDefinition,
  history: SavedQuizResult[]
): number {
  if (def.id === 'first_quiz' || def.id === 'quiz_starter' || def.id === 'quiz_master') {
    return history.length;
  }

  if (def.id === 'perfect_score') {
    const perfectCount = history.filter(
      (h) => h.percentage === 100 || (h.totalQuestions > 0 && h.score === h.totalQuestions)
    ).length;
    return perfectCount;
  }

  if (def.categoryFilter) {
    return history.filter((h) => h.category === def.categoryFilter).length;
  }

  return 0;
}

/**
 * Evaluates all achievements against the user's history and previously saved unlocks.
 */
export function evaluateAllAchievements(
  history: SavedQuizResult[],
  savedUnlocksMap: Map<string, string> = new Map()
): AchievementProgress[] {
  return ACHIEVEMENTS.map((def) => {
    const currentValue = calculateAchievementProgressValue(def, history);
    const earnedNow = currentValue >= def.target;
    const previouslyUnlocked = savedUnlocksMap.has(def.id);
    const isUnlocked = previouslyUnlocked || earnedNow;
    const unlockedAt =
      savedUnlocksMap.get(def.id) || (earnedNow ? new Date().toISOString() : null);

    const percentage = Math.min(
      100,
      Math.round((Math.min(currentValue, def.target) / def.target) * 100)
    );

    return {
      definition: def,
      isUnlocked,
      unlockedAt,
      currentValue,
      targetValue: def.target,
      percentage,
    };
  });
}

/**
 * Fetches previously saved achievements from Firestore for the given user.
 * Checks /users/{userId}/achievements subcollection and falls back to user document.
 */
export async function getSavedAchievements(
  userId: string
): Promise<Map<string, string>> {
  const unlocksMap = new Map<string, string>();

  if (!userId) return unlocksMap;

  // 1. Fetch from subcollection /users/{userId}/achievements
  try {
    const subcollectionRef = collection(db, 'users', userId, 'achievements');
    const snapshot = await getDocs(subcollectionRef);
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const achievementId = data.achievementId || docSnap.id;
      const unlockedAt = data.unlockedAt || new Date().toISOString();
      unlocksMap.set(achievementId, unlockedAt);
    });
  } catch (error) {
    console.warn('Failed to read from users/{userId}/achievements:', error);
  }

  return unlocksMap;
}

/**
 * Automatically unlocks achievements based on the user's Firestore quiz history,
 * saves newly unlocked achievements to Firestore under /users/{userId}/achievements,
 * and updates the user profile record.
 * Returns the list of newly unlocked achievements to trigger notifications.
 */
export async function syncAndSaveAchievements(
  userId: string,
  history: SavedQuizResult[]
): Promise<{
  newlyUnlocked: AchievementDefinition[];
  allProgress: AchievementProgress[];
}> {
  const currentUid = auth.currentUser?.uid;
  if (!currentUid || currentUid !== userId) {
    // Return evaluated in-memory progress without saving if not authenticated as this user
    const progress = evaluateAllAchievements(history);
    return { newlyUnlocked: [], allProgress: progress };
  }

  // 1. Load currently saved achievements from Firestore
  const savedMap = await getSavedAchievements(userId);

  // 2. Evaluate all achievements against the full history
  const allProgress = evaluateAllAchievements(history, savedMap);

  const newlyUnlocked: AchievementDefinition[] = [];
  const now = new Date().toISOString();

  // 3. Identify and persist any newly unlocked achievements
  for (const item of allProgress) {
    if (item.isUnlocked && !savedMap.has(item.definition.id)) {
      newlyUnlocked.push(item.definition);

      const payload: StoredUserAchievement = {
        userId,
        achievementId: item.definition.id,
        title: item.definition.title,
        description: item.definition.description,
        unlockedAt: item.unlockedAt || now,
        category: item.definition.categoryFilter || item.definition.group,
      };

      // Save to subcollection: /users/{userId}/achievements/{achievementId}
      try {
        const achievementDocRef = doc(
          db,
          'users',
          userId,
          'achievements',
          item.definition.id
        );
        await setDoc(achievementDocRef, payload, { merge: true });
        savedMap.set(item.definition.id, payload.unlockedAt);
      } catch (err) {
        console.warn(`Failed saving achievement ${item.definition.id} to Firestore:`, err);
      }
    }
  }

  // 4. Update the user document's unlockedAchievements array
  if (newlyUnlocked.length > 0) {
    try {
      const userDocRef = doc(db, 'users', userId);
      const allUnlockedIds = Array.from(savedMap.keys());
      await updateDoc(userDocRef, {
        unlockedAchievements: allUnlockedIds,
      });
    } catch (err) {
      console.warn('Failed updating user doc with unlocked achievements:', err);
    }
  }

  return {
    newlyUnlocked,
    allProgress,
  };
}

/**
 * Aggregates all progress statistics for the "My Progress" dashboard section:
 * - Total quizzes completed
 * - Total questions answered
 * - Total correct answers
 * - Overall accuracy percentage
 * - Highest score
 * - Best percentage
 * - Current leaderboard position
 */
export function calculatePlayerProgressStats(
  history: SavedQuizResult[],
  userProfile?: UserProfile | null,
  leaderboardRank: number | null = null,
  totalPlayers: number = 0
): PlayerProgressStats {
  const totalQuizzesCompleted = history.length;

  const totalQuestionsAnswered = history.reduce(
    (sum, item) => sum + (Number(item.totalQuestions) || 10),
    0
  );

  const totalCorrectAnswers = history.reduce(
    (sum, item) => sum + (Number(item.correctAnswers) || Number(item.score) || 0),
    0
  );

  const overallAccuracy =
    totalQuestionsAnswered > 0
      ? Math.round((totalCorrectAnswers / totalQuestionsAnswered) * 100)
      : totalQuizzesCompleted > 0 && userProfile?.highScore
      ? Math.round(((userProfile.highScore || 0) / 10) * 100)
      : 0;

  const highestScore = Math.max(
    0,
    userProfile?.highScore ?? 0,
    ...history.map((h) => Number(h.score) || 0)
  );

  const bestPercentage = Math.max(
    0,
    ...history.map((h) => Number(h.percentage) || 0),
    highestScore > 0 ? Math.round((highestScore / 10) * 100) : 0
  );

  return {
    totalQuizzesCompleted,
    totalQuestionsAnswered,
    totalCorrectAnswers,
    overallAccuracy,
    highestScore,
    bestPercentage,
    leaderboardRank,
    totalPlayers,
  };
}
