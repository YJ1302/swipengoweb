'use client';

import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Package } from '@/types';
import { PackagePanel } from './PackagePanel';

// --- ICONS ---
const createCustomIcon = () => {
    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div style="
                width: 36px; height: 36px;
                background: linear-gradient(135deg, #F7B84E 0%, #e6a93d 100%);
                border: 3px solid #000514; border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                box-shadow: 0 4px 12px rgba(247, 184, 78, 0.4);
            ">
                <div style="
                    width: 12px; height: 12px;
                    background: #000514; border-radius: 50%;
                    position: absolute; top: 9px; left: 9px;
                "></div>
            </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
    });
};

const createClusterIcon = (cluster: any) => {
    const count = cluster.getChildCount();
    const size = count > 10 ? 52 : count > 5 ? 46 : 40;
    return L.divIcon({
        html: `
            <div style="
                width: ${size}px; height: ${size}px;
                background: linear-gradient(135deg, #3DCBDC 0%, #2ba8b7 100%);
                border: 3px solid #000514; border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                color: #000514; font-weight: 700; font-size: ${count > 10 ? 16 : 14}px;
                box-shadow: 0 4px 16px rgba(61, 203, 220, 0.5);
            ">${count}</div>
        `,
        className: 'custom-cluster-icon',
        iconSize: L.point(size, size, true),
    });
};

const worldBounds = L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180));

// --- CONTROLLER ---
function MapController({ packages, selectedSlug }: { packages: Package[], selectedSlug: string | null }) {
    const map = useMap();

    // Fit bounds on package list change (filtering)
    useEffect(() => {
        if (packages.length > 0 && !selectedSlug) {
            const bounds = L.latLngBounds(packages.map(p => [p.lat, p.lng]));
            if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [80, 80], maxZoom: 8 });
            }
        }
    }, [map, packages, selectedSlug]);

    // Fly to selection
    useEffect(() => {
        if (selectedSlug) {
            const pkg = packages.find(p => p.slug === selectedSlug);
            if (pkg) {
                map.flyTo([pkg.lat, pkg.lng], 9, { duration: 1.0 });
            }
        }
    }, [map, selectedSlug, packages]);

    return null;
}

// --- SIDEBAR ---
interface SidebarProps {
    packages: Package[];
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    durationFilter: string;
    setDurationFilter: (d: string) => void;
    onSelectPackage: (pkg: Package) => void;
    isCollapsed: boolean;
    toggleCollapse: () => void;
}

function Sidebar({ packages, searchQuery, setSearchQuery, durationFilter, setDurationFilter, onSelectPackage, isCollapsed, toggleCollapse }: SidebarProps) {
    return (
        <div
            className={`
                absolute top-4 left-4 z-[500] 
                bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl 
                flex flex-col transition-all duration-300 ease-in-out
                ${isCollapsed ? 'w-12 h-12 overflow-hidden' : 'w-80 md:w-96 max-h-[calc(100vh-8rem)]'}
            `}
        >
            {/* Toggle Button (Visible when collapsed) */}
            {isCollapsed && (
                <button onClick={toggleCollapse} className="w-full h-full flex items-center justify-center text-white/70 hover:text-white">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            )}

            {/* Content (Visible when expanded) */}
            {!isCollapsed && (
                <>
                    {/* Header: Search & Filter */}
                    <div className="p-4 space-y-3 border-b border-white/10">
                        <div className="flex items-center justify-between">
                            <h2 className="text-white font-bold text-lg">Destinations</h2>
                            <button onClick={toggleCollapse} className="md:hidden p-1 text-white/50 hover:text-white">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search places..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 rounded-lg text-sm text-white focus:ring-2 focus:ring-brand-primary/50 outline-none"
                            />
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                            {['All', '1-4 days', '5-7 days', '8+ days'].map(label => {
                                const id = label === 'All' ? '' : label === '1-4 days' ? 'short' : label === '5-7 days' ? 'medium' : 'long';
                                const isActive = durationFilter === id;
                                return (
                                    <button
                                        key={label}
                                        onClick={() => setDurationFilter(isActive ? '' : id)}
                                        className={`
                                            whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium transition-colors
                                            ${isActive ? 'bg-brand-primary text-brand-navy' : 'bg-slate-800 text-white/70 hover:bg-slate-700'}
                                        `}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Results List */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                        {packages.length === 0 ? (
                            <div className="p-8 text-center text-white/40 text-sm">
                                No packages found matching your criteria.
                            </div>
                        ) : (
                            packages.map(pkg => (
                                <button
                                    key={pkg.slug}
                                    onClick={() => onSelectPackage(pkg)}
                                    className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl transition-colors text-left group"
                                >
                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0 relative">
                                        <img src={pkg.image_url} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-medium text-sm truncate">{pkg.title}</h3>
                                        <div className="flex items-center gap-1 text-white/50 text-xs">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            <span className="truncate">{pkg.location}</span>
                                        </div>
                                        <div className="text-brand-primary text-xs font-bold mt-1">{pkg.price}</div>
                                    </div>
                                    <div className="p-2 text-white/20 group-hover:text-brand-primary transition-colors">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Status Footer */}
                    <div className="p-3 bg-slate-900/50 border-t border-white/5 text-center text-xs text-white/40">
                        Showing {packages.length} destinations
                    </div>
                </>
            )}
        </div>
    );
}

// --- MAIN COMPONENT ---
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
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    useEffect(() => {
        setCustomIcon(createCustomIcon());
        // Auto-collapse sidebar on mobile initially
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setIsSidebarCollapsed(true);
        }
    }, []);

    // Filter logic
    const displayedPackages = useMemo(() => {
        const valid = packages.filter(p => p.lat && p.lng && p.lat !== 0 && p.lng !== 0);
        return valid.filter(pkg => {
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

    const handleSelectPackage = (pkg: Package) => {
        setSelectedPkg(pkg);
        setSelectedSlug(pkg.slug);
        // On mobile, collapse sidebar when selecting
        if (window.innerWidth < 768) {
            setIsSidebarCollapsed(true);
        }
    };

    return (
        <div className="relative w-full h-full bg-brand-navy isolate">
            <Sidebar
                packages={displayedPackages}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                durationFilter={durationFilter}
                setDurationFilter={setDurationFilter}
                onSelectPackage={handleSelectPackage}
                isCollapsed={isSidebarCollapsed}
                toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            <MapContainer
                center={[20, 0]}
                zoom={2}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false} // We can enable it, but default position might overlap sidebar
                maxBounds={worldBounds}
                maxBoundsViscosity={1.0}
                minZoom={2}
                className="z-0 outline-none"
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; CARTO'
                    noWrap={true}
                    bounds={worldBounds}
                />

                {customIcon && (
                    <MarkerClusterGroup
                        chunkedLoading
                        iconCreateFunction={createClusterIcon}
                        maxClusterRadius={50}
                        spiderfyOnMaxZoom={true}
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

            {/* Selected Package Details Panel */}
            <PackagePanel
                pkg={selectedPkg}
                onClose={() => { setSelectedPkg(null); setSelectedSlug(null); }}
            />
        </div>
    );
}
