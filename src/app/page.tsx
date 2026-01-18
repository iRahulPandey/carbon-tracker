'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalculatorForm } from '@/components/CalculatorForm';
import { ResultsCard } from '@/components/ResultsCard';
import { calculateCarbon } from '@/lib/api';
import { getEnvironmentalEquivalents } from '@/lib/utils';
import { CarbonData, Equivalents } from '@/lib/types';
import { Github, Globe } from 'lucide-react';
import { ParticleBackground } from '@/components/ParticleBackground';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<CarbonData | null>(null);
  const [equivalents, setEquivalents] = useState<Equivalents | null>(null);
  const [error, setError] = useState('');
  const [intensity, setIntensity] = useState<'clean' | 'neutral' | 'dirty'>('neutral');

  const handleCalculate = async (bytes: number, isGreen: boolean) => {
    setIsLoading(true);
    setError('');
    setData(null);
    setEquivalents(null);
    setIntensity('neutral');

    try {
      const result = await calculateCarbon(bytes, isGreen);
      const eqs = getEnvironmentalEquivalents(result.gco2e, bytes);

      // Determine intensity based on rating
      // A/A+/B -> Clean
      // C -> Neutral
      // D/E/F -> Dirty
      if (['A+', 'A', 'B'].includes(result.rating)) {
        setIntensity('clean');
      } else if (result.rating === 'C') {
        setIntensity('neutral');
      } else {
        setIntensity('dirty');
      }

      // Artificial delay for smooth animation if API is too fast
      await new Promise(resolve => setTimeout(resolve, 800));

      setData(result);
      setEquivalents(eqs);
    } catch (err) {
      console.error(err);
      setError('Failed to calculate. Please check your connection and try again.');
      setIntensity('dirty'); // Error state looks dirty/glichy
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden bg-[#0a0a0a] text-white selection:bg-emerald-500/30">
      <ParticleBackground intensity={intensity} />

      {/* Background Gradients (Reduced opacity to let particles shine) */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-12 md:py-20 z-10 flex flex-col items-center">

        {/* Header / Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-12"
        >
          <div className="inline-flex items-center justify-center p-2 bg-white/5 rounded-full mb-4 border border-white/5 backdrop-blur-sm">
            <Globe className="w-4 h-4 text-emerald-400 mr-2" />
            <span className="text-xs font-medium text-emerald-400">Carbon Footprint Calculator</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600">
              Calculate Your Website's
            </span>
            <br />
            <span className="text-white">Environmental Impact</span>
          </h1>

          <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            The internet consumes a lot of electricity.
            Find out how much CO2 your web pages produce and how to make them cleaner.
          </p>
        </motion.div>

        {/* Input Section */}
        <div className="w-full">
          <CalculatorForm onCalculate={handleCalculate} isLoading={isLoading} />
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Results Section */}
        <AnimatePresence>
          {data && equivalents && (
            <div className="w-full">
              <ResultsCard data={data} equivalents={equivalents} />
            </div>
          )}
        </AnimatePresence>

        {/* Statistics Banner */}
        {!data && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-20 text-center space-y-2 opacity-50"
          >
            <p className="text-sm font-medium">Global Average</p>
            <p className="text-2xl font-light">0.5g CO2 / view</p>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-8 mt-auto z-10 bg-black/20 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30">
          <p>Data provided by Website Carbon API</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white/60 transition-colors">Methodology</a>
            <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors">
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
