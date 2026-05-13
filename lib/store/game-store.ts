import { create } from 'zustand';
import type { GameState, Grid, Cell, Difficulty, NotesGrid } from '@/types/sudoku';
import { SudokuGenerator } from '@/lib/sudoku/generator';
import { SudokuValidator } from '@/lib/validation/sudoku-validator';

interface GameStore extends GameState {
  setCell: (row: number, col: number, value: Cell) => void;
  toggleNote: (row: number, col: number, value: number) => void;
  setSelectedCell: (row: number, col: number) => void;
  clearSelectedCell: () => void;
  toggleNotesMode: () => void;
  startNewGame: (difficulty: Difficulty, level: number) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  updateTimer: () => void;
  useHint: (row: number, col: number) => void;
  validateGrid: () => { isValid: boolean; isComplete: boolean };
  resetGame: () => void;
  getConflicts: () => Map<string, any>;
  triggerTimeUp: () => void;
}

const createEmptyNotes = (): NotesGrid => {
  return Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => new Set<number>())
  );
};

const createInitialState = (): GameState => {
  const { puzzle, solution, difficulty, level } = SudokuGenerator.generate('easy', 1);

  return {
    puzzle,
    solution,
    currentGrid: puzzle.map(row => [...row]),
    notes: createEmptyNotes(),
    startTime: Date.now(),
    elapsedTime: 0,
    difficulty,
    level,
    mistakes: 0,
    hintsUsed: 0,
    isComplete: false,
    isPaused: false,
    notesMode: false,
    selectedCell: null,
    isFailed: false,
    maxMistakes: 3,
    lastMistakeCell: null,
    actualSolveTime: 0,
  };
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...createInitialState(),

  setSelectedCell: (row: number, col: number) => {
    set({ selectedCell: { row, col } });
  },

  clearSelectedCell: () => {
    set({ selectedCell: null });
  },

  toggleNotesMode: () => {
    set((state) => ({ notesMode: !state.notesMode }));
  },

  toggleNote: (row: number, col: number, value: number) => {
    const state = get();

    if (state.puzzle[row][col] !== null) return;
    if (state.currentGrid[row][col] !== null) return;
    if (state.isComplete || state.isPaused) return;

    const newNotes = state.notes.map((r, rIdx) =>
      r.map((cell, cIdx) => {
        if (rIdx === row && cIdx === col) {
          const newSet = new Set(cell);
          if (newSet.has(value)) {
            newSet.delete(value);
          } else {
            newSet.add(value);
          }
          return newSet;
        }
        return cell;
      })
    );

    set({ notes: newNotes });
  },

  setCell: (row: number, col: number, value: Cell) => {
    const state = get();

    if (state.puzzle[row][col] !== null) return;
    if (state.isComplete || state.isPaused || state.isFailed) return;

    const newGrid = state.currentGrid.map(r => [...r]);
    newGrid[row][col] = value;

    const isMistake = value !== null && value !== state.solution[row][col];
    const newMistakes = isMistake ? state.mistakes + 1 : state.mistakes;

    const newNotes = state.notes.map((r, rIdx) =>
      r.map((cell, cIdx) => {
        if (rIdx === row && cIdx === col) {
          return new Set<number>();
        }
        return cell;
      })
    );

    // Check if player has failed
    const hasFailed = newMistakes >= state.maxMistakes;

    set({
      currentGrid: newGrid,
      notes: newNotes,
      mistakes: newMistakes,
      isFailed: hasFailed,
      lastMistakeCell: isMistake ? { row, col } : null,
    });

    // Clear mistake highlight after 1 second
    if (isMistake) {
      setTimeout(() => {
        set({ lastMistakeCell: null });
      }, 1000);
    }

    if (hasFailed) {
      return;
    }

    const isComplete = SudokuValidator.isGridSolved(newGrid, state.solution);
    if (isComplete) {
      const actualTime = Date.now() - state.startTime;
      set({ isComplete: true, actualSolveTime: actualTime });
    }
  },

  getConflicts: () => {
    const state = get();
    return SudokuValidator.getAllConflicts(state.currentGrid);
  },

  startNewGame: (difficulty: Difficulty, level: number) => {
    const { puzzle, solution } = SudokuGenerator.generate(difficulty, level);

    set({
      puzzle,
      solution,
      currentGrid: puzzle.map(row => [...row]),
      notes: createEmptyNotes(),
      startTime: Date.now(),
      elapsedTime: 0,
      difficulty,
      level,
      mistakes: 0,
      hintsUsed: 0,
      isComplete: false,
      isPaused: false,
      notesMode: false,
      selectedCell: null,
      isFailed: false,
      maxMistakes: 3,
      lastMistakeCell: null,
      actualSolveTime: 0,
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

    const newNotes = state.notes.map((r, rIdx) =>
      r.map((cell, cIdx) => {
        if (rIdx === row && cIdx === col) {
          return new Set<number>();
        }
        return cell;
      })
    );

    const hintPenalty = 5 * 60 * 1000;
    const newStartTime = state.startTime - hintPenalty;

    set({
      currentGrid: newGrid,
      notes: newNotes,
      hintsUsed: state.hintsUsed + 1,
      startTime: newStartTime,
    });
  },

  validateGrid: () => {
    const state = get();
    const isValid = SudokuValidator.isGridValid(state.currentGrid);
    const isComplete = SudokuValidator.isGridSolved(state.currentGrid, state.solution);

    if (isComplete) {
      set({ isComplete: true });
    }

    return {
      isValid,
      isComplete,
    };
  },

  resetGame: () => {
    const state = get();
    set({
      currentGrid: state.puzzle.map(row => [...row]),
      notes: createEmptyNotes(),
      startTime: Date.now(),
      elapsedTime: 0,
      mistakes: 0,
      hintsUsed: 0,
      isComplete: false,
      isPaused: false,
      notesMode: false,
      selectedCell: null,
    });
  },

  triggerTimeUp: () => {
    set({ isFailed: true });
  },
}));
