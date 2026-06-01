'use client';

import { useState } from 'react';
import { useGame } from '@/lib/game-context';
import { SEEDS_PER_LEVEL, TIME_PER_LEVEL, LEVEL_NAMES } from '@/lib/seeds';
import { GameConfig } from '@/lib/types';

const ROUND_OPTIONS = [3, 5, 7, 10];

export default function SetupScreen() {
  const { dispatch } = useGame();
  const [playerNames, setPlayerNames] = useState(['Player 1', 'Player 2']);
  const [level, setLevel] = useState(1);
  const [totalRounds, setTotalRounds] = useState(5);
  const [error, setError] = useState('');

  const addPlayer = () => {
    if (playerNames.length < 5) {
      setPlayerNames([...playerNames, `Player ${playerNames.length + 1}`]);
    }
  };

  const removePlayer = (i: number) => {
    if (playerNames.length > 1) {
      setPlayerNames(playerNames.filter((_, idx) => idx !== i));
    }
  };

  const updateName = (i: number, val: string) => {
    const updated = [...playerNames];
    updated[i] = val;
    setPlayerNames(updated);
  };

  const handleStart = () => {
    const names = playerNames.map(n => n.trim()).filter(Boolean);
    if (names.length === 0) { setError('Add at least one player.'); return; }
    const dupes = names.filter((n, i) => names.indexOf(n) !== i);
    if (dupes.length) { setError('Player names must be unique.'); return; }

    const config: GameConfig = {
      level,
      seedsPerRound: SEEDS_PER_LEVEL[level],
      timeLimit: TIME_PER_LEVEL[level],
      totalRounds,
    };
    dispatch({ type: 'SETUP_GAME', players: names, config });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-5 pt-10 overflow-y-auto">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-black text-white">Game Setup</h2>
          <p className="text-slate-400 text-sm mt-1">Configure your BWTmat session</p>
        </div>

        {/* Players */}
        <section className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold">Players ({playerNames.length}/5)</h3>
            {playerNames.length < 5 && (
              <button onClick={addPlayer} className="text-amber-400 hover:text-amber-300 text-sm font-semibold flex items-center gap-1">
                <span className="text-lg leading-none">+</span> Add Player
              </button>
            )}
          </div>
          <div className="space-y-2">
            {playerNames.map((name, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="text-slate-500 text-sm w-5 text-right shrink-0">{i + 1}.</span>
                <input
                  type="text"
                  value={name}
                  onChange={e => updateName(i, e.target.value)}
                  maxLength={16}
                  className="flex-1 bg-slate-900 border border-slate-600 focus:border-amber-500 rounded-xl px-3 py-2 text-white text-sm outline-none transition-colors"
                  placeholder={`Player ${i + 1}`}
                />
                {playerNames.length > 1 && (
                  <button
                    onClick={() => removePlayer(i)}
                    className="text-slate-500 hover:text-red-400 text-xl leading-none transition-colors"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Level */}
        <section className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 space-y-3">
          <h3 className="text-white font-bold">Level</h3>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map(l => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`flex flex-col items-center py-2 rounded-xl border text-sm font-semibold transition-all ${
                  level === l
                    ? 'bg-amber-500 border-amber-400 text-black'
                    : 'bg-slate-900 border-slate-600 text-slate-300 hover:border-slate-500'
                }`}
              >
                <span className="font-black text-lg">{l}</span>
              </button>
            ))}
          </div>
          <div className="bg-slate-900 rounded-xl p-3 text-sm text-slate-400 space-y-1">
            <p className="text-white font-semibold">{LEVEL_NAMES[level]}</p>
            <p>{SEEDS_PER_LEVEL[level]} seeds per round &nbsp;·&nbsp; {TIME_PER_LEVEL[level]} seconds timer</p>
          </div>
        </section>

        {/* Rounds */}
        <section className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 space-y-3">
          <h3 className="text-white font-bold">Rounds</h3>
          <div className="grid grid-cols-4 gap-2">
            {ROUND_OPTIONS.map(r => (
              <button
                key={r}
                onClick={() => setTotalRounds(r)}
                className={`py-2 rounded-xl border font-bold text-base transition-all ${
                  totalRounds === r
                    ? 'bg-amber-500 border-amber-400 text-black'
                    : 'bg-slate-900 border-slate-600 text-slate-300 hover:border-slate-500'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </section>

        {error && <p className="text-red-400 text-sm text-center font-medium">{error}</p>}

        <div className="flex gap-3 pb-6">
          <button
            onClick={() => dispatch({ type: 'RESET' })}
            className="flex-1 py-3 rounded-2xl border border-slate-600 text-slate-300 hover:text-white font-semibold transition-all"
          >
            Back
          </button>
          <button
            onClick={handleStart}
            className="flex-[2] py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-black font-extrabold text-lg transition-all shadow-lg shadow-amber-500/30"
          >
            Start Game →
          </button>
        </div>
      </div>
    </div>
  );
}
