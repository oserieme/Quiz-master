export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  createdAt: string;
  lastLoginAt: string;
  totalQuizzesPlayed?: number;
  highScore?: number;
  unlockedAchievements?: string[];
  role?: 'player' | 'admin';
}
