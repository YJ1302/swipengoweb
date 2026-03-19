'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917620011714';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent('Hello! I would like to get in touch with you.')}`;

    // Prevent scrolling when side menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [mobileMenuOpen]);

    const navLinks = [
        { href: '/', label: 'Home', external: false },
        { href: '/packages', label: 'Packages', external: false },
        { href: '/customize', label: 'Customize Package', external: false },
        { href: '/gallery', label: 'Gallery', external: false },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-brand-navy/95 backdrop-blur-md border-b border-white/10">
            {/* Full width container with standard padding */}
            <div className="w-full px-4 sm:px-6 lg:px-12">
                <div className="relative flex items-center justify-between h-16 md:h-20 gap-4 transition-all">

                    {/* LEFT: Logo - Significantly Larger */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center group">
                            {/* Added clean white background minimal frame */}
                            <div className="bg-white rounded-lg p-[3px] overflow-hidden transform group-hover:scale-105 transition-transform duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.2)]">
                                <Image
                                    src="/logo.jpg"
                                    alt="Swipe N Go Vacations"
                                    width={220}
                                    height={110}
                                    className="h-10 sm:h-12 md:h-14 w-auto object-contain hover:opacity-90 transition-opacity"
                                    priority
                                />
                            </div>
                        </Link>
                    </div>

                    {/* CENTER: Text (Desktop Only) */}
                    <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center pointer-events-none w-max px-4">
                        <span className="text-2xl lg:text-3xl xl:text-[34px] font-extrabold text-white tracking-widest uppercase font-display bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-brand-primary/80">
                            Swipe N Go Vacations
                        </span>
                    </div>

                    {/* RIGHT: Hamburger Button Only (For all devices per request) */}
                    <div className="flex items-center flex-shrink-0">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="p-1.5 sm:px-4 sm:py-2 text-white/90 hover:text-brand-primary bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-brand-primary/40 transition-all flex items-center gap-2.5 shadow-sm"
                            aria-label="Toggle Navigation Menu"
                        >
                            <span className="hidden sm:block font-bold text-sm tracking-widest uppercase">Menu</span>
                            <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Side Navigation Overlay (Backdrop) */}
            <div 
                className={`fixed inset-0 h-screen w-screen bg-black/70 backdrop-blur-md z-[60] transition-opacity duration-300 ease-in-out ${mobileMenuOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'}`} 
                onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Side Navigation Drawer */}
            <div 
                className={`fixed top-0 right-0 h-screen w-[85vw] max-w-sm bg-brand-navy shadow-2xl z-[70] transform transition-transform duration-500 ease-in-out flex flex-col border-l border-white/10 overflow-y-auto ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Drawer Header */}
                <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
                    <span className="text-2xl font-bold text-white">Navigation</span>
                    <button 
                        onClick={() => setMobileMenuOpen(false)} 
                        className="text-white/60 hover:text-brand-primary p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                        aria-label="Close Menu"
                    >
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Drawer Links */}
                <nav className="flex flex-col p-6 space-y-4 flex-1 relative overflow-hidden">
                    {/* Background glow effect inside drawer menu */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
                    
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="relative text-xl font-medium text-white/80 hover:text-brand-navy hover:bg-brand-primary px-5 py-5 rounded-2xl transition-all duration-300 group flex items-center justify-between border border-transparent hover:border-brand-secondary/50 shadow-sm"
                        >
                            <span className="group-hover:font-bold tracking-wide">{link.label}</span>
                            <svg className="w-6 h-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    ))}
                </nav>
                
                {/* Contact CTA Block at bottom of drawer */}
                <div className="p-6 border-t border-white/10 bg-slate-900/40 relative z-10">
                    <p className="text-white/50 text-xs font-medium uppercase tracking-widest text-center mb-4">Direct Inquiry</p>
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-3 w-full py-4 bg-green-500 text-white font-bold text-lg rounded-2xl shadow-[0_4px_20px_rgba(34,197,94,0.3)] hover:bg-green-400 hover:-translate-y-1 transition-all"
                    >
                        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        WhatsApp Us
                    </a>
                </div>
            </div>
        </header>
    );
}
