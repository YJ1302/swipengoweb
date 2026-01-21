'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { WhatsAppButton } from '../ui/WhatsAppButton';
import Image from 'next/image';

interface HeroMediaItem {
    image_url: string;
    section?: string;
    active?: boolean | string;
    order?: number;
}

export function Hero() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start'],
    });

    const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    const [slides, setSlides] = useState<HeroMediaItem[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);

    // Fetch homepage slides
    useEffect(() => {
        async function fetchSlides() {
            try {
                const res = await fetch('/api/gallery');
                const data = await res.json();
                if (data.gallery) {
                    const homepageSlides = data.gallery
                        .filter((item: HeroMediaItem) => (item.section || 'gallery').toLowerCase() === 'homepage')
                        .sort((a: HeroMediaItem, b: HeroMediaItem) => (a.order || 0) - (b.order || 0));

                    setSlides(homepageSlides);
                }
            } catch (error) {
                console.error('Failed to load hero slides', error);
            } finally {
                setLoading(false);
            }
        }
        fetchSlides();
    }, []);

    // Auto-advance slideshow
    useEffect(() => {
        if (slides.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 3000); // 3 seconds per slide
        return () => clearInterval(interval);
    }, [slides]);

    const fallbackImage = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop';
    const activeImage = slides.length > 0 ? slides[currentSlide].image_url : fallbackImage;

    return (
        <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Slideshow */}
            <motion.div className="absolute inset-0 z-0 bg-brand-navy" style={{ y, opacity }}>
                <AnimatePresence>
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={activeImage}
                            alt="Hero Background"
                            fill
                            priority
                            className="object-cover"
                            quality={90}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/60 via-brand-navy/40 to-brand-navy"></div>

                {/* Texture/Noise Overlay (Optional, keeps it looking premium) */}
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
            </motion.div>

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                    className="mb-6"
                >
                    <span className="inline-block px-4 py-2 bg-white/10 text-brand-primary rounded-full text-sm font-medium border border-white/20 backdrop-blur-md shadow-lg">
                        ✈️ Your Dream Vacation Awaits
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-2xl"
                >
                    Unforgettable
                    <span className="block sm:inline bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent transform hover:scale-105 transition-transform duration-300 cursor-default px-2">
                        Travel
                    </span>
                    Experiences
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
                    className="text-lg sm:text-xl text-slate-200 max-w-2xl mx-auto mb-10 leading-relaxed font-light drop-shadow-lg"
                >
                    Discover handpicked destinations, exclusive packages, and personalized service.
                    Let us turn your travel dreams into reality.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link
                        href="/packages"
                        className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-accent text-brand-navy font-bold rounded-xl shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                        <span>View Packages</span>
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                    <div className="w-full sm:w-auto transform hover:scale-105 transition-transform duration-300">
                        <WhatsAppButton size="lg" variant="outline-white" className="w-full shadow-lg hover:shadow-white/10">Customize Trip</WhatsAppButton>
                    </div>
                </motion.div>

                {/* Slide Indicators */}
                {slides.length > 1 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="flex justify-center gap-2 mt-12"
                    >
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-8 bg-brand-primary' : 'w-2 bg-white/30 hover:bg-white/50'
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block"
            >
                <div className="flex flex-col items-center gap-2">
                    <span className="text-xs text-white/50 font-medium tracking-widest uppercase">Scroll</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-px h-8 bg-gradient-to-b from-white to-transparent"
                    />
                </div>
            </motion.div>
        </section>
    );
}
