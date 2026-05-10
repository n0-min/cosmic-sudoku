'use client';

import { useGameStore } from '@/lib/store/game-store';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function GameTimer() {
  const { elapsedTime, updateTimer, isPaused, isComplete } = useGameStore();
  const [tensionLevel, setTensionLevel] = useState(0);

  useEffect(() => {
    if (isPaused || isComplete) return;

    const interval = setInterval(() => {
      updateTimer();
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused, isComplete, updateTimer]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const timeLimit = 20 * 60 * 1000; // 20 minutes
  const timeRemaining = timeLimit - elapsedTime;
  const percentageRemaining = (timeRemaining / timeLimit) * 100;

  useEffect(() => {
    if (percentageRemaining < 20) {
      setTensionLevel(3);
    } else if (percentageRemaining < 40) {
      setTensionLevel(2);
    } else if (percentageRemaining < 60) {
      setTensionLevel(1);
    } else {
      setTensionLevel(0);
    }
  }, [percentageRemaining]);

  const getTimerColor = () => {
    if (tensionLevel === 3) return 'text-red-500';
    if (tensionLevel === 2) return 'text-orange-500';
    if (tensionLevel === 1) return 'text-yellow-500';
    return 'text-blue-400';
  };

  const getGlowColor = () => {
    if (tensionLevel === 3) return 'shadow-red-500/50';
    if (tensionLevel === 2) return 'shadow-orange-500/50';
    if (tensionLevel === 1) return 'shadow-yellow-500/50';
    return 'shadow-blue-500/50';
  };

  return (
    <motion.div
      animate={
        tensionLevel >= 2
          ? {
              scale: [1, 1.05, 1],
              transition: { duration: 0.5, repeat: Infinity },
            }
          : {}
      }
      className={`text-4xl font-bold ${getTimerColor()} ${getGlowColor()} shadow-lg`}
    >
      {isPaused ? 'PAUSED' : formatTime(elapsedTime)}
    </motion.div>
  );
}
