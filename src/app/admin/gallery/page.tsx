'use client';

import { useState, useEffect, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import Image from 'next/image';

interface GalleryItem {
    _rowIndex: number;
    image_url: string;
    caption: string;
    location: string;
    is_cover: string | boolean;
    active: string | boolean;
    order: number;
}

const EMPTY_ITEM: Omit<GalleryItem, '_rowIndex'> = {
    image_url: '', caption: '', location: '', is_cover: false, active: true, order: 0
};

export default function AdminGalleryPage() {
    const [gallery, setGallery] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
    const [formData, setFormData] = useState<Omit<GalleryItem, '_rowIndex'>>(EMPTY_ITEM);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [expandedLocations, setExpandedLocations] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            const res = await fetch('/api/admin/gallery');
            const data = await res.json();
            setGallery(data.gallery || []);
            // Auto-expand all locations initially
            const locations = new Set((data.gallery || []).map((item: GalleryItem) => item.location || 'Other'));
            setExpandedLocations(locations);
        } catch (error) {
            console.error('Failed to fetch gallery:', error);
        } finally {
            setLoading(false);
        }
    };

    const groupedGallery = useMemo(() => {
        const groups: Record<string, GalleryItem[]> = {};
        gallery.forEach(item => {
            const loc = item.location || 'Other';
            if (!groups[loc]) groups[loc] = [];
            groups[loc].push(item);
        });
        // Sort by order within each group
        Object.keys(groups).forEach(key => {
            groups[key].sort((a, b) => (a.order || 0) - (b.order || 0));
        });
        return groups;
    }, [gallery]);

    const locations = useMemo(() => Object.keys(groupedGallery).sort(), [groupedGallery]);

    const toggleLocation = (loc: string) => {
        setExpandedLocations(prev => {
            const next = new Set(prev);
            if (next.has(loc)) next.delete(loc);
            else next.add(loc);
            return next;
        });
    };

    const openAddModal = (location?: string) => {
        setEditingItem(null);
        setFormData({ ...EMPTY_ITEM, location: location || '' });
        setShowModal(true);
    };

    const openEditModal = (item: GalleryItem) => {
        setEditingItem(item);
        setFormData({
            image_url: item.image_url || '',
            caption: item.caption || '',
            location: item.location || '',
            is_cover: item.is_cover === 'TRUE' || item.is_cover === true,
            active: item.active === 'TRUE' || item.active === true,
            order: item.order || 0,
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.image_url) {
            alert('Image URL is required');
            return;
        }

        setSaving(true);
        try {
            const method = editingItem ? 'PUT' : 'POST';
            const body = editingItem
                ? { ...formData, _rowIndex: editingItem._rowIndex }
                : formData;

            const res = await fetch('/api/admin/gallery', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (data.error) {
                alert(data.error);
            } else {
                setShowModal(false);
                fetchGallery();
            }
        } catch (error) {
            console.error('Failed to save gallery item:', error);
            alert('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (item: GalleryItem) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        setDeleting(item._rowIndex);
        try {
            await fetch('/api/admin/gallery', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _rowIndex: item._rowIndex }),
            });
            fetchGallery();
        } catch (error) {
            console.error('Failed to delete:', error);
        } finally {
            setDeleting(null);
        }
    };

    const setCover = async (item: GalleryItem) => {
        try {
            await fetch('/api/admin/gallery', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _rowIndex: item._rowIndex, is_cover: true, location: item.location }),
            });
            fetchGallery();
        } catch (error) {
            console.error('Failed to set cover:', error);
        }
    };

    const isCover = (item: GalleryItem) => item.is_cover === 'TRUE' || item.is_cover === true;
    const isActive = (item: GalleryItem) => item.active === 'TRUE' || item.active === true;

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">Gallery</h1>
                        <p className="text-slate-400 mt-1">Manage your photo gallery by location</p>
                    </div>
                    <button
                        onClick={() => openAddModal()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-brand-navy font-semibold rounded-xl transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Image
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : gallery.length === 0 ? (
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
                        <p className="text-slate-400 mb-4">No images yet.</p>
                        <button
                            onClick={() => openAddModal()}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-brand-navy font-semibold rounded-xl transition-colors"
                        >
                            Add your first image
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {locations.map(location => {
                            const items = groupedGallery[location];
                            const coverImage = items.find(isCover);
                            const isExpanded = expandedLocations.has(location);

                            return (
                                <div key={location} className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                                    {/* Location Header */}
                                    <button
                                        onClick={() => toggleLocation(location)}
                                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            {coverImage ? (
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-700">
                                                    <Image
                                                        src={coverImage.image_url}
                                                        alt={location}
                                                        width={48}
                                                        height={48}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="text-left">
                                                <h3 className="text-white font-semibold">{location}</h3>
                                                <p className="text-slate-400 text-sm">{items.length} images</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); openAddModal(location); }}
                                                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            </button>
                                            <svg
                                                className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </button>

                                    {/* Images Grid */}
                                    {isExpanded && (
                                        <div className="px-6 pb-6">
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                                {items.map(item => (
                                                    <div
                                                        key={item._rowIndex}
                                                        className={`relative group rounded-xl overflow-hidden bg-slate-700 aspect-square ${!isActive(item) ? 'opacity-50' : ''}`}
                                                    >
                                                        {item.image_url && (
                                                            <Image
                                                                src={item.image_url}
                                                                alt={item.caption || 'Gallery image'}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        )}

                                                        {/* Cover badge */}
                                                        {isCover(item) && (
                                                            <div className="absolute top-2 left-2 px-2 py-1 bg-brand-primary text-brand-navy text-xs font-bold rounded">
                                                                Cover
                                                            </div>
                                                        )}

                                                        {/* Hover overlay */}
                                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={() => openEditModal(item)}
                                                                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                                                            >
                                                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            </button>
                                                            {!isCover(item) && (
                                                                <button
                                                                    onClick={() => setCover(item)}
                                                                    className="p-2 bg-brand-primary/20 hover:bg-brand-primary/30 rounded-lg transition-colors"
                                                                    title="Set as cover"
                                                                >
                                                                    <svg className="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                                    </svg>
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleDelete(item)}
                                                                disabled={deleting === item._rowIndex}
                                                                className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors disabled:opacity-50"
                                                            >
                                                                <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>

                                                        {/* Caption */}
                                                        {item.caption && (
                                                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                                                <p className="text-white text-xs truncate">{item.caption}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Add/Edit Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
                        <div className="relative w-full max-w-lg bg-slate-800 rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-white">
                                    {editingItem ? 'Edit Image' : 'Add Image'}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Image URL *</label>
                                    <input
                                        type="url"
                                        value={formData.image_url}
                                        onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                                    />
                                </div>

                                {formData.image_url && (
                                    <div className="aspect-video relative rounded-lg overflow-hidden bg-slate-700">
                                        <Image
                                            src={formData.image_url}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                            onError={(e) => (e.currentTarget.style.display = 'none')}
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Caption</label>
                                    <input
                                        type="text"
                                        value={formData.caption}
                                        onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
                                        placeholder="Beautiful sunset..."
                                        className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Location</label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                        placeholder="Goa, Maldives, etc."
                                        list="locations"
                                        className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                                    />
                                    <datalist id="locations">
                                        {locations.map(loc => (
                                            <option key={loc} value={loc} />
                                        ))}
                                    </datalist>
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

                                <div className="flex flex-col gap-3">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_cover === true}
                                            onChange={(e) => setFormData(prev => ({ ...prev, is_cover: e.target.checked }))}
                                            className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-brand-primary focus:ring-brand-primary/50"
                                        />
                                        <span className="text-white">Set as cover image for this location</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.active === true}
                                            onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                                            className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-brand-primary focus:ring-brand-primary/50"
                                        />
                                        <span className="text-white">Active (visible on website)</span>
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
                                    {saving ? 'Saving...' : (editingItem ? 'Update' : 'Add')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats */}
                <div className="text-center text-slate-400 text-sm">
                    {gallery.length} images across {locations.length} locations
                </div>
            </div>
        </AdminLayout>
    );
}
