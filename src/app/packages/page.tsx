import { Metadata } from "next";
import { getPackages } from "@/lib/sheets";
import { PackageGrid } from "@/components/packages/PackageGrid";
import { Package } from "@/types";

export const metadata: Metadata = {
    title: "Travel Packages",
    description: "Explore our exclusive travel packages. Custom trips to amazing destinations at the best prices.",
};

// Demo packages for when Google Sheets is not configured
const demoPackages: Package[] = [
    {
        slug: "cancun-paradise",
        title: "Cancun Paradise Escape",
        price: "$1,299",
        duration: "5 Days / 4 Nights",
        location: "Cancun, Mexico",
        description: "Experience the crystal-clear waters and white sandy beaches of Cancun. All-inclusive resort stay with activities.",
        includes: ["All-inclusive resort", "Airport transfers", "Welcome cocktail", "Beach activities", "Spa credit"],
        image_url: "https://images.unsplash.com/photo-1552074284-5e88ef1aef18?q=80&w=800&auto=format&fit=crop",
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
        description: "Discover tropical paradise in the Dominican Republic. Perfect for couples and families seeking adventure and relaxation.",
        includes: ["Beachfront resort", "All meals included", "Snorkeling tour", "City excursion", "Nightlife experience"],
        image_url: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=800&auto=format&fit=crop",
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
        description: "Immerse yourself in the natural beauty of Costa Rica. Rainforests, volcanoes, and stunning beaches await.",
        includes: ["Eco-lodge stay", "Guided rainforest tour", "Volcano visit", "Zip-line adventure", "Wildlife sanctuary"],
        image_url: "https://images.unsplash.com/photo-1518790009324-6bd1f0e8a15d?q=80&w=800&auto=format&fit=crop",
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
        description: "Feel the rhythm of Jamaica with this vibrant vacation package. Beach, culture, and unforgettable experiences.",
        includes: ["Resort accommodation", "Reggae tour", "Beach day", "Jamaican cuisine experience", "Nightlife"],
        image_url: "https://images.unsplash.com/photo-1580541631950-7282082b53ce?q=80&w=800&auto=format&fit=crop",
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
        description: "Indulge in luxury at the Bahamas. Crystal waters, premium resorts, and world-class dining await you.",
        includes: ["5-star resort", "Private beach access", "Sunset cruise", "Fine dining experience", "Spa treatment"],
        image_url: "https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=800&auto=format&fit=crop",
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
        description: "Escape to Aruba's endless sunshine and pristine beaches. The perfect getaway for beach lovers.",
        includes: ["Beachfront hotel", "Island tour", "Water sports", "Local markets visit", "Sunset dinner"],
        image_url: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=800&auto=format&fit=crop",
        whatsapp_text: "Hi! I'm interested in the Aruba Sunshine Holiday package.",
        active: true,
        order: 6,
    },
];

export default async function PackagesPage() {
    let packages = await getPackages();

    // Use demo packages if none are loaded from sheets
    if (packages.length === 0) {
        packages = demoPackages;
    }

    return (
        <div className="min-h-screen pt-20 md:pt-24">
            {/* Hero Section */}
            <section className="py-12 md:py-16 bg-gradient-to-b from-slate-800 to-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                        Travel <span className="text-amber-400">Packages</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Discover our handpicked vacation packages designed to give you unforgettable experiences at the best prices.
                    </p>
                </div>
            </section>

            {/* Packages Grid */}
            <section className="py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <PackageGrid packages={packages} />
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-amber-500 to-orange-500">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                        Don&apos;t See What You&apos;re Looking For?
                    </h2>
                    <p className="text-white/80 mb-8">
                        We specialize in custom trip planning. Tell us your dream destination and we&apos;ll make it happen!
                    </p>
                    <a
                        href={`https://wa.me/917620011714?text=${encodeURIComponent("Hi! I'd like to plan a custom trip.")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-amber-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        <span>Plan a Custom Trip</span>
                    </a>
                </div>
            </section>
        </div>
    );
}
