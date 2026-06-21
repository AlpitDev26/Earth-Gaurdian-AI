"use client";
import GlassCard from '@/components/ui/GlassCard';
import DigitalTwinCard from '@/components/dashboard/DigitalTwinCard';
import WeeklyChart from '@/components/dashboard/WeeklyChart';
import { ScanLine, User, Leaf, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const currentScore = 85; 
  const points = 1250;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <main className="min-h-screen bg-[#0B0F19] text-white overflow-hidden relative">
      {/* Background Mesh Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md mx-auto p-6 pb-28 relative z-10">
        
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-2.5 rounded-2xl shadow-lg">
              <User size={22} className="text-secondary" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Earth Guardian</h1>
              <p className="text-xs text-primary font-medium tracking-wide uppercase mt-0.5">Level 2: Tree</p>
            </div>
          </div>
          <Link href="/rewards">
            <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2 shadow-lg hover:bg-white/10 transition-colors cursor-pointer">
              <Leaf size={16} className="text-primary" />
              <span className="font-bold text-sm">{points}</span>
            </div>
          </Link>
        </motion.header>

        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
          
          {/* Hero: Digital Twin Card */}
          <motion.div variants={itemVariants}>
            <DigitalTwinCard score={currentScore} />
          </motion.div>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div variants={itemVariants}>
              <GlassCard className="flex flex-col items-center justify-center h-full p-5">
                <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Carbon Score</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white tracking-tighter">{currentScore}</span>
                  <span className="text-sm text-gray-500 font-medium">/100</span>
                </div>
              </GlassCard>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <GlassCard className="flex flex-col items-center justify-center h-full p-5">
                <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Weekly Trend</span>
                <div className="flex items-center gap-1.5 text-primary">
                  <TrendingDown size={24} strokeWidth={3} />
                  <span className="text-3xl font-bold tracking-tighter">12%</span>
                </div>
                <span className="text-xs text-gray-500 mt-1 font-medium">vs last week</span>
              </GlassCard>
            </motion.div>
          </div>

          {/* Chart */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-5">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-white tracking-tight">Emissions (7 Days)</h3>
                <Link href="/simulator" className="text-xs font-bold text-secondary bg-secondary/10 px-3 py-1.5 rounded-full hover:bg-secondary/20 transition-colors">
                  Simulator →
                </Link>
              </div>
              <WeeklyChart />
            </GlassCard>
          </motion.div>
        </motion.div>

        {/* Floating Action Button */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5, delay: 0.6 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        >
          <Link href="/scanner">
            <button className="bg-primary hover:bg-emerald-400 text-[#0B0F19] p-5 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all transform hover:scale-105 active:scale-95 group relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
              <ScanLine size={32} className="relative z-10" />
            </button>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
