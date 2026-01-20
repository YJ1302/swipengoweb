'use client';

import { useState, useEffect, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';

interface Lead {
    _rowIndex: number;
    timestamp: string;
    name: string;
    phone: string;
    destination: string;
    travel_month: string;
    travelers: string;
    budget: string;
    notes: string;
    source: string;
    status: string;
}

const STATUS_OPTIONS = ['New', 'Contacted', 'Quote Sent', 'Converted', 'Lost'];

export default function AdminLeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [updating, setUpdating] = useState<number | null>(null);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        }
        try {
            const res = await fetch('/api/admin/leads');
            const data = await res.json();
            setLeads(data.leads || []);
            if (process.env.NODE_ENV === 'development') {
                console.log('[Leads] Fetched:', data.leads?.length || 0, 'leads');
            }
        } catch (error) {
            console.error('Failed to fetch leads:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const updateLeadStatus = async (lead: Lead, newStatus: string) => {
        setUpdating(lead._rowIndex);
        try {
            await fetch('/api/admin/leads', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _rowIndex: lead._rowIndex, status: newStatus }),
            });

            setLeads(prev => prev.map(l =>
                l._rowIndex === lead._rowIndex ? { ...l, status: newStatus } : l
            ));

            if (selectedLead?._rowIndex === lead._rowIndex) {
                setSelectedLead({ ...selectedLead, status: newStatus });
            }
        } catch (error) {
            console.error('Failed to update lead:', error);
        } finally {
            setUpdating(null);
        }
    };

    const filteredLeads = useMemo(() => {
        return leads.filter(lead => {
            const matchesSearch = !searchQuery ||
                lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.phone?.includes(searchQuery) ||
                lead.destination?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = !statusFilter || lead.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [leads, searchQuery, statusFilter]);

    const exportCSV = () => {
        const headers = ['Timestamp', 'Name', 'Phone', 'Destination', 'Month', 'Travelers', 'Budget', 'Notes', 'Source', 'Status'];
        const rows = filteredLeads.map(l => [
            l.timestamp, l.name, l.phone, l.destination, l.travel_month,
            l.travelers, l.budget, l.notes, l.source, l.status
        ]);

        const csv = [headers, ...rows].map(row => row.map(cell => `"${cell || ''}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'new': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'contacted': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'quote sent': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'converted': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'lost': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
        }
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">Leads</h1>
                        <p className="text-slate-400 mt-1">Manage and track your quote requests</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => fetchLeads(true)}
                            disabled={refreshing}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/20 hover:bg-brand-primary/30 text-brand-primary rounded-xl transition-colors disabled:opacity-50"
                        >
                            <svg className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            {refreshing ? 'Refreshing...' : 'Refresh'}
                        </button>
                        <button
                            onClick={exportCSV}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="search"
                            placeholder="Search by name, phone, or destination..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                    >
                        <option value="">All Status</option>
                        {STATUS_OPTIONS.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>

                {/* Leads Table */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
                        </div>
                    ) : filteredLeads.length === 0 ? (
                        <div className="p-12 text-center text-slate-400">
                            {leads.length === 0 ? 'No leads yet.' : 'No leads match your filters.'}
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-slate-400 text-sm border-b border-white/5">
                                            <th className="px-5 py-4 font-medium">Name</th>
                                            <th className="px-5 py-4 font-medium">Phone</th>
                                            <th className="px-5 py-4 font-medium">Destination</th>
                                            <th className="px-5 py-4 font-medium">Date</th>
                                            <th className="px-5 py-4 font-medium">Status</th>
                                            <th className="px-5 py-4 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredLeads.map((lead) => (
                                            <tr
                                                key={lead._rowIndex}
                                                className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                                                onClick={() => setSelectedLead(lead)}
                                            >
                                                <td className="px-5 py-4 text-white font-medium">{lead.name || 'N/A'}</td>
                                                <td className="px-5 py-4 text-slate-300">{lead.phone || 'N/A'}</td>
                                                <td className="px-5 py-4 text-slate-300">{lead.destination || 'Not specified'}</td>
                                                <td className="px-5 py-4 text-slate-400">{formatDate(lead.timestamp)}</td>
                                                <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                                                    <select
                                                        value={lead.status || 'New'}
                                                        onChange={(e) => updateLeadStatus(lead, e.target.value)}
                                                        disabled={updating === lead._rowIndex}
                                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${getStatusColor(lead.status)} bg-transparent cursor-pointer focus:outline-none`}
                                                    >
                                                        {STATUS_OPTIONS.map(status => (
                                                            <option key={status} value={status} className="bg-slate-800">
                                                                {status}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                                                    <a
                                                        href={`https://wa.me/${String(lead.phone || '').replace(/\D/g, '')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                                        </svg>
                                                        WhatsApp
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="md:hidden divide-y divide-white/5">
                                {filteredLeads.map((lead) => (
                                    <div
                                        key={lead._rowIndex}
                                        className="p-4 hover:bg-white/5 transition-colors"
                                        onClick={() => setSelectedLead(lead)}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-white font-medium">{lead.name || 'N/A'}</h3>
                                                <p className="text-slate-400 text-sm">{lead.phone}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                                                {lead.status || 'New'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-400">{lead.destination || 'Not specified'}</span>
                                            <span className="text-slate-500">{formatDate(lead.timestamp)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Lead Detail Drawer */}
                {selectedLead && (
                    <div className="fixed inset-0 z-50 flex justify-end">
                        <div
                            className="absolute inset-0 bg-black/50"
                            onClick={() => setSelectedLead(null)}
                        />
                        <div className="relative w-full max-w-md bg-slate-800 border-l border-white/10 h-full overflow-y-auto">
                            <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-slate-800">
                                <h2 className="text-xl font-semibold text-white">Lead Details</h2>
                                <button
                                    onClick={() => setSelectedLead(null)}
                                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Name</label>
                                    <p className="text-white text-lg">{selectedLead.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Phone</label>
                                    <p className="text-white text-lg">{selectedLead.phone || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Destination</label>
                                    <p className="text-white text-lg">{selectedLead.destination || 'Not specified'}</p>
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Travel Month</label>
                                    <p className="text-white">{selectedLead.travel_month || 'Flexible'}</p>
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Travelers</label>
                                    <p className="text-white">{selectedLead.travelers || 'Not specified'}</p>
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Budget</label>
                                    <p className="text-white">{selectedLead.budget || 'Not specified'}</p>
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Notes</label>
                                    <p className="text-white">{selectedLead.notes || 'None'}</p>
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Source</label>
                                    <p className="text-white">{selectedLead.source || 'Unknown'}</p>
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Date</label>
                                    <p className="text-white">{formatDate(selectedLead.timestamp)}</p>
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-2">Status</label>
                                    <select
                                        value={selectedLead.status || 'New'}
                                        onChange={(e) => updateLeadStatus(selectedLead, e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                                    >
                                        {STATUS_OPTIONS.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>
                                <a
                                    href={`https://wa.me/${String(selectedLead.phone || '').replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    Open WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats Footer */}
                <div className="text-center text-slate-400 text-sm">
                    Showing {filteredLeads.length} of {leads.length} leads
                </div>
            </div>
        </AdminLayout>
    );
}
