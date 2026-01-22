'use client';

import { useState } from 'react';

interface FAQ {
    question: string;
    answer: string;
    category: string;
}

const faqs: FAQ[] = [
    // Visa & Documents
    {
        category: "Visa & Documents",
        question: "What documents do I need to travel internationally?",
        answer: "You'll need a valid passport (with at least 6 months validity), relevant visa for your destination, travel insurance documents, flight tickets, and hotel booking confirmations. We provide a complete checklist once you book."
    },

    // Payment
    {
        category: "Payment",
        question: "What payment methods do you accept?",
        answer: "We accept bank transfers (NEFT/RTGS/IMPS), UPI payments, and credit/debit cards. A 30% advance is required to confirm your booking."
    },
    {
        category: "Payment",
        question: "Is there a refund policy?",
        answer: "Yes. We maintain a clear and transparent cancellation policy. Cancellation charges are applied based on the number of days prior to departure: 30+ days: 10% of the total trip cost; 15–29 days: 25%; 7–14 days: 50%; 0–6 days: 100% (no refund). We recommend purchasing travel insurance to protect against unforeseen changes to your plans."
    },
    // Safety
    {
        category: "Safety",
        question: "Is it safe to travel with you?",
        answer: "Absolutely! We partner only with verified hotels, trusted transport providers, and experienced local guides. We provide 24/7 travel support and emergency assistance throughout your trip."
    },
    {
        category: "Safety",
        question: "Do you recommend travel insurance?",
        answer: "Yes, we highly recommend comprehensive travel insurance covering medical emergencies, trip cancellation, lost luggage, and flight delays. We can help you get the best coverage at competitive rates."
    },
    // Group & Booking
    {
        category: "Booking",
        question: "Can I customize my package?",
        answer: "Absolutely! All our packages are fully customizable. Tell us your preferences - hotels, activities, duration, budget - and we'll craft a personalized itinerary just for you."
    },
    {
        category: "Booking",
        question: "What's the minimum group size for packages?",
        answer: "Most of our packages work great for 2+ travelers. For solo travelers, we offer special packages or can connect you with small group departures. Family packages accommodate any size."
    },
    {
        category: "Booking",
        question: "How far in advance should I book?",
        answer: "We recommend booking 30-60 days in advance for domestic trips and 60-90 days for international trips. Peak season (holidays, festivals) may require even earlier booking for the best rates."
    },
];

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const categories = ['all', ...Array.from(new Set(faqs.map(f => f.category)))];
    const filteredFaqs = selectedCategory === 'all'
        ? faqs
        : faqs.filter(f => f.category === selectedCategory);

    return (
        <section className="py-16 md:py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
                        Frequently Asked <span className="text-brand-primary">Questions</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Everything you need to know about traveling with us. Can&apos;t find an answer? Feel free to contact us.
                    </p>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat
                                ? 'bg-brand-primary text-brand-navy'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                }`}
                        >
                            {cat === 'all' ? 'All Questions' : cat}
                        </button>
                    ))}
                </div>

                {/* FAQs */}
                <div className="space-y-3">
                    {filteredFaqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-700/30 transition-colors"
                            >
                                <span className="font-semibold text-white pr-4 text-lg">{faq.question}</span>
                                <svg
                                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''
                                        }`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {openIndex === index && (
                                <div className="px-6 pb-4 text-slate-200 leading-relaxed bg-slate-800/30">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
