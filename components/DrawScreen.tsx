'use client';

import { useGame } from '@/lib/game-context';
import { LEVEL_NAMES } from '@/lib/seeds';
import GameHeader from './GameHeader';

export default function DrawScreen() {
  const { state, dispatch } = useGame();
  const { players, config, currentRound, roundSeeds } = state;

  const handleReveal = () => dispatch({ type: 'BEGIN_REVEAL' });

  return (
    <div className="min-h-screen flex flex-col p-5">
      <GameHeader />
      {/* Header */}
      <div className="text-center mb-6">
        <p className="text-slate-400 text-sm uppercase tracking-widest font-medium">
          {LEVEL_NAMES[config.level]} · Level {config.level}
        </p>
        <h2 className="text-2xl font-black text-white mt-1">
          Round {currentRound} of {config.totalRounds}
        </h2>
        <p className="text-slate-500 text-xs mt-1">{config.seedsPerRound} seeds · {config.timeLimit}s timer</p>
      </div>

      {/* Instruction banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-center mb-6">
        <p className="text-amber-300 font-semibold text-sm">
          Seeds are dealt! Hold your fist closed — don&apos;t peek.
        </p>
        <p className="text-amber-400/70 text-xs mt-1">
          When everyone is ready, tap <strong>Reveal &amp; Start</strong> to begin the countdown.
        </p>
      </div>

      {/* Players with hidden seeds */}
      <div className="flex-1 space-y-4 overflow-y-auto">
        {players.map(player => {
          const seeds = roundSeeds[player.id] ?? [];
          return (
            <div key={player.id} className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4">
              <p className="text-white font-bold text-sm mb-3">{player.name}</p>
              <div className="flex flex-wrap gap-2">
                {seeds.map((_, i) => (
                  <div
                    key={i}
                    className="w-14 min-w-[3.5rem] h-[4.5rem] rounded-2xl border-2 border-slate-600 bg-slate-900 flex items-center justify-center shadow-md"
                  >
                    <span className="text-slate-600 text-2xl font-bold">?</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reveal button */}
      <div className="mt-6 space-y-3">
        <button
          onClick={handleReveal}
          className="w-full py-5 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-black font-extrabold text-xl transition-all shadow-xl shadow-amber-500/30"
        >
          Reveal &amp; Start Timer ▶
        </button>
        <p className="text-center text-slate-500 text-xs">All seeds will flip at once when you tap</p>
      </div>
    </div>
  );
}
