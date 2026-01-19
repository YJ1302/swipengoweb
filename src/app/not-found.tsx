import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center pt-16">
            <div className="text-center px-4">
                <div className="text-8xl font-bold text-amber-400 mb-4">404</div>
                <h1 className="text-3xl font-bold text-white mb-4">Page Not Found</h1>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                    Oops! It seems like this destination doesn&apos;t exist. Let us help you find your way back.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                        Go Home
                    </Link>
                    <Link
                        href="/packages"
                        className="px-6 py-3 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-colors"
                    >
                        View Packages
                    </Link>
                </div>
            </div>
        </div>
    );
}
