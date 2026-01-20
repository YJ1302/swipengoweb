'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (data.success) {
                router.push('/admin');
            } else {
                setError(data.error || 'Invalid password');
            }
        } catch {
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <Image
                            src="/logo.jpg"
                            alt="Swipe N Go"
                            width={80}
                            height={80}
                            className="w-20 h-20 object-contain"
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Swipe N Go
                    </h1>
                    <p className="text-brand-primary font-medium">Admin Dashboard</p>
                </div>

                {/* Login Card */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <h2 className="text-xl font-semibold text-white mb-6 text-center">
                        Sign In
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                                Admin Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/50 transition-all"
                                required
                                autoFocus
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-brand-primary hover:bg-brand-primary/90 text-brand-navy font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-slate-500 text-sm">
                        <a href="/" className="hover:text-brand-primary transition-colors">
                            ← Back to website
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
