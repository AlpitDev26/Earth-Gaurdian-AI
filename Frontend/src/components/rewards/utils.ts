export type Level = 'Seed' | 'Tree' | 'Forest' | 'Planet Guardian';

export function getLevelInfo(points: number) {
  if (points <= 500) return { level: 'Seed', current: points, next: 501, progress: (points/500)*100, icon: '🌱' };
  if (points <= 2000) return { level: 'Tree', current: points - 501, next: 1500, progress: ((points-501)/1500)*100, icon: '🌳' };
  if (points <= 5000) return { level: 'Forest', current: points - 2001, next: 2999, progress: ((points-2001)/2999)*100, icon: '🌲' };
  return { level: 'Planet Guardian', current: points, next: points, progress: 100, icon: '🌍' };
}

export const POINT_AWARDS = {
  RECEIPT_SCAN: 50,
  ECO_RECEIPT: 100,
  SIMULATION: 30,
  WEEKLY_GOAL: 200
};

// Mock data generation
export const MOCK_ACHIEVEMENTS = [
  { id: 1, title: 'Receipt Scanned', points: POINT_AWARDS.RECEIPT_SCAN, date: 'Today' },
  { id: 2, title: 'Simulation Run', points: POINT_AWARDS.SIMULATION, date: 'Yesterday' },
  { id: 3, title: 'Eco-Receipt Bonus', points: POINT_AWARDS.ECO_RECEIPT, date: 'Jun 12' },
];
