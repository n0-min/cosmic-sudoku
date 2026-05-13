'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/lib/store/user-store';
import { useGameStore } from '@/lib/store/game-store';
import { getSkinById } from '@/lib/skins/material-skins';

export function SkinEffects() {
  const { currentSkin } = useUserStore();
  const { lastMistakeCell } = useGameStore();
  const skin = getSkinById(currentSkin);
  const [isInverted, setIsInverted] = useState(false);

  // Memoize random positions to prevent re-renders
  const verticalRays = useMemo(() => {
    return [...Array(8)].map((_, i) => ({
      key: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
    }));
  }, [currentSkin]);

  useEffect(() => {
    // Apply skin colors to CSS variables
    document.documentElement.style.setProperty('--skin-primary', skin.numbers.given);
    document.documentElement.style.setProperty('--skin-secondary', skin.numbers.user);
    document.documentElement.style.setProperty('--skin-border', skin.grid.border);
    document.documentElement.style.setProperty('--skin-glow', skin.grid.borderGlow);
  }, [skin, currentSkin]);

  // Void skin error effect - invert colors for 1 second
  useEffect(() => {
    if (skin.id === 'void' && lastMistakeCell) {
      setIsInverted(true);
    } else if (skin.id === 'void' && !lastMistakeCell && isInverted) {
      // When lastMistakeCell is cleared, start fade out
      setIsInverted(false);
    }
  }, [lastMistakeCell, skin.id, isInverted]);

  // Reset inversion state on unmount
  useEffect(() => {
    return () => {
      setIsInverted(false);
    };
  }, []);

  // Void skin inversion overlay - with AnimatePresence for smooth exit
  const voidInversionOverlay = skin.id === 'void' ? (
    <AnimatePresence>
      {isInverted && (
        <motion.div
          key="void-inversion"
          className="fixed inset-0 pointer-events-none z-50"
          style={{
            mixBlendMode: 'difference',
            background: '#ffffff',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      )}
    </AnimatePresence>
  ) : null;

  // No effects for common rarity
  if (skin.rarity === 'common') {
    return voidInversionOverlay;
  }

  // Rare: Subtle particle effect
  if (skin.rarity === 'rare') {
    return (
      <>
        {voidInversionOverlay}
        <div key={currentSkin} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`${currentSkin}-particle-${i}`}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: `radial-gradient(circle, ${skin.grid.border}, transparent)`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                willChange: 'opacity, transform',
              }}
              initial={{ opacity: 0, scale: 0.5, y: 0 }}
              animate={{
                opacity: [0, 0.6, 0],
                scale: [0.5, 1.5, 0.5],
                y: [0, -100, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>
      </>
    );
  }

  // Epic: Animated rays and particles
  if (skin.rarity === 'epic') {
    // Quantum Grid - crystalline grid pulses with matrix digits
    if (skin.id === 'quantum') {
      return (
        <>
          {voidInversionOverlay}
          <div key={currentSkin} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Horizontal grid lines */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`${currentSkin}-h-${i}`}
                className="absolute left-0 right-0 h-px"
                style={{
                  top: `${(i + 1) * 8}%`,
                  background: `linear-gradient(to right, transparent, ${skin.grid.borderGlow}, transparent)`,
                  willChange: 'opacity',
                }}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0.4, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}

            {/* Vertical grid lines */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`${currentSkin}-v-${i}`}
                className="absolute top-0 bottom-0 w-px"
                style={{
                  left: `${(i + 1) * 8}%`,
                  background: `linear-gradient(to bottom, transparent, ${skin.grid.borderGlow}, transparent)`,
                  willChange: 'opacity',
                }}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0.4, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}

            {/* Falling matrix digits */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`${currentSkin}-digit-${i}`}
                className="absolute font-data text-lg"
                style={{
                  left: `${Math.random() * 100}%`,
                  color: skin.grid.border,
                  textShadow: `0 0 10px ${skin.grid.borderGlow}`,
                  willChange: 'transform, opacity',
                }}
                initial={{ y: -50, opacity: 0 }}
                animate={{
                  y: ['0vh', '100vh'],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 5 + Math.random() * 5,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: 'linear',
                }}
              >
                {Math.floor(Math.random() * 10)}
              </motion.div>
            ))}
          </div>
        </>
      );
    }

    // Black Hole - event horizon
    return (
      <>
        {voidInversionOverlay}
        <div key={currentSkin} className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
          {/* Event Horizon - central black circle */}
          <motion.div
            key={`${currentSkin}-horizon`}
            className="absolute rounded-full"
            style={{
              left: '50%',
              top: '50%',
              width: '800px',
              height: '800px',
              marginLeft: '-400px',
              marginTop: '-400px',
              background: '#000000',
              border: `3px solid ${skin.grid.border}`,
              boxShadow: `0 0 100px ${skin.grid.borderGlow}, inset 0 0 100px ${skin.grid.borderGlow}`,
              willChange: 'transform',
              zIndex: 10,
            }}
            initial={{ scale: 1 }}
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Accretion disk glow */}
          <motion.div
            key={`${currentSkin}-disk`}
            className="absolute rounded-full"
            style={{
              left: '50%',
              top: '50%',
              width: '1000px',
              height: '1000px',
              marginLeft: '-500px',
              marginTop: '-500px',
              background: `radial-gradient(circle, transparent 40%, ${skin.grid.borderGlow} 50%, transparent 60%)`,
              willChange: 'opacity, transform',
              zIndex: 5,
            }}
            initial={{ opacity: 0.3, rotate: 0 }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              rotate: 360,
            }}
            transition={{
              opacity: { duration: 3, repeat: Infinity },
              rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
            }}
          />

          {/* Orbiting particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`${currentSkin}-particle-${i}`}
              className="absolute w-3 h-3 rounded-full"
              style={{
                left: '50%',
                top: '50%',
                background: skin.grid.border,
                boxShadow: `0 0 10px ${skin.grid.borderGlow}`,
                willChange: 'transform',
                zIndex: 8,
              }}
              initial={{ x: 0, y: 0 }}
              animate={{
                x: [
                  Math.cos((i * Math.PI * 2) / 8) * 450,
                  Math.cos((i * Math.PI * 2) / 8 + Math.PI) * 450,
                  Math.cos((i * Math.PI * 2) / 8) * 450,
                ],
                y: [
                  Math.sin((i * Math.PI * 2) / 8) * 450,
                  Math.sin((i * Math.PI * 2) / 8 + Math.PI) * 450,
                  Math.sin((i * Math.PI * 2) / 8) * 450,
                ],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                delay: i * 0.5,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      </>
    );
  }

  // Legendary: Full screen transformation with intense effects
  if (skin.rarity === 'legendary') {
    // Void Ceremony - return only the inversion effect
    if (skin.id === 'void') {
      return voidInversionOverlay;
    }

    // Default Legendary effect (Supernova)
    return (
      <>
        {voidInversionOverlay}
        <div key={currentSkin} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Animated background overlay */}
          <motion.div
            key={`${currentSkin}-bg`}
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${skin.background.gradient.join(', ')})`,
              opacity: 0.3,
              willChange: 'opacity',
            }}
            initial={{ opacity: 0.2 }}
            animate={{
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
            }}
          />

          {/* Vertical rays from top to bottom */}
          {verticalRays.map((ray) => (
            <motion.div
              key={`${currentSkin}-ray-${ray.key}`}
              className="absolute top-0 w-1 h-full"
              style={{
                left: `${ray.left}%`,
                background: `linear-gradient(to bottom, transparent, ${skin.grid.borderGlow} 30%, ${skin.grid.border} 50%, ${skin.grid.borderGlow} 70%, transparent)`,
                willChange: 'opacity',
              }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: ray.delay,
                ease: 'easeInOut',
              }}
            />
          ))}

          {/* Pulsing vortex */}
          <motion.div
            key={`${currentSkin}-vortex`}
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${skin.grid.borderGlow} 0%, transparent 50%)`,
              willChange: 'opacity',
            }}
            initial={{ opacity: 0.2 }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
            }}
          />

          {/* Screen border glow */}
          <motion.div
            key={`${currentSkin}-border`}
            className="absolute inset-0"
            style={{
              boxShadow: `inset 0 0 100px ${skin.grid.borderGlow}, inset 0 0 50px ${skin.grid.border}`,
              willChange: 'opacity',
            }}
            initial={{ opacity: 0.5 }}
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />
        </div>
      </>
    );
  }

  return null;
}
