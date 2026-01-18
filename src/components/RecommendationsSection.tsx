'use client';

import { motion } from 'framer-motion';
import { Image, Server, Zap, Variable } from 'lucide-react';

export function RecommendationsSection() {
    const recommendations = [
        {
            icon: Image,
            title: "Optimize Images",
            desc: "Compass & lazy-load images to reduce transfer size."
        },
        {
            icon: Server,
            title: "Green Hosting",
            desc: "Switch to a hosting provider powered by renewable energy."
        },
        {
            icon: Variable,
            title: "Minify Assets",
            desc: "Minify CSS & JS and use standard system fonts."
        },
        {
            icon: Zap,
            title: "Use Caching",
            desc: "Implement aggressive caching policies."
        }
    ];

    return (
        <div className="mt-8 space-y-4">
            <h3 className="text-sm uppercase tracking-widest text-white/40 font-semibold mb-4 text-center">
                How to improve
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((rec, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + (index * 0.1) }}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                    >
                        <rec.icon className="w-5 h-5 text-emerald-500 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-medium text-white">{rec.title}</h4>
                            <p className="text-xs text-white/50">{rec.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
