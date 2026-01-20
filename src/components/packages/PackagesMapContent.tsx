'use client';

import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Package } from '@/types';
import { PackagePanel } from './PackagePanel';

// Custom marker icon with brand colors
const createCustomIcon = () => {
    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div style="
                width: 36px;
                height: 36px;
                background: linear-gradient(135deg, #F7B84E 0%, #e6a93d 100%);
                border: 3px solid #000514;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                box-shadow: 0 4px 12px rgba(247, 184, 78, 0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            ">
                <div style="
                    width: 12px;
                    height: 12px;
                    background: #000514;
                    border-radius: 50%;
                    transform: rotate(45deg);
                "></div>
            </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
    });
};

// Custom cluster icon
const createClusterIcon = (cluster: any) => {
    const count = cluster.getChildCount();
    const size = count > 10 ? 52 : count > 5 ? 46 : 40;
    return L.divIcon({
        html: `
            <div style="
                width: ${size}px;
                height: ${size}px;
                background: linear-gradient(135deg, #3DCBDC 0%, #2ba8b7 100%);
                border: 3px solid #000514;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #000514;
                font-weight: 700;
                font-size: ${count > 10 ? 16 : 14}px;
                box-shadow: 0 4px 16px rgba(61, 203, 220, 0.5);
                cursor: pointer;
                transition: all 0.2s ease;
            ">${count}</div>
        `,
        className: 'custom-cluster-icon',
        iconSize: L.point(size, size, true),
    });
};

// World bounds to prevent infinite panning
const worldBounds = L.latLngBounds(
    L.latLng(-85, -180),
    L.latLng(85, 180)
);

// Component to handle map bounds and controls
function MapController({ packages, selectedSlug }: { packages: Package[], selectedSlug: string | null }) {
    const map = useMap();

    useEffect(() => {
        // Set max bounds to prevent infinite panning
        map.setMaxBounds(worldBounds);
        map.setMinZoom(2);
        map.setMaxZoom(18);

        // Initial fit bounds
        if (packages.length > 0 && !selectedSlug) {
            const bounds = L.latLngBounds(packages.map(p => [p.lat, p.lng]));
            map.fitBounds(bounds, { padding: [60, 60], maxZoom: 5 });
        }
    }, [map, packages, selectedSlug]);

    // Focus on selected package
    useEffect(() => {
        if (selectedSlug) {
            const pkg = packages.find(p => p.slug === selectedSlug);
            if (pkg) {
                map.flyTo([pkg.lat, pkg.lng], 8, { duration: 0.8 });
            }
        }
    }, [map, selectedSlug, packages]);

    return null;
}

// Search and filter component
interface SearchFiltersProps {
    packages: Package[];
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    onSelectPackage: (pkg: Package) => void;
    durationFilter: string;
    setDurationFilter: (d: string) => void;
}

function SearchFilters({ packages, searchQuery, setSearchQuery, onSelectPackage, durationFilter, setDurationFilter }: SearchFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);

    const filteredPackages = useMemo(() => {
        return packages.filter(pkg => {
            const matchesSearch = !searchQuery ||
                pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pkg.location.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesDuration = !durationFilter || (() => {
                const days = parseInt(pkg.duration) || 0;
                switch (durationFilter) {
                    case 'short': return days <= 4;
                    case 'medium': return days >= 5 && days <= 7;
                    case 'long': return days >= 8;
                    default: return true;
                }
            })();

            return matchesSearch && matchesDuration;
        });
    }, [packages, searchQuery, durationFilter]);

    return (
        <div className="absolute top-4 left-4 z-[1000] w-80 max-w-[calc(100vw-2rem)]">
            {/* Search Input */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search destinations..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    className="w-full px-4 py-3 pl-11 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/50 shadow-xl"
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                    <button
                        onClick={() => { setSearchQuery(''); setIsOpen(false); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Duration Filter Chips */}
            <div className="flex gap-2 mt-3 flex-wrap">
                {[
                    { id: '', label: 'All' },
                    { id: 'short', label: '1-4 days' },
                    { id: 'medium', label: '5-7 days' },
                    { id: 'long', label: '8+ days' },
                ].map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => setDurationFilter(filter.id === durationFilter ? '' : filter.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${durationFilter === filter.id
                                ? 'bg-brand-primary text-brand-navy shadow-lg shadow-brand-primary/30'
                                : 'bg-slate-800/90 text-white/70 hover:bg-slate-700/90 border border-white/10'
                            }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Search Results Dropdown */}
            {isOpen && (searchQuery || durationFilter) && (
                <div className="mt-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
                    {filteredPackages.length === 0 ? (
                        <div className="p-4 text-center text-white/50 text-sm">
                            No packages found
                        </div>
                    ) : (
                        <div className="py-2">
                            <div className="px-3 py-1 text-xs text-white/40 font-medium uppercase tracking-wider">
                                {filteredPackages.length} package{filteredPackages.length !== 1 ? 's' : ''} found
                            </div>
                            {filteredPackages.map((pkg) => (
                                <button
                                    key={pkg.slug}
                                    onClick={() => {
                                        onSelectPackage(pkg);
                                        setIsOpen(false);
                                    }}
                                    className="w-full px-3 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-left"
                                >
                                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-700">
                                        <img
                                            src={pkg.image_url}
                                            alt={pkg.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-white font-medium truncate">{pkg.title}</div>
                                        <div className="text-white/50 text-sm truncate">{pkg.location}</div>
                                    </div>
                                    <div className="text-brand-primary font-bold text-sm">{pkg.price}</div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Close overlay on outside click */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[-1]"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}

interface PackagesMapContentProps {
    packages: Package[];
    initialSelectedSlug?: string;
}

export default function PackagesMapContent({ packages, initialSelectedSlug }: PackagesMapContentProps) {
    const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
    const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSelectedSlug || null);
    const [customIcon, setCustomIcon] = useState<L.DivIcon | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [durationFilter, setDurationFilter] = useState('');

    useEffect(() => {
        setCustomIcon(createCustomIcon());
    }, []);

    // Filter packages for display
    const validPackages = useMemo(() => {
        return packages.filter(p => p.lat && p.lng && p.lat !== 0 && p.lng !== 0);
    }, [packages]);

    const displayedPackages = useMemo(() => {
        return validPackages.filter(pkg => {
            const matchesSearch = !searchQuery ||
                pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pkg.location.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesDuration = !durationFilter || (() => {
                const days = parseInt(pkg.duration) || 0;
                switch (durationFilter) {
                    case 'short': return days <= 4;
                    case 'medium': return days >= 5 && days <= 7;
                    case 'long': return days >= 8;
                    default: return true;
                }
            })();

            return matchesSearch && matchesDuration;
        });
    }, [validPackages, searchQuery, durationFilter]);

    const handleSelectPackage = (pkg: Package) => {
        setSelectedPkg(pkg);
        setSelectedSlug(pkg.slug);
    };

    const center: L.LatLngExpression = [20, 0];

    return (
        <div className="relative w-full h-full bg-brand-navy">
            {/* Search & Filters */}
            <SearchFilters
                packages={validPackages}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSelectPackage={handleSelectPackage}
                durationFilter={durationFilter}
                setDurationFilter={setDurationFilter}
            />

            {/* Stats Badge */}
            <div className="absolute bottom-4 left-4 z-[1000] flex gap-2">
                <div className="bg-slate-900/90 backdrop-blur-sm px-3 py-2 rounded-lg text-xs text-white/80 font-medium border border-white/10">
                    {displayedPackages.length} destination{displayedPackages.length !== 1 ? 's' : ''}
                </div>
            </div>

            <MapContainer
                center={center}
                zoom={2}
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
                maxBounds={worldBounds}
                maxBoundsViscosity={1.0}
                minZoom={2}
                worldCopyJump={false}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    noWrap={true}
                    bounds={worldBounds}
                />

                {customIcon && (
                    <MarkerClusterGroup
                        chunkedLoading
                        iconCreateFunction={createClusterIcon}
                        maxClusterRadius={50}
                        spiderfyOnMaxZoom={true}
                        showCoverageOnHover={false}
                        zoomToBoundsOnClick={true}
                        animate={true}
                    >
                        {displayedPackages.map((pkg) => (
                            <Marker
                                key={pkg.slug}
                                position={[pkg.lat, pkg.lng]}
                                icon={customIcon}
                                eventHandlers={{
                                    click: () => handleSelectPackage(pkg),
                                }}
                            />
                        ))}
                    </MarkerClusterGroup>
                )}

                <MapController packages={displayedPackages} selectedSlug={selectedSlug} />
            </MapContainer>

            {/* Selected Package Panel */}
            <PackagePanel pkg={selectedPkg} onClose={() => { setSelectedPkg(null); setSelectedSlug(null); }} />
        </div>
    );
}
