"use client";
import { motion } from 'framer-motion';
import { getTwinState, getTwinColors } from './utils';
import TwinParticles from './TwinParticles';

export default function TwinCore({ score }: { score: number }) {
  const state = getTwinState(score);
  const colors = getTwinColors(state);

  // Define advanced animation variants
  const variants = {
    thriving: {
      rotate: 360,
      scale: [1, 1.02, 1],
      transition: { 
        rotate: { duration: 25, repeat: Infinity, ease: "linear" },
        scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
      }
    },
    stressed: {
      rotate: [0, 5, -5, 0],
      scale: [1, 0.98, 1],
      transition: { 
        rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      }
    },
    polluted: {
      x: [0, -4, 4, -4, 4, 0],
      y: [0, 2, -2, 2, -2, 0],
      opacity: [1, 0.8, 1],
      transition: { 
        duration: 0.5, repeat: Infinity, ease: "linear" 
      }
    }
  };

  return (
    <div className="relative flex items-center justify-center w-48 h-48">
      {/* Outer Atmosphere Glow */}
      <motion.div
        animate={state === 'polluted' ? { opacity: [0.3, 0.8, 0.3], scale: [1, 1.05, 1] } : { scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: state === 'polluted' ? 0.8 : 3, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute inset-4 rounded-full ${colors.core} ${colors.glow} opacity-50 blur-2xl`}
      />
      
      {/* The Planet Core */}
      <motion.div
        variants={variants}
        animate={state}
        className={`relative z-10 w-36 h-36 rounded-full ${colors.core} bg-gradient-to-br from-white/50 to-black/30 border-2 border-white/20 shadow-[inset_-15px_-15px_30px_rgba(0,0,0,0.5)] overflow-hidden`}
      >
        {/* Landmass Textures */}
        <div className="absolute top-4 left-4 w-12 h-12 bg-white/20 rounded-full blur-md" />
        <div className="absolute bottom-6 right-8 w-16 h-8 bg-black/20 rounded-full blur-lg" />
        {state === 'polluted' && <div className="absolute top-10 left-10 w-24 h-4 bg-[#1F2937]/50 blur-sm rotate-45" />}

        {/* Particles */}
        <TwinParticles score={score} />
      </motion.div>
    </div>
  );
}
