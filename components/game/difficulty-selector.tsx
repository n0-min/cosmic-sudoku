'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SkinEffects } from '@/components/game/skin-effects';
import type { Difficulty } from '@/types/sudoku';

interface DifficultySelectorProps {
  onSelect: (difficulty: Difficulty) => void;
  onBack: () => void;
}

const difficulties: Array<{
  id: Difficulty;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  cells: number;
}> = [
  {
    id: 'easy',
    title: 'Nebula',
    description: 'Perfect for cosmic beginners',
    icon: '🌟',
    gradient: 'from-green-600 to-emerald-600',
    cells: 40,
  },
  {
    id: 'medium',
    title: 'Stellar',
    description: 'Navigate the cosmic currents',
    icon: '⭐',
    gradient: 'from-blue-600 to-cyan-600',
    cells: 30,
  },
  {
    id: 'hard',
    title: 'Galactic',
    description: 'Challenge the cosmic order',
    icon: '💫',
    gradient: 'from-purple-600 to-pink-600',
    cells: 25,
  },
  {
    id: 'expert',
    title: 'Quantum',
    description: 'Master the infinite system',
    icon: '🌌',
    gradient: 'from-red-600 to-orange-600',
    cells: 20,
  },
];

export function DifficultySelector({ onSelect, onBack }: DifficultySelectorProps) {
  const [mounted, setMounted] = useState(false);

  const stars = useMemo(() => {
    return [...Array(50)].map((_, i) => ({
      key: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 3,
    }));
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E1A] via-[#1A2744] to-[#0A0E1A]">
        {mounted && (
          <>
            <SkinEffects />
            <div className="absolute inset-0 opacity-40">
              {stars.map((star) => (
                <motion.div
                  key={star.key}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${star.left}%`,
                    top: `${star.top}%`,
                  }}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: star.duration,
                    repeat: Infinity,
                    delay: star.delay,
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        {/* Back Button */}
        <div className="absolute top-8 left-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="px-6 py-3 bg-[#1A2744]/80 backdrop-blur rounded-lg hover:bg-[#2A3F5F]/80 transition-all nebula-edge font-ui uppercase tracking-wider text-white"
          >
            ← Back
          </motion.button>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-[4.236rem]"
        >
          <h1 className="font-title text-7xl md:text-8xl font-black bg-gradient-to-r from-[#8B5CF6] via-[#00F5FF] to-[#FFD700] bg-clip-text text-transparent mb-6 tracking-wide">
            SELECT DIFFICULTY
          </h1>
          <p className="font-ui text-xl md:text-2xl text-[#8A9BB8] tracking-wider uppercase">
            Choose Your Cosmic Challenge
          </p>
        </motion.div>

        {/* Difficulty Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1.618rem] w-full max-w-7xl px-4">
          {difficulties.map((diff, index) => (
            <motion.button
              key={diff.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1), duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(diff.id)}
              className={`relative p-[2.618rem] rounded-2xl bg-gradient-to-br ${diff.gradient} overflow-hidden group nebula-edge cursor-pointer gravitational-pull`}
            >
              {/* Orbital Glow */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-500" />

              {/* Content */}
              <div className="relative z-10 text-white">
                <div className="text-6xl mb-6 animate-orbital">{diff.icon}</div>
                <h2 className="font-title text-3xl font-bold mb-3 tracking-wide">{diff.title}</h2>
                <p className="font-ui text-base opacity-90 tracking-wide mb-4">{diff.description}</p>

                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="font-data text-sm opacity-80">
                    {diff.cells} starting cells
                  </p>
                </div>
              </div>

              {/* Stellar Pulse Border */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                  border: '2px solid rgba(139, 92, 246, 0.3)',
                }}
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(139, 92, 246, 0.2)',
                    '0 0 40px rgba(139, 92, 246, 0.4)',
                    '0 0 20px rgba(139, 92, 246, 0.2)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.button>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-[2.618rem] text-center text-[#8A9BB8] font-ui"
        >
          <p className="text-sm tracking-widest uppercase">
            Each difficulty reveals a different cosmic pattern
          </p>
        </motion.div>
      </div>
    </div>
  );
}
