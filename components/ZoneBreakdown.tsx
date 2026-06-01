'use client';

import { DrawnSeed } from '@/lib/types';
import { calculateSeedValue, calculateTotal } from '@/lib/seeds';

interface ZoneBreakdownProps {
  seeds: DrawnSeed[];
}

export default function ZoneBreakdown({ seeds }: ZoneBreakdownProps) {
  const noScore  = seeds.filter(s => s.color === 'red' && !s.isPenalty);
  const comfort  = seeds.filter(s => s.color === 'blue' && !s.isPenalty);
  const banger   = seeds.filter(s => s.color === 'green' && !s.isPenalty);
  const penalty  = seeds.filter(s => s.isPenalty);

  const comfortTotal = comfort.reduce((s, seed) => s + calculateSeedValue(seed), 0);
  const bangerTotal  = banger.reduce((s, seed) => s + calculateSeedValue(seed), 0);
  const penaltyTotal = penalty.reduce((s, seed) => s + calculateSeedValue(seed), 0);
  const total        = calculateTotal(seeds);

  const SeedPill = ({ seed }: { seed: DrawnSeed }) => (
    <span className="inline-flex items-center justify-center rounded-md font-black text-xs"
      style={{ minWidth: 28, height: 28, padding: '0 6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}>
      {seed.display}
    </span>
  );

  const ZoneRow = ({
    icon, label, seedList, subtotal, bg, border, accent,
  }: {
    icon: string; label: string; seedList: DrawnSeed[];
    subtotal: number; bg: string; border: string; accent: string;
  }) => (
    <div className="rounded-xl p-3 space-y-2" style={{ background: bg, border: `1px solid ${border}` }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">{icon}</span>
          <span className="text-xs font-black uppercase tracking-wide" style={{ color: accent }}>{label}</span>
        </div>
        <span className="font-black text-sm" style={{ color: accent }}>
          {subtotal === 0 && seedList.length > 0 ? '= 0' : subtotal > 0 ? `+${subtotal}` : subtotal}
        </span>
      </div>
      {seedList.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {seedList.map(s => <SeedPill key={s.id} seed={s} />)}
        </div>
      ) : (
        <p className="text-white/25 text-xs italic">None</p>
      )}
    </div>
  );

  return (
    <div className="space-y-2">
      {/* Zone rows */}
      <ZoneRow
        icon="✕" label="No Score Zone"
        seedList={noScore} subtotal={0}
        bg="rgba(239,68,68,0.08)" border="rgba(239,68,68,0.25)" accent="#fca5a5"
      />
      <ZoneRow
        icon="●" label="Comfort Zone"
        seedList={comfort} subtotal={comfortTotal}
        bg="rgba(59,130,246,0.08)" border="rgba(59,130,246,0.25)" accent="#93c5fd"
      />
      <ZoneRow
        icon="★" label="Banger Zone"
        seedList={banger} subtotal={bangerTotal}
        bg="rgba(20,184,166,0.08)" border="rgba(20,184,166,0.30)" accent="#5eead4"
      />
      {penalty.length > 0 && (
        <ZoneRow
          icon="−" label="Penalties"
          seedList={penalty} subtotal={penaltyTotal}
          bg="rgba(127,29,29,0.20)" border="rgba(239,68,68,0.30)" accent="#fca5a5"
        />
      )}

      {/* Formula total */}
      <div className="rounded-xl p-3 flex items-center justify-between"
        style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.35)' }}>
        <div className="text-xs text-white/50 font-semibold">
          <span style={{ color: '#5eead4' }}>Banger</span>
          {' + '}
          <span style={{ color: '#93c5fd' }}>Comfort</span>
          {' − '}
          <span style={{ color: '#fca5a5' }}>Penalty</span>
        </div>
        <span className="text-amber-300 font-black text-lg">= {total}</span>
      </div>
    </div>
  );
}
