import { GalleryItem } from '@/types';

interface GalleryGridProps {
    items: GalleryItem[];
}

export function GalleryGrid({ items }: GalleryGridProps) {
    if (items.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 bg-slate-800 rounded-2xl flex items-center justify-center">
                    <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Gallery Coming Soon</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                    We&apos;re adding photos from our amazing trips. Check our Instagram for the latest pictures!
                </p>
            </div>
        );
    }

    return (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="break-inside-avoid group relative overflow-hidden rounded-2xl bg-slate-800"
                >
                    <img
                        src={item.image_url}
                        alt={item.caption || 'Gallery image'}
                        className="w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    {item.caption && (
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <p className="text-white text-sm">{item.caption}</p>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
