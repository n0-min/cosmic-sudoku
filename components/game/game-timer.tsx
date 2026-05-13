'use client';

import { useGameStore } from '@/lib/store/game-store';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function GameTimer() {
  const { elapsedTime, updateTimer, isPaused, isComplete, isFailed } = useGameStore();
  const [tensionLevel, setTensionLevel] = useState(0);

  useEffect(() => {
    if (isPaused || isComplete || isFailed) return;

    const interval = setInterval(() => {
      updateTimer();
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused, isComplete, isFailed, updateTimer]);

  // Check if time is up
  useEffect(() => {
    if (isPaused || isComplete || isFailed) return;

    const timeLimit = 30 * 60 * 1000; // 30 minutes
    if (elapsedTime >= timeLimit) {
      // Time's up - trigger game over
      useGameStore.getState().triggerTimeUp();
    }
  }, [elapsedTime, isPaused, isComplete, isFailed]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const timeLimit = 30 * 60 * 1000; // 30 minutes
  const timeRemaining = Math.max(0, timeLimit - elapsedTime);
  const percentageRemaining = (timeRemaining / timeLimit) * 100;
  const minutesRemaining = Math.floor(timeRemaining / 60000);

  useEffect(() => {
    if (minutesRemaining < 5) {
      setTensionLevel(3); // Last 5 minutes - critical
    } else if (minutesRemaining < 10) {
      setTensionLevel(2); // 5-10 minutes - high tension
    } else if (minutesRemaining < 15) {
      setTensionLevel(1); // 10-15 minutes - medium tension
    } else {
      setTensionLevel(0); // More than 15 minutes - calm
    }
  }, [minutesRemaining]);

  const getTimerColor = () => {
    if (tensionLevel === 3) return 'text-[#DC2626]';
    if (tensionLevel === 2) return 'text-[#F59E0B]';
    if (tensionLevel === 1) return 'text-[#FCD34D]';
    return 'text-[#00F5FF]';
  };

  const getBorderColor = () => {
    if (tensionLevel === 3) return 'rgba(220, 38, 38, 0.6)';
    if (tensionLevel === 2) return 'rgba(245, 158, 11, 0.6)';
    if (tensionLevel === 1) return 'rgba(252, 211, 77, 0.6)';
    return 'rgba(0, 245, 255, 0.6)';
  };

  const getGlowColor = () => {
    if (tensionLevel === 3) return '0 0 40px rgba(220, 38, 38, 0.6), inset 0 0 20px rgba(220, 38, 38, 0.2)';
    if (tensionLevel === 2) return '0 0 40px rgba(245, 158, 11, 0.6), inset 0 0 20px rgba(245, 158, 11, 0.2)';
    if (tensionLevel === 1) return '0 0 40px rgba(252, 211, 77, 0.6), inset 0 0 20px rgba(252, 211, 77, 0.2)';
    return '0 0 40px rgba(0, 245, 255, 0.6), inset 0 0 20px rgba(0, 245, 255, 0.2)';
  };

  return (
    <motion.div
      animate={
        tensionLevel >= 2
          ? {
              scale: [1, 1.02, 1],
              transition: { duration: 0.5, repeat: Infinity },
            }
          : {}
      }
      className="relative px-8 py-6 bg-[#0A0E1A]/80 backdrop-blur-xl rounded-xl mx-4"
      style={{
        border: `2px solid ${getBorderColor()}`,
        boxShadow: getGlowColor(),
        maxWidth: '400px',
        width: '100%',
      }}
    >
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-50"
        style={{
          width: `${percentageRemaining}%`,
          transition: 'width 0.1s linear',
        }}
      />

      {/* Timer display */}
      <div className="flex flex-col items-center gap-2">
        <div className="font-ui text-xs text-[#8A9BB8] uppercase tracking-widest">
          {isPaused ? 'PAUSED' : 'TIME REMAINING'}
        </div>
        <div className={`text-6xl font-data font-bold ${getTimerColor()} tracking-wider`}>
          {isPaused ? '--:--' : formatTime(timeRemaining)}
        </div>
      </div>

      {/* Warning indicator */}
      {tensionLevel >= 2 && !isPaused && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#DC2626]"
          style={{
            boxShadow: '0 0 20px rgba(220, 38, 38, 0.8)',
          }}
        />
      )}
    </motion.div>
  );
}
