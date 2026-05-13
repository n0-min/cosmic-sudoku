'use client';

import { useGameStore } from '@/lib/store/game-store';
import { motion } from 'framer-motion';

export function GameControls() {
  const {
    pauseGame,
    resumeGame,
    resetGame,
    isPaused,
    isComplete,
    level,
    mistakes,
    hintsUsed,
    maxMistakes,
  } = useGameStore();

  return (
    <div className="flex flex-col gap-[1.618rem] w-full max-w-md">
      {/* Stats Display */}
      <div className="flex justify-between items-center bg-[#1A2744]/80 backdrop-blur rounded-xl p-[1.618rem] nebula-edge">
        <div className="text-center">
          <div className="font-ui text-xs text-[#8A9BB8] uppercase tracking-widest mb-1">Level</div>
          <div className="font-data text-3xl font-bold text-[#8B5CF6]">{level}</div>
        </div>
        <div className="text-center">
          <div className="font-ui text-xs text-[#8A9BB8] uppercase tracking-widest mb-1">Mistakes</div>
          <div className="font-data text-3xl font-bold text-[#DC2626]">{mistakes}/{maxMistakes}</div>
        </div>
        <div className="text-center">
          <div className="font-ui text-xs text-[#8A9BB8] uppercase tracking-widest mb-1">Hints</div>
          <div className="font-data text-3xl font-bold text-[#00F5FF]">{hintsUsed}</div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-[0.618rem]">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isPaused ? resumeGame : pauseGame}
          disabled={isComplete}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-[#00F5FF] to-[#06B6D4] hover:from-[#06B6D4] hover:to-[#00F5FF] disabled:from-[#1A2744] disabled:to-[#1A2744] disabled:cursor-not-allowed text-white font-ui uppercase tracking-wider rounded-lg transition-all glow-medium nebula-edge"
        >
          {isPaused ? '▶️ Resume' : '⏸️ Pause'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetGame}
          disabled={isComplete}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FFA500] to-[#FF8C00] hover:from-[#FF8C00] hover:to-[#FFA500] disabled:from-[#1A2744] disabled:to-[#1A2744] disabled:cursor-not-allowed text-white font-ui uppercase tracking-wider rounded-lg transition-all glow-soft nebula-edge"
        >
          🔄 Reset
        </motion.button>
      </div>
    </div>
  );
}
