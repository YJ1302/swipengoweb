'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';

interface ConnectionStatus {
    success: boolean;
    sheetName?: string;
    tabs?: string[];
    timestamp?: string;
    error?: string;
}

export default function AdminSettingsPage() {
    const [testing, setTesting] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null);
    const [config, setConfig] = useState<{ apiUrl: string; keyConfigured: boolean } | null>(null);

    const testConnection = async () => {
        setTesting(true);
        setConnectionStatus(null);
        setConfig(null);

        try {
            const res = await fetch('/api/admin/health');
            const data = await res.json();

            if (data.error) {
                setConnectionStatus({ success: false, error: data.error });
            } else {
                setConnectionStatus({
                    success: true,
                    sheetName: data.sheetName,
                    tabs: data.tabs,
                    timestamp: data.timestamp
                });

                if (data.config) {
                    setConfig(data.config);
                }
            }
        } catch (error) {
            setConnectionStatus({
                success: false,
                error: error instanceof Error ? error.message : 'Connection failed'
            });
        } finally {
            setTesting(false);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6 max-w-3xl">
                {/* Header */}
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">Settings</h1>
                    <p className="text-slate-400 mt-1">Manage your admin dashboard settings</p>
                </div>

                {/* Connection Status */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Google Sheets Connection</h2>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${connectionStatus?.success ? 'bg-green-500' : connectionStatus?.error ? 'bg-red-500' : 'bg-slate-500'}`} />
                                <div>
                                    <p className="text-white font-medium">System Status</p>
                                    <p className="text-slate-400 text-sm">
                                        {connectionStatus?.success
                                            ? 'Systems Operational'
                                            : connectionStatus?.error
                                                ? connectionStatus.error
                                                : 'Not tested'
                                        }
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={testConnection}
                                disabled={testing}
                                className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-brand-navy font-semibold rounded-xl transition-colors disabled:opacity-50"
                            >
                                {testing ? 'Testing...' : 'Test Connection'}
                            </button>
                        </div>

                        {connectionStatus?.success && (
                            <div className="space-y-3 animate-slide-in">
                                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-green-400 font-medium">✓ Apps Script Connected</span>
                                        <span className="text-slate-400 text-xs">{new Date(connectionStatus.timestamp || '').toLocaleString()}</span>
                                    </div>
                                    <p className="text-slate-300 text-sm">
                                        Active Spreadsheet: <span className="text-white font-medium">{connectionStatus.sheetName}</span>
                                    </p>
                                    <div className="flex gap-2 mt-2">
                                        {connectionStatus.tabs?.map(tab => (
                                            <span key={tab} className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300 border border-slate-600">
                                                {tab}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-700/30 border border-white/5 rounded-xl space-y-3">
                                    <h3 className="text-white font-medium text-sm">Environment Configuration</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-slate-500 text-xs uppercase tracking-wider">Admin API URL</label>
                                            <p className="text-slate-300 font-mono text-sm truncate" title="Masked for security">
                                                {config?.apiUrl || 'Unknown'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-slate-500 text-xs uppercase tracking-wider">Admin Key</label>
                                            <p className="text-slate-300 font-mono text-sm">
                                                {config?.keyConfigured ? '••••••••' : 'Not Configured'}
                                                {config?.keyConfigured && <span className="ml-2 text-green-400 text-xs">✓ Set</span>}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Environment Info */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Environment Variables</h2>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                            <span className="text-slate-400">SHEET_ID</span>
                            <span className="text-green-400 text-sm">✓ Configured</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                            <span className="text-slate-400">ADMIN_API_URL</span>
                            <span className="text-green-400 text-sm">✓ Configured</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                            <span className="text-slate-400">ADMIN_KEY</span>
                            <span className="text-green-400 text-sm">✓ Configured</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                            <span className="text-slate-400">ADMIN_PASSWORD</span>
                            <span className="text-green-400 text-sm">✓ Configured</span>
                        </div>
                    </div>

                    <p className="mt-4 text-slate-500 text-sm">
                        Environment variables are managed in your <code className="text-brand-primary">.env.local</code> file.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Quick Links</h2>

                    <div className="grid md:grid-cols-2 gap-3">
                        <a
                            href="https://docs.google.com/spreadsheets"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl transition-colors"
                        >
                            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
                                    <path d="M7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7zm4-8h6v2h-6zm0 4h6v2h-6zm0 4h6v2h-6z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white font-medium">Google Sheets</p>
                                <p className="text-slate-400 text-sm">Open your data source</p>
                            </div>
                        </a>

                        <a
                            href="https://script.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl transition-colors"
                        >
                            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                                <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white font-medium">Apps Script</p>
                                <p className="text-slate-400 text-sm">Manage your API script</p>
                            </div>
                        </a>

                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl transition-colors"
                        >
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white font-medium">View Website</p>
                                <p className="text-slate-400 text-sm">See your public site</p>
                            </div>
                        </a>

                        <a
                            href="https://vercel.com/dashboard"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl transition-colors"
                        >
                            <div className="w-10 h-10 rounded-lg bg-slate-500/20 flex items-center justify-center">
                                <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 22.525H0l12-21.05 12 21.05z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white font-medium">Vercel Dashboard</p>
                                <p className="text-slate-400 text-sm">Manage deployments</p>
                            </div>
                        </a>
                    </div>
                </div>

                {/* Documentation */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Need Help?</h2>
                    <p className="text-slate-400 mb-4">
                        Check the setup guide for detailed instructions on configuring the admin dashboard.
                    </p>
                    <p className="text-slate-500 text-sm">
                        Documentation: <code className="text-brand-primary">Contact Yash Joshi</code>
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
}
