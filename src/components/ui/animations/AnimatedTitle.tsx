'use client';

import { motion } from 'framer-motion';
import { useLoading } from '../../providers/LoadingProvider';

interface AnimatedTitleProps {
    prefix: string;
    highlight: string;
    description?: string;
    className?: string;
}

export function AnimatedTitle({ prefix, highlight, description, className = "text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6" }: AnimatedTitleProps) {
    const { isLoading } = useLoading();

    return (
        <div className="flex flex-col items-center">
            <h1 className={`${className} flex flex-wrap justify-center gap-x-4 overflow-hidden py-2`}>
                <motion.span
                    initial={{ x: -80, opacity: 0, filter: 'blur(10px)' }}
                    animate={!isLoading ? { x: 0, opacity: 1, filter: 'blur(0px)' } : { x: -80, opacity: 0, filter: 'blur(10px)' }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block"
                >
                    {prefix}
                </motion.span>
                <motion.span
                    initial={{ x: 80, opacity: 0, filter: 'blur(10px)' }}
                    animate={!isLoading ? { x: 0, opacity: 1, filter: 'blur(0px)' } : { x: 80, opacity: 0, filter: 'blur(10px)' }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                    className="text-brand-primary inline-block"
                >
                    {highlight}
                </motion.span>
            </h1>

            {description && (
                <motion.p
                    initial={{ y: 40, opacity: 0 }}
                    animate={!isLoading ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                    className="text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed px-4"
                >
                    {description}
                </motion.p>
            )}
        </div>
    );
}
