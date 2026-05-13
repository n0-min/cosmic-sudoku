'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface DefeatScreenProps {
  isVisible: boolean;
  difficulty: string;
  level: number;
  elapsedTime: number;
  mistakes: number;
  onRetry: () => void;
  onMainMenu: () => void;
}

export function DefeatScreen({
  isVisible,
  difficulty,
  level,
  elapsedTime,
  mistakes,
  onRetry,
  onMainMenu,
}: DefeatScreenProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0E1A]/95 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative max-w-2xl w-full mx-4 p-8 rounded-3xl bg-gradient-to-br from-[#1A0F0F] via-[#2A1F1F] to-[#1A0F0F] overflow-hidden"
            style={{
              boxShadow: '0 0 80px rgba(220, 38, 38, 0.4), inset 0 0 60px rgba(220, 38, 38, 0.1)',
              border: '2px solid rgba(220, 38, 38, 0.6)',
            }}
          >
            {/* Animated Background Stars */}
            {mounted && (
              <div className="absolute inset-0 opacity-20">
                {[...Array(50)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-red-500 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Content */}
            <div className="relative z-10 text-center space-y-6">
              {/* Title */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', damping: 15 }}
              >
                <h1 className="font-title text-7xl md:text-8xl font-black bg-gradient-to-r from-[#DC2626] via-[#EF4444] to-[#DC2626] bg-clip-text text-transparent mb-4 tracking-wider">
                  YOU LOSE
                </h1>
                <p className="font-ui text-xl text-[#FF6B6B] tracking-widest uppercase">
                  Mission Failed - Too Many Errors
                </p>
              </motion.div>

              {/* Skull Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring', damping: 12 }}
                className="text-8xl"
              >
                💀
              </motion.div>

              {/* Statistics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 gap-4 mt-8"
              >
                <div className="p-4 rounded-xl bg-[#0A0E1A]/60 border border-[#DC2626]/30">
                  <div className="text-3xl mb-2">⏱️</div>
                  <div className="font-ui text-xs text-[#8A9BB8] uppercase tracking-widest mb-1">Time</div>
                  <div className="font-data text-2xl font-bold text-white">{formatTime(elapsedTime)}</div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#DC2626]/20 to-[#991B1B]/20 border-2 border-[#DC2626]">
                  <div className="text-3xl mb-2">❌</div>
                  <div className="font-ui text-xs text-[#8A9BB8] uppercase tracking-widest mb-1">Mistakes</div>
                  <div className="font-data text-2xl font-bold text-[#DC2626]">{mistakes}</div>
                </div>
              </motion.div>

              {/* Failure Message */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-6 p-4 bg-gradient-to-r from-[#DC2626]/20 to-[#991B1B]/20 rounded-xl border-2 border-[#DC2626]"
              >
                <p className="font-ui text-lg text-[#FF6B6B] tracking-wider uppercase">
                  ⚠️ Maximum 3 mistakes allowed ⚠️
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex flex-col sm:flex-row gap-4 mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onRetry}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-[#DC2626] to-[#991B1B] hover:from-[#EF4444] hover:to-[#DC2626] text-white font-ui text-lg uppercase tracking-wider rounded-xl transition-all"
                  style={{
                    boxShadow: '0 0 30px rgba(220, 38, 38, 0.4)',
                  }}
                >
                  🔄 Try Again
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onMainMenu}
                  className="flex-1 px-8 py-4 bg-[#1A2744] hover:bg-[#2A3F5F] text-white font-ui text-lg uppercase tracking-wider rounded-xl transition-all nebula-edge"
                >
                  🏠 Main Menu
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
