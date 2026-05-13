'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import type { Difficulty } from '@/types/sudoku';
import type { User } from '@supabase/supabase-js';

interface LeaderboardEntry {
  id: string;
  user_id: string;
  difficulty: Difficulty;
  solve_time: number;
  mistakes: number;
  hints_used: number;
  created_at: string;
  profiles: {
    username: string;
  };
}

interface RichestPlayer {
  id: string;
  username: string;
  cosmic_coins: number;
}

const DIFFICULTY_LABELS = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  expert: 'Expert',
};

export default function StatsPage() {
  const router = useRouter();
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [richestPlayers, setRichestPlayers] = useState<RichestPlayer[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [userEntry, setUserEntry] = useState<LeaderboardEntry | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    fetchLeaderboard();
    fetchRichestPlayers();
  }, [selectedDifficulty, user]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      // Fetch top 10 for selected difficulty
      const { data, error } = await supabase
        .from('leaderboard')
        .select(`
          *,
          profiles!inner (username)
        `)
        .eq('difficulty', selectedDifficulty)
        .order('solve_time', { ascending: true })
        .order('mistakes', { ascending: true })
        .order('hints_used', { ascending: true })
        .limit(10);

      if (error) {
        console.error('Error fetching leaderboard:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        setLeaderboard([]);
      } else {
        console.log('Leaderboard data:', data);
        setLeaderboard(data || []);
      }

      // Fetch user's rank if authenticated
      if (user) {
        // Get user's best score for this difficulty
        const { data: userScores, error: userError } = await supabase
          .from('leaderboard')
          .select('*')
          .eq('difficulty', selectedDifficulty)
          .eq('user_id', user.id)
          .order('solve_time', { ascending: true })
          .order('mistakes', { ascending: true })
          .order('hints_used', { ascending: true })
          .limit(1);

        if (!userError && userScores && userScores.length > 0) {
          const bestScore = userScores[0];

          // Get all scores for this difficulty to calculate rank
          const { data: allScores, error: allError } = await supabase
            .from('leaderboard')
            .select('*')
            .eq('difficulty', selectedDifficulty)
            .order('solve_time', { ascending: true })
            .order('mistakes', { ascending: true })
            .order('hints_used', { ascending: true });

          if (!allError && allScores) {
            const rank = allScores.findIndex(
              score =>
                score.solve_time === bestScore.solve_time &&
                score.mistakes === bestScore.mistakes &&
                score.hints_used === bestScore.hints_used &&
                score.user_id === user.id
            ) + 1;

            setUserRank(rank);

            // Get username for user entry
            const { data: profile } = await supabase
              .from('profiles')
              .select('username')
              .eq('id', user.id)
              .single();

            setUserEntry({
              ...bestScore,
              profiles: { username: profile?.username || 'Unknown' },
            });
          }
        } else {
          setUserRank(null);
          setUserEntry(null);
        }
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRichestPlayers = async () => {
    try {
      console.log('Fetching richest players...');
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, cosmic_coins')
        .gt('cosmic_coins', 0)
        .order('cosmic_coins', { ascending: false })
        .limit(10);

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Error fetching richest players:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
        setRichestPlayers([]);
      } else {
        console.log('Richest players data:', data);
        console.log('Data length:', data?.length);
        setRichestPlayers(data || []);
      }
    } catch (error) {
      console.error('Exception fetching richest players:', error);
      setRichestPlayers([]);
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { emoji: '🥇', color: 'from-[#FFD700] to-[#FFA500]' };
    if (rank === 2) return { emoji: '🥈', color: 'from-[#C0C0C0] to-[#A8A8A8]' };
    if (rank === 3) return { emoji: '🥉', color: 'from-[#CD7F32] to-[#B87333]' };
    return { emoji: `#${rank}`, color: 'from-[#4B5563] to-[#6B7280]' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0E1A] via-[#1A2744] to-[#0A0E1A] text-white overflow-hidden relative">
      {/* Animated Background */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(100)].map((_, i) => (
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
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-[2.618rem]">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-[#1A2744]/80 backdrop-blur rounded-lg hover:bg-[#2A3F5F]/80 transition-all nebula-edge font-ui uppercase tracking-wider"
          >
            ← Back
          </motion.button>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-[4.236rem]"
        >
          <h1 className="font-title text-7xl md:text-8xl font-black bg-gradient-to-r from-[#8B5CF6] via-[#00F5FF] to-[#FFD700] bg-clip-text text-transparent mb-4 tracking-wide">
            STATISTICS
          </h1>
          <p className="font-ui text-xl text-[#8A9BB8] tracking-widest uppercase">Global Leaderboards</p>
        </motion.div>

        {/* Fastest Times Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-6xl mx-auto mb-[4.236rem]"
        >
          <div className="mb-[2.618rem]">
            <h2 className="font-title text-4xl font-bold text-center mb-6 bg-gradient-to-r from-[#00F5FF] to-[#8B5CF6] bg-clip-text text-transparent">
              ⚡ FASTEST TIMES
            </h2>

            {/* Difficulty Selector */}
            <div className="flex justify-center gap-4 mb-8">
              {(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map((diff) => (
                <motion.button
                  key={diff}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-6 py-3 rounded-lg font-ui uppercase tracking-wider transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] glow-medium'
                      : 'bg-[#1A2744]/80 hover:bg-[#2A3F5F]/80 nebula-edge'
                  }`}
                >
                  {DIFFICULTY_LABELS[diff]}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="bg-[#1A2744]/60 backdrop-blur rounded-2xl overflow-hidden nebula-edge">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#0A0E1A]/80 border-b border-[#8B5CF6]/30">
                    <th className="px-6 py-4 text-left font-ui text-sm uppercase tracking-wider text-[#8A9BB8]">Rank</th>
                    <th className="px-6 py-4 text-left font-ui text-sm uppercase tracking-wider text-[#8A9BB8]">Player</th>
                    <th className="px-6 py-4 text-left font-ui text-sm uppercase tracking-wider text-[#8A9BB8]">Time</th>
                    <th className="px-6 py-4 text-left font-ui text-sm uppercase tracking-wider text-[#8A9BB8]">Mistakes</th>
                    <th className="px-6 py-4 text-left font-ui text-sm uppercase tracking-wider text-[#8A9BB8]">Hints</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center font-ui text-[#8A9BB8]">
                        Loading...
                      </td>
                    </tr>
                  ) : leaderboard.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center font-ui text-[#8A9BB8]">
                        No scores yet for this difficulty
                      </td>
                    </tr>
                  ) : (
                    leaderboard.map((entry, index) => {
                      const rank = index + 1;
                      const badge = getRankBadge(rank);
                      const isCurrentUser = user && entry.user_id === user.id;

                      return (
                        <motion.tr
                          key={entry.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`border-b border-[#8B5CF6]/10 hover:bg-[#2A3F5F]/30 transition-colors ${
                            isCurrentUser ? 'bg-[#8B5CF6]/20' : ''
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${badge.color} font-data font-bold text-sm`}>
                              <span>{badge.emoji}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-data text-lg">
                            {entry.profiles?.username || 'Unknown'}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs text-[#00F5FF] font-ui uppercase">(You)</span>
                            )}
                          </td>
                          <td className="px-6 py-4 font-data text-lg text-[#00F5FF]">
                            {formatTime(entry.solve_time)}
                          </td>
                          <td className="px-6 py-4 font-data text-lg">
                            {entry.mistakes}
                          </td>
                          <td className="px-6 py-4 font-data text-lg">
                            {entry.hints_used}
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* User's Rank (if not in top 10) */}
          {user && userRank && userRank > 10 && userEntry && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 bg-[#8B5CF6]/20 backdrop-blur rounded-xl p-6 border border-[#8B5CF6]/40"
            >
              <p className="font-ui text-sm uppercase tracking-wider text-[#8A9BB8] mb-3">Your Best Rank</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getRankBadge(userRank).color} font-data font-bold`}>
                    <span>{getRankBadge(userRank).emoji}</span>
                  </div>
                  <div>
                    <p className="font-data text-xl">{userEntry.profiles?.username}</p>
                    <p className="font-ui text-sm text-[#8A9BB8]">
                      {formatTime(userEntry.solve_time)} • {userEntry.mistakes} mistakes • {userEntry.hints_used} hints
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {!user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-center"
            >
              <p className="font-ui text-sm text-[#8A9BB8] uppercase tracking-wider">
                Login to see your rank
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Richest Players Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-6xl mx-auto mb-[4.236rem]"
        >
          <h2 className="font-title text-4xl font-bold text-center mb-8 bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
            💰 RICHEST PLAYERS
          </h2>

          <div className="bg-[#1A2744]/60 backdrop-blur rounded-2xl overflow-hidden nebula-edge">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#0A0E1A]/80 border-b border-[#FFD700]/30">
                    <th className="px-6 py-4 text-left font-ui text-sm uppercase tracking-wider text-[#8A9BB8]">Rank</th>
                    <th className="px-6 py-4 text-left font-ui text-sm uppercase tracking-wider text-[#8A9BB8]">Player</th>
                    <th className="px-6 py-4 text-left font-ui text-sm uppercase tracking-wider text-[#8A9BB8]">Cosmic Coins</th>
                  </tr>
                </thead>
                <tbody>
                  {richestPlayers.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center font-ui text-[#8A9BB8]">
                        No players yet
                      </td>
                    </tr>
                  ) : (
                    richestPlayers.map((player, index) => {
                      const rank = index + 1;
                      const badge = getRankBadge(rank);
                      const isCurrentUser = user && player.id === user.id;

                      return (
                        <motion.tr
                          key={player.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`border-b border-[#FFD700]/10 hover:bg-[#2A3F5F]/30 transition-colors ${
                            isCurrentUser ? 'bg-[#FFD700]/20' : ''
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${badge.color} font-data font-bold text-sm`}>
                              <span>{badge.emoji}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-data text-lg">
                            {player.username}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs text-[#FFD700] font-ui uppercase">(You)</span>
                            )}
                          </td>
                          <td className="px-6 py-4 font-data text-lg text-[#FFD700]">
                            {player.cosmic_coins.toLocaleString()}
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-[#8A9BB8] font-ui"
        >
          <p className="text-sm tracking-widest uppercase">
            Compete across the cosmos
          </p>
        </motion.div>
      </div>
    </div>
  );
}
