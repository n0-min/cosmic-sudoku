'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/store/user-store';

interface DonationPackage {
  id: string;
  coins: number;
  price: number;
  bonus: number;
  popular?: boolean;
}

const DONATION_PACKAGES: DonationPackage[] = [
  {
    id: 'starter',
    coins: 500,
    price: 0.99,
    bonus: 0,
  },
  {
    id: 'basic',
    coins: 1200,
    price: 1.99,
    bonus: 200,
  },
  {
    id: 'popular',
    coins: 3000,
    price: 4.99,
    bonus: 500,
    popular: true,
  },
  {
    id: 'premium',
    coins: 6500,
    price: 9.99,
    bonus: 1500,
  },
  {
    id: 'mega',
    coins: 15000,
    price: 19.99,
    bonus: 5000,
  },
  {
    id: 'ultimate',
    coins: 35000,
    price: 49.99,
    bonus: 15000,
  },
];

export default function DonatePage() {
  const router = useRouter();
  const { cosmicCoins, addCoins } = useUserStore();
  const [processing, setProcessing] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  const handleDonation = async (pkg: DonationPackage) => {
    setProcessing(true);
    setSelectedPackage(pkg.id);

    // Simulate payment processing
    setTimeout(() => {
      const totalCoins = pkg.coins + pkg.bonus;
      addCoins(totalCoins);

      // Show success message
      alert(`Thank you for your support! You received ${totalCoins.toLocaleString()} Cosmic Coins!`);

      setProcessing(false);
      setSelectedPackage(null);
    }, 1500);
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
          <h1 className="font-title text-7xl md:text-8xl font-black bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] bg-clip-text text-transparent mb-4 tracking-wide">
            COSMIC COINS
          </h1>
          <p className="font-ui text-xl text-[#8A9BB8] tracking-widest uppercase">Support Development & Get Rewards</p>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto mb-[2.618rem] p-6 bg-gradient-to-r from-[#8B5CF6]/20 to-[#00F5FF]/20 rounded-xl border border-[#8B5CF6]/40"
        >
          <p className="font-ui text-center text-white/90 leading-relaxed">
            Your support helps us continue developing Cosmic Sudoku and adding new features.
            All donations are greatly appreciated! 🚀
          </p>
        </motion.div>

        {/* Donation Packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1.618rem] max-w-7xl mx-auto">
          {DONATION_PACKAGES.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className={`relative p-8 rounded-2xl bg-gradient-to-br from-[#1A2744] to-[#2A3F5F] overflow-hidden nebula-edge ${
                pkg.popular ? 'ring-2 ring-[#FFD700]' : ''
              }`}
              style={{
                boxShadow: pkg.popular
                  ? '0 0 40px rgba(255, 215, 0, 0.4)'
                  : '0 0 20px rgba(139, 92, 246, 0.3)',
              }}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full text-xs font-ui font-bold uppercase tracking-widest text-[#0A0E1A]">
                  ⭐ Popular
                </div>
              )}

              {/* Content */}
              <div className="flex flex-col h-full text-center space-y-4">
                {/* Coin Icon */}
                <div className="text-7xl">💰</div>

                {/* Coins Amount */}
                <div>
                  <div className="font-data text-5xl font-bold text-[#FFD700] mb-2">
                    {pkg.coins.toLocaleString()}
                  </div>
                  {pkg.bonus > 0 && (
                    <div className="font-ui text-sm text-[#10B981] uppercase tracking-wider">
                      + {pkg.bonus.toLocaleString()} Bonus
                    </div>
                  )}
                </div>

                {/* Total */}
                {pkg.bonus > 0 && (
                  <div className="font-data text-2xl text-white">
                    = {(pkg.coins + pkg.bonus).toLocaleString()} Total
                  </div>
                )}

                {/* Price */}
                <div className="font-title text-4xl font-bold text-white">
                  ${pkg.price.toFixed(2)}
                </div>

                {/* Spacer to push button to bottom */}
                <div className="flex-grow" />

                {/* Buy Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDonation(pkg)}
                  disabled={processing && selectedPackage === pkg.id}
                  className={`w-full px-8 py-4 rounded-xl font-ui text-lg uppercase tracking-wider transition-all ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-[#0A0E1A]'
                      : 'bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] hover:from-[#9333EA] hover:to-[#06B6D4] text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed glow-medium`}
                >
                  {processing && selectedPackage === pkg.id ? 'Processing...' : 'Purchase'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-[4.236rem] text-center text-[#8A9BB8] font-ui space-y-2"
        >
          <p className="text-sm tracking-widest uppercase">
            Secure payment processing • Instant delivery
          </p>
          <p className="text-xs opacity-70">
            Note: This is a demo. No real payments are processed.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
