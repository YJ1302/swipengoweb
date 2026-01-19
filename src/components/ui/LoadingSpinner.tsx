export function LoadingSpinner({ className = '' }: { className?: string }) {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-slate-700"></div>
                <div className="w-12 h-12 rounded-full border-4 border-amber-500 border-t-transparent animate-spin absolute top-0 left-0"></div>
            </div>
        </div>
    );
}

export function LoadingCard() {
    return (
        <div className="bg-slate-800/50 rounded-2xl overflow-hidden animate-pulse">
            <div className="aspect-video bg-slate-700"></div>
            <div className="p-6 space-y-4">
                <div className="h-6 bg-slate-700 rounded w-3/4"></div>
                <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                <div className="h-4 bg-slate-700 rounded w-full"></div>
                <div className="h-10 bg-slate-700 rounded"></div>
            </div>
        </div>
    );
}

export function LoadingGrid({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <LoadingCard key={i} />
            ))}
        </div>
    );
}
