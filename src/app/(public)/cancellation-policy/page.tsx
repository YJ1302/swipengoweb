import Link from 'next/link';

export const metadata = {
    title: 'Cancellation Policy | Swipe N Go Vacations',
    description: 'Read our cancellation and refund policies.',
};

export default function CancellationPolicyPage() {
    return (
        <div className="bg-brand-navy min-h-screen pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Cancellation Policy</h1>

                    <div className="prose prose-invert max-w-none">
                        <p className="text-slate-300 mb-6">
                            At Swipe N Go Vacations, we understand that plans can change. Our cancellation policy is designed to be transparent and fair.
                            Please review the terms below strictly before making a booking.
                        </p>

                        <div className="overflow-x-auto mb-8">
                            <table className="w-full text-left border-collapse border border-white/10 rounded-lg overflow-hidden">
                                <thead>
                                    <tr className="bg-brand-primary text-brand-navy">
                                        <th className="p-4 font-bold border-b border-brand-navy/20">Time Before Departure</th>
                                        <th className="p-4 font-bold border-b border-brand-navy/20">Refund Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="text-slate-200">
                                    <tr className="bg-white/5 border-b border-white/5">
                                        <td className="p-4">30 days or more</td>
                                        <td className="p-4 font-semibold text-green-400">Full Refund <span className="text-slate-400 font-normal text-sm block md:inline">(minus processing fee)</span></td>
                                    </tr>
                                    <tr className="bg-white/5 border-b border-white/5">
                                        <td className="p-4">15 - 29 days</td>
                                        <td className="p-4 font-semibold text-yellow-400">50% Refund</td>
                                    </tr>
                                    <tr className="bg-white/5">
                                        <td className="p-4">Less than 15 days</td>
                                        <td className="p-4 font-semibold text-red-400">No Refund</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <h3 className="text-xl font-bold text-white mt-8 mb-4">Important Notes</h3>
                        <ul className="list-disc list-outside ml-6 space-y-2 text-slate-300">
                            <li>The <strong>processing fee</strong> covers banking charges and administrative costs and is non-refundable in all cases.</li>
                            <li>Refunds will be processed within <strong>7-14 business days</strong> after the cancellation request is approved.</li>
                            <li>For flight bookings, airline cancellation rules apply separately and may exceed the charges listed above.</li>
                            <li>Customized packages involving third-party vendors (e.g., specific resorts) may have stricter cancellation terms which will be communicated at the time of booking.</li>
                        </ul>

                        <div className="mt-12 pt-8 border-t border-white/10 text-center">
                            <p className="text-slate-400 mb-4">Have questions about your booking?</p>
                            <a
                                href="/contact"
                                className="inline-block px-6 py-3 bg-brand-primary text-brand-navy font-bold rounded-xl hover:bg-brand-accent transition-colors"
                            >
                                Contact Support
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
