export type AchievementId =
  | 'first_quiz'
  | 'quiz_starter'
  | 'quiz_master'
  | 'perfect_score'
  | 'sports_fan'
  | 'history_buff'
  | 'science_expert'
  | 'geography_explorer'
  | 'tech_expert'
  | 'gk_pro';

export type AchievementGroup = 'Milestone' | 'Score' | 'Category';
export type BadgeRarity = 'Bronze' | 'Silver' | 'Gold' | 'Diamond';

export interface AchievementDefinition {
  id: AchievementId;
  title: string;
  description: string;
  group: AchievementGroup;
  rarity: BadgeRarity;
  target: number;
  unit: string;
  badgeGradient: string;
  iconName: string;
  categoryFilter?: string;
}

export interface AchievementProgress {
  definition: AchievementDefinition;
  isUnlocked: boolean;
  unlockedAt?: string | null;
  currentValue: number;
  targetValue: number;
  percentage: number;
}

export interface StoredUserAchievement {
  achievementId: string;
  userId: string;
  title: string;
  description: string;
  unlockedAt: string;
  category?: string;
}

export interface PlayerProgressStats {
  totalQuizzesCompleted: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  overallAccuracy: number;
  highestScore: number;
  bestPercentage: number;
  leaderboardRank: number | null;
  totalPlayers: number;
}
