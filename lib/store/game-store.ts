import { create } from 'zustand';
import type { GameState, Grid, Cell, Difficulty } from '@/types/sudoku';
import { SudokuGenerator } from '@/lib/sudoku/generator';

interface GameStore extends GameState {
  setCell: (row: number, col: number, value: Cell) => void;
  startNewGame: (difficulty: Difficulty, level: number) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  updateTimer: () => void;
  useHint: (row: number, col: number) => void;
  validateGrid: () => { isValid: boolean; isComplete: boolean };
  resetGame: () => void;
}

const createInitialState = (): GameState => {
  const { puzzle, solution, difficulty, level } = SudokuGenerator.generate('easy', 1);

  return {
    puzzle,
    solution,
    currentGrid: puzzle.map(row => [...row]),
    startTime: Date.now(),
    elapsedTime: 0,
    difficulty,
    level,
    mistakes: 0,
    hintsUsed: 0,
    isComplete: false,
    isPaused: false,
  };
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...createInitialState(),

  setCell: (row: number, col: number, value: Cell) => {
    const state = get();

    if (state.puzzle[row][col] !== null) return;
    if (state.isComplete || state.isPaused) return;

    const newGrid = state.currentGrid.map(r => [...r]);
    newGrid[row][col] = value;

    const isMistake = value !== null && value !== state.solution[row][col];

    set({
      currentGrid: newGrid,
      mistakes: isMistake ? state.mistakes + 1 : state.mistakes,
    });

    const validation = SudokuGenerator.validate(newGrid, state.solution);
    if (validation.isComplete) {
      set({ isComplete: true });
    }
  },

  startNewGame: (difficulty: Difficulty, level: number) => {
    const { puzzle, solution } = SudokuGenerator.generate(difficulty, level);

    set({
      puzzle,
      solution,
      currentGrid: puzzle.map(row => [...row]),
      startTime: Date.now(),
      elapsedTime: 0,
      difficulty,
      level,
      mistakes: 0,
      hintsUsed: 0,
      isComplete: false,
      isPaused: false,
    });
  },

  pauseGame: () => {
    const state = get();
    if (!state.isPaused && !state.isComplete) {
      set({ isPaused: true });
    }
  },

  resumeGame: () => {
    const state = get();
    if (state.isPaused) {
      set({
        isPaused: false,
        startTime: Date.now() - state.elapsedTime,
      });
    }
  },

  updateTimer: () => {
    const state = get();
    if (!state.isPaused && !state.isComplete) {
      set({ elapsedTime: Date.now() - state.startTime });
    }
  },

  useHint: (row: number, col: number) => {
    const state = get();

    if (state.puzzle[row][col] !== null) return;
    if (state.isComplete || state.isPaused) return;

    const newGrid = state.currentGrid.map(r => [...r]);
    newGrid[row][col] = state.solution[row][col];

    set({
      currentGrid: newGrid,
      hintsUsed: state.hintsUsed + 1,
    });
  },

  validateGrid: () => {
    const state = get();
    const validation = SudokuGenerator.validate(state.currentGrid, state.solution);

    if (validation.isComplete) {
      set({ isComplete: true });
    }

    return {
      isValid: validation.isValid,
      isComplete: validation.isComplete,
    };
  },

  resetGame: () => {
    const state = get();
    set({
      currentGrid: state.puzzle.map(row => [...row]),
      startTime: Date.now(),
      elapsedTime: 0,
      mistakes: 0,
      hintsUsed: 0,
      isComplete: false,
      isPaused: false,
    });
  },
}));
