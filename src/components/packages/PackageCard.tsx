import Link from 'next/link';
import { Package } from '@/types';
import { WhatsAppButton } from '../ui/WhatsAppButton';

interface PackageCardProps {
    package: Package;
}

export function PackageCard({ package: pkg }: PackageCardProps) {
    return (
        <div className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5">
            {/* Image */}
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={pkg.image_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop'}
                    alt={pkg.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>

                {/* Price Badge */}
                <div className="absolute top-4 right-4 px-3 py-1.5 bg-amber-500 text-white text-sm font-bold rounded-full shadow-lg">
                    {pkg.price}
                </div>

                {/* Location */}
                <div className="absolute bottom-4 left-4 flex items-center space-x-1 text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm font-medium">{pkg.location}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                    {pkg.title}
                </h3>

                {/* Duration */}
                <div className="flex items-center space-x-1 text-slate-400 text-sm mb-4">
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
                                className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-lg"
                            >
                                {item}
                            </span>
                        ))}
                        {pkg.includes.length > 3 && (
                            <span className="px-2 py-1 text-amber-400 text-xs">
                                +{pkg.includes.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 mt-4">
                    <Link
                        href={`/packages/${pkg.slug}`}
                        className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-center text-sm font-semibold rounded-xl transition-colors"
                    >
                        View Details
                    </Link>
                    <WhatsAppButton
                        message={pkg.whatsapp_text || `Hi! I'm interested in the ${pkg.title} package.`}
                        size="sm"
                        className="flex-1"
                    >
                        WhatsApp
                    </WhatsAppButton>
                </div>
            </div>
        </div>
    );
}
