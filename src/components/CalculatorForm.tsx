import { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Zap, Globe, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalculatorFormProps {
    onCalculate: (bytes: number, isGreen: boolean) => void;
    isLoading: boolean;
}

export function CalculatorForm({ onCalculate, isLoading }: CalculatorFormProps) {
    // Manual Inputs
    const [sizeInput, setSizeInput] = useState<string>('');
    const [unit, setUnit] = useState<'KB' | 'MB'>('KB');

    // Common
    const [isGreen, setIsGreen] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!sizeInput) {
            setError('Please enter a page size');
            return;
        }
        const value = parseFloat(sizeInput);
        if (isNaN(value) || value <= 0) {
            setError('Please enter a valid number');
            return;
        }
        // Binary conversion: 1 KB = 1024 bytes
        const bytes = unit === 'KB' ? value * 1024 : value * 1024 * 1024;
        onCalculate(bytes, isGreen);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl mx-auto"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative min-h-[140px]">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-input rounded-2xl p-6 space-y-4"
                    >
                        <div className="flex items-center space-x-2 text-white/80 mb-2">
                            <Globe className="w-5 h-5 text-emerald-500" />
                            <label htmlFor="pageSize" className="text-sm font-medium">
                                Page Size
                            </label>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <input
                                    id="pageSize"
                                    type="number"
                                    step="0.01"
                                    value={sizeInput}
                                    onChange={(e) => setSizeInput(e.target.value)}
                                    placeholder="e.g. 2.5"
                                    className="w-full bg-transparent border-b border-white/20 text-3xl font-light text-white placeholder-white/20 focus:outline-none focus:border-emerald-500 transition-colors py-2"
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="flex items-end">
                                <div className="bg-white/5 rounded-lg p-1 flex border border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => setUnit('KB')}
                                        className={cn(
                                            "px-3 py-1 rounded-md text-sm font-medium transition-all",
                                            unit === 'KB' ? "bg-emerald-500/20 text-emerald-400" : "text-white/40 hover:text-white/80"
                                        )}
                                    >
                                        KB
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUnit('MB')}
                                        className={cn(
                                            "px-3 py-1 rounded-md text-sm font-medium transition-all",
                                            unit === 'MB' ? "bg-emerald-500/20 text-emerald-400" : "text-white/40 hover:text-white/80"
                                        )}
                                    >
                                        MB
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div
                    onClick={() => setIsGreen(!isGreen)}
                    className="glass-panel rounded-xl p-4 flex items-center justify-between cursor-pointer group hover:bg-white/10 transition-all border border-white/10"
                >
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                            isGreen ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-white/40"
                        )}>
                            <Leaf className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-white font-medium">Green Hosting</p>
                            <p className="text-xs text-white/50">Powered by renewable energy?</p>
                        </div>
                    </div>
                    <div className={cn(
                        "w-12 h-6 rounded-full p-1 transition-colors relative",
                        isGreen ? "bg-emerald-500" : "bg-white/10"
                    )}>
                        <motion.div
                            layout
                            className="w-4 h-4 rounded-full bg-white shadow-sm"
                            animate={{ x: isGreen ? 24 : 0 }}
                        />
                    </div>
                </div>

                {error && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-400 text-sm text-center"
                    >
                        {error}
                    </motion.p>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
                >
                    {isLoading ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                            <Zap className="w-5 h-5" />
                        </motion.div>
                    ) : (
                        <>
                            Calculate Carbon Footprint
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </form>
        </motion.div>
    );
}
