export type TwinState = 'thriving' | 'stressed' | 'polluted';

export function getTwinState(score: number): TwinState {
  if (score >= 80) return 'thriving';
  if (score >= 40) return 'stressed';
  return 'polluted';
}

export function getTwinColors(state: TwinState) {
  switch (state) {
    case 'thriving':
      return { core: 'bg-primary', glow: 'shadow-[0_0_50px_rgba(16,185,129,0.6)]' };
    case 'stressed':
      return { core: 'bg-warning', glow: 'shadow-[0_0_40px_rgba(245,158,11,0.4)]' };
    case 'polluted':
      return { core: 'bg-danger', glow: 'shadow-[0_0_40px_rgba(239,68,68,0.5)]' };
  }
}
