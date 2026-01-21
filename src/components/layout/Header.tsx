'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917620011714';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent('Hello! I would like to get in touch with you.')}`;

    const navLinks = [
        { href: '/', label: 'Home', external: false },
        { href: '/packages', label: 'Packages', external: false },
        { href: '/gallery', label: 'Gallery', external: false },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-brand-navy/95 backdrop-blur-md border-b border-white/10">
            {/* Full width container with standard padding */}
            <div className="w-full px-4 sm:px-6 lg:px-12">
                <div className="flex items-center justify-between h-20 relative">

                    {/* LEFT: Logo */}
                    <div className="flex-shrink-0 z-20">
                        <Link href="/" className="flex items-center group">
                            <div className="bg-white/95 rounded-lg p-1 transform group-hover:scale-105 transition-transform duration-300">
                                <Image
                                    src="/logo.jpg"
                                    alt="Swipe N Go Vacations"
                                    width={160}
                                    height={80}
                                    className="h-12 md:h-14 w-auto object-contain"
                                    priority
                                />
                            </div>
                        </Link>
                    </div>

                    {/* CENTER: Text (Absolute centered on desktop, hidden or stacked on mobile?) 
                        User: "It should be responsive and not overlap on mobile (collapse neatly)." 
                        I'll hide it on very small screens or make it smaller. 
                        Actually, "collapse neatly" often means stacking or hiding. 
                        Given space constraints on mobile (Logo + Menu Button), centering text might overlap. 
                        I'll show it only on md+ screens for absolute centering, 
                        or use flex-grow with text-center.
                    */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
                        <span className="text-xl lg:text-2xl font-bold text-white tracking-wide uppercase font-display bg-clip-text text-transparent bg-gradient-to-r from-white to-brand-primary/80">
                            Swipe N Go Vacations
                        </span>
                    </div>

                    {/* RIGHT: Navigation */}
                    <div className="flex items-center z-20">
                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="px-3 py-2 text-white/80 hover:text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-200"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-2 text-white/80 hover:text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-200"
                            >
                                Contact
                            </a>
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors ml-4"
                            aria-label="Toggle menu"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Center Text (Optional: Show below logo if needed, but usually redundant if header is slim) 
                    The user said "collapse neatly". I will just show it in the drawer or below header if requested.
                    For now, hiding on mobile is "collapsing" it out of view. 
                    If they want it visible on mobile, I can add it to the drawer header.
                */}
            </div>

            {/* Mobile Menu Drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-white/10 bg-brand-navy">
                    {/* Mobile Brand Text */}
                    <div className="px-4 py-3 text-center border-b border-white/5">
                        <span className="text-lg font-bold text-white tracking-wide uppercase">
                            Swipe N Go Vacations
                        </span>
                    </div>

                    <nav className="flex flex-col p-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-4 py-3 text-white/80 hover:text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-200 text-center"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setMobileMenuOpen(false)}
                            className="px-4 py-3 text-brand-primary hover:text-white font-bold rounded-lg hover:bg-white/10 transition-all duration-200 text-center border border-brand-primary/20"
                        >
                            Contact via WhatsApp
                        </a>
                    </nav>
                </div>
            )}
        </header>
    );
}
