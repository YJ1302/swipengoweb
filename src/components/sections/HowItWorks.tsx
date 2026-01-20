import Link from 'next/link';

const steps = [
    {
        number: 1,
        title: "Share Your Requirements",
        description: "Tell us your dream destination, travel dates, budget, and preferences. We listen to understand exactly what you're looking for.",
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
        )
    },
    {
        number: 2,
        title: "We Craft Your Itinerary",
        description: "Our travel experts design a personalized itinerary with handpicked hotels, experiences, and hidden gems. No cookie-cutter packages.",
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
        )
    },
    {
        number: 3,
        title: "Travel With Our Support",
        description: "Book with confidence knowing you have 24/7 support throughout your journey. We're just a call away if you need anything.",
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    }
];

export function HowItWorks() {
    return (
        <section className="py-16 md:py-24 bg-gradient-to-b from-slate-900 to-brand-navy/50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-medium mb-4">
                        Simple Process
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        How It <span className="text-brand-primary">Works</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Planning your dream vacation is easy with us. Just 3 simple steps to your perfect getaway.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="relative">
                            {/* Connector Line (hidden on mobile, last item) */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-brand-primary/50 to-brand-accent/50" />
                            )}

                            <div className="relative bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 text-center hover:border-brand-primary/30 transition-colors group">
                                {/* Number Badge */}
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-brand-primary text-brand-navy font-bold rounded-full flex items-center justify-center text-sm shadow-lg shadow-brand-primary/30">
                                    {step.number}
                                </div>

                                {/* Icon */}
                                <div className="w-16 h-16 mx-auto mb-4 mt-4 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                                    {step.icon}
                                </div>

                                {/* Content */}
                                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                    <Link
                        href="/quote"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-brand-primary hover:bg-brand-primary/90 text-brand-navy font-bold rounded-xl transition-all shadow-lg shadow-brand-primary/20"
                    >
                        Start Planning Your Trip
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
