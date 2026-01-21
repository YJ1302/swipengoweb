'use client';

import { Reveal } from '../ui/animations/Reveal';
import { StaggerGrid, StaggerItem } from '../ui/animations/Stagger';

const features = [
    {
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
        ),
        title: 'Customize Trips',
        description: 'Every journey is tailored to your preferences. From adventure to relaxation, we design the perfect itinerary just for you.',
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        title: 'Best Prices',
        description: 'Exclusive deals and competitive pricing on all our packages. Travel more, spend less with our unbeatable offers.',
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        title: 'Trusted Service',
        description: 'Years of experience and hundreds of happy travelers. Your satisfaction and safety are our top priorities.',
    },
];

export function Features() {
    return (
        <section className="py-20 bg-slate-900 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <Reveal>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Why Choose <span className="text-amber-400">Us</span>
                        </h2>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            We go above and beyond to make your travel experience exceptional
                        </p>
                    </Reveal>
                </div>

                <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={0.2}>
                    {features.map((feature, index) => (
                        <StaggerItem
                            key={index}
                            className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800 hover:border-amber-500/50 transition-all duration-300"
                        >
                            {/* Icon */}
                            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-amber-500/20">
                                {feature.icon}
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed">{feature.description}</p>

                            {/* Hover Glow */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </StaggerItem>
                    ))}
                </StaggerGrid>
            </div>
        </section>
    );
}

