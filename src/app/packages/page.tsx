import { Metadata } from "next";
import { getPackages } from "@/lib/sheets";
import { PackagesMap } from "@/components/packages/PackagesMap";

export const metadata: Metadata = {
    title: "Explore Destinations",
    description: "Interactive map of our exclusive travel packages. Find your dream vacation by location.",
};

export default async function PackagesPage() {
    const packages = await getPackages();

    console.log(`[PackagesPage] Loaded ${packages.length} packages from sheets`);

    return (
        <main className="h-screen pt-16 md:pt-20 overflow-hidden bg-brand-navy">
            <div className="h-full w-full">
                <PackagesMap packages={packages} />
            </div>
        </main>
    );
}
