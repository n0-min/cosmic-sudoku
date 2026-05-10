'use client';

import { useGameStore } from '@/lib/store/game-store';
import { getBackgroundForDifficulty } from '@/lib/backgrounds/cosmic-backgrounds';
import { motion } from 'framer-motion';

export function CosmicBackground() {
  const { difficulty } = useGameStore();
  const background = getBackgroundForDifficulty(difficulty);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-b ${background.gradient}`} />

      {/* Animated Stars */}
      <div className={`absolute inset-0 ${background.stars}`}>
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Planet/Celestial Body */}
      {background.planet && (
        <motion.div
          className={`absolute text-9xl ${background.animation}`}
          style={{
            right: '10%',
            top: '15%',
            filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.3))',
          }}
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {background.planet}
        </motion.div>
      )}

      {/* Nebula Effect for Expert */}
      {difficulty === 'expert' && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 30% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />
      )}

      {/* Shooting Stars */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`shooting-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 50}%`,
            top: `${Math.random() * 50}%`,
            boxShadow: '0 0 10px 2px rgba(255,255,255,0.8)',
          }}
          animate={{
            x: [0, 300],
            y: [0, 300],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 5 + Math.random() * 5,
            repeatDelay: 10,
          }}
        />
      ))}
    </div>
  );
}
