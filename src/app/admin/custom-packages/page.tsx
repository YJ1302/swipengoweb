'use client';

import { useState, useEffect } from 'react';
import { CustomPackage } from '@/types';
import { AdminLayout } from '@/components/admin/AdminLayout';

export default function CustomPackagesPage() {
    const [packages, setPackages] = useState<CustomPackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDuration, setFilterDuration] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<CustomPackage | null>(null);
    const [saving, setSaving] = useState(false);

    const EMPTY_FORM = {
        destination: '',
        duration_days: 3,
        hotel_star: 3,
        meal_plan: 'CP',
        transport: 'Included',
        activity_pack: 'Standard',
        season: 'Regular',
        currency: 'INR',
        price: 0,
        active: true,
        order: 0,
    };

    const [formData, setFormData] = useState<Partial<CustomPackage>>(EMPTY_FORM);

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const res = await fetch('/api/admin/custom-packages');
            const data = await res.json();
            if (data.customPackages) {
                setPackages(data.customPackages);
            }
        } catch (error) {
            console.error('Error fetching custom packages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInlineEdit = async (pkg: CustomPackage, field: keyof CustomPackage, value: any) => {
        const originalPkgs = [...packages];
        
        // Optimistic update
        setPackages(pkgs => pkgs.map(p => 
            p._rowIndex === pkg._rowIndex ? { ...p, [field]: value } : p
        ));

        try {
            const updateData = { _rowIndex: pkg._rowIndex, [field]: value };
            const res = await fetch('/api/admin/custom-packages', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData),
            });
            if (!res.ok) throw new Error('Update failed');
        } catch (err) {
            console.error(err);
            setPackages(originalPkgs); // Rollback
            alert('Failed to update package');
        }
    };

    const handleDelete = async (rowIndex?: number) => {
        if (!rowIndex || !confirm('Are you sure you want to delete this package?')) return;
        
        try {
            setSaving(true);
            const res = await fetch('/api/admin/custom-packages', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _rowIndex: rowIndex }),
            });
            if (!res.ok) throw new Error('Delete failed');
            await fetchPackages();
        } catch (err) {
            console.error(err);
            alert('Failed to delete');
        } finally {
            setSaving(false);
        }
    };

    const handleAddOrEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const method = editingPackage ? 'PUT' : 'POST';
            const payload = editingPackage ? { ...formData, _rowIndex: editingPackage._rowIndex } : formData;
            const res = await fetch('/api/admin/custom-packages', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Save failed');
            }
            setIsAddModalOpen(false);
            setEditingPackage(null);
            await fetchPackages();
        } catch (err: any) {
            console.error(err);
            alert(err.message || 'Failed to save package');
        } finally {
            setSaving(false);
        }
    };

    const openAddModal = () => {
        setEditingPackage(null);
        setFormData(EMPTY_FORM);
        setIsAddModalOpen(true);
    };

    const openEditModal = (pkg: CustomPackage) => {
        setEditingPackage(pkg);
        setFormData({
            destination: pkg.destination,
            duration_days: pkg.duration_days,
            hotel_star: pkg.hotel_star,
            meal_plan: pkg.meal_plan,
            transport: pkg.transport,
            activity_pack: pkg.activity_pack,
            season: pkg.season,
            currency: pkg.currency || 'INR',
            price: pkg.price,
            active: pkg.active,
            order: pkg.order || 0,
        });
        setIsAddModalOpen(true);
    };

    const filteredPackages = packages.filter(pkg => {
        const matchesSearch = pkg.destination?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDuration = filterDuration ? pkg.duration_days?.toString() === filterDuration : true;
        return matchesSearch && matchesDuration;
    }).sort((a, b) => (a.order || 0) - (b.order || 0) || a.destination?.localeCompare(b.destination));

    if (loading) {
        return <div className="text-white">Loading custom packages...</div>;
    }

    return (
        <AdminLayout>
            <div className="space-y-6 animate-fade-in text-slate-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">Customized Packages</h1>
                        <p className="text-slate-400 mt-1">Manage builder options and pricing.</p>
                    </div>
                <button
                    onClick={openAddModal}
                    className="bg-brand-primary text-slate-900 px-4 py-2 rounded-xl font-bold hover:bg-brand-secondary transition transform hover:scale-105"
                >
                    + Add Combination
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search destination..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                />
                <select
                    value={filterDuration}
                    onChange={(e) => setFilterDuration(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                >
                    <option value="">All Durations</option>
                    {[2,3,4,5,6,7,8,9,10,14].map(d => (
                        <option key={d} value={d}>{d} Days</option>
                    ))}
                </select>
            </div>

            <div className="bg-slate-800/50 rounded-2xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-800/80 text-slate-400 text-sm border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4 font-medium">Destination</th>
                                <th className="px-6 py-4 font-medium">Duration</th>
                                <th className="px-6 py-4 font-medium">Stars</th>
                                <th className="px-6 py-4 font-medium">Meal</th>
                                <th className="px-6 py-4 font-medium">Transport</th>
                                <th className="px-6 py-4 font-medium">Activity</th>
                                <th className="px-6 py-4 font-medium">Season</th>
                                <th className="px-6 py-4 font-medium w-32">Price (₹)</th>
                                <th className="px-6 py-4 font-medium w-24">Active</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredPackages.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="px-6 py-8 text-center text-slate-400">
                                        No custom packages found.
                                    </td>
                                </tr>
                            ) : (
                                filteredPackages.map((pkg) => (
                                    <tr key={pkg.id || pkg._rowIndex} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">{pkg.destination}</td>
                                        <td className="px-6 py-4">{pkg.duration_days} Days</td>
                                        <td className="px-6 py-4">{pkg.hotel_star}★</td>
                                        <td className="px-6 py-4">{pkg.meal_plan}</td>
                                        <td className="px-6 py-4">{pkg.transport}</td>
                                        <td className="px-6 py-4">{pkg.activity_pack}</td>
                                        <td className="px-6 py-4">{pkg.season}</td>
                                        <td className="px-6 py-4">
                                            <input 
                                                type="number" 
                                                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-sm"
                                                value={pkg.price || 0}
                                                onChange={(e) => handleInlineEdit(pkg, 'price', e.target.value)}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => handleInlineEdit(pkg, 'active', !pkg.active)}
                                                className={`w-10 h-6 rounded-full transition-colors relative ${pkg.active ? 'bg-green-500' : 'bg-slate-600'}`}
                                            >
                                                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${pkg.active ? 'translate-x-5' : 'translate-x-1'}`} />
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                            <button 
                                                onClick={() => openEditModal(pkg)}
                                                className="text-brand-primary hover:text-brand-secondary py-1"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(pkg._rowIndex)}
                                                className="text-red-400 hover:text-red-300 px-2 py-1"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 rounded-2xl max-w-2xl w-full p-6 lg:p-8 border border-white/10 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">{editingPackage ? 'Edit Combination' : 'Add Combination'}</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                        </div>

                        <form onSubmit={handleAddOrEdit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Destination</label>
                                    <input required type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                        value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Duration (Days)</label>
                                    <input required type="number" min="1" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                        value={formData.duration_days} onChange={e => setFormData({...formData, duration_days: Number(e.target.value)})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Hotel Stars</label>
                                    <select required className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                        value={formData.hotel_star} onChange={e => setFormData({...formData, hotel_star: Number(e.target.value)})}>
                                        <option value={3}>3 Star</option>
                                        <option value={4}>4 Star</option>
                                        <option value={5}>5 Star</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Meal Plan</label>
                                    <select required className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                        value={formData.meal_plan} onChange={e => setFormData({...formData, meal_plan: e.target.value})}>
                                        <option value="EP">EP (Room Only)</option>
                                        <option value="CP">CP (Breakfast)</option>
                                        <option value="MAP">MAP (Breakfast + Dinner)</option>
                                        <option value="AP">AP (All Meals)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Transport</label>
                                    <select required className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                        value={formData.transport} onChange={e => setFormData({...formData, transport: e.target.value})}>
                                        <option value="Included">Included</option>
                                        <option value="Not Included">Not Included</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Activity Pack</label>
                                    <select required className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                        value={formData.activity_pack} onChange={e => setFormData({...formData, activity_pack: e.target.value})}>
                                        <option value="None">None</option>
                                        <option value="Standard">Standard</option>
                                        <option value="Premium">Premium</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Season</label>
                                    <select required className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                        value={formData.season} onChange={e => setFormData({...formData, season: e.target.value})}>
                                        <option value="Offseason">Offseason</option>
                                        <option value="Regular">Regular</option>
                                        <option value="Peak">Peak</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Price (₹)</label>
                                    <input required type="number" min="0" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                        value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-4">
                                <input type="checkbox" id="active" className="w-4 h-4 rounded border-slate-700" 
                                    checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} />
                                <label htmlFor="active" className="text-white text-sm">Active</label>
                            </div>

                            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-white/10">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-2 text-slate-400 hover:text-white transition">Cancel</button>
                                <button type="submit" disabled={saving} className="bg-brand-primary text-slate-900 font-bold px-6 py-2 rounded-xl hover:bg-brand-secondary transition disabled:opacity-50">
                                    {saving ? 'Saving...' : 'Save Combination'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
        </AdminLayout>
    );
}
