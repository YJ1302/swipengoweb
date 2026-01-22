import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPackages, getPackageBySlug } from "@/lib/sheets";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Package } from "@/types";
import { ItinerarySection } from "@/components/packages/ItinerarySection";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const pkg = await getPackageBySlug(slug);

    if (!pkg) {
        return { title: "Package Not Found" };
    }

    return {
        title: pkg.title,
        description: pkg.description.slice(0, 160),
        openGraph: {
            title: pkg.title,
            description: pkg.description.slice(0, 160),
            images: [pkg.image_url],
        },
    };
}

export async function generateStaticParams() {
    const packages = await getAllPackages();
    return packages.map((pkg) => ({ slug: pkg.slug }));
}

// Accordion logic moved to @/components/packages/ItinerarySection

export default async function PackageDetailPage({ params }: Props) {
    const { slug } = await params;
    const pkg = await getPackageBySlug(slug);

    if (!pkg) {
        notFound();
    }

    // Static cancellation policy
    const cancellationPolicy = [
        "Free cancellation up to 30 days before departure",
        "50% refund for cancellations 15-29 days before",
        "No refund for cancellations less than 15 days before",
        "Travel insurance is highly recommended"
    ];

    return (
        <div className="min-h-screen pt-16 md:pt-20 bg-gradient-to-b from-slate-900 to-brand-navy">
            {/* Hero Image */}
            <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
                <img
                    src={pkg.image_url || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop"}
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

                {/* Back Button */}
                <Link
                    href="/packages"
                    className="absolute top-6 left-6 flex items-center space-x-2 px-4 py-2 bg-slate-900/50 backdrop-blur-sm text-white rounded-full hover:bg-slate-900/70 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Back to Map</span>
                </Link>

                {/* Category Badge */}
                {pkg.category && (
                    <div className="absolute top-6 right-6 px-4 py-2 bg-brand-primary text-brand-navy font-semibold rounded-full text-sm">
                        {pkg.category}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="relative -mt-32 pb-32">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-slate-800/90 backdrop-blur-xl rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl">

                        {/* Header */}
                        <div className="p-6 md:p-8 border-b border-slate-700/50">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl md:text-4xl font-bold text-white mb-3">{pkg.title}</h1>
                                    <div className="flex flex-wrap items-center gap-4 text-slate-400">
                                        <div className="flex items-center space-x-1">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>{pkg.location}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{pkg.duration}</span>
                                        </div>
                                        {pkg.best_time && (
                                            <div className="flex items-center space-x-1">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>Best: {pkg.best_time}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-slate-400">Starting from</div>
                                    <div className="text-3xl md:text-4xl font-bold text-brand-primary">{pkg.price}</div>
                                    <div className="text-xs text-slate-500">per person</div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="p-6 md:p-8 border-b border-slate-700/50">
                            <h2 className="text-xl font-bold text-white mb-4">About This Package</h2>
                            <div className="text-slate-300 leading-relaxed whitespace-pre-line">
                                {pkg.description}
                            </div>
                        </div>

                        {/* Highlights */}
                        {pkg.highlights && pkg.highlights.length > 0 && (
                            <div className="p-6 md:p-8 border-b border-slate-700/50 bg-gradient-to-r from-brand-primary/5 to-transparent">
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <svg className="w-6 h-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                    Highlights
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {pkg.highlights.map((item, index) => (
                                        <div key={index} className="flex items-center space-x-3">
                                            <div className="flex-shrink-0 w-2 h-2 bg-brand-primary rounded-full" />
                                            <span className="text-slate-300">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Itinerary */}
                        <ItinerarySection itinerary={pkg.itinerary} />

                        {/* Includes / Excludes */}
                        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-700/50">
                            {pkg.includes && pkg.includes.length > 0 && (
                                <div className="p-6 md:p-8">
                                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        What&apos;s Included
                                    </h2>
                                    <div className="space-y-2">
                                        {pkg.includes.map((item, index) => (
                                            <div key={index} className="flex items-center space-x-3">
                                                <div className="flex-shrink-0 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <span className="text-slate-300">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {pkg.excludes && pkg.excludes.length > 0 && (
                                <div className="p-6 md:p-8">
                                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Not Included
                                    </h2>
                                    <div className="space-y-2">
                                        {pkg.excludes.map((item, index) => (
                                            <div key={index} className="flex items-center space-x-3">
                                                <div className="flex-shrink-0 w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </div>
                                                <span className="text-slate-300">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* What to Carry */}
                        {pkg.what_to_carry && pkg.what_to_carry.length > 0 && (
                            <div className="p-6 md:p-8 border-t border-slate-700/50">
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <svg className="w-6 h-6 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    What to Carry
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {pkg.what_to_carry.map((item, index) => (
                                        <div key={index} className="flex items-center space-x-2 bg-slate-700/30 px-3 py-2 rounded-lg">
                                            <input type="checkbox" className="w-4 h-4 rounded border-slate-500 text-brand-primary focus:ring-brand-primary bg-slate-600" readOnly />
                                            <span className="text-slate-300 text-sm">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}



                        {/* CTA */}
                        <div className="p-6 md:p-8 bg-gradient-to-r from-brand-navy to-slate-800">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Ready to Book?</h3>
                                    <p className="text-slate-400 text-sm">Contact us directly to customize or book this trip.</p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                    <WhatsAppButton
                                        message={`Hi! I would like to book the ${pkg.title} package.`}
                                        size="lg"
                                        variant="primary"
                                        className="w-full sm:w-auto"
                                    >
                                        Book Now
                                    </WhatsAppButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
