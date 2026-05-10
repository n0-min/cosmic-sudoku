'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/store/user-store';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

export default function MainMenu() {
  const router = useRouter();
  const { cosmicCoins } = useUserStore();
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string>('');
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, cosmic_coins')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUsername(profile.username);
          useUserStore.setState({ cosmicCoins: profile.cosmic_coins });
        }
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const menuItems = [
    {
      id: 'classic',
      title: 'Classic Mode',
      description: 'Play solo and master the cosmos',
      icon: '🎮',
      gradient: 'from-blue-600 to-purple-600',
      route: '/game',
    },
    {
      id: 'duel',
      title: 'Duel Mode',
      description: 'Challenge players in real-time',
      icon: '⚔️',
      gradient: 'from-red-600 to-orange-600',
      route: '/duel',
      comingSoon: true,
    },
    {
      id: 'shop',
      title: 'Skins Shop',
      description: 'Customize your cosmic experience',
      icon: '🛒',
      gradient: 'from-purple-600 to-pink-600',
      route: '/shop',
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E1A] via-[#1A2744] to-[#0A0E1A]">
        <div className="absolute inset-0 opacity-40">
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
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        {/* Auth Buttons */}
        <div className="absolute top-8 right-8">
          {user ? (
            <div className="flex items-center gap-6">
              <div className="text-white">
                <p className="text-xs font-ui text-[#8A9BB8] uppercase tracking-widest">Operator</p>
                <p className="font-data font-bold text-lg">{username || user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-gradient-to-r from-[#DC2626] to-[#991B1B] hover:from-[#EF4444] hover:to-[#DC2626] text-white font-ui uppercase tracking-wider rounded-lg transition-all nebula-edge glow-soft"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/login')}
                className="px-6 py-3 bg-[#1A2744] hover:bg-[#2A3F5F] text-white font-ui uppercase tracking-wider rounded-lg transition-all nebula-edge"
              >
                Login
              </button>
              <button
                onClick={() => router.push('/signup')}
                className="px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] hover:from-[#9333EA] hover:to-[#06B6D4] text-white font-ui uppercase tracking-wider rounded-lg transition-all glow-medium"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-[4.236rem]"
        >
          <h1 className="font-title text-8xl md:text-9xl font-black bg-gradient-to-r from-[#8B5CF6] via-[#00F5FF] to-[#FFD700] bg-clip-text text-transparent mb-6 tracking-wide">
            COSMIC SUDOKU
          </h1>
          <p className="font-ui text-xl md:text-2xl text-[#8A9BB8] tracking-wider uppercase">
            Stellar Calculus
          </p>
        </motion.div>

        {/* Cosmic Coins Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-[2.618rem] px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full shadow-lg glow-medium"
        >
          <div className="flex items-center gap-3 text-[#0A0E1A] font-data font-bold text-xl">
            <span className="text-3xl">💰</span>
            <span>{cosmicCoins.toLocaleString()}</span>
            <span className="font-ui text-sm uppercase tracking-wider opacity-80">Cosmic Coins</span>
          </div>
        </motion.div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[1.618rem] w-full max-w-6xl px-4">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * (index + 1), duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => !item.comingSoon && router.push(item.route)}
              disabled={item.comingSoon}
              className={`relative p-[2.618rem] rounded-2xl bg-gradient-to-br ${item.gradient} overflow-hidden group nebula-edge ${
                item.comingSoon ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer gravitational-pull'
              }`}
            >
              {/* Orbital Glow */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-500" />

              {/* Content */}
              <div className="relative z-10 text-white">
                <div className="text-7xl mb-6 animate-orbital">{item.icon}</div>
                <h2 className="font-title text-4xl font-bold mb-3 tracking-wide">{item.title}</h2>
                <p className="font-ui text-lg opacity-90 tracking-wide">{item.description}</p>

                {item.comingSoon && (
                  <div className="mt-6 inline-block px-6 py-2 bg-black/40 rounded-full text-sm font-ui uppercase tracking-widest nebula-edge">
                    Coming Soon
                  </div>
                )}
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
          transition={{ delay: 1 }}
          className="mt-[2.618rem] text-center text-[#8A9BB8] font-ui"
        >
          <p className="text-sm tracking-widest uppercase">
            Structure and beauty are not opposites but the same truth
          </p>
        </motion.div>
      </div>
    </div>
  );
}
