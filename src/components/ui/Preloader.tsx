'use client';

import { useEffect, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useLoading } from '../providers/LoadingProvider';

export function Preloader() {
    const { isLoading } = useLoading();
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (!isLoading) {
            // Remove from DOM after fade out transition (500ms)
            const timer = setTimeout(() => setVisible(false), 500);
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    if (!visible) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center bg-brand-navy/95 backdrop-blur-md transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0'
                }`}
        >
            <div className="w-64 h-64 md:w-80 md:h-80">
                <DotLottieReact
                    src="https://lottie.host/8c8dd33f-a02e-4c5b-8cc6-cc461e51cded/nrhHVdTWeq.lottie"
                    loop
                    autoplay
                />
            </div>
        </div>
    );
}
