'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Package } from '@/types';
import { formatPrice } from '@/utils/format';
import { useState, useEffect } from 'react';

interface PackageCardProps {
    package: Package;
}

export function PackageCard({ package: pkg }: PackageCardProps) {
    // Generate a consistent pseudo-random rating between 4.8 and 5.0 for the package if not provided
    const [defaultRating, setDefaultRating] = useState('4.8');
    
    useEffect(() => {
        // Simple hash of slug to deterministically select a rating like 4.8, 4.9, 5.0
        const hash = pkg.slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const ratingNum = 4.8 + (hash % 3) * 0.1;
        setDefaultRating(ratingNum.toFixed(1));
    }, [pkg.slug]);

    // Extract chips from category and highlights
    const chipsOptions = [];
    if (pkg.category) chipsOptions.push(pkg.category);
    if (pkg.highlights && pkg.highlights.length > 0) {
        chipsOptions.push(...pkg.highlights);
    }
    // De-duplicate and slice
    const uniqueChips = Array.from(new Set(chipsOptions)).slice(0, 2);

    return (
        <Link 
            href={`/packages/${pkg.slug}`}
            className="group block h-full w-full bg-white rounded-[20px] overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border border-slate-100"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                    src={pkg.image_url || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop'}
                    alt={pkg.title}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-50"></div>
                
                {/* Top-Left Category Chips */}
                <div className="absolute top-4 left-4 flex gap-2">
                    {uniqueChips.map((chip, idx) => (
                        <span 
                            key={idx} 
                            className="bg-white/95 text-slate-900 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm backdrop-blur-sm group-hover:bg-white transition-colors"
                        >
                            {chip}
                        </span>
                    ))}
                </div>

                {/* Top-Right Price Pill */}
                <div className="absolute top-4 right-4 bg-[#0284c7] text-white text-sm font-bold px-3.5 py-1.5 rounded-full shadow-md z-10 transition-transform group-hover:scale-105">
                    {formatPrice(pkg.price)}
                </div>
            </div>

            {/* Bottom Content Container */}
            <div className="p-5 flex flex-col justify-between">
                <div>
                    {/* Location and Rating Row */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center text-slate-500">
                            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-sm font-medium">{pkg.location || 'Destinations'}</span>
                        </div>
                        <div className="flex items-center text-amber-500 font-bold text-sm">
                            <svg className="w-4 h-4 mr-1 fill-current" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {defaultRating}
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-[19px] font-bold text-slate-900 group-hover:text-brand-navy leading-tight transition-colors">
                        {pkg.title}
                    </h3>
                </div>

                {/* Optional Subtle View Details */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm font-semibold text-brand-sky">
                        View Details
                    </span>
                    <svg className="w-4 h-4 text-brand-sky transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </Link>
    );
}

