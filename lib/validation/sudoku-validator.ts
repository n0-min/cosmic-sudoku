import { z } from 'zod';
import type { Grid, Cell } from '@/types/sudoku';

export const CellSchema = z.union([
  z.number().int().min(1).max(9),
  z.null()
]);

export const GridSchema = z.array(
  z.array(CellSchema).length(9)
).length(9);

export const ProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(1),
  cosmic_coins: z.number().int().min(0),
  created_at: z.string().datetime().optional(),
});

export const GameStateSchema = z.object({
  puzzle: GridSchema,
  solution: GridSchema,
  currentGrid: GridSchema,
  difficulty: z.enum(['easy', 'medium', 'hard', 'expert']),
  level: z.number().int().positive(),
  mistakes: z.number().int().min(0),
  hintsUsed: z.number().int().min(0),
});

export interface ConflictInfo {
  row: number;
  col: number;
  type: 'row' | 'column' | 'box';
  conflictsWith: Array<{ row: number; col: number }>;
}

export class SudokuValidator {
  static validateCell(grid: Grid, row: number, col: number, value: Cell): ConflictInfo[] {
    if (value === null) return [];

    const conflicts: ConflictInfo[] = [];
    const conflictingCells: Array<{ row: number; col: number }> = [];

    for (let c = 0; c < 9; c++) {
      if (c !== col && grid[row][c] === value) {
        conflictingCells.push({ row, col: c });
      }
    }
    if (conflictingCells.length > 0) {
      conflicts.push({
        row,
        col,
        type: 'row',
        conflictsWith: [...conflictingCells],
      });
    }

    conflictingCells.length = 0;
    for (let r = 0; r < 9; r++) {
      if (r !== row && grid[r][col] === value) {
        conflictingCells.push({ row: r, col });
      }
    }
    if (conflictingCells.length > 0) {
      conflicts.push({
        row,
        col,
        type: 'column',
        conflictsWith: [...conflictingCells],
      });
    }

    const boxStartRow = Math.floor(row / 3) * 3;
    const boxStartCol = Math.floor(col / 3) * 3;
    conflictingCells.length = 0;

    for (let r = boxStartRow; r < boxStartRow + 3; r++) {
      for (let c = boxStartCol; c < boxStartCol + 3; c++) {
        if ((r !== row || c !== col) && grid[r][c] === value) {
          conflictingCells.push({ row: r, col: c });
        }
      }
    }
    if (conflictingCells.length > 0) {
      conflicts.push({
        row,
        col,
        type: 'box',
        conflictsWith: [...conflictingCells],
      });
    }

    return conflicts;
  }

  static getAllConflicts(grid: Grid): Map<string, ConflictInfo[]> {
    const conflictMap = new Map<string, ConflictInfo[]>();

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const value = grid[row][col];
        if (value !== null) {
          const conflicts = this.validateCell(grid, row, col, value);
          if (conflicts.length > 0) {
            conflictMap.set(`${row}-${col}`, conflicts);
          }
        }
      }
    }

    return conflictMap;
  }

  static isGridComplete(grid: Grid): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === null) return false;
      }
    }
    return true;
  }

  static isGridValid(grid: Grid): boolean {
    return this.getAllConflicts(grid).size === 0;
  }

  static isGridSolved(grid: Grid, solution: Grid): boolean {
    if (!this.isGridComplete(grid)) return false;
    if (!this.isGridValid(grid)) return false;

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] !== solution[row][col]) return false;
      }
    }

    return true;
  }
}
