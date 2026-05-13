'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store/game-store';

export function AICoach() {
  const { puzzle, currentGrid, isPaused, isComplete, selectedCell } = useGameStore();
  const [hint, setHint] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getAIHint = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          puzzle,
          currentGrid,
          selectedCell,
        }),
      });

      const data = await response.json();
      setHint(data.hint);
    } catch (error) {
      console.error('Failed to get AI hint:', error);
      setHint('Unable to get hint at this time. Try analyzing the row, column, and 3x3 box constraints.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isPaused || isComplete || !selectedCell) return null;

  // Check if selected cell is empty
  const isSelectedCellEmpty = currentGrid[selectedCell.row][selectedCell.col] === null &&
                               puzzle[selectedCell.row][selectedCell.col] === null;

  if (!isSelectedCellEmpty) return null;

  return (
    <div className="w-full max-w-md">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={getAIHint}
        disabled={isLoading}
        className="w-full px-6 py-3 bg-gradient-to-r from-[#06B6D4] to-[#0284C7] hover:from-[#0891B2] hover:to-[#0369A1] disabled:from-[#4B5563] disabled:to-[#6B7280] text-white font-ui uppercase tracking-wider rounded-lg transition-all glow-medium nebula-edge"
      >
        {isLoading ? '🤖 Analyzing...' : '🤖 Ask AI Coach'}
      </motion.button>

      <AnimatePresence>
        {hint && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 bg-[#1A2744]/90 backdrop-blur rounded-lg border border-[#06B6D4]/40 nebula-edge"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-[#06B6D4] font-ui font-bold uppercase tracking-wider text-sm">AI Coach Says:</h3>
              <button
                onClick={() => setHint(null)}
                className="text-[#8A9BB8] hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <p className="text-white text-sm leading-relaxed whitespace-pre-wrap font-ui">{hint}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
