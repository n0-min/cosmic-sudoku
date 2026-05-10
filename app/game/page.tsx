'use client';

import { SudokuGrid } from '@/components/game/sudoku-grid';
import { GameTimer } from '@/components/game/game-timer';
import { GameControls } from '@/components/game/game-controls';
import { TensionVFX } from '@/components/game/tension-vfx';
import { AICoach } from '@/components/game/ai-coach';
import { CosmicBackground } from '@/components/game/cosmic-background';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUserStore } from '@/lib/store/user-store';

export default function GamePage() {
  const router = useRouter();
  const { cosmicCoins } = useUserStore();

  return (
    <div className="min-h-screen text-white overflow-hidden relative">
      <CosmicBackground />
      <TensionVFX />

      <main className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center gap-8">
        {/* Header with Back Button and Coins */}
        <div className="w-full max-w-4xl flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-slate-800/50 backdrop-blur rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            ← Back to Menu
          </motion.button>

          <div className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full shadow-lg">
            <div className="flex items-center gap-2 text-white font-bold">
              <span>💰</span>
              <span>{cosmicCoins.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Cosmic Sudoku
          </h1>
          <p className="text-gray-300 text-lg">Journey Through the Stars</p>
        </div>

        <GameTimer />

        <SudokuGrid />

        <AICoach />

        <GameControls />

        <div className="text-center text-sm text-gray-400 mt-8">
          <p>🚀 Progress through cosmic levels • 🤖 AI-powered hints • ⚡ Real-time duels</p>
        </div>
      </main>
    </div>
  );
}
