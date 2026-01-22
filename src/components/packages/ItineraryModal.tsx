'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ItineraryDay } from '@/types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    itinerary: ItineraryDay[];
}

export function ItineraryModal({ isOpen, onClose, itinerary }: Props) {
    const [activeDay, setActiveDay] = useState<number | null>(1);
    const [mounted, setMounted] = useState(false);

    const toggleDay = (dayNum: number) => {
        setActiveDay(activeDay === dayNum ? null : dayNum);
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-slate-900/80"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="pointer-events-auto w-full max-w-[850px] max-h-[85vh] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10">
                                <h2 className="text-2xl font-bold text-white">Itinerary</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gradient-to-b from-slate-900 to-slate-800">
                                {itinerary.length === 0 ? (
                                    <div className="text-center text-slate-400 py-12">
                                        <p>Itinerary details will be shared after booking confirmation.</p>
                                    </div>
                                ) : (
                                    <div className="relative pl-4 sm:pl-8 space-y-6">
                                        {/* Vertical Line */}
                                        <div className="absolute left-[11px] sm:left-[27px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-brand-primary/50 to-transparent" />

                                        {itinerary.map((day, index) => {
                                            const isActive = activeDay === day.day;
                                            return (
                                                <motion.div
                                                    key={day.day}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="relative pl-8 sm:pl-10"
                                                >
                                                    {/* Node/Dot */}
                                                    <button
                                                        onClick={() => toggleDay(day.day)}
                                                        className={`absolute left-0 top-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-all z-10 ${isActive
                                                            ? 'bg-brand-primary border-brand-primary shadow-[0_0_15px_rgba(234,179,8,0.5)]'
                                                            : 'bg-slate-800 border-slate-600 hover:border-brand-primary/50'
                                                            }`}
                                                    >
                                                        <span className={`text-[10px] sm:text-xs font-bold ${isActive ? 'text-brand-navy' : 'text-slate-400'}`}>
                                                            {day.day}
                                                        </span>
                                                    </button>

                                                    {/* Card */}
                                                    <div
                                                        className={`rounded-xl border transition-all duration-300 overflow-hidden ${isActive
                                                            ? 'bg-white/5 border-brand-primary/30 shadow-lg'
                                                            : 'bg-transparent border-transparent hover:bg-white/5'
                                                            }`}
                                                    >
                                                        {/* Header (Clickable) */}
                                                        <button
                                                            onClick={() => toggleDay(day.day)}
                                                            className="w-full flex items-center justify-between p-4 text-left"
                                                        >
                                                            <div className="pr-4">
                                                                <h3 className={`font-bold text-lg transition-colors ${isActive ? 'text-brand-primary' : 'text-white'}`}>
                                                                    {day.title || `Day ${day.day}`}
                                                                </h3>
                                                            </div>
                                                            <svg
                                                                className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isActive ? 'rotate-180 text-brand-primary' : ''}`}
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </button>

                                                        {/* Details (Accordion) */}
                                                        <AnimatePresence>
                                                            {isActive && (
                                                                <motion.div
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: "auto", opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                                >
                                                                    <div className="px-4 pb-4 pt-0">
                                                                        <div className="h-px w-full bg-white/10 mb-4" />
                                                                        <div className="flex flex-col md:flex-row gap-4">
                                                                            <div className="flex-1">
                                                                                <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                                                                                    {day.description || 'No details information available.'}
                                                                                </p>
                                                                            </div>
                                                                            {day.image && (
                                                                                <div className="w-full md:w-1/3 shrink-0">
                                                                                    <div className="aspect-video relative rounded-lg overflow-hidden bg-slate-800 border border-white/10 shadow-lg">
                                                                                        <img
                                                                                            src={day.image}
                                                                                            alt={day.title || `Day ${day.day}`}
                                                                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
