'use client';

import { DrawnSeed, Color } from '@/lib/types';
import { calculateSeedValue } from '@/lib/seeds';

const ZONE_STYLES: Record<Color, { bg: string; ring: string; label: string; glow: string }> = {
  red:   { bg: 'bg-red-600',   ring: 'ring-red-400',   label: 'NO SCORE', glow: 'shadow-red-500/40' },
  blue:  { bg: 'bg-blue-600',  ring: 'ring-blue-400',  label: 'COMFORT',  glow: 'shadow-blue-500/40' },
  green: { bg: 'bg-green-600', ring: 'ring-green-400', label: 'BANGER',   glow: 'shadow-green-500/40' },
};

interface SeedCardProps {
  seed: DrawnSeed;
  revealed: boolean;
  showValue?: boolean;
  delay?: number;
}

export default function SeedCard({ seed, revealed, showValue = false, delay = 0 }: SeedCardProps) {
  const val = calculateSeedValue(seed);
  const styles = ZONE_STYLES[seed.color];

  if (!revealed) {
    return (
      <div className="w-14 min-w-[3.5rem] h-[4.5rem] rounded-2xl border-2 border-slate-600 bg-slate-800 flex items-center justify-center shadow-lg select-none">
        <span className="text-slate-400 text-2xl font-bold">?</span>
      </div>
    );
  }

  return (
    <div
      className={`
        w-14 min-w-[3.5rem] h-[4.5rem] rounded-2xl border-2 ring-2 ${styles.ring}
        ${styles.bg} ${styles.glow} shadow-lg
        flex flex-col items-center justify-center gap-0 relative select-none
        animate-seed-reveal
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      {seed.isSpecial && (
        <span className="absolute top-0.5 right-1 text-yellow-300 text-[10px] leading-none">★</span>
      )}
      <span className="text-white font-extrabold text-lg leading-none">
        {seed.display}
      </span>
      <span className="text-white/70 text-[9px] font-semibold tracking-wide leading-none mt-0.5">
        {seed.isPenalty ? 'PENALTY' : styles.label}
      </span>
      {showValue && !seed.isPenalty && (
        <span className="text-white/90 text-[10px] font-bold leading-none mt-0.5">
          {val > 0 ? `+${val}` : val === 0 ? '0' : val}
        </span>
      )}
    </div>
  );
}
