'use client';

import { useGame } from '@/lib/game-context';
import { LEVEL_NAMES } from '@/lib/seeds';
import GameHeader from './GameHeader';

export default function DrawScreen() {
  const { state, dispatch } = useGame();
  const { players, config, currentRound, roundSeeds } = state;

  return (
    <div className="min-h-screen flex flex-col p-5">
      <GameHeader />

      {/* Level / Round badge */}
      <div className="text-center mb-5">
        <span className="glass border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
          {LEVEL_NAMES[config.level]} · Level {config.level}
        </span>
        <h2 className="text-2xl font-black text-white mt-3">
          Round <span className="text-amber-400">{currentRound}</span>
          <span className="text-white/30"> / {config.totalRounds}</span>
        </h2>
        <p className="text-white/30 text-xs mt-1">{config.seedsPerRound} seeds · {config.timeLimit}s timer</p>
      </div>

      {/* Instruction banner */}
      <div className="glass border border-amber-500/20 rounded-2xl p-4 text-center mb-5"
        style={{ background: 'rgba(245,158,11,0.06)' }}>
        <p className="text-2xl mb-1">✊</p>
        <p className="text-amber-300 font-bold text-sm">Seeds are dealt! Keep your fist closed.</p>
        <p className="text-white/40 text-xs mt-1">
          Tap <strong className="text-amber-400">Reveal &amp; Start</strong> when everyone is ready.
        </p>
      </div>

      {/* Players */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {players.map((player, pi) => {
          const seeds = roundSeeds[player.id] ?? [];
          const initials = player.name.slice(0, 2).toUpperCase();
          const colors = ['#7c3aed','#0891b2','#be185d','#065f46','#92400e'];
          const avatarColor = colors[pi % colors.length];

          return (
            <div key={player.id}
              className="glass rounded-2xl p-4 flex items-center gap-4"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              {/* Avatar */}
              <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white"
                style={{ background: avatarColor, boxShadow: `0 0 16px ${avatarColor}55` }}>
                {initials}
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-sm mb-2">{player.name}</p>
                <div className="flex flex-wrap gap-1.5">
                  {seeds.map((_, i) => (
                    <div key={i}
                      className="rounded-xl flex items-center justify-center"
                      style={{
                        width: 44, height: 56,
                        background: 'linear-gradient(145deg,#1e293b,#0f172a)',
                        border: '2px solid rgba(255,255,255,0.08)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                      }}>
                      <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.20)', fontWeight: 900 }}>?</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reveal CTA */}
      <div className="mt-5 space-y-2">
        <button
          onClick={() => dispatch({ type: 'BEGIN_REVEAL' })}
          className="btn-shimmer w-full py-5 rounded-2xl text-black font-black text-xl transition-all active:scale-95 shadow-2xl glow-amber"
        >
          ▶ Reveal &amp; Start Timer
        </button>
        <p className="text-center text-white/25 text-xs">All seeds flip simultaneously</p>
      </div>
    </div>
  );
}
