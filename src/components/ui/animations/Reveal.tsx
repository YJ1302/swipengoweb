'use client';

import { motion, useInView, UseInViewOptions } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

interface RevealProps {
    children: React.ReactNode;
    width?: 'fit-content' | '100%';
    className?: string;
    delay?: number;
    duration?: number;
    threshold?: number;
    once?: boolean;
}

export function Reveal({
    children,
    width = 'fit-content',
    className,
    delay = 0,
    duration = 0.5,
    threshold = 0.2,
    once = true,
}: RevealProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, margin: `0px 0px -${threshold * 100}px 0px` as "0px" });

    return (
        <div ref={ref} style={{ width }} className={className}>
            <motion.div
                variants={{
                    hidden: { opacity: 0, y: 75 },
                    visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                transition={{ duration, delay, ease: 'easeOut' }}
            >
                {children}
            </motion.div>
        </div>
    );
}
