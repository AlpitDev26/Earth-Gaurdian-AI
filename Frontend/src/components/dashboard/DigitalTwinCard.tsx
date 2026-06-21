"use client";
import GlassCard from '@/components/ui/GlassCard';
import DigitalTwin from '@/components/twin/DigitalTwin';
import { getTwinState } from '@/components/twin/utils';
import { motion } from 'framer-motion';

export default function DigitalTwinCard({ score }: { score: number }) {
  const state = getTwinState(score);

  const StatusText = () => {
    switch (state) {
      case 'thriving': return <span className="text-primary font-bold">Thriving Planet</span>;
      case 'stressed': return <span className="text-warning font-bold">Stressed Planet</span>;
      case 'polluted': return <span className="text-danger font-bold">Polluted Planet</span>;
    }
  };

  const StatusDescription = () => {
    switch (state) {
      case 'thriving': return "Your carbon momentum is excellent. Ecosystems are flourishing.";
      case 'stressed': return "Warning: Recent emissions are high. Ecosystems are degrading.";
      case 'polluted': return "Critical: Immediate intervention required. Complete ecosystem failure imminent.";
    }
  };

  return (
    <GlassCard className="flex flex-col items-center justify-center pt-8 pb-10 relative overflow-hidden group">
      {/* Hover Background Reveal */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <DigitalTwin score={score} />
      
      <div className="mt-8 text-center px-4 relative z-10">
        <motion.h2 
          key={state}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70"
        >
          Status: <StatusText />
        </motion.h2>
        <motion.p 
          key={state + "desc"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-gray-400 mt-2 font-medium leading-relaxed"
        >
          <StatusDescription />
        </motion.p>
      </div>
    </GlassCard>
  );
}
