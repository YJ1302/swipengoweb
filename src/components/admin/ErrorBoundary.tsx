'use client';

import { Component, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: string;
}

export class AdminErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: '' };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: error.stack || '' };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('[AdminErrorBoundary] Caught error:', error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: '' });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[400px] flex items-center justify-center p-8">
                    <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>

                        <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
                        <p className="text-slate-400 mb-4">
                            This page encountered an error. You can try refreshing or navigate to another section.
                        </p>

                        <div className="flex gap-3 justify-center mb-4">
                            <button
                                onClick={this.handleRetry}
                                className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-brand-navy font-semibold rounded-xl transition-colors"
                            >
                                Retry
                            </button>
                            <button
                                onClick={() => window.location.href = '/admin/leads'}
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
                            >
                                Go to Leads
                            </button>
                        </div>

                        <details className="text-left mt-4">
                            <summary className="text-slate-500 text-sm cursor-pointer hover:text-slate-400">
                                Show debug details
                            </summary>
                            <pre className="mt-2 p-3 bg-slate-900 rounded-lg text-xs text-red-400 overflow-auto max-h-40">
                                {this.state.error?.message}
                                {'\n\n'}
                                {this.state.errorInfo}
                            </pre>
                        </details>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
