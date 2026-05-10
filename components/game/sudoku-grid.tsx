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
    <div className="flex flex-col items-center gap-[1.618rem]">
      {/* Star Map Grid */}
      <div
        className="grid grid-cols-9 gap-0 rounded-2xl overflow-hidden bg-[#0A0E1A]/80 backdrop-blur-xl p-2"
        style={{
          boxShadow: '0 0 60px rgba(139, 92, 246, 0.3), inset 0 0 40px rgba(139, 92, 246, 0.1)',
          border: '2px solid rgba(139, 92, 246, 0.4)',
        }}
      >
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

            // Nebula edge luminescence for 3x3 boundaries
            const isRightEdge = colIndex % 3 === 2 && colIndex !== 8;
            const isBottomEdge = rowIndex % 3 === 2 && rowIndex !== 8;

            return (
              <motion.button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                disabled={isGiven || isComplete || isPaused}
                whileHover={!isGiven && !isComplete && !isPaused ? { scale: 1.08 } : {}}
                whileTap={!isGiven && !isComplete && !isPaused ? { scale: 0.92 } : {}}
                className={`
                  w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center font-data text-xl sm:text-2xl font-semibold
                  transition-all duration-300 relative
                  ${isRightEdge ? 'border-r-2' : 'border-r'}
                  ${isBottomEdge ? 'border-b-2' : 'border-b'}
                  ${isRightEdge || isBottomEdge ? 'border-[#8B5CF6]' : 'border-[#1A2744]'}
                  ${isGiven ? 'text-[#00F5FF] bg-[#1A2744]/60 cursor-not-allowed' : 'text-white bg-[#0A0E1A]/40'}
                  ${isSelected ? 'bg-[#8B5CF6]/40 ring-2 ring-[#00F5FF] glow-orbital' : ''}
                  ${!isSelected && (isInSameRow || isInSameCol || isInSameBox) ? 'bg-[#8B5CF6]/10' : ''}
                  ${!isGiven && !isComplete && !isPaused ? 'hover:bg-[#8B5CF6]/30 cursor-pointer gravitational-pull' : ''}
                  ${isPaused ? 'blur-sm' : ''}
                `}
                style={
                  isSelected
                    ? {
                        boxShadow: '0 0 30px rgba(0, 245, 255, 0.5), inset 0 0 20px rgba(139, 92, 246, 0.3)',
                      }
                    : isRightEdge || isBottomEdge
                    ? {
                        boxShadow: '0 0 10px rgba(139, 92, 246, 0.2)',
                      }
                    : {}
                }
              >
                {!isPaused && cell !== null && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {cell}
                  </motion.span>
                )}
              </motion.button>
            );
          })
        )}
      </div>

      {/* Number Input Pad */}
      {!isPaused && !isComplete && (
        <div className="grid grid-cols-9 gap-[0.618rem]">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <motion.button
              key={num}
              onClick={() => handleNumberInput(num)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] hover:from-[#9333EA] hover:to-[#7C3AED] text-white font-data font-bold text-lg rounded-lg transition-all nebula-edge"
              style={{
                boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
              }}
            >
              {num}
            </motion.button>
          ))}
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
