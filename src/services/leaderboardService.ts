import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  LeaderboardEntry,
  LeaderboardCategoryFilter,
  LeaderboardTimeFilter,
} from '../types/quiz';
import { handleFirestoreError, OperationType } from './firestoreErrors';

export interface LeaderboardResult {
  entries: LeaderboardEntry[];
  currentUserEntry: LeaderboardEntry | null;
  currentUserRank: number | null;
  totalParticipants: number;
}

/**
 * Calculates start timestamp based on the selected time filter
 */
function getTimeThreshold(filter: LeaderboardTimeFilter): number | null {
  const now = new Date();
  if (filter === 'This Week') {
    // Past 7 rolling days
    return Date.now() - 7 * 24 * 60 * 60 * 1000;
  }
  if (filter === 'This Month') {
    // Start of current month (UTC)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return startOfMonth.getTime();
  }
  return null; // All Time
}

interface PlayerStatsAccumulator {
  userId: string;
  displayName: string;
  photoURL?: string;
  totalScore: number;
  quizzesCompleted: number;
  percentageSum: number;
  highestScore: number;
  bestTime: number;
}

/**
 * Fetches quiz results from Firestore and calculates leaderboard rankings
 * without exposing sensitive user information (e.g. email addresses).
 */
export async function getLeaderboard(
  categoryFilter: LeaderboardCategoryFilter = 'Overall',
  timeFilter: LeaderboardTimeFilter = 'All Time',
  currentUserId?: string
): Promise<LeaderboardResult> {
  const collectionPath = 'quizResults';
  const timeThreshold = getTimeThreshold(timeFilter);

  try {
    // Fetch recent quiz results from Firestore
    // Limit to 500 documents for optimal client performance and bandwidth
    const q = query(collection(db, collectionPath), limit(500));
    const querySnapshot = await getDocs(q);

    const playersMap = new Map<string, PlayerStatsAccumulator>();

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();

      // Filter by Category
      if (categoryFilter !== 'Overall' && data.category !== categoryFilter) {
        return;
      }

      // Filter by Time
      if (timeThreshold !== null) {
        const completedTime = data.completedAt
          ? new Date(data.completedAt).getTime()
          : 0;
        if (completedTime < timeThreshold) {
          return;
        }
      }

      const uid = data.userId;
      if (!uid) return;

      const score = Number(data.score) || 0;
      const percentage = Number(data.percentage) || 0;
      const timeTaken = Number(data.timeTaken) || 0;

      const existing = playersMap.get(uid);
      if (existing) {
        existing.totalScore += score;
        existing.quizzesCompleted += 1;
        existing.percentageSum += percentage;
        existing.highestScore = Math.max(existing.highestScore, score);
        if (timeTaken > 0) {
          existing.bestTime =
            existing.bestTime === 0
              ? timeTaken
              : Math.min(existing.bestTime, timeTaken);
        }
        // Update with photo or display name if previously missing
        if (!existing.photoURL && data.photoURL) {
          existing.photoURL = data.photoURL;
        }
        if (
          (!existing.displayName || existing.displayName === 'Player') &&
          (data.displayName || data.userName)
        ) {
          existing.displayName = data.displayName || data.userName;
        }
      } else {
        playersMap.set(uid, {
          userId: uid,
          displayName: data.displayName || data.userName || 'Quiz Player',
          photoURL: data.photoURL || undefined,
          totalScore: score,
          quizzesCompleted: 1,
          percentageSum: percentage,
          highestScore: score,
          bestTime: timeTaken,
        });
      }
    });

    // Convert to sorted array
    const sortedPlayers = Array.from(playersMap.values());

    // Sort order:
    // 1. Total Score (DESC)
    // 2. Average Percentage (DESC)
    // 3. Quizzes Completed (DESC)
    sortedPlayers.sort((a, b) => {
      if (b.totalScore !== a.totalScore) {
        return b.totalScore - a.totalScore;
      }
      const avgA = Math.round(a.percentageSum / a.quizzesCompleted);
      const avgB = Math.round(b.percentageSum / b.quizzesCompleted);
      if (avgB !== avgA) {
        return avgB - avgA;
      }
      return b.quizzesCompleted - a.quizzesCompleted;
    });

    // Build finalized leaderboard entries (NO email or private info included)
    const entries: LeaderboardEntry[] = sortedPlayers.map((player, index) => {
      const avgPct = Math.round(player.percentageSum / player.quizzesCompleted);
      const isCurrent = Boolean(currentUserId && player.userId === currentUserId);

      return {
        rank: index + 1,
        userId: player.userId,
        displayName: player.displayName,
        photoURL: player.photoURL,
        totalScore: player.totalScore,
        quizzesCompleted: player.quizzesCompleted,
        averagePercentage: avgPct,
        highestScore: player.highestScore,
        bestTimeFormatted:
          player.bestTime > 0
            ? player.bestTime < 60
              ? `${player.bestTime}s`
              : `${Math.floor(player.bestTime / 60)}m ${player.bestTime % 60}s`
            : undefined,
        isCurrentUser: isCurrent,
      };
    });

    // Identify current user's entry and rank
    let currentUserEntry: LeaderboardEntry | null = null;
    let currentUserRank: number | null = null;

    if (currentUserId) {
      const found = entries.find((e) => e.userId === currentUserId);
      if (found) {
        currentUserEntry = found;
        currentUserRank = found.rank;
      }
    }

    return {
      entries,
      currentUserEntry,
      currentUserRank,
      totalParticipants: entries.length,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionPath);
    return {
      entries: [],
      currentUserEntry: null,
      currentUserRank: null,
      totalParticipants: 0,
    };
  }
}
