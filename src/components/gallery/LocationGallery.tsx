'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { LocationGroup, GalleryItem } from '@/types';
import { Lightbox } from '../ui/animations/Lightbox';
import { StaggerGrid, StaggerItem } from '../ui/animations/Stagger';

// Hook to detect grid columns based on Tailwind breakpoints
function useGridColumns() {
    const [cols, setCols] = useState(1);

    useEffect(() => {
        const updateCols = () => {
            if (window.innerWidth >= 1024) setCols(3); // lg
            else if (window.innerWidth >= 640) setCols(2); // sm
            else setCols(1);
        };

        updateCols();
        window.addEventListener('resize', updateCols);
        return () => window.removeEventListener('resize', updateCols);
    }, []);

    return cols;
}

interface LocationGalleryProps {
    locations: LocationGroup[];
}

export function LocationGallery({ locations }: LocationGalleryProps) {
    const cols = useGridColumns();
    const [expandedLocationName, setExpandedLocationName] = useState<string | null>(null);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    // Toggle expansion
    const handleExpand = (name: string) => {
        setExpandedLocationName(prev => prev === name ? null : name);
    };

    // Calculate items including the injected panel
    const gridItems = useMemo(() => {
        const items: (LocationGroup | { type: 'panel', group: LocationGroup })[] = [...locations];

        if (expandedLocationName) {
            const index = locations.findIndex(l => l.name === expandedLocationName);
            if (index !== -1) {
                // Calculate position to insert panel (after the current row)
                // Row start index = Math.floor(index / cols) * cols
                // Row end index = Row start + cols
                const rowEndIndex = (Math.floor(index / cols) + 1) * cols;
                // Insert at the calculated position, or end of list if close to end
                // We use Math.min to prevent out of bounds gaps if the last row is distinct
                const insertIndex = Math.min(rowEndIndex, locations.length);

                // However, inserting into the array shifts indices. 
                // We need to just insert it.
                // Wait, if we use a flat map, we need to know where to slice.
                // Simpler: Just map original locations, and if we hit the "end of row" for the selected item, render the panel?
                // No, CSS Grid flow is automatic. We physically insert the item in the array.

                // Let's assume sorting order doesn't matter too much or is preserved.
                // Actually, if we insert at `insertIndex`, it will visually appear after the row.
                // But `locations` length might not be divisible by `cols`, so last row might be short.
                // Logic: `current item index` -> `row index`. `(rowIndex + 1) * cols`. 
                // But since we are modifying the array, we do:

                const panelItem = { type: 'panel' as const, group: locations[index] };
                // Splice it in
                // We recreate array to avoid mutation
                // If rowEndIndex > locations.length, we just append.

                const newItems: any[] = [...locations];
                newItems.splice(insertIndex, 0, panelItem);
                return newItems;
            }
        }
        return items;
    }, [locations, expandedLocationName, cols]);

    // Lightbox helpers
    const currentGroup = expandedLocationName ? locations.find(l => l.name === expandedLocationName) : null;
    const currentPhotos = currentGroup ? currentGroup.photos : [];

    const openLightbox = (index: number) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);
    const nextImage = () => setLightboxIndex(prev => (prev !== null && prev < currentPhotos.length - 1 ? prev + 1 : prev));
    const prevImage = () => setLightboxIndex(prev => (prev !== null && prev > 0 ? prev - 1 : prev));

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-min">
                {gridItems.map((item: any, index) => {
                    if (item.type === 'panel') {
                        const group = item.group as LocationGroup;
                        return (
                            <motion.div
                                key={`panel-${group.name}`}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                                className="col-span-1 sm:col-span-2 lg:col-span-3 w-full overflow-hidden"
                            >
                                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8 mt-4 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4">
                                        <button
                                            onClick={() => setExpandedLocationName(null)}
                                            className="p-2 bg-slate-100 hover:bg-slate-200 text-brand-navy rounded-full transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="mb-8">
                                        <h3 className="text-2xl md:text-3xl font-bold text-brand-navy mb-2">{group.name} Gallery</h3>
                                        <p className="text-slate-500">{group.photos.length} Photos collected from our trips</p>
                                    </div>

                                    {/* Masonry Grid for Photos */}
                                    <StaggerGrid className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                                        {group.photos.map((photo: GalleryItem, pIndex: number) => (
                                            <StaggerItem key={`${group.name}-${pIndex}`} className="break-inside-avoid">
                                                <div
                                                    className="relative group rounded-xl overflow-hidden cursor-pointer"
                                                    onClick={() => openLightbox(pIndex)}
                                                >
                                                    <Image
                                                        src={photo.image_url}
                                                        alt={photo.caption || group.name}
                                                        width={600}
                                                        height={400}
                                                        className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                    />
                                                    <div className="absolute inset-0 bg-brand-navy/0 group-hover:bg-brand-navy/20 transition-colors duration-300"></div>
                                                    <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-brand-navy/80 to-transparent text-white text-sm">
                                                        {photo.caption}
                                                    </div>
                                                </div>
                                            </StaggerItem>
                                        ))}
                                    </StaggerGrid>
                                </div>
                            </motion.div>
                        );
                    }

                    const group = item as LocationGroup;
                    const isExpanded = expandedLocationName === group.name;

                    return (
                        <motion.div
                            layoutId={`card-${group.name}`}
                            key={group.name}
                            className={`group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl hover:shadow-brand-secondary/20 transition-all duration-300 hover:-translate-y-1 ring-0 hover:ring-2 hover:ring-brand-secondary/50 ${isExpanded ? 'ring-2 ring-brand-primary' : ''}`}
                            onClick={() => handleExpand(group.name)}
                        >
                            <Image
                                src={group.coverImage.image_url}
                                alt={group.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                            {/* Card Content */}
                            <div className="absolute inset-0 flex flex-col justify-end p-6">
                                <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-brand-primary transition-colors">
                                    {group.name}
                                </h3>
                                <div className="flex items-center space-x-2 text-white/80 text-sm mb-4">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{group.photos.length} Photos</span>
                                </div>

                                {/* Hover Overlay/CTA (Desktop) */}
                                <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100">
                                    <span className="inline-block px-4 py-2 bg-brand-primary text-brand-navy font-semibold rounded-full text-sm">
                                        View Photos
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Lightbox */}
            {currentGroup && (
                <Lightbox
                    src={lightboxIndex !== null ? currentPhotos[lightboxIndex]?.image_url : null}
                    alt={lightboxIndex !== null ? (currentPhotos[lightboxIndex]?.caption || '') : ''}
                    onClose={closeLightbox}
                    onNext={nextImage}
                    onPrev={prevImage}
                    hasNext={lightboxIndex !== null && lightboxIndex < currentPhotos.length - 1}
                    hasPrev={lightboxIndex !== null && lightboxIndex > 0}
                />
            )}
        </>
    );
}
