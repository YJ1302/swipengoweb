import { Package } from '@/types';
import { PackageCard } from './PackageCard';

interface PackageGridProps {
    packages: Package[];
}

export function PackageGrid({ packages }: PackageGridProps) {
    if (packages.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 bg-slate-800 rounded-2xl flex items-center justify-center">
                    <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Packages Available</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                    We&apos;re updating our packages. Please check back soon or contact us on WhatsApp for custom trip planning!
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {packages.map((pkg) => (
                <PackageCard key={pkg.slug} package={pkg} />
            ))}
        </div>
    );
}
