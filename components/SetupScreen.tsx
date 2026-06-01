'use client';

import { useState } from 'react';
import { useGame } from '@/lib/game-context';
import { SEEDS_PER_LEVEL, TIME_PER_LEVEL, LEVEL_NAMES } from '@/lib/seeds';
import { GameConfig } from '@/lib/types';

const ROUND_OPTIONS = [3, 5, 7, 10];
const LEVEL_ICONS = ['⚡', '🔥', '💡', '🧠', '🏆'];

export default function SetupScreen() {
  const { dispatch } = useGame();
  const [playerNames, setPlayerNames] = useState(['Player 1', 'Player 2']);
  const [level, setLevel]             = useState(1);
  const [totalRounds, setTotalRounds] = useState(5);
  const [error, setError]             = useState('');

  const addPlayer = () => {
    if (playerNames.length < 5)
      setPlayerNames([...playerNames, `Player ${playerNames.length + 1}`]);
  };
  const removePlayer = (i: number) => {
    if (playerNames.length > 1) setPlayerNames(playerNames.filter((_, idx) => idx !== i));
  };
  const updateName = (i: number, val: string) => {
    const u = [...playerNames]; u[i] = val; setPlayerNames(u);
  };

  const handleStart = () => {
    const names = playerNames.map(n => n.trim()).filter(Boolean);
    if (!names.length) { setError('Add at least one player.'); return; }
    if (names.length !== new Set(names).size) { setError('Player names must be unique.'); return; }
    const config: GameConfig = {
      level,
      seedsPerRound: SEEDS_PER_LEVEL[level],
      timeLimit:     TIME_PER_LEVEL[level],
      totalRounds,
    };
    dispatch({ type: 'SETUP_GAME', players: names, config });
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-5 pt-10 overflow-y-auto">
      <div className="w-full max-w-md space-y-5">

        {/* Title */}
        <div className="text-center mb-2">
          <h2 className="text-3xl font-black text-white">Game Setup</h2>
          <p className="text-white/30 text-sm mt-1">Configure your BWTmat session</p>
        </div>

        {/* Players */}
        <section className="glass rounded-2xl p-4 space-y-3"
          style={{ border: '1px solid rgba(255,255,255,0.09)' }}>
          <div className="flex items-center justify-between">
            <p className="text-white font-black">Players <span className="text-white/30 font-semibold text-sm">({playerNames.length}/5)</span></p>
            {playerNames.length < 5 && (
              <button onClick={addPlayer}
                className="text-amber-400 hover:text-amber-300 text-sm font-black flex items-center gap-1 transition-colors">
                + Add
              </button>
            )}
          </div>
          <div className="space-y-2">
            {playerNames.map((name, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="text-white/20 text-sm w-5 text-right shrink-0">{i + 1}</span>
                <input
                  type="text" value={name}
                  onChange={e => updateName(i, e.target.value)}
                  maxLength={16}
                  placeholder={`Player ${i + 1}`}
                  className="flex-1 px-4 py-2.5 rounded-xl text-white font-semibold text-sm outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1.5px solid rgba(255,255,255,0.10)',
                  }}
                  onFocus={e => (e.target.style.border = '1.5px solid rgba(245,158,11,0.60)')}
                  onBlur={e  => (e.target.style.border = '1.5px solid rgba(255,255,255,0.10)')}
                />
                {playerNames.length > 1 && (
                  <button onClick={() => removePlayer(i)}
                    className="text-white/20 hover:text-red-400 text-xl leading-none transition-colors w-6 text-center">
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Level */}
        <section className="glass rounded-2xl p-4 space-y-3"
          style={{ border: '1px solid rgba(255,255,255,0.09)' }}>
          <p className="text-white font-black">Level</p>
          <div className="grid grid-cols-5 gap-2">
            {[1,2,3,4,5].map(l => (
              <button key={l} onClick={() => setLevel(l)}
                className="flex flex-col items-center py-3 rounded-xl font-black text-sm transition-all active:scale-95"
                style={{
                  background: level === l
                    ? 'linear-gradient(135deg,#f59e0b,#d97706)'
                    : 'rgba(255,255,255,0.06)',
                  border: level === l ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: level === l ? '0 0 20px rgba(245,158,11,0.35)' : 'none',
                  color: level === l ? '#000' : '#fff',
                }}>
                <span className="text-base">{LEVEL_ICONS[l-1]}</span>
                <span>{l}</span>
              </button>
            ))}
          </div>
          <div className="rounded-xl px-4 py-3 text-sm"
            style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}>
            <p className="text-amber-300 font-black">{LEVEL_NAMES[level]}</p>
            <p className="text-white/40 text-xs mt-0.5">
              {SEEDS_PER_LEVEL[level]} seeds per round · {TIME_PER_LEVEL[level]} seconds
            </p>
          </div>
        </section>

        {/* Rounds */}
        <section className="glass rounded-2xl p-4 space-y-3"
          style={{ border: '1px solid rgba(255,255,255,0.09)' }}>
          <p className="text-white font-black">Rounds</p>
          <div className="grid grid-cols-4 gap-2">
            {ROUND_OPTIONS.map(r => (
              <button key={r} onClick={() => setTotalRounds(r)}
                className="py-3 rounded-xl font-black text-base transition-all active:scale-95"
                style={{
                  background: totalRounds === r
                    ? 'linear-gradient(135deg,#f59e0b,#d97706)'
                    : 'rgba(255,255,255,0.06)',
                  border: totalRounds === r ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: totalRounds === r ? '0 0 20px rgba(245,158,11,0.35)' : 'none',
                  color: totalRounds === r ? '#000' : '#fff',
                }}>
                {r}
              </button>
            ))}
          </div>
        </section>

        {error && (
          <p className="text-red-400 text-sm text-center font-bold"
            style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.20)', padding: '8px 16px', borderRadius: 12 }}>
            {error}
          </p>
        )}

        <div className="flex gap-3 pb-6">
          <button onClick={() => dispatch({ type: 'RESET' })}
            className="flex-1 py-3 rounded-2xl font-bold text-white/60 hover:text-white transition-all"
            style={{ border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.04)' }}>
            ← Back
          </button>
          <button onClick={handleStart}
            className="btn-shimmer flex-[2] py-4 rounded-2xl text-black font-black text-lg transition-all active:scale-95 shadow-2xl glow-amber">
            Start Game →
          </button>
        </div>
      </div>
    </div>
  );
}
