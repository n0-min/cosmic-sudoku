'use client';

import { SudokuGrid } from '@/components/game/sudoku-grid';
import { GameTimer } from '@/components/game/game-timer';
import { GameControls } from '@/components/game/game-controls';
import { TensionVFX } from '@/components/game/tension-vfx';
import { AICoach } from '@/components/game/ai-coach';
import { CosmicBackground } from '@/components/game/cosmic-background';
import { DifficultySelector } from '@/components/game/difficulty-selector';
import { VictoryScreen } from '@/components/game/victory-screen';
import { DefeatScreen } from '@/components/game/defeat-screen';
import { SkinEffects } from '@/components/game/skin-effects';
import { ErrorBoundary } from '@/components/error-boundary';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUserStore } from '@/lib/store/user-store';
import { useGameStore } from '@/lib/store/game-store';
import { getSkinById } from '@/lib/skins/material-skins';
import { calculateLeaderboardRank, saveScoreToDatabase } from '@/lib/leaderboard/leaderboard-utils';
import { createBrowserClient } from '@supabase/ssr';
import { useState, useEffect } from 'react';
import type { Difficulty } from '@/types/sudoku';
import type { User } from '@supabase/supabase-js';

export default function GamePage() {
  const router = useRouter();
  const { cosmicCoins, addCoins, currentSkin } = useUserStore();
  const skin = getSkinById(currentSkin);
  const { startNewGame, resetGame, difficulty, level, elapsedTime, mistakes, hintsUsed, isComplete, isFailed, actualSolveTime } = useGameStore();
  const [showDifficultySelector, setShowDifficultySelector] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [showDefeat, setShowDefeat] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [leaderboardRank, setLeaderboardRank] = useState<number | undefined>(undefined);
  const [totalPlayers, setTotalPlayers] = useState<number | undefined>(undefined);
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Hydration check
  useEffect(() => {
    setMounted(true);
    // Preload critical resources
    if (typeof window !== 'undefined') {
      requestAnimationFrame(() => {
        document.body.style.visibility = 'visible';
      });
    }
  }, []);

  // Check authentication
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Watch for game completion
  useEffect(() => {
    const handleCompletion = async () => {
      if (isComplete && gameStarted) {
        // Only calculate leaderboard rank for authenticated users
        if (user) {
          const rankData = await calculateLeaderboardRank(difficulty, actualSolveTime, mistakes, hintsUsed);
          setLeaderboardRank(rankData.rank);
          setTotalPlayers(rankData.totalPlayers);

          // Save score to database
          await saveScoreToDatabase(user.id, difficulty, actualSolveTime, mistakes, hintsUsed);
        } else {
          // Guest user - no leaderboard
          setLeaderboardRank(undefined);
          setTotalPlayers(undefined);
        }

        // Calculate coins based on difficulty and performance
        const baseCoins = {
          easy: 50,
          medium: 100,
          hard: 200,
          expert: 400,
        }[difficulty];

        const timeBonus = Math.max(0, 100 - Math.floor(actualSolveTime / 1000));
        const mistakePenalty = mistakes * 10;
        const hintPenalty = hintsUsed * 20;
        const perfectBonus = mistakes === 0 && hintsUsed === 0 ? baseCoins : 0;

        // Rank bonus (only for authenticated users)
        let rankBonus = 0;
        if (user && leaderboardRank) {
          if (leaderboardRank === 1) rankBonus = 500;
          else if (leaderboardRank === 2) rankBonus = 300;
          else if (leaderboardRank === 3) rankBonus = 200;
          else if (leaderboardRank <= 10) rankBonus = 100;
        }

        const totalCoins = Math.max(10, baseCoins + timeBonus - mistakePenalty - hintPenalty + perfectBonus + rankBonus);

        setCoinsEarned(totalCoins);
        addCoins(totalCoins);
        setShowVictory(true);
      }
    };

    handleCompletion();
  }, [isComplete, gameStarted, actualSolveTime, user]);

  // Watch for game failure
  useEffect(() => {
    if (isFailed && gameStarted) {
      setShowDefeat(true);
    }
  }, [isFailed, gameStarted]);

  const handleDifficultySelect = (selectedDifficulty: Difficulty) => {
    startNewGame(selectedDifficulty, 1);
    setShowDifficultySelector(false);
    setGameStarted(true);
    setShowVictory(false);
    setShowDefeat(false);
  };

  const handleBack = () => {
    if (gameStarted) {
      // Reset game state when leaving
      resetGame();
      setGameStarted(false);
    }
    router.push('/');
  };

  const handleBackToDifficulty = () => {
    // Reset game state when going back to difficulty selection
    resetGame();
    setGameStarted(false);
    setShowDifficultySelector(true);
    setShowVictory(false);
    setShowDefeat(false);
  };

  const handleRetry = () => {
    startNewGame(difficulty, level);
    setShowDefeat(false);
  };

  const handleNextLevel = () => {
    startNewGame(difficulty, level + 1);
    setShowVictory(false);
  };

  const handleMainMenu = () => {
    resetGame();
    setGameStarted(false);
    router.push('/');
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  if (showDifficultySelector) {
    return (
      <ErrorBoundary>
        <DifficultySelector
          onSelect={handleDifficultySelect}
          onBack={handleBack}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div
        className="min-h-screen w-full text-white overflow-x-hidden relative"
        style={{
          background: `linear-gradient(to bottom, ${skin.background.gradient.join(', ')})`,
        }}
      >
        <SkinEffects />
        <CosmicBackground />
        <TensionVFX />

        <VictoryScreen
          isVisible={showVictory}
          difficulty={difficulty}
          level={level}
          elapsedTime={actualSolveTime}
          mistakes={mistakes}
          hintsUsed={hintsUsed}
          coinsEarned={coinsEarned}
          leaderboardRank={leaderboardRank}
          totalPlayers={totalPlayers}
          onNextLevel={handleNextLevel}
          onMainMenu={handleMainMenu}
        />

        <DefeatScreen
          isVisible={showDefeat}
          difficulty={difficulty}
          level={level}
          elapsedTime={actualSolveTime || elapsedTime}
          mistakes={mistakes}
          onRetry={handleRetry}
          onMainMenu={handleMainMenu}
        />

        <main className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center gap-[1.618rem]">
          {/* Header with Back Button and Coins */}
          <div className="w-full max-w-4xl flex justify-between items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBackToDifficulty}
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
    </ErrorBoundary>
  );
}
