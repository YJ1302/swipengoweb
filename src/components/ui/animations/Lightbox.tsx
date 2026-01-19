'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useCallback } from 'react';

interface LightboxProps {
    src: string | null;
    alt: string;
    onClose: () => void;
    onNext?: () => void;
    onPrev?: () => void;
    hasNext?: boolean;
    hasPrev?: boolean;
}

export function Lightbox({ src, alt, onClose, onNext, onPrev, hasNext, hasPrev }: LightboxProps) {
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'ArrowRight' && onNext) onNext();
        if (e.key === 'ArrowLeft' && onPrev) onPrev();
    }, [onClose, onNext, onPrev]);

    useEffect(() => {
        if (src) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [src, handleKeyDown]);

    return (
        <AnimatePresence>
            {src && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-brand-navy/95 backdrop-blur-md p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative max-w-7xl w-full h-full max-h-[90vh] flex flex-col items-center justify-center"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute -top-4 -right-4 md:top-0 md:right-0 z-10 p-2 text-white/70 hover:text-white bg-black/30 rounded-full hover:bg-brand-primary/20 transition-all backdrop-blur-sm"
                            aria-label="Close lightbox"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Navigation Arrows */}
                        {hasPrev && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
                                className="absolute left-0 md:-left-16 top-1/2 -translate-y-1/2 z-10 p-3 text-white/70 hover:text-brand-primary bg-black/20 hover:bg-black/40 rounded-full transition-all backdrop-blur-sm group"
                                aria-label="Previous image"
                            >
                                <svg className="w-8 h-8 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        )}
                        {hasNext && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onNext?.(); }}
                                className="absolute right-0 md:-right-16 top-1/2 -translate-y-1/2 z-10 p-3 text-white/70 hover:text-brand-primary bg-black/20 hover:bg-black/40 rounded-full transition-all backdrop-blur-sm group"
                                aria-label="Next image"
                            >
                                <svg className="w-8 h-8 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        )}

                        <div className="relative w-full h-full">
                            <Image
                                src={src}
                                alt={alt}
                                fill
                                className="object-contain"
                                sizes="90vw"
                                priority
                            />
                        </div>

                        {alt && (
                            <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                                <span className="inline-block px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-white/90 text-sm font-medium border border-white/10">
                                    {alt}
                                </span>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
