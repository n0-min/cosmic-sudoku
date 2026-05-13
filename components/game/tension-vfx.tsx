'use client';

import { useGameStore } from '@/lib/store/game-store';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

export function TensionVFX() {
  const { elapsedTime, isPaused, isComplete, isFailed } = useGameStore();

  const timeLimit = 30 * 60 * 1000; // 30 minutes
  const timeRemaining = timeLimit - elapsedTime;
  const minutesRemaining = Math.floor(timeRemaining / 60000);

  // Tension levels based on minutes remaining
  const tensionLevel = minutesRemaining < 5 ? 3 : minutesRemaining < 10 ? 2 : minutesRemaining < 15 ? 1 : 0;

  useEffect(() => {
    // Only shake in last 5 minutes (tensionLevel 3)
    if (tensionLevel >= 3 && !isPaused && !isComplete && !isFailed) {
      document.body.style.animation = 'screenShake 0.8s infinite';
    } else {
      document.body.style.animation = '';
    }

    return () => {
      document.body.style.animation = '';
    };
  }, [tensionLevel, isPaused, isComplete, isFailed]);

  if (isPaused || isComplete || isFailed || tensionLevel === 0) return null;

  const getVignetteOpacity = () => {
    if (tensionLevel === 3) return 0.6;
    if (tensionLevel === 2) return 0.4;
    return 0.2;
  };

  const getGlitchIntensity = () => {
    if (tensionLevel === 3) return 'animate-glitch-medium';
    if (tensionLevel === 2) return 'animate-glitch-light';
    return '';
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 pointer-events-none z-50"
        animate={{
          background: [
            `radial-gradient(circle, transparent 40%, rgba(220, 38, 38, ${getVignetteOpacity()}) 100%)`,
            `radial-gradient(circle, transparent 40%, rgba(220, 38, 38, ${getVignetteOpacity() * 0.7}) 100%)`,
            `radial-gradient(circle, transparent 40%, rgba(220, 38, 38, ${getVignetteOpacity()}) 100%)`,
          ],
        }}
        transition={{ duration: 1, repeat: Infinity }}
      />

      {tensionLevel >= 2 && (
        <div className={`fixed inset-0 pointer-events-none z-40 ${getGlitchIntensity()}`}>
          <div className="absolute inset-0 bg-red-500/5" />
        </div>
      )}
    </>
  );
}
