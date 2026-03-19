'use client';

import { useState, useEffect, useMemo } from 'react';
import { CustomPackage } from '@/types';
import { AnimatedTitle } from '@/components/ui/animations/AnimatedTitle';

export default function CustomizePage() {
    const [packages, setPackages] = useState<CustomPackage[]>([]);
    const [loading, setLoading] = useState(true);

    const [destination, setDestination] = useState<string>('');
    const [destSearch, setDestSearch] = useState<string>('');
    const [destDropdownOpen, setDestDropdownOpen] = useState<boolean>(false);
    const [durationDays, setDurationDays] = useState<string>('');
    const [hotelStar, setHotelStar] = useState<string>('');
    const [mealPlan, setMealPlan] = useState<string>('');
    const [transport, setTransport] = useState<string>('');
    const [activityPack, setActivityPack] = useState<string>('');
    const [season, setSeason] = useState<string>('');

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const res = await fetch('/api/custom-packages');
            const data = await res.json();
            if (data.customPackages) {
                setPackages(data.customPackages);
            }
        } catch (error) {
            console.error('Error fetching custom packages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setDestination('');
        setDestSearch('');
        setDurationDays('');
        setHotelStar('');
        setMealPlan('');
        setTransport('');
        setActivityPack('');
        setSeason('');
    };

    // Helper to get unique values for a field given that other fields might be selected
    const getOptions = (field: keyof CustomPackage) => {
        let availablePkgs = packages;

        // Filter by all OTHER selected criteria to see what's valid for this field
        if (field !== 'destination' && destination) availablePkgs = availablePkgs.filter(p => p.destination === destination);
        if (field !== 'duration_days' && durationDays) availablePkgs = availablePkgs.filter(p => p.duration_days.toString() === durationDays);
        if (field !== 'hotel_star' && hotelStar) availablePkgs = availablePkgs.filter(p => p.hotel_star.toString() === hotelStar);
        if (field !== 'meal_plan' && mealPlan) availablePkgs = availablePkgs.filter(p => p.meal_plan === mealPlan);
        if (field !== 'transport' && transport) availablePkgs = availablePkgs.filter(p => p.transport === transport);
        if (field !== 'activity_pack' && activityPack) availablePkgs = availablePkgs.filter(p => p.activity_pack === activityPack);
        if (field !== 'season' && season) availablePkgs = availablePkgs.filter(p => p.season === season);

        const options = Array.from(new Set(availablePkgs.map(p => String(p[field])))).filter(Boolean).sort();
        // If numeric like duration/star, sort numerically
        if (field === 'duration_days' || field === 'hotel_star') {
            options.sort((a, b) => Number(a) - Number(b));
        }
        return options;
    };

    // Compute Exact Match
    const matchingPackage = useMemo(() => {
        if (!destination || !durationDays || !hotelStar || !mealPlan || !transport || !activityPack || !season) return null;
        return packages.find(p => 
            p.destination === destination &&
            p.duration_days.toString() === durationDays &&
            p.hotel_star.toString() === hotelStar &&
            p.meal_plan === mealPlan &&
            p.transport === transport &&
            p.activity_pack === activityPack &&
            p.season === season
        );
    }, [destination, durationDays, hotelStar, mealPlan, transport, activityPack, season, packages]);

    const isComplete = destination && durationDays && hotelStar && mealPlan && transport && activityPack && season;

    const getWhatsAppUrl = () => {
        if (!matchingPackage) return '#';
        const msg = `Hello! I would like to request a quote for this customized package:
*Destination:* ${matchingPackage.destination}
*Duration:* ${matchingPackage.duration_days} Days
*Hotel:* ${matchingPackage.hotel_star} Star
*Meal Plan:* ${matchingPackage.meal_plan}
*Transport:* ${matchingPackage.transport}
*Activity Pack:* ${matchingPackage.activity_pack}
*Season:* ${matchingPackage.season}

*Price Quoted:* ₹${matchingPackage.price.toLocaleString()}

Please send me the complete itinerary!`;
        const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917620011714';
        return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    };

    return (
        <div className="min-h-screen pt-20 md:pt-24 bg-background flex flex-col">
            {/* Packages Header */}
            <section className="py-12 md:py-20 bg-brand-navy relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-navy">
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-brand-secondary/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                    <AnimatedTitle
                        prefix="Build Your"
                        highlight="Custom Package"
                        description="Select your preferences below to instantly get a quote for a package tailored perfectly to your choices."
                    />
                </div>
            </section>

            <section className="flex-grow py-12 md:py-16 bg-white overflow-visible relative">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">

                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 flex flex-col md:flex-row relative">
                        {/* Loading Overlay */}
                        {loading && (
                            <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-sm flex flex-col justify-center items-center">
                                <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                                <p className="mt-4 text-brand-navy font-semibold">Loading combinations...</p>
                            </div>
                        )}

                        <div className="flex-1 p-6 md:p-10 space-y-6">
                            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl -mx-2 md:-mx-4 mb-4">
                                <h3 className="font-bold text-slate-800 text-lg">Build Your Trip</h3>
                                <button onClick={handleClear} className="text-sm font-semibold text-brand-primary hover:text-brand-secondary transition">Clear Selections</button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {/* Destination (Searchable Combobox) */}
                                <div className="space-y-1.5 relative">
                                    <label className="text-sm font-medium text-slate-700">Destination</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={destSearch}
                                            onChange={(e) => {
                                                setDestSearch(e.target.value);
                                                setDestination(''); // Reset the selected exact match
                                                setDestDropdownOpen(true);
                                            }}
                                            onFocus={() => {
                                                if (!destSearch) setDestSearch('');
                                                setDestDropdownOpen(true);
                                            }}
                                            onBlur={() => setTimeout(() => setDestDropdownOpen(false), 200)}
                                            placeholder="Type to search destinations..."
                                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary transition shadow-sm"
                                        />
                                        
                                        {destSearch && (
                                            <button 
                                                type="button"
                                                onMouseDown={(e) => { 
                                                    e.preventDefault(); 
                                                    setDestSearch(''); 
                                                    setDestination(''); 
                                                    setDestDropdownOpen(true); 
                                                }}
                                                className="absolute inset-y-0 right-8 pr-2 flex items-center text-slate-400 hover:text-red-500 transition-colors focus:outline-none"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                        
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-brand-primary">
                                            <svg className={`h-5 w-5 transition-transform duration-300 ${destDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                    
                                    {/* Overlay Dropdown */}
                                    {destDropdownOpen && (
                                        <div className="absolute top-[76px] left-0 w-full z-[100] bg-white border border-slate-100 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] max-h-60 overflow-y-auto overflow-x-hidden">
                                            {(() => {
                                                const opts = getOptions('destination').filter(opt => opt.toLowerCase().includes(destSearch.toLowerCase()));
                                                if (opts.length === 0) {
                                                    return <div className="px-4 py-4 text-slate-500 text-center italic text-sm">No destinations match your search...</div>;
                                                }
                                                return opts.map(opt => (
                                                    <button
                                                        key={opt}
                                                        type="button"
                                                        onMouseDown={(e) => {
                                                            e.preventDefault();
                                                            setDestination(opt);
                                                            setDestSearch(opt);
                                                            setDestDropdownOpen(false);
                                                        }}
                                                        className="w-full text-left px-5 py-3 hover:bg-brand-primary/10 cursor-pointer text-slate-800 font-medium border-b border-slate-50 last:border-0 transition-colors focus:bg-brand-primary/20 focus:outline-none"
                                                    >
                                                        {opt}
                                                    </button>
                                                ));
                                            })()}
                                        </div>
                                    )}
                                </div>

                                {/* Duration */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Duration (Days)</label>
                                    <select disabled={!destination} value={durationDays} onChange={e => setDurationDays(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary transition disabled:opacity-50">
                                        <option value="">Select Duration</option>
                                        {getOptions('duration_days').map(opt => <option key={opt} value={opt}>{opt} Days</option>)}
                                    </select>
                                </div>

                                {/* Hotel Star */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Hotel Category</label>
                                    <select disabled={!destination} value={hotelStar} onChange={e => setHotelStar(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary transition disabled:opacity-50">
                                        <option value="">Select Stars</option>
                                        {getOptions('hotel_star').map(opt => <option key={opt} value={opt}>{opt} Star</option>)}
                                    </select>
                                </div>

                                {/* Meal Plan */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Meal Plan</label>
                                    <select disabled={!destination} value={mealPlan} onChange={e => setMealPlan(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary transition disabled:opacity-50">
                                        <option value="">Select Meal Plan</option>
                                        {getOptions('meal_plan').map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>

                                {/* Transport */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Transport</label>
                                    <select disabled={!destination} value={transport} onChange={e => setTransport(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary transition disabled:opacity-50">
                                        <option value="">Select Transport</option>
                                        {getOptions('transport').map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>

                                {/* Activity Pack */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Activity Pack</label>
                                    <select disabled={!destination} value={activityPack} onChange={e => setActivityPack(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary transition disabled:opacity-50">
                                        <option value="">Select Activity</option>
                                        {getOptions('activity_pack').map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>

                                {/* Season */}
                                <div className="space-y-1.5 sm:col-span-2">
                                    <label className="text-sm font-medium text-slate-700">Season</label>
                                    <select disabled={!destination} value={season} onChange={e => setSeason(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary transition disabled:opacity-50">
                                        <option value="">Select Season</option>
                                        {getOptions('season').map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Summary / Result Panel */}
                        <div className="w-full md:w-80 bg-slate-50 border-t md:border-t-0 md:border-l border-slate-100 p-8 flex flex-col justify-center items-center text-center transition-all">
                            {matchingPackage ? (
                                <div className="animate-fade-in w-full">
                                    <span className="inline-block px-4 py-1.5 bg-brand-primary/20 text-brand-secondary font-bold rounded-full text-sm mb-6 shadow-sm border border-brand-primary/30">
                                        Combination Available
                                    </span>
                                    
                                    <div className="mb-2 text-slate-500 font-medium text-sm">Estimated Price</div>
                                    <div className="text-4xl font-extrabold text-brand-navy mb-8">
                                        ₹{matchingPackage.price.toLocaleString()}
                                    </div>
                                    
                                    <a
                                        href={getWhatsAppUrl()}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full bg-brand-navy text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                                    >
                                        Request Quote on WhatsApp
                                    </a>
                                </div>
                            ) : isComplete ? (
                                <div className="animate-fade-in text-center p-4">
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex justify-center items-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-800 mb-2">Not Available</h4>
                                    <p className="text-slate-500 text-sm">
                                        This specific combination is not available right now. Please try changing some options.
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center opacity-50 p-4">
                                    <div className="w-16 h-16 bg-slate-200. rounded-full flex justify-center items-center mx-auto mb-4 text-slate-400">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-slate-500 text-sm font-medium">Complete all selections to view pricing.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
