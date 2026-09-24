import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Category, Difficulty, Question } from '../types/quiz';
import { QUESTION_POOL, CATEGORIES, DIFFICULTIES } from '../data/questions';
import { handleFirestoreError, OperationType } from './firestoreErrors';

export interface QuestionValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validates a question according to quizmaster rules:
 * - Question text non-empty (at least 8 characters)
 * - Exactly 4 options, all trimmed and non-empty
 * - All 4 options must be unique/distinct
 * - Correct answer index between 0 and 3 pointing to a valid option
 * - Valid category & difficulty
 */
export function validateQuestion(data: {
  question?: string;
  options?: string[];
  correctAnswerIndex?: number;
  category?: Category | string;
  difficulty?: Difficulty | string;
  explanation?: string;
}): QuestionValidationResult {
  const errors: Record<string, string> = {};

  // Question text check
  const text = (data.question || '').trim();
  if (!text) {
    errors.question = 'Question prompt cannot be empty.';
  } else if (text.length < 8) {
    errors.question = 'Question prompt must be at least 8 characters long.';
  }

  // Options check
  const options = data.options || [];
  if (options.length !== 4) {
    errors.options = 'Exactly 4 answer options are required.';
  } else {
    const trimmedOptions = options.map((opt) => (opt || '').trim());
    const hasEmpty = trimmedOptions.some((opt) => opt.length === 0);
    if (hasEmpty) {
      errors.options = 'All 4 answer options must have text. None can be left blank.';
    }

    // Check for duplicate options (case-insensitive)
    const lowerSet = new Set(trimmedOptions.map((opt) => opt.toLowerCase()));
    if (lowerSet.size !== 4) {
      errors.options = 'All 4 answer options must be unique. Duplicate answers are not permitted.';
    }
  }

  // Correct answer index check
  const correctIdx = data.correctAnswerIndex;
  if (
    typeof correctIdx !== 'number' ||
    isNaN(correctIdx) ||
    correctIdx < 0 ||
    correctIdx > 3
  ) {
    errors.correctAnswerIndex = 'Please select which option (A, B, C, or D) is the correct answer.';
  }

  // Category check
  if (!data.category || !CATEGORIES.includes(data.category as Category)) {
    errors.category = 'Please select a valid quiz category.';
  }

  // Difficulty check
  if (!data.difficulty || !DIFFICULTIES.includes(data.difficulty as Difficulty)) {
    errors.difficulty = 'Please select a valid difficulty level (Easy, Medium, Hard).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Utility to shuffle an array (Fisher-Yates)
 */
function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Shuffles the 4 options of a question and updates the correctAnswerIndex accordingly
 */
export function prepareQuestionForPlay(q: Question): Question {
  const originalCorrect = q.options[q.correctAnswerIndex];
  const shuffledOptions = shuffle(q.options);
  const newIndex = shuffledOptions.indexOf(originalCorrect);

  return {
    ...q,
    options: shuffledOptions,
    correctAnswerIndex: newIndex >= 0 ? newIndex : 0,
    correctAnswer: originalCorrect,
  };
}

/**
 * Fetches all questions from Firestore (for Admin Dashboard)
 */
export async function fetchAllQuestionsFromFirestore(): Promise<Question[]> {
  try {
    const questionsRef = collection(db, 'questions');
    const snap = await getDocs(questionsRef);
    const questions: Question[] = [];

    snap.forEach((docSnap) => {
      const data = docSnap.data();
      questions.push({
        id: docSnap.id,
        question: data.question || '',
        options: data.options || [],
        correctAnswerIndex: typeof data.correctAnswerIndex === 'number' ? data.correctAnswerIndex : 0,
        correctAnswer: data.correctAnswer || (data.options ? data.options[data.correctAnswerIndex || 0] : ''),
        category: data.category as Category,
        difficulty: data.difficulty as Difficulty,
        explanation: data.explanation || '',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        createdBy: data.createdBy,
      });
    });

    // Sort by createdAt descending if present
    questions.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

    return questions;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, 'questions');
    return [];
  }
}

/**
 * Adds a new question to Firestore /questions collection.
 * Requires admin authentication.
 */
export async function addQuestionToFirestore(
  data: Omit<Question, 'id'>,
  adminUid?: string
): Promise<Question> {
  const validation = validateQuestion(data);
  if (!validation.isValid) {
    const firstErr = Object.values(validation.errors)[0];
    throw new Error(`Validation Error: ${firstErr}`);
  }

  const now = new Date().toISOString();
  const trimmedOptions = data.options.map((opt) => opt.trim());
  const correctAnswer = trimmedOptions[data.correctAnswerIndex] || '';

  const questionsRef = collection(db, 'questions');
  const newDocRef = doc(questionsRef);

  const payload: Omit<Question, 'id'> = {
    question: data.question.trim(),
    options: trimmedOptions,
    correctAnswerIndex: data.correctAnswerIndex,
    correctAnswer,
    category: data.category,
    difficulty: data.difficulty,
    explanation: (data.explanation || '').trim(),
    createdAt: now,
    updatedAt: now,
    createdBy: adminUid || 'admin',
  };

  try {
    await setDoc(newDocRef, payload);
    return {
      id: newDocRef.id,
      ...payload,
    };
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `questions/${newDocRef.id}`);
    throw err;
  }
}

/**
 * Updates an existing question in Firestore /questions/{id}.
 * Requires admin authentication.
 */
export async function updateQuestionInFirestore(
  id: string,
  data: Partial<Omit<Question, 'id'>>,
  adminUid?: string
): Promise<void> {
  if (!id) throw new Error('Question ID is required for update.');

  const validation = validateQuestion(data);
  if (!validation.isValid) {
    const firstErr = Object.values(validation.errors)[0];
    throw new Error(`Validation Error: ${firstErr}`);
  }

  const now = new Date().toISOString();
  const trimmedOptions = (data.options || []).map((opt) => opt.trim());
  const correctAnswer =
    typeof data.correctAnswerIndex === 'number'
      ? trimmedOptions[data.correctAnswerIndex] || ''
      : undefined;

  const docRef = doc(db, 'questions', id);
  const updates: Record<string, unknown> = {
    updatedAt: now,
  };

  if (data.question) updates.question = data.question.trim();
  if (data.options) updates.options = trimmedOptions;
  if (typeof data.correctAnswerIndex === 'number') {
    updates.correctAnswerIndex = data.correctAnswerIndex;
    updates.correctAnswer = correctAnswer;
  }
  if (data.category) updates.category = data.category;
  if (data.difficulty) updates.difficulty = data.difficulty;
  if (data.explanation !== undefined) updates.explanation = data.explanation.trim();
  if (adminUid) updates.lastModifiedBy = adminUid;

  try {
    await updateDoc(docRef, updates);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `questions/${id}`);
    throw err;
  }
}

/**
 * Deletes a question from Firestore /questions/{id}.
 * Requires admin authentication.
 */
export async function deleteQuestionFromFirestore(id: string): Promise<void> {
  if (!id) throw new Error('Question ID is required for deletion.');
  const docRef = doc(db, 'questions', id);
  try {
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `questions/${id}`);
    throw err;
  }
}

/**
 * Retrieves quiz questions from Firestore for the selected Category and Difficulty.
 * If Firestore has sufficient questions, shuffles and selects 10.
 * If Firestore has fewer questions, gracefully blends with initial question bank
 * so gameplay is always 100% resilient.
 */
export async function getQuizQuestionsFromFirestore(
  category: Category,
  difficulty: Difficulty,
  count: number = 10
): Promise<Question[]> {
  try {
    const questionsRef = collection(db, 'questions');
    const qQuery = query(
      questionsRef,
      where('category', '==', category),
      where('difficulty', '==', difficulty)
    );

    const snapshot = await getDocs(qQuery);
    const firestoreQuestions: Question[] = [];

    snapshot.forEach((d) => {
      const data = d.data();
      if (data.question && Array.isArray(data.options) && data.options.length === 4) {
        firestoreQuestions.push({
          id: d.id,
          question: data.question,
          options: data.options,
          correctAnswerIndex: typeof data.correctAnswerIndex === 'number' ? data.correctAnswerIndex : 0,
          correctAnswer: data.correctAnswer || data.options[data.correctAnswerIndex || 0],
          category: data.category as Category,
          difficulty: data.difficulty as Difficulty,
          explanation: data.explanation || '',
        });
      }
    });

    let selected: Question[] = [];

    if (firestoreQuestions.length >= count) {
      selected = shuffle(firestoreQuestions).slice(0, count);
    } else {
      // If Firestore has fewer, take all matching from Firestore first
      selected = [...firestoreQuestions];

      // Top-up from QUESTION_POOL with same category & difficulty
      const poolMatching = QUESTION_POOL.filter(
        (pq) =>
          pq.category === category &&
          pq.difficulty === difficulty &&
          !firestoreQuestions.some((fq) => fq.question.toLowerCase() === pq.question.toLowerCase())
      );

      const needed = count - selected.length;
      selected.push(...shuffle(poolMatching).slice(0, needed));

      // If still needed, top-up from same category any difficulty
      if (selected.length < count) {
        const remainingNeeded = count - selected.length;
        const poolAny = QUESTION_POOL.filter(
          (pq) =>
            pq.category === category &&
            !selected.some((s) => s.question.toLowerCase() === pq.question.toLowerCase())
        );
        selected.push(...shuffle(poolAny).slice(0, remainingNeeded));
      }
    }

    // Shuffle options for fair gameplay
    return selected.map(prepareQuestionForPlay);
  } catch (err) {
    console.warn('Could not retrieve questions from Firestore, falling back to local pool:', err);
    // Graceful fallback to built-in question pool
    const poolFiltered = QUESTION_POOL.filter(
      (q) => q.category === category && q.difficulty === difficulty
    );
    return shuffle(poolFiltered.length >= count ? poolFiltered : QUESTION_POOL)
      .slice(0, count)
      .map(prepareQuestionForPlay);
  }
}

/**
 * Batch seeds initial questions from the question pool into Firestore.
 * Helpful for administrators to initialize the question database with 1 click.
 */
export async function seedQuestionsToFirestore(
  adminUid?: string,
  onProgress?: (current: number, total: number) => void
): Promise<{ seeded: number; skipped: number }> {
  const existingDocs = await fetchAllQuestionsFromFirestore();
  const existingTextSet = new Set(existingDocs.map((q) => q.question.trim().toLowerCase()));

  const toAdd = QUESTION_POOL.filter(
    (item) => !existingTextSet.has(item.question.trim().toLowerCase())
  );

  if (toAdd.length === 0) {
    return { seeded: 0, skipped: QUESTION_POOL.length };
  }

  const batchSize = 250;
  let seededCount = 0;
  const now = new Date().toISOString();

  for (let i = 0; i < toAdd.length; i += batchSize) {
    const batch = writeBatch(db);
    const chunk = toAdd.slice(i, i + batchSize);

    for (const q of chunk) {
      const docRef = doc(collection(db, 'questions'));
      const payload: Omit<Question, 'id'> = {
        question: q.question.trim(),
        options: q.options.map((o) => o.trim()),
        correctAnswerIndex: q.correctAnswerIndex,
        correctAnswer: q.options[q.correctAnswerIndex],
        category: q.category,
        difficulty: q.difficulty,
        explanation: q.explanation || '',
        createdAt: now,
        updatedAt: now,
        createdBy: adminUid || 'admin-seed',
      };
      batch.set(docRef, payload);
    }

    await batch.commit();
    seededCount += chunk.length;
    onProgress?.(seededCount, toAdd.length);
  }

  return { seeded: seededCount, skipped: QUESTION_POOL.length - toAdd.length };
}
