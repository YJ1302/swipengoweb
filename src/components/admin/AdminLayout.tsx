'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface AdminLayoutProps {
    children: ReactNode;
}

// Admin-only navigation items (no public site links)
const navItems = [
    { href: '/admin', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { href: '/admin/leads', label: 'Leads', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { href: '/admin/packages', label: 'Packages', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { href: '/admin/gallery', label: 'Gallery', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { href: '/admin/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];

export function AdminLayout({ children }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [authenticated, setAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/admin/auth');
            const data = await res.json();
            if (data.authenticated) {
                setAuthenticated(true);
            } else {
                router.push('/admin/login');
            }
        } catch {
            router.push('/admin/login');
        }
    };

    const handleLogout = async () => {
        await fetch('/api/admin/auth', { method: 'DELETE' });
        router.push('/admin/login');
    };

    if (authenticated === null) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 z-50 h-full w-64 bg-slate-800/95 backdrop-blur-xl border-r border-white/10
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
            `}>
                {/* Logo */}
                <div className="h-20 flex items-center justify-between px-4 border-b border-white/10">
                    <Link href="/admin" className="flex items-center gap-3">
                        <Image
                            src="/logo.jpg"
                            alt="Swipe N Go"
                            width={48}
                            height={48}
                            className="w-12 h-12 object-contain"
                        />
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-white leading-tight">Swipe N Go</span>
                            <span className="text-xs text-brand-primary font-medium">Admin Panel</span>
                        </div>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 text-slate-400 hover:text-white"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/admin' && pathname?.startsWith(item.href));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                                    ${isActive
                                        ? 'bg-brand-primary/20 text-brand-primary'
                                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                    }
                                `}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                </svg>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom section - only Logout, View Website opens in new tab */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-all mb-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Website
                        <svg className="w-3 h-3 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 rounded-xl hover:bg-red-500/10 transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <header className="h-16 bg-slate-800/50 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 sticky top-0 z-30">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 text-slate-400 hover:text-white"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-2">
                        <Image
                            src="/logo.jpg"
                            alt="Swipe N Go"
                            width={32}
                            height={32}
                            className="w-8 h-8 object-contain"
                        />
                        <span className="text-white font-bold text-sm">Admin</span>
                    </div>

                    <div className="flex-1 max-w-md mx-4 hidden md:block">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="search"
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center">
                                <svg className="w-4 h-4 text-brand-primary" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="text-white text-sm font-medium hidden sm:block">Admin</span>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
