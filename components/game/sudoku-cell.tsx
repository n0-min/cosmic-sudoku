'use client';

import { motion } from 'framer-motion';
import type { Cell as CellType, Notes } from '@/types/sudoku';
import { useGameStore } from '@/lib/store/game-store';
import { useUserStore } from '@/lib/store/user-store';
import { getSkinById } from '@/lib/skins/material-skins';

interface SudokuCellProps {
  value: CellType;
  notes: Notes;
  row: number;
  col: number;
  isGiven: boolean;
  isSelected: boolean;
  isInSameRow: boolean;
  isInSameCol: boolean;
  isInSameBox: boolean;
  isSameNumber: boolean;
  hasConflict: boolean;
  isPaused: boolean;
  isComplete: boolean;
  notesMode: boolean;
  onClick: () => void;
}

export function SudokuCell({
  value,
  notes,
  row,
  col,
  isGiven,
  isSelected,
  isInSameRow,
  isInSameCol,
  isInSameBox,
  isSameNumber,
  hasConflict,
  isPaused,
  isComplete,
  notesMode,
  onClick,
}: SudokuCellProps) {
  const isRightEdge = col % 3 === 2 && col !== 8;
  const isBottomEdge = row % 3 === 2 && row !== 8;
  const isLeftEdge = col % 3 === 0 && col !== 0;
  const isTopEdge = row % 3 === 0 && row !== 0;
  const { lastMistakeCell } = useGameStore();
  const { currentSkin } = useUserStore();
  const skin = getSkinById(currentSkin);

  const isMistakeCell = lastMistakeCell?.row === row && lastMistakeCell?.col === col;

  const getCellBackground = () => {
    if (isPaused) return skin.grid.cellBg;
    if (hasConflict) return 'rgba(220, 38, 38, 0.3)';
    if (isSelected) return skin.grid.selectedCell;
    if (isSameNumber && value !== null) return skin.grid.cellBgHover;
    if (isInSameRow || isInSameCol || isInSameBox) return skin.grid.cellBgHover;
    if (isGiven) return skin.grid.cellBg;
    return skin.grid.cellBg;
  };

  const getCellTextColor = () => {
    if (hasConflict) return '#FF6B6B';
    if (isGiven) return skin.numbers.given;
    return skin.numbers.user;
  };

  const getCellRing = () => {
    if (isSelected) return `ring-2`;
    if (hasConflict) return 'ring-2 ring-[#DC2626]';
    return '';
  };

  const getCellShadow = () => {
    if (isMistakeCell) {
      return { boxShadow: '0 0 40px rgba(220, 38, 38, 0.9), 0 0 60px rgba(239, 68, 68, 0.6), inset 0 0 30px rgba(220, 38, 38, 0.5)' };
    }
    if (isSelected) {
      return { boxShadow: skin.grid.selectedGlow };
    }
    if (hasConflict) {
      return { boxShadow: '0 0 20px rgba(220, 38, 38, 0.4)' };
    }
    return {};
  };

  const renderNotes = () => {
    if (notes.size === 0) return null;

    return (
      <div className="grid grid-cols-3 gap-0 w-full h-full p-0.5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <div
            key={num}
            className="flex items-center justify-center text-[8px] sm:text-[10px] text-[#8A9BB8] font-data"
          >
            {notes.has(num) ? num : ''}
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={isGiven || isComplete || isPaused}
      whileHover={!isGiven && !isComplete && !isPaused ? { scale: 1.08 } : {}}
      whileTap={!isGiven && !isComplete && !isPaused ? { scale: 0.92 } : {}}
      className={`
        w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center font-data text-lg sm:text-xl md:text-2xl font-semibold
        transition-all duration-300 relative
        border-r border-b border-l border-t
        ${isRightEdge ? 'border-r-[3px]' : ''}
        ${isBottomEdge ? 'border-b-[3px]' : ''}
        ${isLeftEdge ? 'border-l-[3px]' : ''}
        ${isTopEdge ? 'border-t-[3px]' : ''}
        ${getCellRing()}
        ${!isGiven && !isComplete && !isPaused ? 'cursor-pointer gravitational-pull active:scale-95' : ''}
        ${isGiven ? 'cursor-not-allowed' : ''}
        ${isPaused ? 'blur-sm' : ''}
        ${hasConflict ? 'glow-error error-cell' : ''}
        ${isSelected ? 'glow-orbital' : ''}
        ${isMistakeCell ? 'mistake-cell' : ''}
      `}
      style={{
        ...getCellShadow(),
        background: getCellBackground(),
        color: getCellTextColor(),
        borderColor: skin.grid.border,
        borderRightColor: isRightEdge ? skin.grid.border : skin.grid.border,
        borderBottomColor: isBottomEdge ? skin.grid.border : skin.grid.border,
        borderLeftColor: isLeftEdge ? skin.grid.border : skin.grid.border,
        borderTopColor: isTopEdge ? skin.grid.border : skin.grid.border,
        borderRightWidth: isRightEdge ? '3px' : '1px',
        borderBottomWidth: isBottomEdge ? '3px' : '1px',
        borderLeftWidth: isLeftEdge ? '3px' : '1px',
        borderTopWidth: isTopEdge ? '3px' : '1px',
      }}
    >
      {!isPaused && value !== null && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {value}
        </motion.span>
      )}
      {!isPaused && value === null && renderNotes()}
    </motion.button>
  );
}
