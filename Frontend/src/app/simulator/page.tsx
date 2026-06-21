"use client";
import { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { ArrowLeft, Zap, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Simulator() {
  const [meatDays, setMeatDays] = useState(7);
  const [transitCommute, setTransitCommute] = useState(0);
  const [solarEnergy, setSolarEnergy] = useState(0); 
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Dynamic data generation based on slider states
  const generateData = () => {
    let base = 500; // Baseline monthly emissions in kg
    const data = [];
    for(let i=0; i<=12; i++) {
      let reduction = ((7 - meatDays) * 12) + (transitCommute * 18) + (solarEnergy * 25);
      // Create a slight curve to simulate gradual adoption
      let adoptionCurve = i === 0 ? 0 : 1 - Math.exp(-i / 3); 
      
      data.push({
        month: i === 0 ? 'Now' : `M${i}`,
        baseline: base,
        simulated: Math.round(base - (reduction * adoptionCurve))
      });
    }
    return data;
  };

  const data = generateData();
  const monthlySavings = data[0].baseline - data[12].simulated;
  const yearlySavings = monthlySavings * 12;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0B0F19]/90 backdrop-blur-md p-4 border border-white/10 rounded-xl shadow-2xl">
          <p className="font-bold mb-3 text-white border-b border-white/10 pb-2">{label === 'Now' ? 'Current' : `Month ${label.replace('M', '')}`}</p>
          <div className="flex justify-between gap-8 text-sm mb-2">
            <span className="text-danger font-medium">Baseline:</span>
            <span className="font-mono text-white">{payload[0].value} kg</span>
          </div>
          <div className="flex justify-between gap-8 text-sm">
            <span className="text-primary font-medium">Simulated:</span>
            <span className="font-mono text-white">{payload[1].value} kg</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <main className="min-h-screen bg-[#0B0F19] text-white p-6 max-w-md mx-auto relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[20%] left-[-20%] w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[0%] right-[-20%] w-96 h-96 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8 relative z-10"
      >
        <Link href="/">
          <div className="bg-white/5 p-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} />
          </div>
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight">AI Time Machine</h1>
          <p className="text-xs text-secondary tracking-wide uppercase mt-0.5">Predictive Simulation</p>
        </div>
      </motion.header>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 pb-12"
      >
        {/* Chart Section */}
        <GlassCard className="mb-6 p-5">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h3 className="font-bold text-white tracking-tight text-lg">12-Month Projection</h3>
              <p className="text-xs text-gray-400 mt-1">Baseline vs New Habits</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary tracking-tighter">-{Math.round((monthlySavings/500)*100)}%</span>
            </div>
          </div>
          
          <div className="h-56 w-full -ml-4 min-h-[14rem]">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSimulated" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" stroke="#4B5563" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#4B5563" fontSize={10} tickLine={false} axisLine={false} width={40} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="baseline" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorBaseline)" />
                  <Area type="monotone" dataKey="simulated" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorSimulated)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </GlassCard>

        {/* Savings Summary */}
        <motion.div 
          key={yearlySavings}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-r from-primary/20 to-emerald-900/20 border border-primary/30 p-5 rounded-2xl mb-8 flex items-center justify-between shadow-[0_0_30px_rgba(16,185,129,0.15)]"
        >
          <div>
            <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">Potential Impact</p>
            <p className="text-2xl font-bold tracking-tighter text-white">
              {yearlySavings.toLocaleString()} <span className="text-sm font-normal text-gray-400">kg CO₂/yr</span>
            </p>
          </div>
          <div className="bg-primary/20 p-3 rounded-full">
            <TrendingDown size={28} className="text-primary" />
          </div>
        </motion.div>

        {/* Controls */}
        <div className="space-y-3">
          <h3 className="font-bold text-lg tracking-tight mb-4 flex items-center gap-2 text-white">
            <Zap size={18} className="text-secondary" /> Lifestyle Tweaks
          </h3>
          
          <GlassCard className="p-6">
            <div className="space-y-8">
              
              {/* Slider 1 */}
              <div>
                <label className="flex justify-between items-center mb-3 text-sm">
                  <span className="font-medium text-gray-200">Meat Consumption</span>
                  <span className="bg-white/10 px-3 py-1.5 rounded-full text-white font-bold">{meatDays} <span className="text-xs font-normal text-gray-400">days/wk</span></span>
                </label>
                <input 
                  type="range" min="0" max="7" value={meatDays} 
                  onChange={(e) => setMeatDays(Number(e.target.value))}
                  className="w-full h-2.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-emerald-400 transition-colors"
                />
              </div>

              {/* Slider 2 */}
              <div>
                <label className="flex justify-between items-center mb-3 text-sm">
                  <span className="font-medium text-gray-200">Public Transit / EV</span>
                  <span className="bg-white/10 px-3 py-1.5 rounded-full text-white font-bold">{transitCommute} <span className="text-xs font-normal text-gray-400">days/wk</span></span>
                </label>
                <input 
                  type="range" min="0" max="5" value={transitCommute} 
                  onChange={(e) => setTransitCommute(Number(e.target.value))}
                  className="w-full h-2.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-secondary hover:accent-blue-400 transition-colors"
                />
              </div>

               {/* Slider 3 */}
               <div>
                <label className="flex justify-between items-center mb-3 text-sm">
                  <span className="font-medium text-gray-200">Renewable Energy</span>
                  <span className="bg-white/10 px-3 py-1.5 rounded-full text-white font-bold">{solarEnergy * 10} <span className="text-xs font-normal text-gray-400">%</span></span>
                </label>
                <input 
                  type="range" min="0" max="10" value={solarEnergy} 
                  onChange={(e) => setSolarEnergy(Number(e.target.value))}
                  className="w-full h-2.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-warning hover:accent-yellow-400 transition-colors"
                />
              </div>

            </div>
          </GlassCard>
        </div>
      </motion.div>
    </main>
  );
}
