import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPackages, getPackageBySlug } from "@/lib/sheets";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Package } from "@/types";

// Demo packages for when Google Sheets is not configured
const demoPackages: Package[] = [
    {
        slug: "cancun-paradise",
        title: "Cancun Paradise Escape",
        price: "$1,299",
        duration: "5 Days / 4 Nights",
        location: "Cancun, Mexico",
        description: "Experience the crystal-clear waters and white sandy beaches of Cancun. This all-inclusive package offers the perfect blend of relaxation and adventure. Stay at a premium beachfront resort with world-class amenities, enjoy daily activities, and create memories that will last a lifetime.\n\nYour Cancun escape includes access to pristine beaches, swimming pools, and water sports. Explore the ancient Mayan ruins, swim in crystal-clear cenotes, or simply relax with a cocktail by the pool. Our experienced local guides ensure you discover the best of what Cancun has to offer.",
        includes: ["All-inclusive resort stay", "Round-trip airport transfers", "Welcome cocktail & dinner", "Beach activities & water sports", "Spa credit ($50 value)", "Guided excursion option"],
        image_url: "https://images.unsplash.com/photo-1552074284-5e88ef1aef18?q=80&w=1200&auto=format&fit=crop",
        whatsapp_text: "Hi! I'm interested in the Cancun Paradise Escape package.",
        active: true,
        order: 1,
    },
    {
        slug: "dominican-republic-adventure",
        title: "Dominican Republic Adventure",
        price: "$1,499",
        duration: "6 Days / 5 Nights",
        location: "Punta Cana, DR",
        description: "Discover tropical paradise in the Dominican Republic. Experience the warmth of Caribbean hospitality combined with stunning natural beauty. From pristine beaches to vibrant local culture, this package offers an unforgettable adventure.\n\nEnjoy snorkeling in crystal-clear waters, explore charming colonial towns, and dance the night away to merengue rhythms. Our carefully curated experience ensures you get the authentic Dominican experience while enjoying modern comforts.",
        includes: ["Beachfront resort accommodation", "All meals & drinks included", "Snorkeling tour", "City excursion to Santo Domingo", "Nightlife experience", "Daily activities"],
        image_url: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=1200&auto=format&fit=crop",
        whatsapp_text: "Hi! I'm interested in the Dominican Republic Adventure package.",
        active: true,
        order: 2,
    },
    {
        slug: "costa-rica-nature",
        title: "Costa Rica Nature Retreat",
        price: "$1,799",
        duration: "7 Days / 6 Nights",
        location: "Costa Rica",
        description: "Immerse yourself in the natural beauty of Costa Rica. This eco-adventure package takes you through rainforests, past active volcanoes, and along stunning beaches. Perfect for nature lovers and adventure seekers.\n\nFrom zip-lining through the canopy to relaxing in natural hot springs, every day brings new discoveries. Spot exotic wildlife, including toucans, sloths, and monkeys in their natural habitat. Experience the pure life - Pura Vida!",
        includes: ["Eco-lodge accommodation", "Guided rainforest tour", "Volcano visit with hot springs", "Zip-line adventure", "Wildlife sanctuary visit", "All breakfasts included"],
        image_url: "https://images.unsplash.com/photo-1518790009324-6bd1f0e8a15d?q=80&w=1200&auto=format&fit=crop",
        whatsapp_text: "Hi! I'm interested in the Costa Rica Nature Retreat package.",
        active: true,
        order: 3,
    },
    {
        slug: "jamaica-vibes",
        title: "Jamaica Vibes Package",
        price: "$1,399",
        duration: "5 Days / 4 Nights",
        location: "Montego Bay, Jamaica",
        description: "Feel the rhythm of Jamaica with this vibrant vacation package. Experience the perfect blend of beach relaxation, cultural immersion, and exciting nightlife. Jamaica offers an atmosphere unlike anywhere else in the Caribbean.\n\nFrom the famous Dunn's River Falls to the streets of Montego Bay, every moment is filled with the warmth and energy of Jamaican culture. Enjoy authentic jerk cuisine, reggae music, and the legendary hospitality of the Jamaican people.",
        includes: ["Resort accommodation", "Reggae music tour", "Beach day at Doctor's Cave", "Jamaican cuisine experience", "Nightlife & entertainment", "Airport transfers"],
        image_url: "https://images.unsplash.com/photo-1580541631950-7282082b53ce?q=80&w=1200&auto=format&fit=crop",
        whatsapp_text: "Hi! I'm interested in the Jamaica Vibes Package.",
        active: true,
        order: 4,
    },
    {
        slug: "bahamas-luxury",
        title: "Bahamas Luxury Getaway",
        price: "$2,199",
        duration: "6 Days / 5 Nights",
        location: "Nassau, Bahamas",
        description: "Indulge in luxury at the Bahamas. Experience world-class resorts, pristine beaches, and unparalleled service. This premium package is designed for those who appreciate the finer things in life.\n\nFrom private beach cabanas to gourmet dining experiences, every detail is crafted to exceed your expectations. Explore the famous swimming pigs, snorkel in crystal-clear waters, or simply relax in paradise.",
        includes: ["5-star resort accommodation", "Private beach access", "Sunset cruise", "Fine dining experiences (2)", "Spa treatment included", "Premium transfers"],
        image_url: "https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=1200&auto=format&fit=crop",
        whatsapp_text: "Hi! I'm interested in the Bahamas Luxury Getaway package.",
        active: true,
        order: 5,
    },
    {
        slug: "aruba-sunshine",
        title: "Aruba Sunshine Holiday",
        price: "$1,599",
        duration: "5 Days / 4 Nights",
        location: "Aruba",
        description: "Escape to Aruba's endless sunshine and pristine beaches. Known as 'One Happy Island,' Aruba offers perfect weather year-round and some of the most beautiful beaches in the Caribbean.\n\nExplore dramatic desert landscapes, windswept divi-divi trees, and turquoise waters. Whether you're seeking adventure or relaxation, Aruba delivers an unforgettable vacation experience.",
        includes: ["Beachfront hotel stay", "Island exploration tour", "Water sports package", "Local markets visit", "Sunset dinner cruise", "All breakfasts"],
        image_url: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=1200&auto=format&fit=crop",
        whatsapp_text: "Hi! I'm interested in the Aruba Sunshine Holiday package.",
        active: true,
        order: 6,
    },
];

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    let pkg = await getPackageBySlug(slug);

    // Use demo package if not found
    if (!pkg) {
        pkg = demoPackages.find(p => p.slug === slug) || null;
    }

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
    const packages = await getPackages();
    const allPackages = packages.length > 0 ? packages : demoPackages;

    return allPackages.map((pkg) => ({
        slug: pkg.slug,
    }));
}

export default async function PackageDetailPage({ params }: Props) {
    const { slug } = await params;
    let pkg = await getPackageBySlug(slug);

    // Use demo package if not found
    if (!pkg) {
        pkg = demoPackages.find(p => p.slug === slug) || null;
    }

    if (!pkg) {
        notFound();
    }

    return (
        <div className="min-h-screen pt-16 md:pt-20">
            {/* Hero Image */}
            <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
                <img
                    src={pkg.image_url || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop"}
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>

                {/* Back Button */}
                <Link
                    href="/packages"
                    className="absolute top-6 left-6 flex items-center space-x-2 px-4 py-2 bg-slate-900/50 backdrop-blur-sm text-white rounded-full hover:bg-slate-900/70 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Back to Packages</span>
                </Link>
            </div>

            {/* Content */}
            <div className="relative -mt-32 pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl border border-slate-700/50 overflow-hidden">
                        {/* Header */}
                        <div className="p-6 md:p-8 border-b border-slate-700/50">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{pkg.title}</h1>
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
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-slate-400">Starting from</div>
                                    <div className="text-3xl font-bold text-amber-400">{pkg.price}</div>
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

                        {/* What's Included */}
                        {pkg.includes.length > 0 && (
                            <div className="p-6 md:p-8 border-b border-slate-700/50">
                                <h2 className="text-xl font-bold text-white mb-4">What&apos;s Included</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {pkg.includes.map((item, index) => (
                                        <div key={index} className="flex items-center space-x-3">
                                            <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-slate-300">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CTA */}
                        <div className="p-6 md:p-8 bg-gradient-to-r from-slate-800 to-slate-800/50">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Ready to Book?</h3>
                                    <p className="text-slate-400 text-sm">Contact us on WhatsApp for instant booking</p>
                                </div>
                                <WhatsAppButton
                                    message={pkg.whatsapp_text || `Hi! I'm interested in the ${pkg.title} package.`}
                                    size="lg"
                                >
                                    Book via WhatsApp
                                </WhatsAppButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
