import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { SavedQuizResult } from '../types/quiz';
import { handleFirestoreError, OperationType } from './firestoreErrors';
import { updateUserQuizStats } from './userService';

/**
 * Saves a completed quiz result to Firebase Firestore.
 * Required fields saved:
 * - userId: Firebase Authentication UID
 * - userName: User's name/display name
 * - userEmail: User's email address
 * - category: Quiz domain
 * - difficulty: Difficulty level (Easy, Medium, Hard)
 * - totalQuestions: Total questions in quiz
 * - correctAnswers: Count of correct answers
 * - incorrectAnswers: Count of incorrect/timed-out answers
 * - score: Points earned
 * - percentage: Accuracy percentage (0-100)
 * - timeTaken: Seconds taken to complete
 * - completedAt: Timestamp of completion
 *
 * Stored both under:
 * 1. /users/{userId}/quizResults/{resultId} (direct subcollection under authenticated user's UID)
 * 2. /quizResults/{resultId} (top-level collection with owner userId check)
 */
export async function saveQuizResult(
  resultData: Omit<SavedQuizResult, 'id'>
): Promise<string> {
  const currentUid = auth.currentUser?.uid;
  if (!currentUid || currentUid !== resultData.userId) {
    throw new Error('User must be authenticated to save quiz results.');
  }

  const payload = {
    userId: resultData.userId,
    userName: resultData.userName || resultData.displayName || 'Quiz Player',
    userEmail: resultData.userEmail || resultData.email || '',
    displayName: resultData.displayName || resultData.userName || 'Quiz Player',
    email: resultData.email || resultData.userEmail || '',
    photoURL: resultData.photoURL || auth.currentUser?.photoURL || '',
    category: resultData.category,
    difficulty: resultData.difficulty,
    totalQuestions: Number(resultData.totalQuestions) || 10,
    correctAnswers: Number(resultData.correctAnswers) || 0,
    incorrectAnswers: Number(resultData.incorrectAnswers) || 0,
    score: Number(resultData.score) || 0,
    percentage: Number(resultData.percentage) || 0,
    timeTaken: Number(resultData.timeTaken) || 0,
    timeTakenFormatted:
      resultData.timeTakenFormatted ||
      (resultData.timeTaken ? `${resultData.timeTaken}s` : '0s'),
    completedAt: resultData.completedAt || new Date().toISOString(),
    createdAt: serverTimestamp(),
  };

  let savedDocId = '';

  // 1. Save under the authenticated user's UID: /users/{userId}/quizResults
  // Full private record including email address for personal history
  try {
    const userSubcollectionRef = collection(db, 'users', resultData.userId, 'quizResults');
    const docRef = await addDoc(userSubcollectionRef, payload);
    savedDocId = docRef.id;
  } catch (error) {
    console.warn('Failed to save to users/{userId}/quizResults subcollection:', error);
  }

  // 2. Also save to top-level /quizResults collection for public leaderboard calculation.
  // Privacy Hardening: Strip userEmail/email so public queries cannot scrape player emails.
  try {
    const publicPayload = {
      userId: payload.userId,
      userName: payload.userName,
      displayName: payload.displayName,
      photoURL: payload.photoURL,
      category: payload.category,
      difficulty: payload.difficulty,
      totalQuestions: payload.totalQuestions,
      correctAnswers: payload.correctAnswers,
      incorrectAnswers: payload.incorrectAnswers,
      score: payload.score,
      percentage: payload.percentage,
      timeTaken: payload.timeTaken,
      timeTakenFormatted: payload.timeTakenFormatted,
      completedAt: payload.completedAt,
      createdAt: payload.createdAt,
    };
    const topLevelRef = collection(db, 'quizResults');
    const topDocRef = await addDoc(topLevelRef, publicPayload);
    if (!savedDocId) {
      savedDocId = topDocRef.id;
    }
  } catch (error) {
    console.warn('Failed to save to /quizResults collection:', error);
    // If neither succeeded, throw
    if (!savedDocId) {
      handleFirestoreError(error, OperationType.CREATE, 'quizResults');
      throw error;
    }
  }

  // Update cumulative user profile statistics (totalQuizzesPlayed & highScore)
  try {
    await updateUserQuizStats(resultData.userId, resultData.score);
  } catch (statsErr) {
    console.warn('Failed to update cumulative stats:', statsErr);
  }

  return savedDocId;
}

/**
 * Fetches the quiz history for a specific authenticated user from Firestore.
 * Ensures a user can only read their own quiz history.
 * Checks /users/{userId}/quizResults first, and falls back/merges with /quizResults.
 */
export async function getUserQuizHistory(userId: string): Promise<SavedQuizResult[]> {
  const currentUid = auth.currentUser?.uid;
  if (!currentUid || currentUid !== userId) {
    console.warn('Cannot fetch quiz history for non-matching or unauthenticated user');
    return [];
  }

  const resultsMap = new Map<string, SavedQuizResult>();

  // 1. Fetch from user UID subcollection: /users/{userId}/quizResults
  try {
    const userSubcollectionRef = collection(db, 'users', userId, 'quizResults');
    const snapshot = await getDocs(userSubcollectionRef);

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      resultsMap.set(docSnap.id, {
        id: docSnap.id,
        userId: data.userId || userId,
        userName: data.userName || data.displayName || 'Player',
        displayName: data.displayName || data.userName || 'Player',
        userEmail: data.userEmail || data.email || '',
        email: data.email || data.userEmail || '',
        category: data.category,
        difficulty: data.difficulty,
        totalQuestions: Number(data.totalQuestions) || 10,
        correctAnswers: Number(data.correctAnswers) || 0,
        incorrectAnswers: Number(data.incorrectAnswers) || 0,
        score: Number(data.score) || 0,
        percentage: Number(data.percentage) || 0,
        timeTaken: Number(data.timeTaken) || 0,
        timeTakenFormatted:
          data.timeTakenFormatted ||
          (data.timeTaken ? `${data.timeTaken}s` : '0s'),
        completedAt: data.completedAt || new Date().toISOString(),
      });
    });
  } catch (userSubError) {
    console.warn('Error reading from users/{userId}/quizResults:', userSubError);
  }

  // 2. Also query top-level /quizResults for this userId
  try {
    const q = query(
      collection(db, 'quizResults'),
      where('userId', '==', userId)
    );
    const topSnapshot = await getDocs(q);

    topSnapshot.forEach((docSnap) => {
      if (!resultsMap.has(docSnap.id)) {
        const data = docSnap.data();
        resultsMap.set(docSnap.id, {
          id: docSnap.id,
          userId: data.userId || userId,
          userName: data.userName || data.displayName || 'Player',
          displayName: data.displayName || data.userName || 'Player',
          userEmail: data.userEmail || data.email || '',
          email: data.email || data.userEmail || '',
          category: data.category,
          difficulty: data.difficulty,
          totalQuestions: Number(data.totalQuestions) || 10,
          correctAnswers: Number(data.correctAnswers) || 0,
          incorrectAnswers: Number(data.incorrectAnswers) || 0,
          score: Number(data.score) || 0,
          percentage: Number(data.percentage) || 0,
          timeTaken: Number(data.timeTaken) || 0,
          timeTakenFormatted:
            data.timeTakenFormatted ||
            (data.timeTaken ? `${data.timeTaken}s` : '0s'),
          completedAt: data.completedAt || new Date().toISOString(),
        });
      }
    });
  } catch (topError) {
    console.warn('Error reading from /quizResults:', topError);
  }

  const results = Array.from(resultsMap.values());

  // Sort newest first
  results.sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  return results;
}

/**
 * Retrieves a single quiz result by ID
 */
export async function getQuizResultById(
  resultId: string,
  userId?: string
): Promise<SavedQuizResult | null> {
  const currentUid = auth.currentUser?.uid;
  const targetUid = userId || currentUid;

  if (!targetUid || (currentUid && targetUid !== currentUid)) {
    return null;
  }

  // Check user subcollection first
  try {
    const subDocSnap = await getDoc(doc(db, 'users', targetUid, 'quizResults', resultId));
    if (subDocSnap.exists()) {
      const data = subDocSnap.data();
      return {
        id: subDocSnap.id,
        userId: data.userId || targetUid,
        userName: data.userName || data.displayName || 'Player',
        displayName: data.displayName || data.userName || 'Player',
        userEmail: data.userEmail || data.email || '',
        email: data.email || data.userEmail || '',
        category: data.category,
        difficulty: data.difficulty,
        totalQuestions: Number(data.totalQuestions) || 10,
        correctAnswers: Number(data.correctAnswers) || 0,
        incorrectAnswers: Number(data.incorrectAnswers) || 0,
        score: Number(data.score) || 0,
        percentage: Number(data.percentage) || 0,
        timeTaken: Number(data.timeTaken) || 0,
        timeTakenFormatted:
          data.timeTakenFormatted ||
          (data.timeTaken ? `${data.timeTaken}s` : '0s'),
        completedAt: data.completedAt || new Date().toISOString(),
      };
    }
  } catch {
    // Continue to top-level check
  }

  // Check top-level quizResults
  try {
    const topDocSnap = await getDoc(doc(db, 'quizResults', resultId));
    if (topDocSnap.exists()) {
      const data = topDocSnap.data();
      if (data.userId !== currentUid) return null;

      return {
        id: topDocSnap.id,
        userId: data.userId,
        userName: data.userName || data.displayName || 'Player',
        displayName: data.displayName || data.userName || 'Player',
        userEmail: data.userEmail || data.email || '',
        email: data.email || data.userEmail || '',
        category: data.category,
        difficulty: data.difficulty,
        totalQuestions: Number(data.totalQuestions) || 10,
        correctAnswers: Number(data.correctAnswers) || 0,
        incorrectAnswers: Number(data.incorrectAnswers) || 0,
        score: Number(data.score) || 0,
        percentage: Number(data.percentage) || 0,
        timeTaken: Number(data.timeTaken) || 0,
        timeTakenFormatted:
          data.timeTakenFormatted ||
          (data.timeTaken ? `${data.timeTaken}s` : '0s'),
        completedAt: data.completedAt || new Date().toISOString(),
      };
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `quizResults/${resultId}`);
  }

  return null;
}
