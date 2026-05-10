'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/store/user-store';
import type { Skin } from '@/types/sudoku';

const MOCK_SKINS: Skin[] = [
  {
    id: '1',
    skin_id: 'default',
    name: 'Classic',
    description: 'The original cosmic theme',
    price: 0,
    rarity: 'common',
    theme_colors: { primary: '#8b5cf6', secondary: '#3b82f6' },
  },
  {
    id: '2',
    skin_id: 'nebula',
    name: 'Nebula Dream',
    description: 'Purple and pink cosmic clouds',
    price: 500,
    rarity: 'rare',
    theme_colors: { primary: '#ec4899', secondary: '#a855f7' },
  },
  {
    id: '3',
    skin_id: 'blackhole',
    name: 'Black Hole',
    description: 'Dark matter and event horizon',
    price: 1000,
    rarity: 'epic',
    theme_colors: { primary: '#1e1b4b', secondary: '#312e81' },
  },
  {
    id: '4',
    skin_id: 'supernova',
    name: 'Supernova Burst',
    description: 'Explosive stellar energy',
    price: 2000,
    rarity: 'legendary',
    theme_colors: { primary: '#f59e0b', secondary: '#ef4444' },
  },
  {
    id: '5',
    skin_id: 'aurora',
    name: 'Aurora Borealis',
    description: 'Northern lights in space',
    price: 750,
    rarity: 'rare',
    theme_colors: { primary: '#10b981', secondary: '#06b6d4' },
  },
  {
    id: '6',
    skin_id: 'galaxy',
    name: 'Spiral Galaxy',
    description: 'Swirling stars and dust',
    price: 1500,
    rarity: 'epic',
    theme_colors: { primary: '#6366f1', secondary: '#8b5cf6' },
  },
];

const RARITY_COLORS = {
  common: 'from-gray-600 to-gray-700',
  rare: 'from-blue-600 to-blue-700',
  epic: 'from-purple-600 to-purple-700',
  legendary: 'from-orange-600 to-red-600',
};

const RARITY_GLOW = {
  common: 'shadow-gray-500/50',
  rare: 'shadow-blue-500/50',
  epic: 'shadow-purple-500/50',
  legendary: 'shadow-orange-500/50',
};

export default function ShopPage() {
  const router = useRouter();
  const { cosmicCoins, currentSkin, ownedSkins, setCurrentSkin, addOwnedSkin, addCoins } = useUserStore();
  const [selectedSkin, setSelectedSkin] = useState<Skin | null>(null);

  const handlePurchase = (skin: Skin) => {
    if (cosmicCoins >= skin.price && !ownedSkins.includes(skin.skin_id)) {
      addCoins(-skin.price);
      addOwnedSkin(skin.skin_id);
      setCurrentSkin(skin.skin_id);
      alert(`✨ ${skin.name} purchased and equipped!`);
    }
  };

  const handleEquip = (skinId: string) => {
    setCurrentSkin(skinId);
    alert('✅ Skin equipped!');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 opacity-20">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
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
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-slate-800/50 backdrop-blur rounded-lg hover:bg-slate-700/50 transition-colors text-white"
          >
            ← Back to Menu
          </motion.button>

          <div className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full shadow-lg">
            <div className="flex items-center gap-2 text-white font-bold text-xl">
              <span className="text-2xl">💰</span>
              <span>{cosmicCoins.toLocaleString()} Cosmic Coins</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Skins Shop
          </h1>
          <p className="text-xl text-gray-300">Customize Your Cosmic Experience</p>
        </motion.div>

        {/* Skins Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {MOCK_SKINS.map((skin, index) => {
            const isOwned = ownedSkins.includes(skin.skin_id);
            const isEquipped = currentSkin === skin.skin_id;
            const canAfford = cosmicCoins >= skin.price;

            return (
              <motion.div
                key={skin.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`relative p-6 rounded-2xl bg-gradient-to-br ${RARITY_COLORS[skin.rarity]} ${RARITY_GLOW[skin.rarity]} shadow-2xl overflow-hidden`}
              >
                {/* Rarity Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur rounded-full text-xs font-bold text-white uppercase">
                  {skin.rarity}
                </div>

                {/* Equipped Badge */}
                {isEquipped && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-green-600 rounded-full text-xs font-bold text-white">
                    ✓ Equipped
                  </div>
                )}

                {/* Preview */}
                <div
                  className="w-full h-32 rounded-lg mb-4"
                  style={{
                    background: `linear-gradient(135deg, ${skin.theme_colors.primary}, ${skin.theme_colors.secondary})`,
                  }}
                />

                {/* Info */}
                <h3 className="text-2xl font-bold text-white mb-2">{skin.name}</h3>
                <p className="text-sm text-white/80 mb-4">{skin.description}</p>

                {/* Price/Action */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-yellow-300 font-bold text-lg">
                    <span>💰</span>
                    <span>{skin.price === 0 ? 'Free' : skin.price.toLocaleString()}</span>
                  </div>

                  {isOwned ? (
                    isEquipped ? (
                      <div className="px-4 py-2 bg-green-600/50 rounded-lg text-white font-semibold">
                        Equipped
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEquip(skin.skin_id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-semibold transition-colors"
                      >
                        Equip
                      </motion.button>
                    )
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePurchase(skin)}
                      disabled={!canAfford}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        canAfford
                          ? 'bg-purple-600 hover:bg-purple-500 text-white'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Buy' : 'Not Enough'}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 max-w-2xl mx-auto p-6 bg-slate-800/50 backdrop-blur rounded-2xl text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-2">💡 How to Earn Coins</h3>
          <p className="text-gray-300">
            Complete puzzles to earn Cosmic Coins! Higher difficulties reward more coins.
            <br />
            Easy: 10 coins • Medium: 25 coins • Hard: 50 coins • Expert: 100 coins
          </p>
        </motion.div>
      </div>
    </div>
  );
}
