import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
    const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || 'Swipe N Go Vacations';
    const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/swipe_n_go_vacations/';
    const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://www.facebook.com/p/Swipengovacations-61570140293216/';
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="relative w-12 h-12 bg-white rounded-lg p-0.5 overflow-hidden flex-shrink-0">
                                <Image
                                    src="/logo.jpg"
                                    alt={businessName}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-white font-display font-bold text-xl">{businessName}</span>
                        </div>
                        <p className="text-slate-400 max-w-md">
                            Your trusted partner for unforgettable vacation experiences.
                            Custom trips, best prices, and personalized service.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-slate-400 hover:text-amber-400 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/packages" className="text-slate-400 hover:text-amber-400 transition-colors">
                                    Packages
                                </Link>
                            </li>
                            <li>
                                <Link href="/gallery" className="text-slate-400 hover:text-amber-400 transition-colors">
                                    Gallery
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-slate-400 hover:text-amber-400 transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/cancellation-policy" className="text-slate-400 hover:text-amber-400 transition-colors text-sm">
                                    Cancellation Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Connect</h3>
                        <div className="space-y-3">
                            {instagramUrl && (
                                <a
                                    href={instagramUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-2 text-slate-400 hover:text-pink-400 transition-colors group"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" />
                                    </svg>
                                    <span>Instagram</span>
                                </a>
                            )}
                            {facebookUrl && (
                                <a
                                    href={facebookUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-2 text-slate-400 hover:text-blue-500 transition-colors group"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    <span>Facebook</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-slate-800 text-center">
                    <p className="text-slate-500 text-sm">
                        © {currentYear} {businessName}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
