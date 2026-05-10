'use client';

import { useGameStore } from '@/lib/store/game-store';
import { useUserStore } from '@/lib/store/user-store';
import { motion } from 'framer-motion';
import type { Difficulty } from '@/types/sudoku';
import { useEffect, useState } from 'react';

export function GameControls() {
  const {
    pauseGame,
    resumeGame,
    resetGame,
    startNewGame,
    isPaused,
    isComplete,
    difficulty,
    level,
    mistakes,
    hintsUsed,
    elapsedTime
  } = useGameStore();

  const { addCoins } = useUserStore();
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [hasRewarded, setHasRewarded] = useState(false);

  useEffect(() => {
    if (isComplete && !hasRewarded) {
      const baseCoins = {
        easy: 10,
        medium: 25,
        hard: 50,
        expert: 100,
      }[difficulty];

      const timeSeconds = Math.floor(elapsedTime / 1000);
      const timeBonus = timeSeconds < 300 ? 50 : timeSeconds < 600 ? 25 : 0;
      const mistakePenalty = mistakes * 5;

      const totalCoins = Math.max(baseCoins + timeBonus - mistakePenalty, baseCoins / 2);

      setCoinsEarned(Math.floor(totalCoins));
      addCoins(Math.floor(totalCoins));
      setHasRewarded(true);
    }
  }, [isComplete, hasRewarded, difficulty, elapsedTime, mistakes, addCoins]);

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    startNewGame(newDifficulty, level);
    setHasRewarded(false);
  };

  const handleNextLevel = () => {
    startNewGame(difficulty, level + 1);
    setHasRewarded(false);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div className="flex justify-between items-center bg-slate-800/50 backdrop-blur rounded-lg p-4">
        <div className="text-sm">
          <div className="text-gray-400">Level</div>
          <div className="text-2xl font-bold text-purple-400">{level}</div>
        </div>
        <div className="text-sm">
          <div className="text-gray-400">Mistakes</div>
          <div className="text-2xl font-bold text-red-400">{mistakes}</div>
        </div>
        <div className="text-sm">
          <div className="text-gray-400">Hints</div>
          <div className="text-2xl font-bold text-blue-400">{hintsUsed}</div>
        </div>
      </div>

      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isPaused ? resumeGame : pauseGame}
          disabled={isComplete}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
        >
          {isPaused ? 'Resume' : 'Pause'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetGame}
          disabled={isComplete}
          className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
        >
          Reset
        </motion.button>
      </div>

      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-center"
        >
          <h2 className="text-3xl font-bold mb-2">🎉 Completed!</h2>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="mb-4 text-2xl font-bold text-yellow-300"
          >
            💰 +{coinsEarned} Cosmic Coins!
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextLevel}
            className="px-6 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Next Level
          </motion.button>
        </motion.div>
      )}

      <div className="flex gap-2">
        {(['easy', 'medium', 'hard', 'expert'] as Difficulty[]).map((diff) => (
          <motion.button
            key={diff}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDifficultyChange(diff)}
            className={`flex-1 px-3 py-2 font-semibold rounded-lg transition-colors capitalize ${
              difficulty === diff
                ? 'bg-purple-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            {diff}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
