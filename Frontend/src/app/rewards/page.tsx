"use client";
import { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { ArrowLeft, Trophy, Star, Medal, Zap, Lock, Leaf } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getLevelInfo, MOCK_ACHIEVEMENTS } from '@/components/rewards/utils';

// MOCK DATA
const USER_POINTS = 1250;
const BADGES = [
  { id: 1, name: "First Scan", icon: <Zap />, unlocked: true, date: "Jun 10" },
  { id: 2, name: "Eco Hero", icon: <Leaf />, unlocked: true, date: "Jun 12" },
  { id: 3, name: "Carbon Saver", icon: <Medal />, unlocked: true, date: "Jun 15" },
  { id: 4, name: "Climate Champion", icon: <Trophy />, unlocked: false, date: "" },
  { id: 5, name: "Green Warrior", icon: <Star />, unlocked: false, date: "" },
  { id: 6, name: "Earth Guardian", icon: <Trophy />, unlocked: false, date: "" },
];

export default function RewardsScreen() {
  const [points, setPoints] = useState(0);
  
  useEffect(() => {
    // Points counter animation effect
    let start = 0;
    const end = USER_POINTS;
    const duration = 1500;
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // EaseOutQuart function
      const ease = 1 - Math.pow(1 - progress, 4);
      setPoints(Math.floor(end * ease));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, []);

  const levelInfo = getLevelInfo(points);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", bounce: 0.5 } }
  };

  return (
    <main className="min-h-screen bg-[#0B0F19] text-white p-6 max-w-md mx-auto relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-warning/10 rounded-full blur-[120px] pointer-events-none" />

      <header className="flex items-center gap-4 mb-8 relative z-10">
        <Link href="/">
          <div className="bg-white/5 p-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} />
          </div>
        </Link>
        <h1 className="text-xl font-bold tracking-tight">Gamification</h1>
      </header>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 relative z-10 pb-20">
        
        {/* Main Level Card */}
        <motion.div variants={itemVariants}>
          <GlassCard className="relative overflow-hidden group border-warning/20 shadow-[0_0_40px_rgba(245,158,11,0.05)]">
            <div className="absolute top-0 right-0 p-6 text-8xl opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 pointer-events-none">
              {levelInfo.icon}
            </div>
            
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-warning/20 p-3 rounded-2xl border border-warning/30 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                <Trophy className="text-warning" size={28} />
              </div>
              <div>
                <p className="text-xs text-warning font-bold uppercase tracking-wider mb-0.5">Current Level</p>
                <h2 className="text-3xl font-bold tracking-tighter">{levelInfo.level}</h2>
              </div>
            </div>

            {/* Dynamic Points Counter */}
            <div className="flex justify-between items-end mb-3">
              <span className="text-5xl font-black tracking-tighter text-white drop-shadow-md">
                {points.toLocaleString()} <span className="text-base font-medium text-gray-400">pts</span>
              </span>
              <span className="text-xs font-bold text-gray-400 bg-white/5 px-2 py-1 rounded-md">Next: {levelInfo.next.toLocaleString()}</span>
            </div>

            {/* Smooth Progress Bar */}
            <div className="h-3.5 w-full bg-[#0B0F19] rounded-full overflow-hidden shadow-inner border border-white/5">
              <motion.div 
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 relative shadow-[0_0_10px_rgba(253,224,71,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${levelInfo.progress}%` }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              >
                {/* Shimmer effect */}
                <motion.div 
                  className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{ left: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                />
              </motion.div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Badges Grid System */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold tracking-tight text-lg">Badges & Trophies</h3>
            <span className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full text-gray-200 border border-white/5">
              {BADGES.filter(b => b.unlocked).length} / {BADGES.length}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {BADGES.map((badge) => (
              <motion.div 
                key={badge.id}
                whileHover={badge.unlocked ? { scale: 1.05 } : {}}
                whileTap={badge.unlocked ? { scale: 0.95 } : {}}
                className={`p-5 rounded-2xl border flex flex-col items-center text-center transition-all ${
                  badge.unlocked 
                    ? 'bg-gradient-to-b from-white/10 to-white/5 border-warning/30 shadow-[0_4px_20px_rgba(245,158,11,0.1)] cursor-pointer' 
                    : 'bg-white/5 border-white/5 opacity-50 grayscale'
                }`}
              >
                <div className={`p-3.5 rounded-full mb-3 relative shadow-lg ${badge.unlocked ? 'bg-gradient-to-br from-warning/30 to-warning/10 text-warning border border-warning/30' : 'bg-[#1F2937] text-gray-500'}`}>
                  {badge.unlocked && <div className="absolute inset-0 bg-warning rounded-full blur-md opacity-20" />}
                  {badge.unlocked ? badge.icon : <Lock size={24} />}
                </div>
                <h4 className={`font-bold text-sm tracking-tight mb-1 ${badge.unlocked ? 'text-white' : 'text-gray-400'}`}>{badge.name}</h4>
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500">{badge.unlocked ? badge.date : 'Locked'}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity Log */}
        <motion.div variants={itemVariants}>
          <h3 className="font-bold tracking-tight text-lg mb-4">Recent Awards</h3>
          <GlassCard className="p-0 overflow-hidden divide-y divide-white/5">
            {MOCK_ACHIEVEMENTS.map(ach => (
              <div key={ach.id} className="p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
                <div>
                  <h4 className="font-bold text-sm">{ach.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{ach.date}</p>
                </div>
                <div className="font-bold text-warning bg-warning/10 px-3 py-1 rounded-full text-sm">
                  +{ach.points}
                </div>
              </div>
            ))}
          </GlassCard>
        </motion.div>

      </motion.div>
    </main>
  );
}
