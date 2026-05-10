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
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
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
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        {/* Auth Buttons */}
        <div className="absolute top-8 right-8">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="text-white">
                <p className="text-sm text-gray-400">Welcome back,</p>
                <p className="font-bold">{username || user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/login')}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
              >
                Login
              </button>
              <button
                onClick={() => router.push('/signup')}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition"
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
          className="text-center mb-12"
        >
          <h1 className="text-7xl md:text-9xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Cosmic Sudoku
          </h1>
          <p className="text-xl md:text-2xl text-gray-300">
            Journey Through the Stars
          </p>
        </motion.div>

        {/* Cosmic Coins Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8 px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full shadow-lg"
        >
          <div className="flex items-center gap-2 text-white font-bold text-xl">
            <span className="text-2xl">💰</span>
            <span>{cosmicCoins.toLocaleString()} Cosmic Coins</span>
          </div>
        </motion.div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
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
              className={`relative p-8 rounded-2xl bg-gradient-to-br ${item.gradient} shadow-2xl overflow-hidden group ${
                item.comingSoon ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative z-10 text-white">
                <div className="text-6xl mb-4">{item.icon}</div>
                <h2 className="text-3xl font-bold mb-2">{item.title}</h2>
                <p className="text-lg opacity-90">{item.description}</p>

                {item.comingSoon && (
                  <div className="mt-4 inline-block px-4 py-1 bg-black/30 rounded-full text-sm">
                    Coming Soon
                  </div>
                )}
              </div>

              {/* Animated Border */}
              <motion.div
                className="absolute inset-0 border-2 border-white/20 rounded-2xl"
                animate={{
                  borderColor: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.5)', 'rgba(255,255,255,0.2)'],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center text-gray-400"
        >
          <p className="text-sm">
            🚀 Explore • 🧠 Master • 🏆 Conquer the Cosmos
          </p>
        </motion.div>
      </div>
    </div>
  );
}
