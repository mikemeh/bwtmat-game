'use client';

import { DrawnSeed, Color } from '@/lib/types';
import { calculateSeedValue } from '@/lib/seeds';

const ZONE: Record<Color, { grad: string; glow: string; label: string; text: string }> = {
  red: {
    grad:  'linear-gradient(145deg,#ef4444 0%,#991b1b 100%)',
    glow:  '0 0 22px rgba(239,68,68,0.65), 0 0 44px rgba(239,68,68,0.25)',
    label: 'NO SCORE',
    text:  '#fecaca',
  },
  blue: {
    grad:  'linear-gradient(145deg,#3b82f6 0%,#1e3a8a 100%)',
    glow:  '0 0 22px rgba(59,130,246,0.65), 0 0 44px rgba(59,130,246,0.25)',
    label: 'COMFORT',
    text:  '#bfdbfe',
  },
  green: {
    grad:  'linear-gradient(145deg,#22c55e 0%,#14532d 100%)',
    glow:  '0 0 22px rgba(34,197,94,0.65),  0 0 44px rgba(34,197,94,0.25)',
    label: 'BANGER',
    text:  '#bbf7d0',
  },
};

interface SeedCardProps {
  seed: DrawnSeed;
  revealed: boolean;
  showValue?: boolean;
  delay?: number;
}

export default function SeedCard({ seed, revealed, showValue = false, delay = 0 }: SeedCardProps) {
  const val = calculateSeedValue(seed);
  const zone = ZONE[seed.color];

  if (!revealed) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-2xl select-none"
        style={{
          width: 56, minWidth: 56, height: 72,
          background: 'linear-gradient(145deg,#1e293b,#0f172a)',
          border: '2px solid rgba(255,255,255,0.10)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        }}
      >
        <span style={{ fontSize: 22, color: 'rgba(255,255,255,0.25)', fontWeight: 900 }}>?</span>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl select-none relative animate-seed-reveal"
      style={{
        width: 56, minWidth: 56, height: 72,
        background: zone.grad,
        boxShadow: zone.glow,
        border: '1.5px solid rgba(255,255,255,0.20)',
        animationDelay: `${delay}ms`,
      }}
    >
      {seed.isSpecial && (
        <span style={{
          position: 'absolute', top: 3, right: 5,
          fontSize: 9, color: '#fde68a', fontWeight: 900, lineHeight: 1,
          textShadow: '0 0 6px rgba(253,230,138,0.8)',
        }}>★</span>
      )}

      <span style={{
        color: '#fff',
        fontWeight: 900,
        fontSize: seed.display.length > 2 ? 13 : 18,
        lineHeight: 1,
        textShadow: '0 2px 6px rgba(0,0,0,0.4)',
        fontFamily: seed.isPenalty ? "'Orbitron', monospace" : 'inherit',
      }}>
        {seed.display}
      </span>

      <span style={{
        color: zone.text,
        fontSize: 8,
        fontWeight: 800,
        letterSpacing: '0.04em',
        marginTop: 3,
        lineHeight: 1,
        opacity: 0.85,
      }}>
        {seed.isPenalty ? 'PENALTY' : zone.label}
      </span>

      {showValue && (
        <span style={{
          color: '#fff',
          fontSize: 9,
          fontWeight: 900,
          marginTop: 2,
          lineHeight: 1,
          textShadow: '0 0 8px rgba(255,255,255,0.5)',
        }}>
          {val > 0 ? `+${val}` : val}
        </span>
      )}
    </div>
  );
}
