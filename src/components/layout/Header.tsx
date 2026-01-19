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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center group">
                        <div className="bg-white/95 rounded-lg p-1 transform group-hover:scale-105 transition-transform duration-300">
                            <Image
                                src="/logo.jpg"
                                alt="Swipe N Go Vacations"
                                width={160}
                                height={80}
                                className="h-10 md:h-14 w-auto object-contain"
                                priority
                            />
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-4 py-2 text-white/80 hover:text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-200"
                            >
                                {link.label}
                            </Link>
                        ))}
                        {/* Contact link - opens WhatsApp directly */}
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 text-white/80 hover:text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-200"
                        >
                            Contact
                        </a>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-white/10">
                        <nav className="flex flex-col space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-4 py-3 text-white/80 hover:text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-200"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {/* Contact link - opens WhatsApp directly */}
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-4 py-3 text-white/80 hover:text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-200"
                            >
                                Contact
                            </a>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}

