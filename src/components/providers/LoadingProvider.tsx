'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type LoadingContextType = {
    isLoading: boolean;
};

const LoadingContext = createContext<LoadingContextType>({ isLoading: true });

export const useLoading = () => useContext(LoadingContext);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Wait for 3000ms (main loading) + slight buffer for fade
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <LoadingContext.Provider value={{ isLoading }}>
            {children}
        </LoadingContext.Provider>
    );
}
