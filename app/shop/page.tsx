'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/store/user-store';
import { getAllSkins, type SkinTheme } from '@/lib/skins/material-skins';

const RARITY_COLORS = {
  common: 'from-[#4B5563] to-[#6B7280]',
  rare: 'from-[#3B82F6] to-[#2563EB]',
  epic: 'from-[#8B5CF6] to-[#7C3AED]',
  legendary: 'from-[#F59E0B] to-[#DC2626]',
};

const RARITY_GLOW = {
  common: '0 0 20px rgba(107, 114, 128, 0.3)',
  rare: '0 0 30px rgba(59, 130, 246, 0.5)',
  epic: '0 0 40px rgba(139, 92, 246, 0.6)',
  legendary: '0 0 50px rgba(245, 158, 11, 0.7)',
};

const RARITY_LABELS = {
  common: 'COMMON',
  rare: 'RARE',
  epic: 'EPIC',
  legendary: 'LEGENDARY',
};

export default function ShopPage() {
  const router = useRouter();
  const { cosmicCoins, currentSkin, setCurrentSkin } = useUserStore();
  const [ownedSkins, setOwnedSkins] = useState<string[]>(['default']);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const allSkins = getAllSkins();

  const handlePurchase = async (skin: SkinTheme) => {
    if (cosmicCoins < skin.price) {
      alert('Not enough Cosmic Coins!');
      return;
    }

    setPurchasingId(skin.id);

    // Simulate purchase
    setTimeout(() => {
      setOwnedSkins([...ownedSkins, skin.id]);
      useUserStore.setState({ cosmicCoins: cosmicCoins - skin.price });
      setPurchasingId(null);
    }, 500);
  };

  const handleEquip = (skinId: string) => {
    setCurrentSkin(skinId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0E1A] via-[#1A2744] to-[#0A0E1A] text-white overflow-hidden relative">
      {/* Animated Background */}
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

          <div className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full shadow-lg glow-medium">
            <div className="flex items-center gap-3 text-[#0A0E1A] font-data font-bold text-lg">
              <span className="text-2xl">💰</span>
              <span>{cosmicCoins.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-[4.236rem]"
        >
          <h1 className="font-title text-7xl md:text-8xl font-black bg-gradient-to-r from-[#8B5CF6] via-[#00F5FF] to-[#FFD700] bg-clip-text text-transparent mb-4 tracking-wide">
            MATERIAL REALITIES
          </h1>
          <p className="font-ui text-xl text-[#8A9BB8] tracking-widest uppercase">Six Distinct Physical States</p>
        </motion.div>

        {/* Skins Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1.618rem] max-w-7xl mx-auto">
          {allSkins.map((skin, index) => {
            const isOwned = ownedSkins.includes(skin.id);
            const isEquipped = currentSkin === skin.id;
            const canAfford = cosmicCoins >= skin.price;
            const isPurchasing = purchasingId === skin.id;

            return (
              <motion.div
                key={skin.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="relative p-8 rounded-2xl bg-gradient-to-br overflow-hidden nebula-edge"
                style={{
                  background: `linear-gradient(135deg, ${skin.background.gradient[0]}, ${skin.background.gradient[1]})`,
                  boxShadow: RARITY_GLOW[skin.rarity],
                }}
              >
                {/* Rarity Badge */}
                <div
                  className={`absolute top-4 right-4 px-4 py-2 bg-gradient-to-r ${RARITY_COLORS[skin.rarity]} rounded-full text-xs font-ui font-bold uppercase tracking-widest`}
                >
                  {RARITY_LABELS[skin.rarity]}
                </div>

                {/* Equipped Badge */}
                {isEquipped && (
                  <div className="absolute top-4 left-4 px-4 py-2 bg-[#10B981] rounded-full text-xs font-ui font-bold uppercase tracking-widest glow-soft">
                    ✓ Active
                  </div>
                )}

                {/* Material Preview */}
                <div
                  className="w-full h-40 rounded-xl mb-6 relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${skin.background.gradient.join(', ')})`,
                    border: `2px solid ${skin.grid.border}`,
                    boxShadow: `0 0 30px ${skin.grid.borderGlow}`,
                  }}
                >
                  {/* Mini grid preview */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1 p-4">
                    {[...Array(9)].map((_, i) => (
                      <div
                        key={i}
                        className="rounded"
                        style={{
                          background: skin.grid.cellBg,
                          border: `1px solid ${skin.grid.border}`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Info */}
                <h3 className="font-title text-3xl font-bold mb-2 tracking-wide">{skin.name}</h3>
                <p className="font-ui text-sm text-white/80 mb-6 leading-relaxed">{skin.description}</p>

                {/* Effects Info */}
                <div className="mb-6 p-3 bg-black/30 rounded-lg">
                  <p className="font-data text-xs text-white/70 uppercase tracking-wider">
                    Effect: {skin.effects.type} • {skin.effects.intensity}
                  </p>
                </div>

                {/* Price/Action */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#FFD700] font-data font-bold text-xl">
                    <span>💰</span>
                    <span>{skin.price === 0 ? 'Free' : skin.price.toLocaleString()}</span>
                  </div>

                  {isOwned ? (
                    isEquipped ? (
                      <div className="px-6 py-3 bg-[#10B981]/50 rounded-lg font-ui uppercase tracking-wider text-sm">
                        Active
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEquip(skin.id)}
                        className="px-6 py-3 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] rounded-lg font-ui uppercase tracking-wider text-sm transition-all glow-soft"
                      >
                        Equip
                      </motion.button>
                    )
                  ) : (
                    <motion.button
                      whileHover={{ scale: canAfford ? 1.05 : 1 }}
                      whileTap={{ scale: canAfford ? 0.95 : 1 }}
                      onClick={() => canAfford && handlePurchase(skin)}
                      disabled={!canAfford || isPurchasing}
                      className={`px-6 py-3 rounded-lg font-ui uppercase tracking-wider text-sm transition-all ${
                        canAfford
                          ? 'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] glow-medium'
                          : 'bg-[#4B5563] cursor-not-allowed opacity-50'
                      }`}
                    >
                      {isPurchasing ? 'Acquiring...' : canAfford ? 'Purchase' : 'Insufficient'}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-[4.236rem] text-center text-[#8A9BB8] font-ui"
        >
          <p className="text-sm tracking-widest uppercase">
            Each skin is a distinct material reality with unique visual physics
          </p>
        </motion.div>
      </div>
    </div>
  );
}
