export type Category =
  | 'General Knowledge'
  | 'Science'
  | 'History'
  | 'Geography'
  | 'Technology'
  | 'Sports';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  correctAnswer?: string;
  category: Category;
  difficulty: Difficulty;
  explanation: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

export type QuizState =
  | 'HOME'
  | 'CHOOSE_CATEGORY'
  | 'CHOOSE_DIFFICULTY'
  | 'QUIZ'
  | 'RESULTS'
  | 'PROFILE'
  | 'LEADERBOARD'
  | 'ADMIN';

export interface UserAnswerRecord {
  questionId: string;
  questionText: string;
  category: Category;
  difficulty: Difficulty;
  options: string[];
  selectedIndex: number;
  correctIndex: number;
  isCorrect: boolean;
  explanation: string;
  isTimedOut?: boolean;
}

export interface QuizResults {
  totalScore: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  percentage: number;
  category: Category;
  difficulty: Difficulty;
  timeTaken: number;
  timeTakenFormatted: string;
  answers: UserAnswerRecord[];
  savedResultId?: string;
  isSavedToFirestore?: boolean;
}

export interface SavedQuizResult {
  id?: string;
  userId: string;
  userName: string;
  displayName?: string;
  userEmail: string;
  email?: string;
  photoURL?: string;
  category: Category;
  difficulty: Difficulty;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  percentage: number;
  timeTaken: number;
  timeTakenFormatted?: string;
  completedAt: string;
}

export type LeaderboardCategoryFilter = 'Overall' | Category;
export type LeaderboardTimeFilter = 'All Time' | 'This Month' | 'This Week';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  photoURL?: string;
  totalScore: number;
  quizzesCompleted: number;
  averagePercentage: number;
  highestScore: number;
  bestTimeFormatted?: string;
  isCurrentUser: boolean;
}

