'use client';

import { Reveal } from '../ui/animations/Reveal';

const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/swipe_n_go_vacations/';

export function InstagramPreview() {
    return (
        <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <Reveal width="100%">
                    <div className="relative">
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-orange-500/20 blur-3xl animate-pulse"></div>

                        <div className="relative bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 md:p-12 hover:border-pink-500/30 transition-colors duration-300">
                            {/* Instagram Icon */}
                            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 rounded-2xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300 shadow-lg shadow-pink-500/20">
                                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" />
                                </svg>
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                                Follow Our Adventures
                            </h2>
                            <p className="text-slate-400 mb-8 max-w-md mx-auto">
                                Get travel inspiration, exclusive deals, and behind-the-scenes content on our Instagram
                            </p>

                            <a
                                href={instagramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-pink-500/25 transform hover:scale-105 active:scale-95 transition-all duration-200"
                            >
                                <span>@swipe_n_go_vacations</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

