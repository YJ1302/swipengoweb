import { Metadata } from "next";
import { QuoteForm } from "@/components/quote/QuoteForm";

export const metadata: Metadata = {
    title: "Request a Quote",
    description: "Get a personalized travel quote from Swipe N Go Vacations. Tell us your dream destination and we'll craft the perfect itinerary for you.",
};

interface QuotePageProps {
    searchParams: Promise<{ destination?: string }>;
}

export default async function QuotePage({ searchParams }: QuotePageProps) {
    const params = await searchParams;
    const destination = params.destination || '';

    return (
        <main className="min-h-screen pt-24 md:pt-28 pb-20 bg-gradient-to-b from-slate-900 to-brand-navy">
            <div className="max-w-2xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Request a <span className="text-brand-primary">Quote</span>
                    </h1>
                    <p className="text-slate-400 max-w-lg mx-auto">
                        Tell us about your dream vacation and we&apos;ll craft a personalized itinerary just for you. No commitment required!
                    </p>
                </div>

                {/* How it Works */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                    {[
                        { step: 1, title: "Share", desc: "Your requirements" },
                        { step: 2, title: "We Craft", desc: "Custom itinerary" },
                        { step: 3, title: "You Travel", desc: "With our support" },
                    ].map((item, index) => (
                        <div key={index} className="text-center">
                            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold">
                                {item.step}
                            </div>
                            <div className="text-white font-medium text-sm">{item.title}</div>
                            <div className="text-slate-500 text-xs">{item.desc}</div>
                        </div>
                    ))}
                </div>

                {/* Form */}
                <QuoteForm initialDestination={destination} />
            </div>
        </main>
    );
}
