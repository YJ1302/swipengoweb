'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminErrorBoundary } from '@/components/admin/ErrorBoundary';
import Link from 'next/link';

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

interface KPIData {
    totalLeads: number;
    newLeads: number;
    converted: number;
    conversionRate: number;
}

function OverviewContent() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [kpis, setKpis] = useState<KPIData>({ totalLeads: 0, newLeads: 0, converted: 0, conversionRate: 0 });

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            setError(null);
            const res = await fetch('/api/admin/leads');

            if (!res.ok) {
                throw new Error(`Failed to fetch leads: ${res.status}`);
            }

            const data = await res.json();

            if (data.error) {
                throw new Error(data.error);
            }

            const leadsList = Array.isArray(data.leads) ? data.leads : [];
            setLeads(leadsList);

            // Calculate KPIs safely
            const total = leadsList.length;
            const newCount = leadsList.filter((l: Lead) => l.status === 'New' || !l.status).length;
            const convertedCount = leadsList.filter((l: Lead) => l.status === 'Converted').length;
            const rate = total > 0 ? Math.round((convertedCount / total) * 100) : 0;

            setKpis({
                totalLeads: total,
                newLeads: newCount,
                converted: convertedCount,
                conversionRate: rate,
            });
        } catch (err) {
            console.error('Failed to fetch leads:', err);
            setError(err instanceof Error ? err.message : 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'new': return 'bg-blue-500/20 text-blue-400';
            case 'contacted': return 'bg-yellow-500/20 text-yellow-400';
            case 'quote sent': return 'bg-purple-500/20 text-purple-400';
            case 'converted': return 'bg-green-500/20 text-green-400';
            case 'lost': return 'bg-red-500/20 text-red-400';
            default: return 'bg-slate-500/20 text-slate-400';
        }
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'N/A';
        try {
            const date = new Date(dateStr);
            // Check for Invalid Date
            if (isNaN(date.getTime())) return 'N/A';
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'N/A';
        }
    };

    // Safe phone formatter
    const formatPhone = (phone: string | undefined | null): string => {
        if (!phone) return '';
        return String(phone).replace(/\D/g, '');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard Overview</h1>
                <p className="text-slate-400 mt-1">Welcome back! Here&apos;s what&apos;s happening.</p>
            </div>

            {/* Error State */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-red-400 font-medium">Failed to load data</span>
                    </div>
                    <p className="text-slate-400 text-sm mb-4">{error}</p>
                    <button
                        onClick={() => { setLoading(true); fetchLeads(); }}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <span className="text-slate-400 text-sm">Total Leads</span>
                    </div>
                    <p className="text-3xl font-bold text-white">
                        {loading ? '-' : kpis.totalLeads}
                    </p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-slate-400 text-sm">New Leads</span>
                    </div>
                    <p className="text-3xl font-bold text-white">
                        {loading ? '-' : kpis.newLeads}
                    </p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-slate-400 text-sm">Converted</span>
                    </div>
                    <p className="text-3xl font-bold text-white">
                        {loading ? '-' : kpis.converted}
                    </p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <span className="text-slate-400 text-sm">Conversion Rate</span>
                    </div>
                    <p className="text-3xl font-bold text-white">
                        {loading ? '-' : `${kpis.conversionRate}%`}
                    </p>
                </div>
            </div>

            {/* Recent Leads */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Recent Leads</h2>
                    <Link
                        href="/admin/leads"
                        className="text-brand-primary hover:text-brand-primary/80 text-sm font-medium transition-colors"
                    >
                        View All →
                    </Link>
                </div>

                {loading ? (
                    <div className="p-8 text-center">
                        <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                ) : leads.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                        No leads yet. They will appear here when someone submits a quote request.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-slate-400 text-sm border-b border-white/5">
                                    <th className="px-5 py-3 font-medium">Name</th>
                                    <th className="px-5 py-3 font-medium hidden md:table-cell">Phone</th>
                                    <th className="px-5 py-3 font-medium">Destination</th>
                                    <th className="px-5 py-3 font-medium hidden lg:table-cell">Date</th>
                                    <th className="px-5 py-3 font-medium">Status</th>
                                    <th className="px-5 py-3 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leads.slice(0, 5).map((lead) => (
                                    <tr key={lead._rowIndex} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="px-5 py-4 text-white font-medium">{lead.name || 'N/A'}</td>
                                        <td className="px-5 py-4 text-slate-300 hidden md:table-cell">{lead.phone || 'N/A'}</td>
                                        <td className="px-5 py-4 text-slate-300">{lead.destination || 'Not specified'}</td>
                                        <td className="px-5 py-4 text-slate-400 hidden lg:table-cell">{formatDate(lead.timestamp)}</td>
                                        <td className="px-5 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                                                {lead.status || 'New'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <a
                                                href={`https://wa.me/${formatPhone(lead.phone)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                                </svg>
                                                Chat
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
                <Link
                    href="/admin/packages"
                    className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/5 transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">Add Package</h3>
                            <p className="text-slate-400 text-sm">Create new travel package</p>
                        </div>
                    </div>
                </Link>

                <Link
                    href="/admin/gallery"
                    className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/5 transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">Add Gallery Image</h3>
                            <p className="text-slate-400 text-sm">Upload new photos</p>
                        </div>
                    </div>
                </Link>

                <Link
                    href="/admin/settings"
                    className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/5 transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">Test Connection</h3>
                            <p className="text-slate-400 text-sm">Check Google Sheets status</p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default function AdminOverviewPage() {
    return (
        <AdminLayout>
            <AdminErrorBoundary>
                <OverviewContent />
            </AdminErrorBoundary>
        </AdminLayout>
    );
}
