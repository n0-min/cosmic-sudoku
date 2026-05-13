'use client';

import { useGameStore } from '@/lib/store/game-store';
import { useUserStore } from '@/lib/store/user-store';
import { getSkinById } from '@/lib/skins/material-skins';
import { motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import { SudokuCell } from './sudoku-cell';

export function SudokuGrid() {
  const {
    puzzle,
    currentGrid,
    notes,
    selectedCell,
    notesMode,
    isComplete,
    isPaused,
    setCell,
    toggleNote,
    setSelectedCell,
    clearSelectedCell,
    toggleNotesMode,
    getConflicts,
  } = useGameStore();

  const { currentSkin } = useUserStore();
  const skin = getSkinById(currentSkin);

  const conflicts = useMemo(() => getConflicts(), [currentGrid]);

  const handleCellClick = (row: number, col: number) => {
    if (puzzle[row][col] === null && !isComplete && !isPaused) {
      setSelectedCell(row, col);
    }
  };

  const handleNumberInput = (num: number) => {
    if (selectedCell && !isComplete && !isPaused) {
      if (notesMode) {
        toggleNote(selectedCell.row, selectedCell.col, num);
      } else {
        setCell(selectedCell.row, selectedCell.col, num);
      }
    }
  };

  const handleClear = () => {
    if (selectedCell && !isComplete && !isPaused) {
      setCell(selectedCell.row, selectedCell.col, null);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isComplete || isPaused) return;

      if (e.key.toLowerCase() === 'n') {
        toggleNotesMode();
        return;
      }

      if (!selectedCell) return;

      if (e.key >= '1' && e.key <= '9') {
        handleNumberInput(parseInt(e.key));
      } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        handleClear();
      } else if (e.key === 'Escape') {
        clearSelectedCell();
      } else if (e.key === 'ArrowUp' && selectedCell.row > 0) {
        setSelectedCell(selectedCell.row - 1, selectedCell.col);
      } else if (e.key === 'ArrowDown' && selectedCell.row < 8) {
        setSelectedCell(selectedCell.row + 1, selectedCell.col);
      } else if (e.key === 'ArrowLeft' && selectedCell.col > 0) {
        setSelectedCell(selectedCell.row, selectedCell.col - 1);
      } else if (e.key === 'ArrowRight' && selectedCell.col < 8) {
        setSelectedCell(selectedCell.row, selectedCell.col + 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedCell, isComplete, isPaused, notesMode]);

  const selectedValue = selectedCell ? currentGrid[selectedCell.row][selectedCell.col] : null;

  // Count how many times each number appears in the grid
  const getNumberCount = (num: number): number => {
    let count = 0;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (currentGrid[row][col] === num) {
          count++;
        }
      }
    }
    return count;
  };

  // Check if a number is complete (appears 9 times)
  const isNumberComplete = (num: number): boolean => {
    return getNumberCount(num) === 9;
  };

  return (
    <div className="flex flex-col items-center gap-[1.618rem]">
      {/* Notes Mode Toggle */}
      {!isPaused && !isComplete && (
        <motion.button
          onClick={toggleNotesMode}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-6 py-3 rounded-lg font-ui uppercase tracking-wider transition-all ${
            notesMode
              ? 'bg-gradient-to-r from-[#00F5FF] to-[#06B6D4] text-[#0A0E1A] glow-medium'
              : 'bg-[#1A2744]/80 text-white hover:bg-[#2A3F5F]/80'
          } nebula-edge`}
        >
          {notesMode ? '✏️ Notes Mode (N)' : '🔢 Number Mode (N)'}
        </motion.button>
      )}

      {/* Star Map Grid */}
      <div
        className="grid grid-cols-9 gap-0 overflow-hidden p-2"
        style={{
          background: `linear-gradient(135deg, ${skin.background.gradient.join(', ')})`,
        }}
      >
        {/* Inner border around the grid cells */}
        <div
          className="col-span-9 row-span-9 grid grid-cols-9 gap-0 backdrop-blur-xl"
          style={{
            gridColumn: '1 / -1',
            gridRow: '1 / -1',
            border: `2px solid ${skin.grid.border}`,
            boxShadow: `inset 0 0 20px ${skin.grid.borderGlow}`,
            background: skin.grid.cellBg,
          }}
        >
          {currentGrid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isGiven = puzzle[rowIndex][colIndex] !== null;
              const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
              const isInSameRow = selectedCell?.row === rowIndex;
              const isInSameCol = selectedCell?.col === colIndex;
              const isInSameBox =
                selectedCell !== null &&
                Math.floor(selectedCell.row / 3) === Math.floor(rowIndex / 3) &&
                Math.floor(selectedCell.col / 3) === Math.floor(colIndex / 3);
              const isSameNumber = selectedValue !== null && cell === selectedValue && cell !== null;
              const hasConflict = conflicts.has(`${rowIndex}-${colIndex}`);

              return (
                <SudokuCell
                  key={`${rowIndex}-${colIndex}`}
                  value={cell}
                  notes={notes[rowIndex][colIndex]}
                  row={rowIndex}
                  col={colIndex}
                  isGiven={isGiven}
                  isSelected={isSelected}
                  isInSameRow={isInSameRow}
                  isInSameCol={isInSameCol}
                  isInSameBox={isInSameBox}
                  isSameNumber={isSameNumber}
                  hasConflict={hasConflict}
                  isPaused={isPaused}
                  isComplete={isComplete}
                  notesMode={notesMode}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Number Input Pad */}
      {!isPaused && !isComplete && (
        <div className="grid grid-cols-9 gap-2 sm:gap-[0.618rem] w-full max-w-md">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
            const isComplete = isNumberComplete(num);

            if (isComplete) {
              return null; // Hide button if number is complete
            }

            return (
              <motion.button
                key={num}
                onClick={() => handleNumberInput(num)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-full aspect-square min-h-[44px] bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] hover:from-[#9333EA] hover:to-[#7C3AED] active:from-[#7C3AED] active:to-[#6D28D9] text-white font-data font-bold text-base sm:text-lg rounded-lg transition-all nebula-edge touch-manipulation"
                style={{
                  boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
                }}
              >
                {num}
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Clear Button */}
      {!isPaused && !isComplete && selectedCell && (
        <motion.button
          onClick={handleClear}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-gradient-to-r from-[#DC2626] to-[#991B1B] hover:from-[#EF4444] hover:to-[#DC2626] text-white font-ui uppercase tracking-wider rounded-lg transition-all glow-soft"
        >
          Clear Cell
        </motion.button>
      )}
    </div>
  );
}
