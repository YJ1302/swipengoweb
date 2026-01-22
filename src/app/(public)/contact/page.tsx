import { Metadata } from "next";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Get in touch with Swipe N Go Vacations. Contact us on WhatsApp for instant responses and custom trip planning.",
};

export default function ContactPage() {
    const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/swipe_n_go_vacations/";
    const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || "Swipe N Go Vacations";

    return (
        <div className="min-h-screen pt-20 md:pt-24">
            {/* Hero Section */}
            <section className="py-12 md:py-16 bg-gradient-to-b from-slate-800 to-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                        Get in <span className="text-amber-400">Touch</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Ready to plan your dream vacation? We&apos;re here to help! Contact us through WhatsApp for the fastest response.
                    </p>
                </div>
            </section>

            {/* Contact Options */}
            <section className="py-12 md:py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* WhatsApp Card */}
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-green-500/50 transition-all duration-300">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">WhatsApp</h2>
                            <p className="text-slate-400 mb-6">
                                Get instant responses and personalized trip planning. Our team is ready to assist you!
                            </p>
                            <WhatsAppButton size="lg" className="w-full justify-center">
                                Chat Now
                            </WhatsAppButton>
                        </div>

                        {/* Instagram Card */}
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-pink-500/50 transition-all duration-300">
                            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Instagram</h2>
                            <p className="text-slate-400 mb-6">
                                Follow us for travel inspiration, exclusive deals, and behind-the-scenes content!
                            </p>
                            <a
                                href={instagramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200"
                            >
                                <span>Follow Us</span>
                            </a>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-12 bg-slate-800/30 border border-slate-700/30 rounded-2xl p-8 text-center">
                        <h3 className="text-lg font-semibold text-white mb-4">Why Contact Us?</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div>
                                <div className="text-3xl mb-2">⚡</div>
                                <h4 className="font-semibold text-white mb-1">Fast Response</h4>
                                <p className="text-slate-400 text-sm">Usually within minutes on WhatsApp</p>
                            </div>
                            <div>
                                <div className="text-3xl mb-2">🎯</div>
                                <h4 className="font-semibold text-white mb-1">Custom Trips</h4>
                                <p className="text-slate-400 text-sm">Tailored to your preferences</p>
                            </div>
                            <div>
                                <div className="text-3xl mb-2">💰</div>
                                <h4 className="font-semibold text-white mb-1">Best Prices</h4>
                                <p className="text-slate-400 text-sm">Exclusive deals just for you</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map or Additional CTA */}
            <section className="py-16 bg-gradient-to-r from-amber-500 to-orange-500">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                        Ready to Start Planning?
                    </h2>
                    <p className="text-white/80 mb-8">
                        Tell us your dream destination and let us handle the rest. Your perfect vacation is just a message away!
                    </p>
                    <WhatsAppButton
                        message={`Hi ${businessName}! I'd like to plan my dream vacation. Can you help me?`}
                        size="lg"
                        variant="secondary"
                        className="bg-white text-amber-600 hover:bg-white/90"
                    >
                        Start Planning Now
                    </WhatsAppButton>
                </div>
            </section>
        </div>
    );
}
