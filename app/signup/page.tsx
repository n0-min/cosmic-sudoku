'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
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

      if (authError) throw authError;

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            username,
            city: city || null,
          });

        if (profileError) throw profileError;

        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
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
            JOIN THE COSMOS
          </h1>
          <p className="text-center text-[#8A9BB8] mb-10 font-ui tracking-wider uppercase text-sm">Register New Operator</p>

          {error && (
            <div className="mb-6 p-4 bg-[#DC2626]/20 border border-[#DC2626]/50 rounded-lg text-[#FCA5A5] text-sm font-ui">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-[#10B981]/20 border border-[#10B981]/50 rounded-lg text-[#6EE7B7] text-sm font-ui">
              Account created! Redirecting to login...
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
              disabled={loading || success}
              className="w-full py-4 bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] hover:from-[#9333EA] hover:to-[#06B6D4] disabled:from-[#4B5563] disabled:to-[#6B7280] text-white font-ui font-bold uppercase tracking-widest rounded-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed glow-medium"
            >
              {loading ? 'Creating...' : success ? 'Success!' : 'Register'}
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
