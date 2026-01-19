'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { WhatsAppButton } from '../ui/WhatsAppButton';
import { CountUp } from '../ui/animations/CountUp';
import { StaggerGrid, StaggerItem } from '../ui/animations/Stagger';

export function Hero() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start'],
    });

    const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    return (
        <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image with Parallax & Zoom */}
            <motion.div
                className="absolute inset-0 z-0"
                style={{ y, opacity }}
            >
                <motion.div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop')`,
                    }}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, ease: 'easeOut' }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/80 via-brand-navy/60 to-brand-navy"></div>
            </motion.div>

            {/* Animated Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <motion.div
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        opacity: [0.2, 0.5, 0.2],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                    className="mb-4"
                >
                    <span className="inline-block px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-medium border border-brand-primary/20 backdrop-blur-md">
                        ✈️ Your Dream Vacation Awaits
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight drop-shadow-xl"
                >
                    Unforgettable
                    <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent transform hover:scale-105 transition-transform duration-300 inline-block cursor-default"> Travel </span>
                    Experiences
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
                    className="text-lg sm:text-xl text-slate-200 max-w-2xl mx-auto mb-8 leading-relaxed font-light drop-shadow-md"
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
                        className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-accent text-brand-navy font-semibold rounded-xl shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                        <span>View Packages</span>
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                    <div className="w-full sm:w-auto transform hover:scale-105 transition-transform duration-300">
                        <WhatsAppButton size="lg" variant="secondary" className="w-full shadow-lg hover:shadow-white/10" />
                    </div>
                </motion.div>

                {/* Animated Stats in Hero */}
                <div className="mt-12">
                    <StaggerGrid className="grid grid-cols-3 gap-6 max-w-lg mx-auto" delay={1}>
                        <StaggerItem className="text-center p-3 rounded-2xl bg-brand-navy/30 backdrop-blur-sm border border-white/5 hover:bg-brand-navy/50 transition-colors">
                            <div className="text-2xl font-bold text-brand-primary">
                                <CountUp end={500} suffix="+" duration={2.5} />
                            </div>
                            <div className="text-xs text-slate-300 mt-1">Happy Travelers</div>
                        </StaggerItem>
                        <StaggerItem className="text-center p-3 rounded-2xl bg-brand-navy/30 backdrop-blur-sm border border-white/5 hover:bg-brand-navy/50 transition-colors">
                            <div className="text-2xl font-bold text-brand-primary">
                                <CountUp end={50} suffix="+" duration={2.5} />
                            </div>
                            <div className="text-xs text-slate-300 mt-1">Destinations</div>
                        </StaggerItem>
                        <StaggerItem className="text-center p-3 rounded-2xl bg-brand-navy/30 backdrop-blur-sm border border-white/5 hover:bg-brand-navy/50 transition-colors">
                            <div className="text-2xl font-bold text-brand-primary">
                                <CountUp end={5} suffix="⭐" duration={2} />
                            </div>
                            <div className="text-xs text-slate-300 mt-1">Rated Service</div>
                        </StaggerItem>
                    </StaggerGrid>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2 cursor-pointer hover:border-white/60 transition-colors"
                >
                    <motion.div
                        animate={{ height: ['20%', '50%', '20%'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1 bg-white/50 rounded-full"
                    />
                </motion.div>
            </motion.div>
        </section>
    );
}

