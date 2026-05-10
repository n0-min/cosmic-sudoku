export type AchievementType =
  | 'first_win'
  | 'speed_demon'
  | 'perfectionist'
  | 'marathon'
  | 'expert_master'
  | 'no_hints'
  | 'flawless'
  | 'cosmic_explorer'
  | 'duel_champion';

export interface Achievement {
  id: AchievementType;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  unlocksTheme?: 'nebula' | 'blackhole' | 'supernova';
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_win',
    name: 'First Steps',
    description: 'Complete your first puzzle',
    icon: '🎯',
    requirement: 'Complete 1 puzzle',
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete a puzzle in under 5 minutes',
    icon: '⚡',
    requirement: 'Complete puzzle < 5 minutes',
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Complete a puzzle with no mistakes',
    icon: '💎',
    requirement: 'Complete with 0 mistakes',
  },
  {
    id: 'marathon',
    name: 'Marathon Runner',
    description: 'Complete 10 puzzles',
    icon: '🏃',
    requirement: 'Complete 10 puzzles',
    unlocksTheme: 'nebula',
  },
  {
    id: 'expert_master',
    name: 'Expert Master',
    description: 'Complete 10 expert difficulty puzzles',
    icon: '🎓',
    requirement: 'Complete 10 expert puzzles',
  },
  {
    id: 'no_hints',
    name: 'Self-Sufficient',
    description: 'Complete a puzzle without using hints',
    icon: '🧠',
    requirement: 'Complete with 0 hints',
  },
  {
    id: 'flawless',
    name: 'Flawless Victory',
    description: 'Complete a puzzle with no mistakes and no hints',
    icon: '👑',
    requirement: 'Complete with 0 mistakes and 0 hints',
    unlocksTheme: 'blackhole',
  },
  {
    id: 'cosmic_explorer',
    name: 'Cosmic Explorer',
    description: 'Reach level 100',
    icon: '🚀',
    requirement: 'Reach level 100',
    unlocksTheme: 'supernova',
  },
  {
    id: 'duel_champion',
    name: 'Duel Champion',
    description: 'Win 10 duels',
    icon: '⚔️',
    requirement: 'Win 10 duels',
  },
];

export function checkAchievements(gameData: {
  gamesPlayed: number;
  gamesWon: number;
  level: number;
  timeSeconds: number;
  mistakes: number;
  hintsUsed: number;
  difficulty: string;
  expertWins?: number;
  duelWins?: number;
}): AchievementType[] {
  const unlocked: AchievementType[] = [];

  if (gameData.gamesWon >= 1) unlocked.push('first_win');
  if (gameData.timeSeconds < 300) unlocked.push('speed_demon');
  if (gameData.mistakes === 0) unlocked.push('perfectionist');
  if (gameData.gamesWon >= 10) unlocked.push('marathon');
  if (gameData.expertWins && gameData.expertWins >= 10) unlocked.push('expert_master');
  if (gameData.hintsUsed === 0) unlocked.push('no_hints');
  if (gameData.mistakes === 0 && gameData.hintsUsed === 0) unlocked.push('flawless');
  if (gameData.level >= 100) unlocked.push('cosmic_explorer');
  if (gameData.duelWins && gameData.duelWins >= 10) unlocked.push('duel_champion');

  return unlocked;
}
