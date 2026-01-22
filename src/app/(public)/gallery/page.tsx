import { Metadata } from "next";
import { getGalleryLocations } from "@/lib/sheets";
import { LocationGallery } from "@/components/gallery/LocationGallery";
import { LocationGroup } from "@/types";
import { AnimatedTitle } from "@/components/ui/animations/AnimatedTitle";

export const metadata: Metadata = {
    title: "Gallery | Swipe N Go Vacations",
    description: "Browse photos from our amazing travel experiences. Explore destinations like Bali, Dubai, Thailand, and more.",
};

// Demo gallery for when Google Sheets is not configured
const demoLocations: LocationGroup[] = [
    {
        name: "Cancun & Tulum",
        coverImage: {
            image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
            caption: "Crystal clear waters of Cancun",
            location: "Cancun",
            is_cover: true,
            active: true,
            order: 1
        },
        photos: [
            {
                image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
                caption: "Crystal clear waters of Cancun",
                location: "Cancun",
                is_cover: true,
                active: true,
                order: 1
            },
            {
                image_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop",
                caption: "Sunset at the beach resort",
                location: "Cancun",
                is_cover: false,
                active: true,
                order: 2
            },
            {
                image_url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop",
                caption: "Relaxing beachside moments",
                location: "Cancun",
                is_cover: false,
                active: true,
                order: 3
            }
        ]
    },
    {
        name: "Costa Rica",
        coverImage: {
            image_url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop",
            caption: "Mountain views in Costa Rica",
            location: "Costa Rica",
            is_cover: true,
            active: true,
            order: 4
        },
        photos: [
            {
                image_url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop",
                caption: "Mountain views in Costa Rica",
                location: "Costa Rica",
                is_cover: true,
                active: true,
                order: 4
            },
            {
                image_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=800&auto=format&fit=crop",
                caption: "Tropical jungle adventure",
                location: "Costa Rica",
                is_cover: false,
                active: true,
                order: 5
            }
        ]
    },
    {
        name: "Maldives",
        coverImage: {
            image_url: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=800&auto=format&fit=crop",
            caption: "Caribbean island paradise",
            location: "Maldives",
            is_cover: true,
            active: true,
            order: 6
        },
        photos: [
            {
                image_url: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=800&auto=format&fit=crop",
                caption: "Caribbean island paradise",
                location: "Maldives",
                is_cover: true,
                active: true,
                order: 6
            },
            {
                image_url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop",
                caption: "Luxury resort pool",
                location: "Maldives",
                is_cover: false,
                active: true,
                order: 7
            },
            {
                image_url: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=800&auto=format&fit=crop",
                caption: "Adventure awaits",
                location: "Maldives",
                is_cover: false,
                active: true,
                order: 8
            }
        ]
    }
];

export default async function GalleryPage() {
    let locations = await getGalleryLocations();

    // Use demo gallery if none are loaded from sheets
    if (locations.length === 0) {
        locations = demoLocations;
    }

    return (
        <div className="min-h-screen pt-20 md:pt-24 bg-background">
            {/* Gallery Header */}
            <section className="py-12 md:py-20 bg-brand-navy relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-navy">
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-brand-secondary/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                    <AnimatedTitle
                        prefix="Travel"
                        highlight="Gallery"
                        description="Explore our world through the lens. From serene beaches to bustling cities, discover the memories created by our happy travelers."
                    />
                </div>
            </section>

            {/* Gallery Locations */}
            <section className="py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <LocationGallery locations={locations} />
                </div>
            </section>

            {/* Instagram CTA */}
            <section className="py-16 bg-gradient-to-r from-pink-600 via-purple-600 to-brand-accent">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                        Want to See More?
                    </h2>
                    <p className="text-white/90 mb-8 max-w-2xl mx-auto">
                        Follow us on Instagram <span className="font-bold">@swipe_n_go_vacations</span> for daily travel inspiration, reels, and behind-the-scenes content!
                    </p>
                    <a
                        href={process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/swipe_n_go_vacations/"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-purple-600 font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        <span>Follow on Instagram</span>
                    </a>
                </div>
            </section>
        </div>
    );
}
