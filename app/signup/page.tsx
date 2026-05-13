'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Starting signup process...');

      // Check if email already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', email)
        .limit(1);

      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            city,
          },
        },
      });

      console.log('Auth response:', { authData, authError });

      if (authError) {
        // Handle specific error messages
        if (authError.message.includes('already registered') ||
            authError.message.includes('already exists') ||
            authError.message.includes('User already registered')) {
          throw new Error('This email is already registered. Please use a different email or try logging in.');
        }
        throw authError;
      }

      // Check if user was actually created (Supabase sometimes returns user even if email exists)
      if (authData.user && authData.user.identities && authData.user.identities.length === 0) {
        throw new Error('This email is already registered. Please use a different email or try logging in.');
      }

      if (authData.user) {
        console.log('User created, creating profile...');

        // Create profile with initial values
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            username,
            city: city || null,
            cosmic_coins: 0,
            current_skin: 'default',
            owned_skins: ['default'],
          });

        if (profileError) {
          console.log('Profile error:', profileError);
          // Check if it's a duplicate key error
          if (profileError.message.includes('duplicate') || profileError.code === '23505') {
            throw new Error('This email is already registered. Please use a different email or try logging in.');
          }
        }

        console.log('Showing confirmation modal');
        // Show email confirmation modal
        setShowEmailConfirmation(true);
      } else {
        console.log('No user in response');
        throw new Error('Registration failed - no user returned');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmationOk = () => {
    setShowEmailConfirmation(false);
    router.push('/');
  };

  const stars = useMemo(() => {
    return [...Array(150)].map((_, i) => ({
      key: i,
      width: Math.random() * 3 + 1,
      height: Math.random() * 3 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      animationDelay: Math.random() * 3,
      animationDuration: Math.random() * 3 + 2,
    }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0E1A] via-[#1A2744] to-[#0A0E1A] flex items-center justify-center p-4">
      {/* Email Confirmation Modal */}
      <AnimatePresence>
        {showEmailConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0E1A]/95 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="relative max-w-lg w-full mx-4 p-8 rounded-2xl bg-gradient-to-br from-[#1A2744] via-[#2A3F5F] to-[#1A2744] nebula-edge overflow-hidden"
              style={{
                boxShadow: '0 0 80px rgba(139, 92, 246, 0.4), inset 0 0 60px rgba(139, 92, 246, 0.1)',
              }}
            >
              {/* Animated Background Stars */}
              <div className="absolute inset-0 opacity-30">
                {[...Array(30)].map((_, i) => (
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
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="relative z-10 text-center space-y-6">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                  className="text-7xl"
                >
                  📧
                </motion.div>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="font-title text-4xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] bg-clip-text text-transparent mb-3 tracking-wide">
                    VERIFY YOUR EMAIL
                  </h2>
                  <p className="font-ui text-lg text-[#8A9BB8] tracking-wider uppercase">
                    Confirmation Required
                  </p>
                </motion.div>

                {/* Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-6 bg-[#0A0E1A]/60 rounded-xl border border-[#8B5CF6]/30"
                >
                  <p className="font-ui text-white/90 leading-relaxed mb-4">
                    We've sent a confirmation link to:
                  </p>
                  <p className="font-data text-[#00F5FF] text-lg font-bold mb-4">
                    {email}
                  </p>
                  <p className="font-ui text-[#8A9BB8] text-sm leading-relaxed">
                    Please check your inbox and click the confirmation link to activate your account.
                  </p>
                </motion.div>

                {/* OK Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConfirmationOk}
                  className="w-full px-8 py-4 bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] hover:from-[#9333EA] hover:to-[#06B6D4] text-white font-ui text-lg uppercase tracking-wider rounded-xl transition-all glow-medium"
                >
                  OK
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.key}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: star.width + 'px',
              height: star.height + 'px',
              top: star.top + '%',
              left: star.left + '%',
              animationDelay: star.animationDelay + 's',
              animationDuration: star.animationDuration + 's',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-[#0A0E1A]/60 backdrop-blur-xl rounded-2xl p-10 shadow-2xl nebula-edge">
          <h1 className="font-title text-5xl font-bold text-center mb-3 bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] bg-clip-text text-transparent tracking-wide">
            JOIN THE COSMOS
          </h1>
          <p className="text-center text-[#8A9BB8] mb-10 font-ui tracking-wider uppercase text-sm">Register New Operator</p>

          {error && (
            <div className="mb-6 p-4 bg-[#DC2626]/20 border border-[#DC2626]/50 rounded-lg text-[#FCA5A5] text-sm font-ui">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-[1.618rem]">
            <div>
              <label htmlFor="username" className="block text-sm font-ui text-[#8A9BB8] mb-2 uppercase tracking-widest">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                maxLength={20}
                className="w-full px-5 py-4 bg-[#1A2744]/50 border border-[#8B5CF6]/30 rounded-lg text-white font-data placeholder-[#8A9BB8]/50 focus:outline-none focus:border-[#00F5FF] focus:ring-2 focus:ring-[#00F5FF]/20 transition-all"
                placeholder="CosmicOperator"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-ui text-[#8A9BB8] mb-2 uppercase tracking-widest">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-4 bg-[#1A2744]/50 border border-[#8B5CF6]/30 rounded-lg text-white font-data placeholder-[#8A9BB8]/50 focus:outline-none focus:border-[#00F5FF] focus:ring-2 focus:ring-[#00F5FF]/20 transition-all"
                placeholder="operator@stellar.sys"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-ui text-[#8A9BB8] mb-2 uppercase tracking-widest">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-5 py-4 bg-[#1A2744]/50 border border-[#8B5CF6]/30 rounded-lg text-white font-data placeholder-[#8A9BB8]/50 focus:outline-none focus:border-[#00F5FF] focus:ring-2 focus:ring-[#00F5FF]/20 transition-all"
                placeholder="••••••••"
              />
              <p className="mt-2 text-xs text-[#8A9BB8]/70 font-ui">Minimum 6 characters</p>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-ui text-[#8A9BB8] mb-2 uppercase tracking-widest">
                City <span className="text-[#8A9BB8]/50">(Optional)</span>
              </label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-5 py-4 bg-[#1A2744]/50 border border-[#8B5CF6]/30 rounded-lg text-white font-data placeholder-[#8A9BB8]/50 focus:outline-none focus:border-[#00F5FF] focus:ring-2 focus:ring-[#00F5FF]/20 transition-all"
                placeholder="Your location"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] hover:from-[#9333EA] hover:to-[#06B6D4] disabled:from-[#4B5563] disabled:to-[#6B7280] text-white font-ui font-bold uppercase tracking-widest rounded-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed glow-medium"
            >
              {loading ? 'Creating...' : 'Register'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[#8A9BB8] font-ui">
              Already registered?{' '}
              <Link href="/login" className="text-[#00F5FF] hover:text-[#8B5CF6] font-semibold transition-colors">
                Login
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-[#8A9BB8]/70 hover:text-[#8A9BB8] text-sm font-ui transition-colors">
              ← Return to base
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
