'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import Image from 'next/image';

interface Package {
    _rowIndex: number;
    slug: string;
    title: string;
    price: string;
    duration: string;
    location: string;
    description: string;
    includes: string;
    excludes: string;
    image_url: string;
    active: string | boolean;
    order: number;
    lat: string | number;
    lng: string | number;
    country: string;
    city: string;
    category: string;
    best_time: string;
    highlights: string;
    itinerary: string;
    what_to_carry: string;
}

interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error';
}

const EMPTY_PACKAGE: Omit<Package, '_rowIndex'> = {
    slug: '', title: '', price: '', duration: '', location: '', description: '',
    includes: '', excludes: '', image_url: '', active: true, order: 0,
    lat: '', lng: '', country: '', city: '', category: '', best_time: '',
    highlights: '', itinerary: '', what_to_carry: ''
};

// Helper: Convert Decimal to DMS string
const toDMS = (coordinate: number | string, type: 'lat' | 'lng'): string => {
    if (coordinate === '' || coordinate === null || coordinate === undefined) return '';
    const num = Number(coordinate);
    if (isNaN(num)) return String(coordinate); // return as is if already string/invalid

    const abs = Math.abs(num);
    const deg = Math.floor(abs);
    const minDecimal = (abs - deg) * 60;
    const min = Math.floor(minDecimal);
    const sec = Math.round((minDecimal - min) * 60);

    const dir = type === 'lat'
        ? (num >= 0 ? 'N' : 'S')
        : (num >= 0 ? 'E' : 'W');

    return `${deg}°${min}'${sec}" ${dir}`;
};

// Helper: Parse DMS string or Decimal to number
const parseDMS = (input: string): number | null => {
    if (!input) return null;
    const clean = input.toString().trim();
    // Try simple decimal
    if (!isNaN(Number(clean))) return Number(clean);

    // Parse DMS - matches 8:15:00 N, 8°15'00" N, 8 15 0 N
    const regex = /^(\d+(?:\.\d+)?)[°:\s]+(\d+(?:\.\d+)?)?[':\s]*(\d+(?:\.\d+)?)?["\s]*([NSEWnsew])?$/i;
    const match = clean.match(regex);

    if (!match) return null;

    const deg = parseFloat(match[1]);
    const min = match[2] ? parseFloat(match[2]) : 0;
    const sec = match[3] ? parseFloat(match[3]) : 0;
    const dir = match[4] ? match[4].toUpperCase() : '';

    let val = deg + min / 60 + sec / 3600;

    if (dir === 'S' || dir === 'W') val = -val;

    return parseFloat(val.toFixed(6));
};

export default function AdminPackagesPage() {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
    const [showModal, setShowModal] = useState(false);
    const [editingPackage, setEditingPackage] = useState<Package | null>(null);
    const [formData, setFormData] = useState<Omit<Package, '_rowIndex'>>(EMPTY_PACKAGE);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [toggling, setToggling] = useState<number | null>(null); // Track which row is toggling
    const [toasts, setToasts] = useState<Toast[]>([]); // Toast notifications

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const res = await fetch('/api/admin/packages');
            const data = await res.json();
            setPackages(data.packages || []);
        } catch (error) {
            console.error('Failed to fetch packages:', error);
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        setEditingPackage(null);
        setFormData(EMPTY_PACKAGE);
        setShowModal(true);
    };

    const openEditModal = (pkg: Package) => {
        setEditingPackage(pkg);
        setFormData({
            slug: pkg.slug || '',
            title: pkg.title || '',
            price: pkg.price || '',
            duration: pkg.duration || '',
            location: pkg.location || '',
            description: pkg.description || '',
            includes: pkg.includes || '',
            excludes: pkg.excludes || '',
            image_url: pkg.image_url || '',
            active: pkg.active === 'TRUE' || pkg.active === true,
            order: pkg.order || 0,
            lat: toDMS(pkg.lat, 'lat'),
            lng: toDMS(pkg.lng, 'lng'),
            country: pkg.country || '',
            city: pkg.city || '',
            category: pkg.category || '',
            best_time: pkg.best_time || '',
            highlights: pkg.highlights || '',
            itinerary: pkg.itinerary || '',
            what_to_carry: pkg.what_to_carry || '',
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        // Parse Lat/Lng
        const latDecimal = parseDMS(String(formData.lat));
        const lngDecimal = parseDMS(String(formData.lng));

        // Validate required fields
        const requiredFields = [];
        if (!formData.slug) requiredFields.push('Slug');
        if (!formData.title) requiredFields.push('Title');
        if (!formData.location) requiredFields.push('Location');
        if (!formData.image_url) requiredFields.push('Image URL');

        if (latDecimal === null) requiredFields.push('Valid Latitude (e.g. 8°15\'00" N)');
        if (lngDecimal === null) requiredFields.push('Valid Longitude (e.g. 74°12\'00" E)');

        if (requiredFields.length > 0) {
            alert(`Please fill in required fields: ${requiredFields.join(', ')}`);
            return;
        }

        setSaving(true);
        try {
            const method = editingPackage ? 'PUT' : 'POST';

            // Prepare body with decimal lat/lng
            const payload = {
                ...formData,
                lat: latDecimal,
                lng: lngDecimal
            };

            const body = editingPackage
                ? { ...payload, _rowIndex: editingPackage._rowIndex }
                : payload;

            const res = await fetch('/api/admin/packages', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (data.error) {
                alert(data.error);
            } else {
                setShowModal(false);
                fetchPackages();
            }
        } catch (error) {
            console.error('Failed to save package:', error);
            alert('Failed to save package');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (pkg: Package) => {
        if (!confirm(`Are you sure you want to delete "${pkg.title}"?`)) return;

        setDeleting(pkg._rowIndex);
        try {
            await fetch('/api/admin/packages', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _rowIndex: pkg._rowIndex }),
            });
            fetchPackages();
        } catch (error) {
            console.error('Failed to delete package:', error);
        } finally {
            setDeleting(null);
        }
    };

    // Toast helper
    const showToast = (message: string, type: 'success' | 'error') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    // Optimistic toggle with instant UI update
    const toggleActive = async (pkg: Package) => {
        if (toggling === pkg._rowIndex) return; // Prevent double-click spam

        const wasActive = pkg.active === 'TRUE' || pkg.active === true;
        const newActive = !wasActive;

        // 1. Immediately update UI (optimistic)
        setPackages(prev => prev.map(p =>
            p._rowIndex === pkg._rowIndex ? { ...p, active: newActive ? 'TRUE' : 'FALSE' } : p
        ));
        setToggling(pkg._rowIndex);

        try {
            // 2. Send request in background
            const res = await fetch('/api/admin/packages', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _rowIndex: pkg._rowIndex, active: newActive }),
            });

            const data = await res.json();

            if (data.error) {
                throw new Error(data.error);
            }

            showToast(`${pkg.title} ${newActive ? 'activated' : 'deactivated'}`, 'success');
        } catch (error) {
            // 3. Revert on error
            console.error('Failed to toggle active:', error);
            setPackages(prev => prev.map(p =>
                p._rowIndex === pkg._rowIndex ? { ...p, active: wasActive ? 'TRUE' : 'FALSE' } : p
            ));
            showToast(`Failed to update ${pkg.title}`, 'error');
        } finally {
            setToggling(null);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">Packages</h1>
                        <p className="text-slate-400 mt-1">Manage your travel packages</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex bg-slate-800 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('table')}
                                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${viewMode === 'table' ? 'bg-brand-primary text-brand-navy' : 'text-slate-400 hover:text-white'}`}
                            >
                                Table
                            </button>
                            <button
                                onClick={() => setViewMode('cards')}
                                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${viewMode === 'cards' ? 'bg-brand-primary text-brand-navy' : 'text-slate-400 hover:text-white'}`}
                            >
                                Cards
                            </button>
                        </div>
                        <button
                            onClick={openAddModal}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-brand-navy font-semibold rounded-xl transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Package
                        </button>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : packages.length === 0 ? (
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
                        <p className="text-slate-400 mb-4">No packages yet.</p>
                        <button
                            onClick={openAddModal}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-brand-navy font-semibold rounded-xl transition-colors"
                        >
                            Create your first package
                        </button>
                    </div>
                ) : viewMode === 'table' ? (
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-slate-400 text-sm border-b border-white/5">
                                        <th className="px-5 py-4 font-medium">Image</th>
                                        <th className="px-5 py-4 font-medium">Title</th>
                                        <th className="px-5 py-4 font-medium">Location</th>
                                        <th className="px-5 py-4 font-medium">Price</th>
                                        <th className="px-5 py-4 font-medium">Duration</th>
                                        <th className="px-5 py-4 font-medium">Active</th>
                                        <th className="px-5 py-4 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {packages.map((pkg) => (
                                        <tr key={pkg._rowIndex} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-700">
                                                    {pkg.image_url && (
                                                        <Image
                                                            src={pkg.image_url}
                                                            alt={pkg.title}
                                                            width={64}
                                                            height={48}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className="text-white font-medium">{pkg.title}</p>
                                                <p className="text-slate-500 text-sm">{pkg.slug}</p>
                                            </td>
                                            <td className="px-5 py-4 text-slate-300">{pkg.location}</td>
                                            <td className="px-5 py-4 text-brand-primary font-medium">{pkg.price}</td>
                                            <td className="px-5 py-4 text-slate-300">{pkg.duration}</td>
                                            <td className="px-5 py-4">
                                                <button
                                                    onClick={() => toggleActive(pkg)}
                                                    disabled={toggling === pkg._rowIndex}
                                                    className={`w-12 h-6 rounded-full transition-all relative ${pkg.active === 'TRUE' || pkg.active === true
                                                        ? 'bg-green-500'
                                                        : 'bg-slate-600'
                                                        } ${toggling === pkg._rowIndex ? 'opacity-70 cursor-wait' : ''}`}
                                                >
                                                    {toggling === pkg._rowIndex ? (
                                                        <span className="absolute inset-0 flex items-center justify-center">
                                                            <svg className="w-3 h-3 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                            </svg>
                                                        </span>
                                                    ) : (
                                                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${pkg.active === 'TRUE' || pkg.active === true ? 'left-7' : 'left-1'
                                                            }`} />
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => openEditModal(pkg)}
                                                        className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(pkg)}
                                                        disabled={deleting === pkg._rowIndex}
                                                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {packages.map((pkg) => (
                            <div key={pkg._rowIndex} className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden group">
                                <div className="aspect-video relative bg-slate-700">
                                    {pkg.image_url && (
                                        <Image
                                            src={pkg.image_url}
                                            alt={pkg.title}
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                    <div className="absolute top-3 right-3 flex gap-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${pkg.active === 'TRUE' || pkg.active === true
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-red-500/20 text-red-400'
                                            }`}>
                                            {pkg.active === 'TRUE' || pkg.active === true ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-white font-semibold text-lg truncate">{pkg.title}</h3>
                                    <p className="text-slate-400 text-sm mb-3">{pkg.location}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-brand-primary font-bold">{pkg.price}</span>
                                        <span className="text-slate-500 text-sm">{pkg.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                                        <button
                                            onClick={() => openEditModal(pkg)}
                                            className="flex-1 py-2 text-center text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => toggleActive(pkg)}
                                            className="flex-1 py-2 text-center text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm"
                                        >
                                            {pkg.active === 'TRUE' || pkg.active === true ? 'Disable' : 'Enable'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(pkg)}
                                            className="py-2 px-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add/Edit Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
                        <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-800 rounded-2xl overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-white">
                                        {editingPackage ? 'Edit Package' : 'Add New Package'}
                                    </h2>
                                    <p className="text-slate-400 text-sm mt-1">
                                        <span className="text-red-500">*</span> indicates required fields
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-slate-400 text-sm mb-1">Slug <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={formData.slug}
                                            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                                            placeholder="goa-beach-escape"
                                            required
                                            className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-sm mb-1">Title <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                            placeholder="Goa Beach Escape"
                                            required
                                            className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-slate-400 text-sm mb-1">Price</label>
                                        <input
                                            type="text"
                                            value={formData.price}
                                            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                            placeholder="₹15,000"
                                            className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-sm mb-1">Duration</label>
                                        <input
                                            type="text"
                                            value={formData.duration}
                                            onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                                            placeholder="5 Days / 4 Nights"
                                            className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-sm mb-1">Order</label>
                                        <input
                                            type="number"
                                            value={formData.order}
                                            onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                                            className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Location <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                        placeholder="Goa, India"
                                        required
                                        className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Image URL <span className="text-red-500">*</span></label>
                                    <input
                                        type="url"
                                        value={formData.image_url}
                                        onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                                        placeholder="https://example.com/image.jpg"
                                        required
                                        className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                                    />
                                    {formData.image_url && (
                                        <div className="mt-2 aspect-video relative rounded-lg overflow-hidden bg-slate-700 max-w-xs">
                                            <Image
                                                src={formData.image_url}
                                                alt="Preview"
                                                fill
                                                className="object-cover"
                                                onError={(e) => (e.currentTarget.style.display = 'none')}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-slate-400 text-sm mb-1">Latitude <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={formData.lat}
                                                onChange={(e) => setFormData(prev => ({ ...prev, lat: e.target.value }))}
                                                placeholder={`8°15'00" N`}
                                                required
                                                className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                                            />
                                            {/* Helper text only on focus or always? small below */}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">DMS (8°15' N) or Decimal (8.25)</p>
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-sm mb-1">Longitude <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={formData.lng}
                                            onChange={(e) => setFormData(prev => ({ ...prev, lng: e.target.value }))}
                                            placeholder={`74°12'00" E`}
                                            required
                                            className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                                        />
                                        <p className="text-xs text-slate-500 mt-1">DMS (74°12' E) or Decimal (74.20)</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        rows={3}
                                        placeholder="Package description..."
                                        className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 resize-none"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-slate-400 text-sm mb-1">Includes</label>
                                        <textarea
                                            value={formData.includes}
                                            onChange={(e) => setFormData(prev => ({ ...prev, includes: e.target.value }))}
                                            rows={3}
                                            placeholder="What's included..."
                                            className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-sm mb-1">Excludes</label>
                                        <textarea
                                            value={formData.excludes}
                                            onChange={(e) => setFormData(prev => ({ ...prev, excludes: e.target.value }))}
                                            rows={3}
                                            placeholder="What's not included..."
                                            className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Active Toggle - Prominent Section */}
                                <div className="p-4 bg-slate-700/30 rounded-xl border border-white/5">
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <div>
                                            <span className="text-white font-medium">Active Status</span>
                                            <p className="text-slate-400 text-sm">When enabled, this package will be visible on the public website</p>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={formData.active === true || formData.active === 'TRUE'}
                                                onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                                                className="sr-only"
                                            />
                                            <div
                                                onClick={() => setFormData(prev => ({ ...prev, active: !(prev.active === true || prev.active === 'TRUE') }))}
                                                className={`w-14 h-7 rounded-full transition-colors cursor-pointer flex items-center px-1 ${formData.active === true || formData.active === 'TRUE'
                                                    ? 'bg-green-500'
                                                    : 'bg-slate-600'
                                                    }`}
                                            >
                                                <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${formData.active === true || formData.active === 'TRUE'
                                                    ? 'translate-x-7'
                                                    : 'translate-x-0'
                                                    }`} />
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="p-6 border-t border-white/10 flex justify-end gap-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2 text-slate-400 hover:text-white rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-6 py-2 bg-brand-primary hover:bg-brand-primary/90 text-brand-navy font-semibold rounded-xl transition-colors disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : (editingPackage ? 'Update' : 'Create')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats */}
                <div className="text-center text-slate-400 text-sm">
                    {packages.length} packages total • {packages.filter(p => p.active === 'TRUE' || p.active === true).length} active
                </div>
            </div>

            {/* Toast Notifications */}
            <div className="fixed bottom-4 right-4 z-50 space-y-2">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-slide-in ${toast.type === 'success'
                            ? 'bg-green-500/90 text-white'
                            : 'bg-red-500/90 text-white'
                            }`}
                    >
                        {toast.type === 'success' ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                        <span className="text-sm font-medium">{toast.message}</span>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
