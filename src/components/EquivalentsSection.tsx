'use client';

import { motion } from 'framer-motion';
import { Trees, Car, Smartphone, Coffee, Database } from 'lucide-react';
import { Equivalents } from '@/lib/types';

interface EquivalentsSectionProps {
    equivalents: Equivalents;
}

export function EquivalentsSection({ equivalents }: EquivalentsSectionProps) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    const items = [
        {
            icon: Trees,
            value: equivalents.trees.value,
            label: equivalents.trees.label,
            color: "text-emerald-400"
        },
        {
            icon: Car,
            value: equivalents.carMiles.value,
            label: equivalents.carMiles.label,
            color: "text-blue-400"
        },
        {
            icon: Smartphone,
            value: equivalents.phoneCharges.value,
            label: equivalents.phoneCharges.label,
            color: "text-purple-400"
        },
        {
            icon: Coffee, // closest to tea cup
            value: equivalents.teaCups.value,
            label: equivalents.teaCups.label,
            color: "text-orange-400"
        }
    ];

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-4 mt-8"
        >
            {items.map((stat, index) => (
                <motion.div
                    key={index}
                    variants={item}
                    whileHover={{ scale: 1.02 }}
                    className="glass-panel rounded-xl p-4 flex flex-col items-center text-center space-y-2 border border-white/5 bg-white/5 hover:bg-white/10 transition-colors"
                >
                    <div className={`p-2 rounded-full bg-white/5 ${stat.color}`}>
                        <stat.icon className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-2xl text-white">
                        {stat.value}
                    </div>
                    <div className="text-xs text-white/50 leading-tight h-8 flex items-center justify-center">
                        {stat.label}
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}
