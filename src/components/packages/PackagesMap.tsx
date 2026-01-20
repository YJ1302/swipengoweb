'use client';

import dynamic from 'next/dynamic';
import { Package } from '@/types';

const PackagesMapContent = dynamic(() => import('./PackagesMapContent'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[calc(100vh-64px)] flex items-center justify-center bg-slate-900 text-white">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-medium animate-pulse">Loading World Map...</p>
            </div>
        </div>
    )
});

interface PackagesMapProps {
    packages: Package[];
}

export function PackagesMap(props: PackagesMapProps) {
    return <PackagesMapContent {...props} />;
}
