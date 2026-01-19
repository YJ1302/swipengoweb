const testimonials = [
    {
        name: 'Maria Rodriguez',
        location: 'Miami, FL',
        text: 'Amazing experience! They planned our Cancun trip perfectly. Every detail was taken care of and we had the vacation of our dreams.',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    },
    {
        name: 'Carlos Mendez',
        location: 'New York, NY',
        text: 'Best travel agency I have ever worked with. Professional, responsive, and they got us incredible deals. Highly recommend!',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    },
    {
        name: 'Jennifer Thompson',
        location: 'Los Angeles, CA',
        text: 'Our family vacation was absolutely perfect. The custom itinerary they created exceeded all expectations. Can not wait to book again!',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop',
    },
];

export function Testimonials() {
    return (
        <section className="py-20 bg-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        What Our <span className="text-amber-400">Travelers</span> Say
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Real experiences from real travelers who trusted us with their dream vacations
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-amber-500/30 transition-all duration-300"
                        >
                            {/* Stars */}
                            <div className="flex space-x-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-slate-300 mb-6 leading-relaxed italic">&ldquo;{testimonial.text}&rdquo;</p>

                            {/* Author */}
                            <div className="flex items-center space-x-3">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <p className="text-white font-semibold">{testimonial.name}</p>
                                    <p className="text-slate-500 text-sm">{testimonial.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
