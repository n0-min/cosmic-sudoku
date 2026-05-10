'use client';

import { useGameStore } from '@/lib/store/game-store';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function SudokuGrid() {
  const { puzzle, currentGrid, setCell, isComplete, isPaused } = useGameStore();
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  const handleCellClick = (row: number, col: number) => {
    if (puzzle[row][col] === null && !isComplete && !isPaused) {
      setSelectedCell({ row, col });
    }
  };

  const handleNumberInput = (num: number) => {
    if (selectedCell && !isComplete && !isPaused) {
      setCell(selectedCell.row, selectedCell.col, num);
    }
  };

  const handleClear = () => {
    if (selectedCell && !isComplete && !isPaused) {
      setCell(selectedCell.row, selectedCell.col, null);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedCell || isComplete || isPaused) return;

      if (e.key >= '1' && e.key <= '9') {
        handleNumberInput(parseInt(e.key));
      } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedCell, isComplete, isPaused]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="grid grid-cols-9 gap-0 border-4 border-purple-500 rounded-lg overflow-hidden bg-slate-900/50 backdrop-blur">
        {currentGrid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isGiven = puzzle[rowIndex][colIndex] !== null;
            const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
            const isInSameRow = selectedCell?.row === rowIndex;
            const isInSameCol = selectedCell?.col === colIndex;
            const isInSameBox =
              selectedCell &&
              Math.floor(selectedCell.row / 3) === Math.floor(rowIndex / 3) &&
              Math.floor(selectedCell.col / 3) === Math.floor(colIndex / 3);

            const borderClasses = [
              colIndex % 3 === 2 && colIndex !== 8 ? 'border-r-2 border-purple-500' : 'border-r border-slate-700',
              rowIndex % 3 === 2 && rowIndex !== 8 ? 'border-b-2 border-purple-500' : 'border-b border-slate-700',
            ].join(' ');

            return (
              <motion.button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                disabled={isGiven || isComplete || isPaused}
                whileHover={!isGiven && !isComplete && !isPaused ? { scale: 1.05 } : {}}
                whileTap={!isGiven && !isComplete && !isPaused ? { scale: 0.95 } : {}}
                className={`
                  w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-lg sm:text-xl font-bold
                  transition-colors duration-150
                  ${borderClasses}
                  ${isGiven ? 'text-blue-300 bg-slate-800/80 cursor-not-allowed' : 'text-white bg-slate-900/40'}
                  ${isSelected ? 'bg-purple-600/40 ring-2 ring-purple-400' : ''}
                  ${!isSelected && (isInSameRow || isInSameCol || isInSameBox) ? 'bg-purple-900/20' : ''}
                  ${!isGiven && !isComplete && !isPaused ? 'hover:bg-purple-800/30 cursor-pointer' : ''}
                  ${isPaused ? 'blur-sm' : ''}
                `}
              >
                {!isPaused && cell !== null && cell}
              </motion.button>
            );
          })
        )}
      </div>

      {!isPaused && !isComplete && (
        <div className="grid grid-cols-9 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <motion.button
              key={num}
              onClick={() => handleNumberInput(num)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-colors"
            >
              {num}
            </motion.button>
          ))}
        </div>
      )}

      {!isPaused && !isComplete && selectedCell && (
        <motion.button
          onClick={handleClear}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors"
        >
          Clear
        </motion.button>
      )}
    </div>
  );
}
