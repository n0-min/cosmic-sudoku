'use client';

import { useGameStore } from '@/lib/store/game-store';
import { getThemeForLevel, getProgressInTheme } from '@/lib/progression/themes';
import { motion } from 'framer-motion';

export function ProgressionDisplay() {
  const { level } = useGameStore();
  const theme = getThemeForLevel(level);
  const progress = getProgressInTheme(level);

  return (
    <div className="w-full max-w-md">
      <div className="bg-slate-800/50 backdrop-blur rounded-lg p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-400">Current Zone</div>
            <div className="text-xl font-bold">{theme.displayName}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Level</div>
            <div className="text-3xl font-bold text-purple-400">{level}</div>
          </div>
        </div>

        <p className="text-sm text-gray-300">{theme.description}</p>

        {theme.levelRange[1] !== Infinity && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Progress in {theme.displayName}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${theme.gradient}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Level {theme.levelRange[0]}</span>
              <span>Level {theme.levelRange[1]}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
