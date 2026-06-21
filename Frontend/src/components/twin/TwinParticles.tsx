"use client";
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getTwinState } from './utils';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export default function TwinParticles({ score }: { score: number }) {
  const state = getTwinState(score);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const count = state === 'thriving' ? 20 : state === 'stressed' ? 8 : 35;
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * (state === 'polluted' ? 6 : 4) + 2,
      duration: Math.random() * 2 + 2,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, [state]);

  if (!mounted || particles.length === 0) return null;

  if (state === 'thriving') {
    return (
      <div className="absolute inset-0 overflow-hidden rounded-full z-20 pointer-events-none">
        {particles.map(p => (
          <motion.div
            key={p.id}
            className="absolute bg-white/60 rounded-full"
            style={{ width: p.size, height: p.size, left: `${p.x}%`, top: '100%' }}
            animate={{ top: '-10%', opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
          />
        ))}
      </div>
    );
  }

  if (state === 'polluted') {
    return (
      <div className="absolute inset-0 overflow-hidden rounded-full z-20 pointer-events-none">
        {particles.map(p => (
          <motion.div
            key={p.id}
            className="absolute bg-[#1F2937]/80 rounded-sm"
            style={{ width: p.size, height: p.size, left: `${p.x}%`, top: '-10%' }}
            animate={{ top: '110%', opacity: [0, 1, 0], rotate: [0, 360] }}
            transition={{ duration: p.duration * 0.8, repeat: Infinity, delay: p.delay, ease: "linear" }}
          />
        ))}
      </div>
    );
  }

  // Stressed: Sparse, sideways moving particles
  return (
    <div className="absolute inset-0 overflow-hidden rounded-full z-20 pointer-events-none">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute bg-yellow-100/40 rounded-full"
          style={{ width: p.size, height: p.size, left: '-10%', top: `${p.y}%` }}
          animate={{ left: '110%', opacity: [0, 0.5, 0] }}
          transition={{ duration: p.duration * 1.5, repeat: Infinity, delay: p.delay, ease: "linear" }}
        />
      ))}
    </div>
  );
}
