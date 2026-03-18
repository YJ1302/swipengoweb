import { Metadata } from "next";
import { getAllPackages } from "@/lib/sheets";
import { PackageGrid } from "@/components/packages/PackageGrid";
import { AnimatedTitle } from "@/components/ui/animations/AnimatedTitle";

export const metadata: Metadata = {
    title: "Explore Packages",
    description: "Browse through our handpicked domestic and international destinations.",
};

export default async function PackagesPage() {
    // Get all valid packages
    const packages = await getAllPackages();

    console.log(`[PackagesPage] Loaded ${packages.length} packages for grid`);

    return (
        <div className="min-h-screen pt-20 md:pt-24 bg-background">
            {/* Packages Header */}
            <section className="py-12 md:py-20 bg-brand-navy relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-navy">
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-brand-secondary/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                    <AnimatedTitle
                        prefix="Explore Our"
                        highlight="Packages"
                        description="Browse through our handpicked destinations. Find your next great adventure with Swipe N Go Vacations."
                    />
                </div>
            </section>

            {/* Packages Grid */}
            <section className="py-12 md:py-16 bg-white overflow-visible relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                    <PackageGrid initialPackages={packages} />
                </div>
            </section>
        </div>
    );
}
