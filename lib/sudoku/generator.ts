import type { Grid, Cell, Difficulty, SudokuPuzzle } from '@/types/sudoku';

export class SudokuGenerator {
  private static readonly SIZE = 9;
  private static readonly BOX_SIZE = 3;

  private static isValid(grid: Grid, row: number, col: number, num: number): boolean {
    for (let x = 0; x < this.SIZE; x++) {
      if (grid[row][x] === num || grid[x][col] === num) {
        return false;
      }
    }

    const boxRow = Math.floor(row / this.BOX_SIZE) * this.BOX_SIZE;
    const boxCol = Math.floor(col / this.BOX_SIZE) * this.BOX_SIZE;

    for (let i = 0; i < this.BOX_SIZE; i++) {
      for (let j = 0; j < this.BOX_SIZE; j++) {
        if (grid[boxRow + i][boxCol + j] === num) {
          return false;
        }
      }
    }

    return true;
  }

  private static solveSudoku(grid: Grid): boolean {
    for (let row = 0; row < this.SIZE; row++) {
      for (let col = 0; col < this.SIZE; col++) {
        if (grid[row][col] === null) {
          const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

          for (const num of numbers) {
            if (this.isValid(grid, row, col, num)) {
              grid[row][col] = num;

              if (this.solveSudoku(grid)) {
                return true;
              }

              grid[row][col] = null;
            }
          }

          return false;
        }
      }
    }

    return true;
  }

  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private static createEmptyGrid(): Grid {
    return Array(this.SIZE).fill(null).map(() => Array(this.SIZE).fill(null));
  }

  private static copyGrid(grid: Grid): Grid {
    return grid.map(row => [...row]);
  }

  private static generateFullGrid(): Grid {
    const grid = this.createEmptyGrid();
    this.solveSudoku(grid);
    return grid;
  }

  private static countSolutions(grid: Grid, limit: number = 2): number {
    let count = 0;

    const solve = (g: Grid): void => {
      if (count >= limit) return;

      for (let row = 0; row < this.SIZE; row++) {
        for (let col = 0; col < this.SIZE; col++) {
          if (g[row][col] === null) {
            for (let num = 1; num <= 9; num++) {
              if (this.isValid(g, row, col, num)) {
                g[row][col] = num;
                solve(g);
                g[row][col] = null;
              }
            }
            return;
          }
        }
      }

      count++;
    };

    solve(this.copyGrid(grid));
    return count;
  }

  private static getDifficultySettings(difficulty: Difficulty): number {
    const settings = {
      easy: 40,
      medium: 50,
      hard: 55,
      expert: 60
    };
    return settings[difficulty];
  }

  private static removeCells(grid: Grid, cellsToRemove: number): Grid {
    const puzzle = this.copyGrid(grid);
    let removed = 0;
    const attempts = cellsToRemove * 3;

    for (let i = 0; i < attempts && removed < cellsToRemove; i++) {
      const row = Math.floor(Math.random() * this.SIZE);
      const col = Math.floor(Math.random() * this.SIZE);

      if (puzzle[row][col] !== null) {
        const backup = puzzle[row][col];
        puzzle[row][col] = null;

        const solutions = this.countSolutions(puzzle, 2);

        if (solutions === 1) {
          removed++;
        } else {
          puzzle[row][col] = backup;
        }
      }
    }

    return puzzle;
  }

  static generate(difficulty: Difficulty, level: number): SudokuPuzzle {
    const solution = this.generateFullGrid();
    const cellsToRemove = this.getDifficultySettings(difficulty);
    const puzzle = this.removeCells(solution, cellsToRemove);

    return {
      puzzle,
      solution,
      difficulty,
      level
    };
  }

  static validate(grid: Grid, solution: Grid): { isValid: boolean; isComplete: boolean; errors: { row: number; col: number }[] } {
    const errors: { row: number; col: number }[] = [];
    let isComplete = true;

    for (let row = 0; row < this.SIZE; row++) {
      for (let col = 0; col < this.SIZE; col++) {
        const cell = grid[row][col];

        if (cell === null) {
          isComplete = false;
        } else if (cell !== solution[row][col]) {
          errors.push({ row, col });
        }
      }
    }

    return {
      isValid: errors.length === 0,
      isComplete: isComplete && errors.length === 0,
      errors
    };
  }
}
