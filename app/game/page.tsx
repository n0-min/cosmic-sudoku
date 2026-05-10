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
    <div className="min-h-screen text-white overflow-hidden relative bg-gradient-to-b from-[#0A0E1A] via-[#1A2744] to-[#0A0E1A]">
      <CosmicBackground />
      <TensionVFX />

      <main className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center gap-[1.618rem]">
        {/* Header with Back Button and Coins */}
        <div className="w-full max-w-4xl flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-[#1A2744]/80 backdrop-blur rounded-lg hover:bg-[#2A3F5F]/80 transition-all nebula-edge font-ui uppercase tracking-wider"
          >
            ← Back
          </motion.button>

          <div className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full shadow-lg glow-medium">
            <div className="flex items-center gap-3 text-[#0A0E1A] font-data font-bold text-lg">
              <span className="text-2xl">💰</span>
              <span>{cosmicCoins.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="font-title text-6xl md:text-7xl font-black bg-gradient-to-r from-[#8B5CF6] via-[#00F5FF] to-[#FFD700] bg-clip-text text-transparent tracking-wide">
            COSMIC SUDOKU
          </h1>
          <p className="font-ui text-lg text-[#8A9BB8] tracking-widest uppercase">Stellar Calculus</p>
        </div>

        <GameTimer />

        <SudokuGrid />

        <AICoach />

        <GameControls />

        <div className="text-center text-sm text-[#8A9BB8] mt-[1.618rem] font-ui tracking-wider">
          <p>Each cell is a celestial coordinate in the infinite system</p>
        </div>
      </main>
    </div>
  );
}
