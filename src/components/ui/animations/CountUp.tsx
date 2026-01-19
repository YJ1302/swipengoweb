'use client';

import { motion, useSpring, useTransform, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
    end: number;
    suffix?: string;
    prefix?: string;
    duration?: number;
    className?: string;
}

export function CountUp({
    end,
    suffix = '',
    prefix = '',
    duration = 2,
    className,
}: CountUpProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '0px 0px -50px 0px' });

    const springValue = useSpring(0, {
        stiffness: 50,
        damping: 20,
        duration: duration * 1000,
    });

    const displayValue = useTransform(springValue, (current) =>
        `${prefix}${Math.round(current)}${suffix}`
    );

    useEffect(() => {
        if (isInView) {
            springValue.set(end);
        }
    }, [isInView, end, springValue]);

    return (
        <span ref={ref} className={className}>
            <motion.span>{displayValue}</motion.span>
        </span>
    );
}
