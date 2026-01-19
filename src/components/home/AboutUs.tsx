export function AboutUs() {
    const destinations = ['Bali', 'Dubai', 'Thailand', 'Europe', 'Sri Lanka', 'India'];

    return (
        <section className="py-16 md:py-24 bg-gradient-to-b from-slate-900 to-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <div>
                        <span className="inline-block px-4 py-2 bg-amber-500/10 text-amber-400 rounded-full text-sm font-semibold mb-4">
                            About Us
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                            Your Trusted Travel Partner Since{' '}
                            <span className="text-amber-400">2024</span>
                        </h2>
                        <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                            Swipe N Go Vacations is a licensed travel agency offering personalized domestic and international travel solutions. Whether it&apos;s a family holiday, romantic honeymoon, or group adventure, we craft each experience to match your style and budget.
                        </p>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            Founded in 2024, we are committed to providing seamless travel planning, transparent pricing, and real-time assistance. We&apos;ve been connecting travelers to destinations with verified support and expert guidance.
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                <div className="text-2xl md:text-3xl font-bold text-amber-400">500+</div>
                                <div className="text-slate-400 text-sm">Happy Travelers</div>
                            </div>
                            <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                <div className="text-2xl md:text-3xl font-bold text-amber-400">50+</div>
                                <div className="text-slate-400 text-sm">Destinations</div>
                            </div>
                            <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                <div className="text-2xl md:text-3xl font-bold text-amber-400">100%</div>
                                <div className="text-slate-400 text-sm">Support</div>
                            </div>
                        </div>

                        {/* CTA */}
                        <a
                            href="https://wa.me/917620011714?text=Hello!%20I%20would%20like%20to%20know%20more%20about%20Swipe%20N%20Go%20Vacations."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transform hover:scale-105 active:scale-95 transition-all duration-200"
                        >
                            <span>Get in Touch</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </a>
                    </div>

                    {/* Destinations Visual */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-3xl blur-3xl"></div>
                        <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8">
                            <h3 className="text-xl font-semibold text-white mb-6 text-center">
                                Popular Destinations We Cover
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {destinations.map((destination, index) => (
                                    <div
                                        key={destination}
                                        className="group p-4 bg-slate-700/30 hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-orange-500/20 rounded-xl border border-slate-600/30 hover:border-amber-500/50 transition-all duration-300 text-center cursor-pointer"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="text-2xl mb-2">
                                            {destination === 'Bali' && '🏝️'}
                                            {destination === 'Dubai' && '🏙️'}
                                            {destination === 'Thailand' && '🛕'}
                                            {destination === 'Europe' && '🏰'}
                                            {destination === 'Sri Lanka' && '🌴'}
                                            {destination === 'India' && '🇮🇳'}
                                        </div>
                                        <span className="text-slate-300 group-hover:text-white font-medium transition-colors">
                                            {destination}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Trust Badges */}
                            <div className="mt-8 pt-6 border-t border-slate-700/50">
                                <div className="flex flex-wrap justify-center gap-4">
                                    <div className="flex items-center space-x-2 text-slate-400">
                                        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm">Licensed Agency</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-slate-400">
                                        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm">Verified Support</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-slate-400">
                                        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm">Expert Guidance</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
