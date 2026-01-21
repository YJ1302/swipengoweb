'use client';

import { Package } from '@/types';
import { formatPrice, formatCoordinatesDMS } from '@/utils/format';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface PackagePanelProps {
    pkg: Package | null;
    onClose: () => void;
}

export function PackagePanel({ pkg, onClose }: PackagePanelProps) {
    if (!pkg) return null;

    const WHATSAPP_NUMBER = '917620011714';

    return (
        <AnimatePresence>
            {pkg && (
                <>
                    {/* Backdrop for mobile */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-[999] md:hidden"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 md:left-auto md:right-6 md:top-24 md:bottom-6 md:w-[380px] bg-slate-900/98 backdrop-blur-xl border border-white/10 shadow-2xl z-[1000] md:rounded-2xl rounded-t-3xl overflow-hidden max-h-[80vh] md:max-h-none flex flex-col"
                    >
                        {/* Header Image */}
                        <div className="relative h-48 md:h-52 w-full flex-shrink-0">
                            <img
                                src={pkg.image_url}
                                alt={pkg.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors backdrop-blur-sm"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Category badge */}
                            {pkg.category && (
                                <div className="absolute top-4 left-4 px-3 py-1 bg-brand-primary text-brand-navy text-xs font-semibold rounded-full">
                                    {pkg.category}
                                </div>
                            )}

                            {/* Price overlay */}
                            <div className="absolute bottom-4 right-4 text-right">
                                <div className="text-2xl font-bold text-white drop-shadow-lg">{formatPrice(pkg.price)}</div>
                                <div className="text-xs text-white/70">{pkg.duration}</div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex-1 overflow-y-auto">
                            <h3 className="text-xl font-bold text-white mb-1">{pkg.title}</h3>
                            <div className="flex items-center text-sm text-white/60 mb-4">
                                <svg className="w-4 h-4 mr-1 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {pkg.location}
                            </div>
                            {/* Coordinates */}
                            {(pkg.lat !== 0 || pkg.lng !== 0) && (
                                <div className="flex items-center text-xs text-brand-primary/80 mb-4 ml-0.5 font-mono bg-brand-navy/50 px-2 py-1 rounded w-fit border border-brand-primary/20">
                                    <svg className="w-3 h-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    </svg>
                                    {formatCoordinatesDMS(pkg.lat, pkg.lng)}
                                </div>
                            )}

                            <p className="text-sm text-white/75 leading-relaxed mb-5 line-clamp-4">
                                {pkg.description}
                            </p>

                            {/* Highlights or Includes preview */}
                            {(pkg.highlights?.length > 0 || pkg.includes?.length > 0) && (
                                <div className="mb-5">
                                    <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                                        {pkg.highlights?.length > 0 ? 'Highlights' : 'Includes'}
                                    </h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {(pkg.highlights?.length > 0 ? pkg.highlights : pkg.includes).slice(0, 4).map((item, i) => (
                                            <span key={i} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-white/70">
                                                {item}
                                            </span>
                                        ))}
                                        {(pkg.highlights?.length > 0 ? pkg.highlights : pkg.includes).length > 4 && (
                                            <span className="px-2.5 py-1 text-xs text-white/40">
                                                +{(pkg.highlights?.length > 0 ? pkg.highlights : pkg.includes).length - 4} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="p-4 border-t border-white/10 bg-slate-800/50">
                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    href={`/packages/${pkg.slug}`}
                                    className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white text-center rounded-xl font-medium transition-colors border border-white/10"
                                >
                                    View Details
                                </Link>
                                <a
                                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(pkg.whatsapp_text || `Hi! I'm interested in ${pkg.title}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-3 bg-brand-primary hover:bg-brand-primary/90 text-brand-navy text-center rounded-xl font-bold transition-colors shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                    </svg>
                                    Book Now
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
