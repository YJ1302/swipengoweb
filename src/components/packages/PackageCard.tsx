'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Package } from '@/types';
import { WhatsAppButton } from '../ui/WhatsAppButton';

interface PackageCardProps {
    package: Package;
}

export function PackageCard({ package: pkg }: PackageCardProps) {
    return (
        <div className="group h-full flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-brand-secondary/50 transition-all duration-500 hover:shadow-xl hover:shadow-brand-secondary/10 hover:-translate-y-1">
            {/* Image */}
            <div className="relative aspect-video overflow-hidden">
                <Image
                    src={pkg.image_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop'}
                    alt={pkg.title}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                {/* Price Badge */}
                <div className="absolute top-4 right-4 px-3 py-1.5 bg-brand-primary text-brand-navy text-sm font-bold rounded-full shadow-lg border border-white/20">
                    {pkg.price}
                </div>

                {/* Location */}
                <div className="absolute bottom-4 left-4 flex items-center space-x-1 text-white">
                    <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm font-medium drop-shadow-md">{pkg.location}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-brand-navy mb-2 group-hover:text-brand-secondary transition-colors duration-300">
                    {pkg.title}
                </h3>

                {/* Duration */}
                <div className="flex items-center space-x-1 text-slate-500 text-sm mb-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{pkg.duration}</span>
                </div>

                {/* Includes Preview */}
                {pkg.includes.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {pkg.includes.slice(0, 3).map((item, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg border border-slate-200"
                            >
                                {item}
                            </span>
                        ))}
                        {pkg.includes.length > 3 && (
                            <span className="px-2 py-1 text-brand-secondary text-xs font-medium">
                                +{pkg.includes.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                <div className="flex-grow"></div>

                {/* Actions */}
                <div className="flex gap-3 mt-4">
                    <Link
                        href={`/packages/${pkg.slug}`}
                        className="flex-1 px-4 py-2.5 bg-brand-navy hover:bg-brand-navy/90 text-white text-center text-sm font-semibold rounded-xl transition-all duration-300 hover:shadow-lg active:scale-95"
                    >
                        View Details
                    </Link>
                    <div className="flex-1">
                        <WhatsAppButton
                            message={pkg.whatsapp_text || `Hi! I'm interested in the ${pkg.title} package.`}
                            size="sm"
                            className="w-full h-full justify-center shadow-none hover:shadow-lg"
                        >
                            WhatsApp
                        </WhatsAppButton>
                    </div>
                </div>
            </div>
        </div>
    );
}

