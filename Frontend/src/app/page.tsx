"use client";
import { useEffect, useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import DigitalTwinCard from '@/components/dashboard/DigitalTwinCard';
import WeeklyChart from '@/components/dashboard/WeeklyChart';
import { ScanLine, User, Leaf, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Gauge = ({ value }: { value: number }) => {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  return (
    <div className="flex items-center gap-3 w-full mt-3 z-10">
      <div className="relative w-14 h-14 flex-shrink-0">
        <svg viewBox="0 0 56 56" className="transform -rotate-90 w-14 h-14 overflow-visible">
          <circle cx="28" cy="28" r={radius} stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/10" />
          <motion.circle 
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            cx="28" cy="28" r={radius} stroke="currentColor" strokeWidth="4" fill="transparent" 
            strokeDasharray={circumference}
            strokeLinecap="round"
            className="text-primary drop-shadow-[0_0_6px_rgba(16,185,129,1)]"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-black tracking-tighter text-white drop-shadow-md">{value}</span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Score</span>
        <span className="text-xs text-primary font-black tracking-tight leading-none uppercase drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">Healthy</span>
      </div>
    </div>
  );
};

const Sparkline = () => {
  return (
    <div className="w-full mt-3 relative h-10 z-10">
      <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
        <defs>
          <linearGradient id="sparkline-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          d="M0,28 Q20,15 40,22 T70,12 T100,5 L100,30 L0,30 Z" 
          fill="url(#sparkline-gradient)" 
        />
        <motion.path 
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
          d="M0,28 Q20,15 40,22 T70,12 T100,5" 
          fill="none" stroke="#38BDF8" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" 
          className="drop-shadow-[0_0_6px_rgba(56,189,248,1)]"
        />
        <motion.circle 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.7, type: "spring" }}
          cx="100" cy="5" r="3.5" fill="#38BDF8" className="drop-shadow-[0_0_8px_rgba(56,189,248,1)]"
        />
      </svg>
    </div>
  );
};

export default function Dashboard() {
  const [currentScore, setCurrentScore] = useState(100);
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState("Seed");

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/users/me')
      .then(res => res.json())
      .then(data => {
        setPoints(data.totalPoints || 0);
        setLevel(data.currentLevel || "Seed");
        setCurrentScore(data.currentCarbonScore !== undefined ? data.currentCarbonScore : 100);
      })
      .catch(err => console.error("Failed to fetch user stats", err));
  }, []);

  const containerVariants: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <main className="min-h-screen bg-[#0B0F19] text-white overflow-hidden relative">
      {/* Sci-Fi Holographic Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_40%,#000_10%,transparent_100%)] pointer-events-none" />
      
      {/* Background Mesh Gradients & Particles */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      {[
        { left: '15%', top: '85%', duration: 10, delay: 0, x: -30 },
        { left: '35%', top: '95%', duration: 12, delay: 2, x: 20 },
        { left: '55%', top: '80%', duration: 8, delay: 1, x: -10 },
        { left: '75%', top: '90%', duration: 11, delay: 3, x: 40 },
        { left: '85%', top: '88%', duration: 9, delay: 0.5, x: -20 },
        { left: '5%', top: '92%', duration: 13, delay: 4, x: 10 }
      ].map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-white/20 blur-[1px] pointer-events-none"
          animate={{
            y: [0, -200],
            x: [0, p.x],
            opacity: [0, 0.6, 0]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
            delay: p.delay
          }}
          style={{ left: p.left, top: p.top }}
        />
      ))}

      <div className="max-w-md mx-auto p-6 pb-28 relative z-10">
        
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }} 
              className="bg-white/5 backdrop-blur-md border border-white/10 p-2.5 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.05)] cursor-pointer transition-colors"
            >
              <User size={22} className="text-secondary drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Earth Guardian</h1>
              <p className="text-xs text-primary font-medium tracking-wide uppercase mt-0.5">Level: {level}</p>
            </div>
          </div>
          <Link href="/rewards">
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md pl-3 pr-4 py-2 rounded-2xl border border-white/10 flex flex-col justify-center shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-primary/50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-1">
                <Leaf size={14} className="text-primary group-hover:animate-pulse drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                <span className="font-bold text-sm bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">{points} XP</span>
              </div>
              <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (points / 500) * 100)}%` }} 
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary to-emerald-300 shadow-[0_0_5px_rgba(16,185,129,0.8)]"
                />
              </div>
            </motion.div>
          </Link>
        </motion.header>

        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
          
          {/* Hero: Digital Twin Hologram Projection */}
          <motion.div variants={itemVariants} className="relative group">
            {/* Hologram Base Emitter */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/40 transition-colors duration-700 pointer-events-none" />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-[2px] pointer-events-none" />
            
            <div className="relative transform-gpu transition-transform duration-700 group-hover:-translate-y-2">
              <DigitalTwinCard score={currentScore} />
              
              {/* Sci-Fi Scanline Sweep Effect */}
              <motion.div 
                animate={{ top: ['-10%', '110%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent shadow-[0_0_10px_rgba(16,185,129,0.8)] pointer-events-none z-50 rounded-full"
              />
            </div>
          </motion.div>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div variants={itemVariants} whileHover={{ y: -5, scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
              <GlassCard className="flex flex-col items-start justify-between h-full p-4 relative overflow-hidden group shadow-[0_4px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_10px_40px_rgba(16,185,129,0.15)] transition-shadow border border-white/5">
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300 pointer-events-none" />
                <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider relative z-10 group-hover:text-primary transition-colors">Planet Health</span>
                <Gauge value={currentScore} />
              </GlassCard>
            </motion.div>
            
            <motion.div variants={itemVariants} whileHover={{ y: -5, scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
              <GlassCard className="flex flex-col items-start justify-between h-full p-4 relative overflow-hidden group shadow-[0_4px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_10px_40px_rgba(56,189,248,0.15)] transition-shadow border border-white/5">
                <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/5 transition-colors duration-300 pointer-events-none" />
                <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider relative z-10 group-hover:text-secondary transition-colors mb-1">7-Day Trend</span>
                <div className="flex items-center gap-1 text-secondary relative z-10 mt-1">
                  <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                    <TrendingDown size={18} strokeWidth={3} className="drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
                  </motion.div>
                  <span className="text-2xl font-black tracking-tighter drop-shadow-sm text-white">-12%</span>
                </div>
                <Sparkline />
              </GlassCard>
            </motion.div>
          </div>

          {/* Chart */}
          <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 300 }}>
            <GlassCard className="p-5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
              <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="font-bold text-white tracking-tight group-hover:text-primary transition-colors">Emissions (7 Days)</h3>
                <Link href="/simulator">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="text-xs font-bold text-secondary bg-secondary/10 px-3 py-1.5 rounded-full hover:bg-secondary/20 transition-colors border border-secondary/20 cursor-pointer shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                    Simulator →
                  </motion.div>
                </Link>
              </div>
              <div className="relative z-10">
                <WeeklyChart />
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>

        {/* Floating Action Orb */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5, delay: 0.6 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center"
        >
          <Link href="/scanner">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full group-hover:bg-primary/60 transition-all duration-700 group-hover:scale-[1.8] pointer-events-none" />
              <button className="relative bg-gradient-to-br from-primary to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-[#0B0F19] p-5 rounded-full shadow-[0_0_40px_rgba(16,185,129,0.5)] border border-white/30 transition-all transform group-hover:scale-110 group-active:scale-95">
                <ScanLine size={32} strokeWidth={2.5} className="drop-shadow-lg" />
              </button>
            </div>
          </Link>
          <span className="text-[10px] uppercase tracking-[0.2em] font-black text-primary mt-3 opacity-80 drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]">Initiate Scan</span>
        </motion.div>
      </div>
    </main>
  );
}
