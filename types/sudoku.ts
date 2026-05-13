export type Cell = number | null;
export type Grid = Cell[][];
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type Notes = Set<number>;
export type NotesGrid = Notes[][];

export interface SudokuPuzzle {
  puzzle: Grid;
  solution: Grid;
  difficulty: Difficulty;
  level: number;
}

export interface GameState {
  puzzle: Grid;
  solution: Grid;
  currentGrid: Grid;
  notes: NotesGrid;
  startTime: number;
  elapsedTime: number;
  difficulty: Difficulty;
  level: number;
  mistakes: number;
  hintsUsed: number;
  isComplete: boolean;
  isPaused: boolean;
  notesMode: boolean;
  selectedCell: { row: number; col: number } | null;
  isFailed: boolean;
  maxMistakes: number;
  lastMistakeCell: { row: number; col: number } | null;
  actualSolveTime: number;
}

export interface ValidationResult {
  isValid: boolean;
  isComplete: boolean;
  errors: { row: number; col: number }[];
}

export type SkinRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Skin {
  id: string;
  skin_id: string;
  name: string;
  description: string;
  price: number;
  rarity: SkinRarity;
  preview_image?: string;
  theme_colors: {
    primary: string;
    secondary: string;
  };
}

export interface UserProfile {
  id: string;
  username: string;
  city?: string;
  level: number;
  total_score: number;
  games_played: number;
  games_won: number;
  cosmic_coins: number;
  current_skin: string;
  created_at: string;
  updated_at: string;
}

export interface CurrencyReward {
  coins_earned: number;
  new_total: number;
}
