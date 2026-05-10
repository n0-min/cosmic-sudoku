'use client';

import { useGameStore } from '@/lib/store/game-store';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

export function TensionVFX() {
  const { elapsedTime, isPaused, isComplete } = useGameStore();

  const timeLimit = 20 * 60 * 1000;
  const timeRemaining = timeLimit - elapsedTime;
  const percentageRemaining = (timeRemaining / timeLimit) * 100;

  const tensionLevel = percentageRemaining < 20 ? 3 : percentageRemaining < 40 ? 2 : percentageRemaining < 60 ? 1 : 0;

  useEffect(() => {
    if (tensionLevel >= 2 && !isPaused && !isComplete) {
      document.body.style.animation = 'screenShake 0.5s infinite';
    } else {
      document.body.style.animation = '';
    }

    return () => {
      document.body.style.animation = '';
    };
  }, [tensionLevel, isPaused, isComplete]);

  if (isPaused || isComplete || tensionLevel === 0) return null;

  const getVignetteOpacity = () => {
    if (tensionLevel === 3) return 0.6;
    if (tensionLevel === 2) return 0.4;
    return 0.2;
  };

  const getGlitchIntensity = () => {
    if (tensionLevel === 3) return 'animate-glitch-intense';
    if (tensionLevel === 2) return 'animate-glitch-medium';
    return 'animate-glitch-light';
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

      {tensionLevel === 3 && (
        <div className={`fixed inset-0 pointer-events-none z-40 ${getGlitchIntensity()}`}>
          <div className="absolute inset-0 bg-red-500/5" />
        </div>
      )}
    </>
  );
}
