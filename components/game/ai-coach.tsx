'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store/game-store';

export function AICoach() {
  const { puzzle, currentGrid, isPaused, isComplete } = useGameStore();
  const [hint, setHint] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

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

  if (isPaused || isComplete) return null;

  return (
    <div className="w-full max-w-md">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={getAIHint}
        disabled={isLoading}
        className="w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold rounded-lg transition-all shadow-lg"
      >
        {isLoading ? '🤖 Analyzing...' : '🤖 Ask AI Coach'}
      </motion.button>

      <AnimatePresence>
        {hint && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 bg-slate-800/80 backdrop-blur rounded-lg border border-cyan-500/30"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-cyan-400 font-semibold">AI Coach Says:</h3>
              <button
                onClick={() => setHint(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{hint}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
