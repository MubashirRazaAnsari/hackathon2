'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from '@/lib/auth-client';

export default function SigninPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn.email({
        email,
        password,
        callbackURL: '/dashboard'
      });

      if (res.error) {
        throw new Error(res.error.message || 'Login failed');
      }

      router.refresh();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block text-indigo-400 hover:text-indigo-300 mb-4 transition-colors">
             ← Back to home
          </Link>
          <h2 className="text-4xl font-black gradient-text">Welcome Back</h2>
          <p className="text-slate-400">Continue your journey to efficiency</p>
        </div>

        <div className="glass-card p-8 md:p-10">
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
               ⚠️ {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 ml-1" htmlFor="email text-slate-400">Email Address</label>
              <input
                id="email"
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-semibold text-slate-300" htmlFor="password">Password</label>
                <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Forgot Password?</a>
              </div>
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-4 flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Authenticating...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-400">
              New to the platform?{' '}
              <Link
                href="/auth/signup"
                className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
        
        {/* Footer info */}
        <p className="text-center text-xs text-slate-600">
          Secure, encrypted, and privacy-focused auth powered by Better-Auth.
        </p>
      </div>
    </div>
  );
}