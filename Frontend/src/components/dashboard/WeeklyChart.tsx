"use client";
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { useState, useEffect } from 'react';

const data = [
  { day: 'Mon', co2: 12 },
  { day: 'Tue', co2: 15 },
  { day: 'Wed', co2: 8 },
  { day: 'Thu', co2: 10 },
  { day: 'Fri', co2: 18 },
  { day: 'Sat', co2: 22 },
  { day: 'Sun', co2: 14 },
];

export default function WeeklyChart() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="h-32 w-full min-h-[8rem]">
      {mounted && (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis dataKey="day" hide />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0B0F19', borderColor: 'rgba(255,255,255,0.1)' }}
              itemStyle={{ color: '#10B981' }}
            />
            <Area type="monotone" dataKey="co2" stroke="#10B981" fill="#10B981" fillOpacity={0.2} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
