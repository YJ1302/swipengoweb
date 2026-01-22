'use client';

import { useState } from 'react';
import { ItineraryDay } from '@/types';
import { ItineraryModal } from './ItineraryModal';

export function ItinerarySection({ itinerary }: { itinerary: ItineraryDay[] }) {
    const [isOpen, setIsOpen] = useState(false);

    const hasItinerary = itinerary && itinerary.length > 0;
    const count = itinerary ? itinerary.length : 0;

    return (
        <>
            <div className="p-6 md:p-8 border-b border-slate-700/50">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Day-by-Day Itinerary
                </h2>

                <button
                    onClick={() => setIsOpen(true)}
                    className="w-full text-left group bg-slate-800 hover:bg-slate-750 border border-white/10 rounded-xl p-6 transition-all duration-300 hover:border-brand-primary/50 hover:shadow-[0_0_20px_rgba(234,179,8,0.1)] relative overflow-hidden"
                >
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/0 via-brand-primary/0 to-brand-primary/0 group-hover:from-brand-primary/5 group-hover:to-transparent transition-all duration-500" />

                    <div className="relative flex items-center justify-between z-10">
                        <div>
                            <h3 className="text-lg font-bold text-white group-hover:text-brand-primary transition-colors">View Full Itinerary</h3>
                            <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
                                {hasItinerary ? (
                                    <>
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                        {count} Days of Adventure
                                    </>
                                ) : (
                                    'Details available upon request'
                                )}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-brand-navy group-hover:border-brand-primary transition-all duration-300 transform group-hover:rotate-[-45deg] sm:group-hover:rotate-0">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </button>
            </div>

            <ItineraryModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                itinerary={itinerary || []}
            />
        </>
    );
}
