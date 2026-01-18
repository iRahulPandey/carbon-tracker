'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface CarbonDisplayProps {
    value: number;
}

export function CarbonDisplay({ value }: CarbonDisplayProps) {
    const spring = useSpring(0, { stiffness: 60, damping: 20 });
    const displayValue = useTransform(spring, (current) => current.toFixed(3));

    useEffect(() => {
        spring.set(value);
    }, [value, spring]);

    return (
        <div className="flex flex-col items-center justify-center py-6">
            <div className="text-6xl md:text-7xl font-light text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70 tracking-tight flex items-baseline gap-2">
                <motion.span>{displayValue}</motion.span>
                <span className="text-2xl text-white/50 font-normal">g</span>
            </div>
            <p className="text-white/60 uppercase tracking-widest text-sm font-medium mt-1">CO2 per view</p>
        </div>
    );
}
