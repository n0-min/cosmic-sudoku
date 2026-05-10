'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0E1A] via-[#1A2744] to-[#0A0E1A] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(150)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's',
              animationDuration: Math.random() * 3 + 2 + 's',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-[#0A0E1A]/60 backdrop-blur-xl rounded-2xl p-10 shadow-2xl nebula-edge">
          <h1 className="font-title text-5xl font-bold text-center mb-3 bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] bg-clip-text text-transparent tracking-wide">
            WELCOME BACK
          </h1>
          <p className="text-center text-[#8A9BB8] mb-10 font-ui tracking-wider uppercase text-sm">Access Stellar Calculus</p>

          {error && (
            <div className="mb-6 p-4 bg-[#DC2626]/20 border border-[#DC2626]/50 rounded-lg text-[#FCA5A5] text-sm font-ui">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-[1.618rem]">
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
                className="w-full px-5 py-4 bg-[#1A2744]/50 border border-[#8B5CF6]/30 rounded-lg text-white font-data placeholder-[#8A9BB8]/50 focus:outline-none focus:border-[#00F5FF] focus:ring-2 focus:ring-[#00F5FF]/20 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] hover:from-[#9333EA] hover:to-[#06B6D4] disabled:from-[#4B5563] disabled:to-[#6B7280] text-white font-ui font-bold uppercase tracking-widest rounded-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed glow-medium"
            >
              {loading ? 'Accessing...' : 'Login'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[#8A9BB8] font-ui">
              New operator?{' '}
              <Link href="/signup" className="text-[#00F5FF] hover:text-[#8B5CF6] font-semibold transition-colors">
                Register
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
