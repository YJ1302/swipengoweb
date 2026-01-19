import Link from 'next/link';
import { WhatsAppButton } from '../ui/WhatsAppButton';

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop')`,
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900"></div>
            </div>

            {/* Animated Particles Effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="mb-6">
                    <span className="inline-block px-4 py-2 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium border border-amber-500/30 backdrop-blur-sm">
                        ✈️ Your Dream Vacation Awaits
                    </span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
                    Unforgettable
                    <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent"> Travel </span>
                    Experiences
                </h1>

                <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Discover handpicked destinations, exclusive packages, and personalized service.
                    Let us turn your travel dreams into reality.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/packages"
                        className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 transform hover:scale-105 active:scale-95 transition-all duration-200"
                    >
                        View Packages
                    </Link>
                    <WhatsAppButton size="lg" variant="secondary" className="w-full sm:w-auto">
                        Chat on WhatsApp
                    </WhatsAppButton>
                </div>

                {/* Stats */}
                <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-amber-400">500+</div>
                        <div className="text-sm text-slate-400">Happy Travelers</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-amber-400">50+</div>
                        <div className="text-sm text-slate-400">Destinations</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-amber-400">5⭐</div>
                        <div className="text-sm text-slate-400">Rated Service</div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
                    <div className="w-1 h-2 bg-white/50 rounded-full"></div>
                </div>
            </div>
        </section>
    );
}
