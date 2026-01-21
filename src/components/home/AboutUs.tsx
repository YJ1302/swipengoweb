'use client';

import Image from 'next/image';
import { Reveal } from '../ui/animations/Reveal';
import { StaggerGrid, StaggerItem } from '../ui/animations/Stagger';
import { CountUp } from '../ui/animations/CountUp';

export function AboutUs() {
    const destinations = [
        { name: 'Bali', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop' },
        { name: 'Dubai', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop' },
        { name: 'Thailand', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&h=300&fit=crop' },
        { name: 'Sri Lanka', image: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?auto=format&fit=crop&w=400&h=300' },
        { name: 'India', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=300&fit=crop' },
        { name: 'Vietnam', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=400&h=300&fit=crop' },
    ];

    return (
        <section className="py-12 md:py-16 bg-background overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <div>
                        <Reveal>
                            <span className="inline-block px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-semibold mb-4">
                                About Us
                            </span>
                        </Reveal>
                        <Reveal delay={0.1}>
                            <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy mb-6">
                                Your Trusted Travel Partner Since{' '}
                                <span className="text-brand-primary">2024</span>
                            </h2>
                        </Reveal>
                        <Reveal delay={0.2}>
                            <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                                Swipe N Go Vacations is a licensed travel agency offering personalized domestic and international travel solutions. Whether it&apos;s a family holiday, romantic honeymoon, or group adventure, we craft each experience to match your style and budget.
                            </p>
                        </Reveal>
                        <Reveal delay={0.3}>
                            <p className="text-slate-500 mb-8 leading-relaxed">
                                Founded in 2024, we are committed to providing seamless travel planning, transparent pricing, and real-time assistance. We&apos;ve been connecting travelers to destinations with verified support and expert guidance.
                            </p>
                        </Reveal>

                        {/* Stats */}
                        <StaggerGrid className="grid grid-cols-3 gap-4 mb-8" delay={0.4}>
                            <StaggerItem className="text-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="text-2xl md:text-3xl font-bold text-brand-primary">
                                    <CountUp end={500} suffix="+" />
                                </div>
                                <div className="text-slate-500 text-sm">Happy Travelers</div>
                            </StaggerItem>
                            <StaggerItem className="text-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="text-2xl md:text-3xl font-bold text-brand-primary">
                                    <CountUp end={50} suffix="+" />
                                </div>
                                <div className="text-slate-500 text-sm">Destinations</div>
                            </StaggerItem>
                            <StaggerItem className="text-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="text-2xl md:text-3xl font-bold text-brand-primary">
                                    <CountUp end={5} suffix="⭐" />
                                </div>
                                <div className="text-slate-500 text-sm">Rated Service</div>
                            </StaggerItem>
                        </StaggerGrid>

                        {/* CTA */}
                        <Reveal delay={0.5}>
                            <a
                                href="https://wa.me/917620011714?text=Hello!%20I%20would%20like%20to%20know%20more%20about%20Swipe%20N%20Go%20Vacations."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-2 px-6 py-3 bg-brand-navy text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200"
                            >
                                <span>Get in Touch</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                        </Reveal>
                    </div>

                    {/* Destinations Visual */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 rounded-3xl blur-3xl"></div>
                        <div className="relative bg-white/50 backdrop-blur-sm border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
                            <Reveal>
                                <h3 className="text-xl font-semibold text-brand-navy mb-6 text-center">
                                    Popular Destinations We Cover
                                </h3>
                            </Reveal>
                            <StaggerGrid className="grid grid-cols-2 sm:grid-cols-3 gap-4" delay={0.2} staggerDelay={0.05}>
                                {destinations.map((destination) => (
                                    <StaggerItem
                                        key={destination.name}
                                        className="group relative overflow-hidden rounded-xl cursor-pointer"
                                    >
                                        <div className="aspect-[4/3] relative">
                                            <Image
                                                src={destination.image}
                                                alt={destination.name}
                                                fill
                                                className="object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-0 transition-transform duration-300">
                                            <span className="text-white font-semibold text-sm md:text-base drop-shadow-md block text-center">
                                                {destination.name}
                                            </span>
                                        </div>
                                    </StaggerItem>
                                ))}
                            </StaggerGrid>

                            {/* Trust Badges */}
                            <Reveal delay={0.6} className="mt-8 pt-6 border-t border-slate-100">
                                <div className="flex flex-wrap justify-center gap-4">
                                    <div className="flex items-center space-x-2 text-slate-500">
                                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm">Licensed Agency</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-slate-500">
                                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm">Verified Support</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-slate-500">
                                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm">Expert Guidance</span>
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

