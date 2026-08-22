'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (data.success) {
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        setErrorMsg(data.error || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-black text-white">
      <div className="w-full max-w-md bg-neutral-950 rounded-2xl border border-neutral-800 p-8 sm:p-10 shadow-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 text-white flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6 text-neutral-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Admin Portal
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              RAMBADEVI Jewellers • Management Login
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/50 border border-red-800 text-xs text-red-300 font-medium text-center">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
              Username
            </label>
            <input
              type="text"
              required
              autoComplete="username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full text-sm px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-sm px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-white text-black font-bold text-sm hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-neutral-800/80">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <span>← Return to Public Store</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
