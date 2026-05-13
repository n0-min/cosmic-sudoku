'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/store/user-store';
import { SkinEffects } from '@/components/game/skin-effects';
import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useState, useMemo } from 'react';
import type { User } from '@supabase/supabase-js';

export default function MainMenu() {
  const router = useRouter();
  const { cosmicCoins, currentSkin } = useUserStore();
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    setMounted(true);

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Main page: Got user:', user);
      setUser(user);

      if (user) {
        // Set userId in store
        useUserStore.getState().setUserId(user.id);
        console.log('Main page: Set userId in store:', user.id);

        // Load user data from database
        console.log('Main page: Fetching profile for user:', user.id);
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('username, cosmic_coins, current_skin, owned_skins')
          .eq('id', user.id)
          .maybeSingle();

        console.log('Main page: Profile query result:', { profile, error });

        if (error) {
          console.error('Error loading profile:', error);
        }

        if (profile) {
          console.log('Main page: Profile found:', profile);
          setUsername(profile.username);
          // Load user data into store with fallback values
          const cosmicCoins = profile.cosmic_coins ?? 0;
          const currentSkin = profile.current_skin || 'default';
          const ownedSkins = (profile.owned_skins && profile.owned_skins.length > 0)
            ? profile.owned_skins
            : ['default'];

          console.log('Loading profile data:', { cosmicCoins, currentSkin, ownedSkins });

          useUserStore.getState().loadUserData(
            cosmicCoins,
            currentSkin,
            ownedSkins
          );

          // If profile has null values, update them in database
          if (profile.cosmic_coins === null || profile.current_skin === null || !profile.owned_skins) {
            console.log('Updating profile with default values...');
            const { error: updateError } = await supabase
              .from('profiles')
              .update({
                cosmic_coins: cosmicCoins,
                current_skin: currentSkin,
                owned_skins: ownedSkins,
              })
              .eq('id', user.id);

            if (updateError) {
              console.error('Error updating profile:', updateError);
            } else {
              console.log('Profile updated successfully');
            }
          }
        } else {
          console.warn('Main page: No profile found for user:', user.id);
        }
      } else {
        console.log('Main page: No user logged in');
        // Reset user data when logged out
        useUserStore.getState().resetUserData();
        setUsername('');
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        // Set userId in store
        useUserStore.getState().setUserId(session.user.id);

        // Load user data when logged in
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('username, cosmic_coins, current_skin, owned_skins')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error('Error loading profile:', error);
        }

        if (profile) {
          setUsername(profile.username);
          // Load user data with fallback values
          const cosmicCoins = profile.cosmic_coins ?? 0;
          const currentSkin = profile.current_skin || 'default';
          const ownedSkins = (profile.owned_skins && profile.owned_skins.length > 0)
            ? profile.owned_skins
            : ['default'];

          console.log('Loading profile data (auth change):', { cosmicCoins, currentSkin, ownedSkins });

          useUserStore.getState().loadUserData(
            cosmicCoins,
            currentSkin,
            ownedSkins
          );

          // If profile has null values, update them in database
          if (profile.cosmic_coins === null || profile.current_skin === null || !profile.owned_skins) {
            console.log('Updating profile with default values...');
            await supabase
              .from('profiles')
              .update({
                cosmic_coins: cosmicCoins,
                current_skin: currentSkin,
                owned_skins: ownedSkins,
              })
              .eq('id', session.user.id);
          }
        }
      } else {
        // Reset user data when logged out
        useUserStore.getState().resetUserData();
        setUsername('');
      }
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
      requiresDifficulty: true,
    },
    {
      id: 'duel',
      title: 'Duel Mode',
      description: 'Challenge players in real-time',
      icon: '⚔️',
      gradient: 'from-red-400 to-orange-400',
      route: '/duel',
      comingSoon: true,
    },
    {
      id: 'stats',
      title: 'Statistics',
      description: 'View global leaderboards',
      icon: '📊',
      gradient: 'from-cyan-600 to-blue-600',
      route: '/stats',
    },
    {
      id: 'shop',
      title: 'Skins Shop',
      description: 'Customize your cosmic experience',
      icon: '🛒',
      gradient: 'from-purple-600 to-pink-600',
      route: '/shop',
    },
    {
      id: 'donate',
      title: 'Get Coins',
      description: 'Support development & get rewards',
      icon: '💰',
      gradient: 'from-yellow-500 to-orange-500',
      route: '/donate',
    },
  ];

  const stars = useMemo(() => {
    return [...Array(100)].map((_, i) => ({
      key: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 3,
    }));
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
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
          className="mb-[2.618rem] px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full shadow-lg glow-medium"
        >
          <div className="flex items-center gap-3 text-[#0A0E1A] font-data font-bold text-xl">
            <span className="text-3xl">💰</span>
            <span>{cosmicCoins.toLocaleString()}</span>
            <span className="font-ui text-sm uppercase tracking-wider opacity-80">Cosmic Coins</span>
          </div>
        </motion.div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1.618rem] w-full max-w-7xl px-4">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => !item.comingSoon && router.push(item.route)}
              disabled={item.comingSoon}
              className={`relative p-[2.618rem] rounded-2xl bg-gradient-to-br ${item.gradient} overflow-hidden group nebula-edge ${
                item.comingSoon ? 'cursor-not-allowed' : 'cursor-pointer gravitational-pull'
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
