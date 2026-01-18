'use client';

import { motion } from 'framer-motion';
import { CarbonData, Equivalents } from '@/lib/types';
import { CarbonDisplay } from './CarbonDisplay';
import { RatingBadge } from './RatingBadge';
import { EquivalentsSection } from './EquivalentsSection';
import { RecommendationsSection } from './RecommendationsSection';
import { CheckCircle2, XCircle } from 'lucide-react';

import { getEcoPersona } from '@/lib/utils';

interface ResultsCardProps {
    data: CarbonData;
    equivalents: Equivalents;
}

export function ResultsCard({ data, equivalents }: ResultsCardProps) {
    const persona = getEcoPersona(data.rating);

    return (
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="glass-panel rounded-3xl p-6 md:p-10 w-full max-w-2xl mx-auto mt-10 relative overflow-hidden"
        >
            {/* Background Gradient Blob */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 mb-8 border-b border-white/5 pb-8">
                <div className="flex-1 text-center md:text-left">
                    <div className="mb-2">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/50 mb-2">
                            {persona.emoji} Your Eco-Persona
                        </span>
                        <h2 className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                            {persona.title}
                        </h2>
                        <p className="text-sm text-white/40 mt-1">{persona.description}</p>
                    </div>

                    <CarbonDisplay value={data.gco2e} />

                    <div className="mt-4 flex flex-col md:flex-row items-center gap-4 justify-center md:justify-start">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                            {data.green ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span className="text-xs font-medium text-white/70">
                                {data.green ? "Green Hosting Verified" : "Standard Hosting"}
                            </span>
                        </div>

                        <div className="text-xs text-white/50">
                            Cleaner than <span className="text-emerald-400 font-bold">{Math.round(data.cleanerThan * 100)}%</span> of pages
                        </div>
                    </div>
                </div>

                <div className="flex-shrink-0">
                    <RatingBadge rating={data.rating} />
                </div>
            </div>

            <EquivalentsSection equivalents={equivalents} />

            <RecommendationsSection />

            <div className="mt-8 pt-6 border-t border-white/5 text-center space-y-2">
                <p className="text-xs text-white/30">
                    Based on {equivalents.dataSize.value}MB data transfer.
                    Methodology by <a href="#" className="underline hover:text-white/50">Sustainable Web Design</a>.
                </p>
                <p className="text-[10px] text-white/20">
                    Assumptions: Annual views (10k), Car (404g/mi), Tea (71g/cup), Phone (8g/charge), Tree (absorbs 21kg/yr).
                </p>
            </div>
        </motion.div>
    );
}
