'use client';

import { useState, useMemo } from 'react';
import { Package } from '@/types';
import { PackageCard } from './PackageCard';
import { StaggerGrid, StaggerItem } from '../ui/animations/Stagger';

interface PackageGridProps {
    initialPackages: Package[];
}

type PriceFilterType = 'All' | '0-15000' | '15001-30000' | '30001-60000' | '60000+';
type DurationFilterType = 'All' | '1-4' | '5-7' | '8+';

const priceOptions: { value: PriceFilterType; label: string }[] = [
    { value: 'All', label: 'All' },
    { value: '0-15000', label: 'Under ₹15K' },
    { value: '15001-30000', label: '₹15K - ₹30K' },
    { value: '30001-60000', label: '₹30K - ₹60K' },
    { value: '60000+', label: '₹60K+' }
];

const durationOptions: { value: DurationFilterType; label: string }[] = [
    { value: 'All', label: 'All' },
    { value: '1-4', label: '1-4 Days' },
    { value: '5-7', label: '5-7 Days' },
    { value: '8+', label: '8+ Days' }
];

export function PackageGrid({ initialPackages }: PackageGridProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [priceFilter, setPriceFilter] = useState<PriceFilterType>('All');
    const [durationFilter, setDurationFilter] = useState<DurationFilterType>('All');

    const filteredPackages = useMemo(() => {
        return initialPackages.filter((pkg) => {
            // 1. Search Filtering
            if (searchTerm.trim() !== '') {
                const searchLower = searchTerm.toLowerCase();
                const searchableText = [
                    pkg.title, pkg.location, pkg.country, pkg.city, pkg.category, pkg.type, pkg.duration,
                    ...(pkg.highlights || []), ...(pkg.includes || [])
                ].filter(Boolean).join(' ').toLowerCase();
                
                if (!searchableText.includes(searchLower)) return false;
            }

            // 2. Price Filtering
            if (priceFilter !== 'All') {
                const numericPrice = parseInt((pkg.price || '').replace(/[^\d]/g, ''), 10);
                if (isNaN(numericPrice)) return false; 

                if (priceFilter === '0-15000' && numericPrice > 15000) return false;
                if (priceFilter === '15001-30000' && (numericPrice <= 15000 || numericPrice > 30000)) return false;
                if (priceFilter === '30001-60000' && (numericPrice <= 30000 || numericPrice > 60000)) return false;
                if (priceFilter === '60000+' && numericPrice <= 60000) return false;
            }

            // 3. Duration Filtering
            if (durationFilter !== 'All') {
                const daysMatch = (pkg.duration || '').match(/\d+/);
                const numericDays = daysMatch ? parseInt(daysMatch[0], 10) : NaN;
                if (isNaN(numericDays)) return false;

                if (durationFilter === '1-4' && (numericDays < 1 || numericDays > 4)) return false;
                if (durationFilter === '5-7' && (numericDays < 5 || numericDays > 7)) return false;
                if (durationFilter === '8+' && numericDays < 8) return false;
            }

            return true;
        });
    }, [initialPackages, searchTerm, priceFilter, durationFilter]);

    const hasActiveFilters = searchTerm !== '' || priceFilter !== 'All' || durationFilter !== 'All';

    const clearAllFilters = () => {
        setSearchTerm('');
        setPriceFilter('All');
        setDurationFilter('All');
    };

    // Use a unified string key that combines all filter states to confidently reset StaggerGrid animations
    const animationKey = `${searchTerm}-${priceFilter}-${durationFilter}`;

    return (
        <div className="w-full">
            {/* Header & Main Search Row */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                {/* Visual Header / Title Area */}
                <div className="flex-1">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-800">
                        {searchTerm ? `Search Results for "${searchTerm}"` : "All Destinations"}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Showing {filteredPackages.length} package{filteredPackages.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Enhanced Search Bar */}
                <div className="relative w-full md:w-[400px]">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search destinations, tags, features..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-12 py-3 bg-white border-2 border-slate-100 rounded-2xl text-base font-medium focus:outline-none focus:ring-4 focus:ring-brand-primary/20 focus:border-brand-primary text-slate-800 placeholder-slate-400 transition-all shadow-sm"
                    />
                    {searchTerm && (
                        <button 
                            onClick={() => setSearchTerm('')}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Sub-Filters Row (Price & Duration) */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-4 xl:gap-8 flex-1">
                    {/* Price Filter */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Price</span>
                        <div className="flex flex-wrap items-center gap-2">
                            {priceOptions.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => setPriceFilter(opt.value)}
                                    className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                                        priceFilter === opt.value
                                            ? 'bg-brand-primary text-brand-navy shadow-sm ring-1 ring-brand-primary'
                                            : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-primary hover:text-brand-navy'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Divider for larger screens */}
                    <div className="hidden lg:block w-px h-8 bg-slate-200 self-center"></div>

                    {/* Duration Filter */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Duration</span>
                        <div className="flex flex-wrap items-center gap-2">
                            {durationOptions.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => setDurationFilter(opt.value)}
                                    className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                                        durationFilter === opt.value
                                            ? 'bg-brand-primary text-brand-navy shadow-sm ring-1 ring-brand-primary'
                                            : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-primary hover:text-brand-navy'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Result count & Clear button block */}
                <div className="flex items-center gap-4 border-t xl:border-t-0 pt-4 xl:pt-0 border-slate-200">
                    <span className="text-sm font-medium text-slate-500 whitespace-nowrap">
                        Showing {filteredPackages.length} package{filteredPackages.length !== 1 ? 's' : ''}
                    </span>
                    {hasActiveFilters && (
                        <button 
                            onClick={clearAllFilters}
                            className="text-sm text-red-600 hover:text-red-700 font-semibold px-4 py-2 hover:bg-red-50 rounded-full transition-colors ml-auto whitespace-nowrap"
                        >
                            Clear all filters
                        </button>
                    )}
                </div>
            </div>

            {/* Grid */}
            {filteredPackages.length === 0 ? (
                <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-slate-100/50">
                    <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm">
                        <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-3">No packages found</h3>
                    <p className="text-slate-500 max-w-md mx-auto text-lg mb-8">
                         We couldn&apos;t find any destinations matching your selected filters. 
                    </p>
                    <button 
                        onClick={clearAllFilters}
                        className="px-6 py-3 bg-brand-navy text-white rounded-full font-medium hover:bg-brand-navy/90 transition-colors shadow-sm"
                    >
                        Clear filters
                    </button>
                </div>
            ) : (
                <StaggerGrid key={animationKey} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {filteredPackages.map((pkg) => (
                        <StaggerItem key={`${pkg.slug}-${pkg.title}`}>
                            <PackageCard package={pkg} />
                        </StaggerItem>
                    ))}
                </StaggerGrid>
            )}
        </div>
    );
}

