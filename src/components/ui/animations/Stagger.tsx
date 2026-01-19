'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

interface StaggerGridProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    staggerDelay?: number;
    columns?: number; // Optional, mainly for reference or if we enforce grid here
}

export function StaggerGrid({
    children,
    className,
    delay = 0,
    staggerDelay = 0.1,
}: StaggerGridProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '0px 0px -100px 0px' });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: staggerDelay,
                delayChildren: delay,
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface StaggerItemProps {
    children: React.ReactNode;
    className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: 'easeOut' as any,
            },
        },
    };

    return (
        <motion.div variants={itemVariants} className={className}>
            {children}
        </motion.div>
    );
}
