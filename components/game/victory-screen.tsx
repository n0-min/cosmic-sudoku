'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface VictoryScreenProps {
  isVisible: boolean;
  difficulty: string;
  level: number;
  elapsedTime: number;
  mistakes: number;
  hintsUsed: number;
  coinsEarned: number;
  leaderboardRank?: number;
  totalPlayers?: number;
  onNextLevel: () => void;
  onMainMenu: () => void;
}

export function VictoryScreen({
  isVisible,
  difficulty,
  level,
  elapsedTime,
  mistakes,
  hintsUsed,
  coinsEarned,
  leaderboardRank,
  totalPlayers,
  onNextLevel,
  onMainMenu,
}: VictoryScreenProps) {
  const [showStats, setShowStats] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShowStats(true), 800);
      return () => clearTimeout(timer);
    } else {
      setShowStats(false);
    }
  }, [isVisible]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const isPerfectSolve = mistakes === 0 && hintsUsed === 0;
  const accuracy = mistakes === 0 ? 100 : Math.max(0, 100 - mistakes * 5);

  const getRankBadge = () => {
    if (!leaderboardRank) return null;

    if (leaderboardRank === 1) {
      return { emoji: '🥇', text: '1ST PLACE', color: 'from-[#FFD700] to-[#FFA500]', glow: 'rgba(255, 215, 0, 0.6)' };
    } else if (leaderboardRank === 2) {
      return { emoji: '🥈', text: '2ND PLACE', color: 'from-[#C0C0C0] to-[#A8A8A8]', glow: 'rgba(192, 192, 192, 0.6)' };
    } else if (leaderboardRank === 3) {
      return { emoji: '🥉', text: '3RD PLACE', color: 'from-[#CD7F32] to-[#B87333]', glow: 'rgba(205, 127, 50, 0.6)' };
    } else if (leaderboardRank <= 10) {
      return { emoji: '⭐', text: `TOP 10 - #${leaderboardRank}`, color: 'from-[#8B5CF6] to-[#7C3AED]', glow: 'rgba(139, 92, 246, 0.6)' };
    } else {
      return { emoji: '📊', text: `RANK #${leaderboardRank}`, color: 'from-[#1A2744] to-[#2A3F5F]', glow: 'rgba(139, 92, 246, 0.3)' };
    }
  };

  const rankBadge = getRankBadge();

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
            className="relative max-w-2xl w-full mx-4 p-8 rounded-3xl bg-gradient-to-br from-[#1A2744] via-[#2A3F5F] to-[#1A2744] nebula-edge overflow-hidden"
            style={{
              boxShadow: '0 0 80px rgba(139, 92, 246, 0.4), inset 0 0 60px rgba(139, 92, 246, 0.1)',
            }}
          >
            {/* Animated Background Stars */}
            {mounted && (
              <div className="absolute inset-0 opacity-30">
                {[...Array(50)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
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
                <h1 className="font-title text-6xl md:text-7xl font-black bg-gradient-to-r from-[#FFD700] via-[#00F5FF] to-[#8B5CF6] bg-clip-text text-transparent mb-4">
                  {isPerfectSolve ? '🌟 PERFECT SOLVE!' : '🎉 MISSION COMPLETE!'}
                </h1>
                <p className="font-ui text-xl text-[#8A9BB8] tracking-widest uppercase">
                  You've reached {difficulty === 'easy' ? 'Mercury' : difficulty === 'medium' ? 'Venus' : difficulty === 'hard' ? 'Mars' : 'Jupiter'}!
                </p>
              </motion.div>

              {/* Coins Earned */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring', damping: 12 }}
                className="inline-block px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full glow-medium"
              >
                <div className="flex items-center gap-3 text-[#0A0E1A] font-data font-bold text-3xl">
                  <span className="text-4xl">💰</span>
                  <span>+{coinsEarned}</span>
                  <span className="font-ui text-lg uppercase tracking-wider opacity-80">Cosmic Coins</span>
                </div>
              </motion.div>

              {/* Statistics */}
              <AnimatePresence>
                {showStats && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
                  >
                    <StatCard
                      icon="⏱️"
                      label="Time"
                      value={formatTime(elapsedTime)}
                      delay={0.5}
                    />
                    <StatCard
                      icon="🎯"
                      label="Accuracy"
                      value={`${accuracy}%`}
                      delay={0.6}
                      highlight={accuracy === 100}
                    />
                    <StatCard
                      icon="❌"
                      label="Mistakes"
                      value={mistakes.toString()}
                      delay={0.7}
                      highlight={mistakes === 0}
                    />
                    <StatCard
                      icon="💡"
                      label="Hints"
                      value={hintsUsed.toString()}
                      delay={0.8}
                      highlight={hintsUsed === 0}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Perfect Solve Bonus */}
              {isPerfectSolve && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-6 p-4 bg-gradient-to-r from-[#FFD700]/20 to-[#FFA500]/20 rounded-xl border-2 border-[#FFD700]"
                >
                  <p className="font-ui text-lg text-[#FFD700] tracking-wider uppercase">
                    ⭐ Perfect Solve Bonus Applied! ⭐
                  </p>
                </motion.div>
              )}

              {/* Leaderboard Rank */}
              {rankBadge && showStats && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1 }}
                  className={`mt-6 p-6 bg-gradient-to-r ${rankBadge.color} rounded-xl border-2 border-white/20`}
                  style={{
                    boxShadow: `0 0 40px ${rankBadge.glow}`,
                  }}
                >
                  <div className="text-center">
                    <div className="text-6xl mb-3">{rankBadge.emoji}</div>
                    <p className="font-title text-3xl font-bold text-white tracking-wider mb-2">
                      {rankBadge.text}
                    </p>
                    <p className="font-ui text-sm text-white/80 uppercase tracking-widest">
                      {difficulty.toUpperCase()} DIFFICULTY
                    </p>
                    {totalPlayers && (
                      <p className="font-data text-xs text-white/60 mt-2">
                        Out of {totalPlayers.toLocaleString()} players
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Guest User Notice */}
              {!rankBadge && showStats && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1 }}
                  className="mt-6 p-6 bg-gradient-to-r from-[#1A2744]/80 to-[#2A3F5F]/80 rounded-xl border-2 border-[#8B5CF6]/40"
                >
                  <div className="text-center">
                    <div className="text-5xl mb-3">🔒</div>
                    <p className="font-ui text-lg text-[#8A9BB8] tracking-wider uppercase mb-2">
                      Login to compete
                    </p>
                    <p className="font-ui text-sm text-white/60">
                      Sign in to save your score and compete on the leaderboard
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="flex flex-col sm:flex-row gap-4 mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onNextLevel}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] hover:from-[#9333EA] hover:to-[#06B6D4] text-white font-ui text-lg uppercase tracking-wider rounded-xl transition-all glow-medium"
                >
                  🚀 Next Level
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

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  delay: number;
  highlight?: boolean;
}

function StatCard({ icon, label, value, delay, highlight = false }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`p-4 rounded-xl ${
        highlight
          ? 'bg-gradient-to-br from-[#FFD700]/20 to-[#FFA500]/20 border-2 border-[#FFD700]'
          : 'bg-[#0A0E1A]/60 border border-[#8B5CF6]/30'
      }`}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <div className="font-ui text-xs text-[#8A9BB8] uppercase tracking-widest mb-1">{label}</div>
      <div className={`font-data text-2xl font-bold ${highlight ? 'text-[#FFD700]' : 'text-white'}`}>
        {value}
      </div>
    </motion.div>
  );
}
